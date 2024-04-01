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
  notification,
} from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import NotificationEvent from "./NotificationEvent";
import ResultEvent from "./ResultEvent";
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
  const [vacation, setVacation] = useState("");
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState("");
  const [showAttachment, setShowAttachment] = useState(false);
  const [success, setSuccess] = useState(false);
  const [add, setAdd] = useState(false);
  const [days, setDays] = useState(0);
  const [api, contextHolder] = notification.useNotification();
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
    form.resetFields(["vacation"]);
    form.resetFields(["startdate"]);
    form.resetFields(["enddate"]);
    form.resetFields(["reason"]);
    form.resetFields(["select_attachment"]);
    setSuccess(false);
    setVacation("");
    setStartDate("");
    setEndDate("");
    setReason("");
    setAttachment("");
    setShowAttachment(false);
    setAdd(true);
    setDays(0);
  };

  const onVacationChange = (value) => {
    setVacation(value);
    setStep(1);
  };

  const onStartDateChange = (value) => {
    setStartDate(value);
    setStep(2);
  };

  const onEndDateChange = (value) => {
    setEndDate(value);
    setStep(3);
  };

  const onReasonChange = (value) => {
    setReason(value);
    setStep(4);
  };

  const onAttachmentChange = (value) => {
    setAttachment(value);
    setShowAttachment(true);
    setStep(5);
  };

  const removeAttachment = () => {
    form.resetFields(["select_attachment"]);
    setAttachment("");
    setShowAttachment(false);
  };

  const viewVacation = () => {
    setAdd(false);
    setSuccess(false);
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
        <Button size="medium" type="primary" onClick={newVacation}>
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
    },
    {
      title: "Start Date",
      dataIndex: "start",
      key: "start",
      width: "200px",
    },
    {
      title: "End Date",
      dataIndex: "end",
      key: "end",
      width: "200px",
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
    },
    {
      title: addVactionButton,
      dataIndex: "addVactionButton",
      key: "addVactionButton",
    },
  ];

  const createVacation = () => {
    var vacData = {
      emp_id: empid,
      vac_type: vacation,
      vac_start: moment(startdate).format(dateFormat),
      vac_end: moment(enddate).format(dateFormat),
      vac_reason: reason ? reason : "No Reason",
      vac_attachment: attachment ? attachment : "No Attachment",
      vac_total: days,
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
        queryClient.invalidateQueries("vacations");
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
        api.info(
          NotificationEvent(false, "Employee vacation failed to apply.")
        );
      });
  };

  const { mutate } = useMutation(createVacation);

  const onFinish = () => {
    var valid = true;
    if (vacation === "") {
      valid = false;
      api.info(NotificationEvent(false, "No vacation type selected."));
    } else if (startdate === "") {
      valid = false;
      api.info(NotificationEvent(false, "No start date selected."));
    } else if (enddate === "") {
      valid = false;
      api.info(NotificationEvent(false, "No end date selected."));
    } else if (startdate > enddate) {
      valid = false;
      api.info(NotificationEvent(false, "End date must be after start date."));
    } else if (startdate.isBefore(moment(), "day")) {
      valid = false;
      api.info(
        NotificationEvent(false, "Cannot apply vacation for previous date.")
      );
    } else if (checkVacation()) {
      valid = false;
      api.info(NotificationEvent(false, "Vacation exist for this date."));
    }
    if (valid) {
      var d =
        moment
          .duration(
            moment(enddate, "YYYY-MM-DD").diff(moment(startdate, "YYYY-MM-DD"))
          )
          .asDays() + 1;
      setDays(parseFloat(d).toFixed(0));
      mutate();
    }
  };

  if (success) {
    return (
      <>
        <div style={{ minHeight: "460px" }}>
          <ResultEvent
            icon={<CheckOutlined />}
            status="success"
            title={"Successfully applied employee vacation."}
            subTitle={`From ${moment(startdate).format(
              displayDateFormat
            )} To ${moment(enddate).format(displayDateFormat)} (${
              days > 1 ? days + " days" : days + " day"
            })`}
            extra={
              <Row className="space-between-row">
                <Col span={12} style={{ paddingRight: "10px" }}>
                  <Button
                    size="large"
                    type="default"
                    onClick={viewVacation}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    size="large"
                    type="primary"
                    onClick={newVacation}
                    block
                  >
                    NEW VACATION
                  </Button>
                </Col>
              </Row>
            }
            height="70%"
            theme={theme}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <div style={{ marginTop: "24px", minHeight: "460px" }}>
        {add ? (
          <div className="justified-row">
            <div className="card-custom-size-full">
              <Form
                {...layout}
                layout="vertical"
                size="large"
                name="add-new-shift"
                onFinish={onFinish}
                form={form}
              >
                <Card size="large" className="card-no-padding">
                  <Row>
                    <Col span={16} style={{ paddingRight: "24px" }}>
                      <div
                        className=" card-with-background"
                        style={{ padding: "24px" }}
                      >
                        <Form.Item
                          name={["vacation"]}
                          label="Vacation Type"
                          initialValue={vacation}
                          rules={[
                            {
                              required: true,
                              message: "Vacation type required",
                            },
                          ]}
                        >
                          <Select
                            size="large"
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
                              .filter((res) => res.opt_category === "Vacation")
                              .map((vac) => {
                                return {
                                  value: vac.opt_name,
                                  label: vac.opt_name,
                                };
                              })}
                            onChange={onVacationChange}
                          />
                        </Form.Item>
                        <Form.Item
                          name={["startdate"]}
                          label="Start Date"
                          initialValue={
                            startdate === "" ? "" : moment(startdate)
                          }
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
                            onChange={onStartDateChange}
                            inputReadOnly
                          />
                        </Form.Item>
                        <Form.Item
                          name={["enddate"]}
                          label="End Date"
                          initialValue={enddate === "" ? "" : moment(enddate)}
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
                            onChange={onEndDateChange}
                            inputReadOnly
                          />
                        </Form.Item>
                        <Form.Item
                          name={["reason"]}
                          label="Vacation Reason"
                          initialValue={reason}
                        >
                          <Input
                            onChange={(e) => onReasonChange(e.target.value)}
                          />
                        </Form.Item>
                        {showAttachment ? (
                          <Form.Item
                            name={["attachment"]}
                            label="Attachment"
                            initialValue={attachment}
                          >
                            <Input
                              readOnly
                              suffix={
                                <Button
                                  className="align-items-center "
                                  icon={
                                    <CloseOutlined className="medium-card-title" />
                                  }
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                  }}
                                  onClick={removeAttachment}
                                />
                              }
                            />
                          </Form.Item>
                        ) : (
                          <Form.Item
                            name={["select_attachment"]}
                            label="Attachment"
                          >
                            <Input
                              type="file"
                              onChange={(e) =>
                                onAttachmentChange(e.target.value)
                              }
                            />
                          </Form.Item>
                        )}
                        <div
                          className="space-between-row"
                          style={{ paddingTop: "24px" }}
                        >
                          <Button
                            size="large"
                            type="default"
                            style={{
                              marginRight: "10px",
                            }}
                            onClick={viewVacation}
                            block
                          >
                            CANCEL
                          </Button>
                          <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
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
                              description: vacation === "" ? " " : vacation,
                              status: vacation === "" ? "error" : "finish",
                            },
                            {
                              title: "Start Date",
                              description:
                                startdate === ""
                                  ? " "
                                  : moment(startdate).format(displayDateFormat),
                              status: startdate === "" ? "error" : "finish",
                            },
                            {
                              title: "End Date",
                              description:
                                enddate === ""
                                  ? " "
                                  : moment(enddate).format(displayDateFormat),
                              status: enddate === "" ? "error" : "finish",
                            },
                            {
                              title: "Vacation Reason",
                              description: reason === "" ? " " : reason,
                              status: reason === "" ? "error" : "finish",
                            },
                            {
                              title: "Attachment",
                              description: attachment === "" ? " " : attachment,
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
          <Card className="card-no-padding" size="small">
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
              size="large"
              scroll={{
                x: "100%",
                y: 300,
              }}
            />
          </Card>
        )}
      </div>
    </>
  );
};

export default Vacation;
