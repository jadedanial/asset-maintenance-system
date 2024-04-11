import React, { useState } from "react";
import { useCustomQueryClient } from "../useQueryClient";
import { useMutation } from "react-query";
import axios from "axios";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Card,
  Button,
  Table,
  Col,
  Row,
  Steps,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ResultEvent from "./ResultEvent";
import Spinner from "../components/Spinner";
import moment from "moment";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const Vacation = ({ vacations, options, empid, theme }) => {
  const queryClient = useCustomQueryClient();
  const [step, setStep] = useState(0);
  const dateFormat = "YYYY-MM-DD";
  const displayDateFormat = "MMMM DD, YYYY";
  const datePickerFormat = (value) => `${value.format(displayDateFormat)}`;
  const [vacationtype, setVacationType] = useState("");
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState("");
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [add, setAdd] = useState(false);
  const [days, setDays] = useState(0);
  const [form] = Form.useForm();

  const loadVacations = vacations.map((res) => {
    return {
      id: res.emp_id,
      type: res.vac_type,
      start: res.vac_start,
      end: res.vac_end,
      reason: res.vac_reason,
      attach: res.vac_attachment === "No Attachment" ? "No" : "Yes",
      total: res.vac_total,
    };
  });

  const newVacation = () => {
    setSubmit(false);
    setSuccess(false);
    setAdd(true);
    form.resetFields(["vacationtype"]);
    form.resetFields(["startdate"]);
    form.resetFields(["enddate"]);
    form.resetFields(["reason"]);
    form.resetFields(["attachment"]);
    setVacationType("");
    setStartDate("");
    setEndDate("");
    setReason("");
    setAttachment("");
    setDays(0);
  };

  const updateField = (value, step) => {
    const fieldMap = {
      1: [setVacationType, setStep],
      2: [setStartDate, setStep],
      3: [setEndDate, setStep],
      4: [setReason, setStep],
      5: [setAttachment, setStep],
    };
    const [updateState, setStepState] = fieldMap[step];
    updateState(value);
    setStepState(step);
  };

  const viewVacation = () => {
    setSubmit(false);
    setSuccess(false);
    setAdd(false);
  };

  const checkVacation = () => {
    var onVacation = false;
    var vacs = loadVacations
      .filter((res) => res.id === empid)
      .map((vac) => {
        return {
          start: vac.start,
          end: vac.end,
        };
      });
    for (var i = 0; i < vacs.length; i++) {
      var startVac = vacs[i]["start"];
      var endVac = vacs[i]["end"];
      if (
        moment(moment(startdate).format(dateFormat)).isBetween(
          startVac,
          endVac,
          undefined,
          []
        ) ||
        moment(moment(enddate).format(dateFormat)).isBetween(
          startVac,
          endVac,
          undefined,
          []
        )
      ) {
        onVacation = true;
        break;
      } else {
        onVacation = false;
      }
    }
    return onVacation;
  };

  const addVactionButton = () => {
    return (
      <div className="flex-end-row">
        <Button type="primary" onClick={newVacation}>
          ADD
        </Button>
      </div>
    );
  };

  const columns = [
    {
      title: "Vacation Type",
      dataIndex: "type",
      key: "type",
      width: "200px",
      sorter: (a, b) => a.type.localeCompare(b.type),
      defaultSortOrder: "ascend",
    },
    {
      title: "Start Date",
      dataIndex: "start",
      key: "start",
      width: "200px",
      sorter: (a, b) => new Date(a.start) - new Date(b.start),
      defaultSortOrder: "ascend",
    },
    {
      title: "End Date",
      dataIndex: "end",
      key: "end",
      width: "200px",
      sorter: (a, b) => new Date(a.end) - new Date(b.end),
      defaultSortOrder: "ascend",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Attachment",
      dataIndex: "attach",
      key: "attach",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      sorter: (a, b) => a.total - b.total,
      defaultSortOrder: "ascend",
    },
    {
      title: addVactionButton,
      dataIndex: "addVactionButton",
      key: "addVactionButton",
    },
  ];

  const addVacation = (d) => {
    var vacData = {
      emp_id: empid,
      vac_type: vacationtype,
      vac_start: moment(startdate).format(dateFormat),
      vac_end: moment(enddate).format(dateFormat),
      vac_reason: reason ? reason : "No Reason",
      vac_attachment: attachment ? attachment : "No Attachment",
      vac_total: d,
    };
    const token = sessionStorage.getItem("token");
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/api/vacation`,
      data: vacData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then(() => {
        setLoading(false);
        setSuccess(true);
      })
      .catch(() => {
        setLoading(false);
        setSuccess(false);
      });
  };

  const createVacation = () => {
    setSubmit(true);
    setLoading(true);
    var valid = true;
    if (vacationtype === "") {
      valid = false;
      setErrorMessage("No vacation type selected.");
    } else if (startdate === "") {
      valid = false;
      setErrorMessage("No start date selected.");
    } else if (enddate === "") {
      valid = false;
      setErrorMessage("No end date selected.");
    } else if (startdate > enddate) {
      valid = false;
      setErrorMessage("End date must be after start date.");
    } else if (startdate.isBefore(moment(), "day")) {
      valid = false;
      setErrorMessage("Cannot apply vacation for previous date.");
    } else if (checkVacation()) {
      valid = false;
      setErrorMessage("Vacation exist for this date.");
    }
    if (valid) {
      var d =
        moment
          .duration(
            moment(enddate, "YYYY-MM-DD").diff(moment(startdate, "YYYY-MM-DD"))
          )
          .asDays() + 1;
      setDays(parseFloat(d).toFixed(0));
      addVacation(parseFloat(d).toFixed(0));
    } else {
      setLoading(false);
      setSuccess(false);
    }
  };

  const { mutate } = useMutation(createVacation);

  const onFinish = () => {
    mutate();
  };

  return (
    <>
      {submit ? (
        loading ? (
          <Spinner height={"40vh"} theme={theme} />
        ) : (
          <ResultEvent
            icon={success ? <CheckOutlined /> : <CloseOutlined />}
            status={success ? "success" : "error"}
            title={
              success
                ? "Successfully applied vacation."
                : "Failed to apply vacation."
            }
            subTitle={
              success
                ? `From ${moment(startdate).format(
                    displayDateFormat
                  )} to ${moment(enddate).format(displayDateFormat)} (${
                    days > 1 ? days + " days" : days + " day"
                  })`
                : errorMessage
            }
            extra={
              <Row className="space-between-row">
                <Col span={12} style={{ paddingRight: "10px" }}>
                  <Button
                    type="default"
                    onClick={() => {
                      viewVacation();
                      queryClient.invalidateQueries("vacations");
                    }}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={() => {
                      newVacation();
                    }}
                    block
                  >
                    NEW VACATION
                  </Button>
                </Col>
              </Row>
            }
            height="50vh"
            theme={theme}
          />
        )
      ) : (
        <div style={{ marginTop: "24px" }}>
          {add ? (
            <div className="justified-row">
              <div className="card-custom-size-full">
                <Form
                  {...layout}
                  layout="vertical"
                  name="add-new-shift"
                  onFinish={onFinish}
                  form={form}
                >
                  <Card className="card-no-padding">
                    <Row>
                      <Col span={16} style={{ paddingRight: "24px" }}>
                        <div
                          className=" card-with-background"
                          style={{ padding: "24px" }}
                        >
                          <Form.Item
                            name={["vacationtype"]}
                            label="Vacation Type"
                            rules={[
                              {
                                required: true,
                                message: "Vacation type required",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              style={{ width: "100%" }}
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toLowerCase()
                                  .includes(input)
                              }
                              filterSort={(optionA, optionB) =>
                                (optionA?.label ?? "")
                                  .toLowerCase()
                                  .localeCompare(
                                    (optionB?.label ?? "").toLowerCase()
                                  )
                              }
                              options={options
                                .filter(
                                  (res) => res.opt_category === "Vacation"
                                )
                                .map((vac) => {
                                  return {
                                    value: vac.opt_name,
                                    label: vac.opt_name,
                                  };
                                })}
                              onChange={(value) => updateField(value, 1)}
                            />
                          </Form.Item>
                          <Form.Item
                            name={["startdate"]}
                            label="Start Date"
                            rules={[
                              {
                                required: true,
                                message: "Start date required",
                              },
                            ]}
                          >
                            <DatePicker
                              placeholder=""
                              format={datePickerFormat}
                              onChange={(value) => updateField(value, 2)}
                              inputReadOnly
                            />
                          </Form.Item>
                          <Form.Item
                            name={["enddate"]}
                            label="End Date"
                            rules={[
                              {
                                required: true,
                                message: "End date required",
                              },
                            ]}
                          >
                            <DatePicker
                              placeholder=""
                              format={datePickerFormat}
                              onChange={(value) => updateField(value, 3)}
                              inputReadOnly
                            />
                          </Form.Item>
                          <Form.Item name={["reason"]} label="Vacation Reason">
                            <Input
                              onChange={(e) => updateField(e.target.value, 4)}
                            />
                          </Form.Item>
                          <Form.Item name={["attachment"]} label="Attachment">
                            <Input
                              type="file"
                              onChange={(e) => updateField(e.target.value, 5)}
                            />
                          </Form.Item>
                          <div
                            className="space-between-row"
                            style={{ paddingTop: "24px" }}
                          >
                            <Button
                              type="default"
                              onClick={() => {
                                viewVacation();
                                queryClient.invalidateQueries("vacations");
                              }}
                              block
                            >
                              CANCEL
                            </Button>
                            <Button
                              type="primary"
                              htmlType="submit"
                              style={{
                                marginLeft: "10px",
                              }}
                              block
                            >
                              SAVE
                            </Button>
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div
                          className="card-with-background"
                          style={{ padding: "24px" }}
                        >
                          <Steps
                            current={step}
                            direction="vertical"
                            items={[
                              {
                                title: "Vaction Type",
                                description:
                                  vacationtype === "" ? "Empty" : vacationtype,
                                status:
                                  vacationtype === "" ? "error" : "finish",
                              },
                              {
                                title: "Start Date",
                                description: moment(
                                  startdate,
                                  displayDateFormat,
                                  true
                                ).isValid()
                                  ? moment(startdate).format(displayDateFormat)
                                  : "Invalid date",
                                status: moment(
                                  startdate,
                                  displayDateFormat,
                                  true
                                ).isValid()
                                  ? "finish"
                                  : "error",
                              },
                              {
                                title: "End Date",
                                description: moment(
                                  enddate,
                                  displayDateFormat,
                                  true
                                ).isValid()
                                  ? moment(enddate).format(displayDateFormat)
                                  : "Invalid date",
                                status: moment(
                                  enddate,
                                  displayDateFormat,
                                  true
                                ).isValid()
                                  ? "finish"
                                  : "error",
                              },
                              {
                                title: "Vacation Reason",
                                description: reason === "" ? "Empty" : reason,
                                status: reason === "" ? "error" : "finish",
                              },
                              {
                                title: "Attachment",
                                description:
                                  attachment === "" ? "Empty" : attachment,
                                status: attachment === "" ? "error" : "finish",
                              },
                            ]}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Form>
              </div>
            </div>
          ) : (
            <Card className="card-no-padding">
              <Table
                rowClassName={() => "table-row"}
                columns={columns}
                dataSource={loadVacations
                  .filter((res) => res.id === empid)
                  .map((vac) => {
                    return {
                      type: vac.type,
                      start: moment(vac.start).format(displayDateFormat),
                      end: moment(vac.end).format(displayDateFormat),
                      reason: vac.reason,
                      attach: vac.attach,
                      total: vac.total,
                    };
                  })}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                }}
                scroll={{
                  x: "100%",
                  y: 300,
                }}
              />
            </Card>
          )}
        </div>
      )}
    </>
  );
};

export default Vacation;
