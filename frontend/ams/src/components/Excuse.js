import React, { useState } from "react";
import { useCustomQueryClient } from "../useQueryClient";
import { useMutation } from "react-query";
import axios from "axios";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Card,
  Button,
  Table,
  Row,
  Col,
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

const Excuse = ({ excuses, attendances, empid, theme }) => {
  const queryClient = useCustomQueryClient();
  const [step, setStep] = useState(0);
  const dateFormat = "YYYY-MM-DD";
  const timeFormat = "HH:mm:ss";
  const displayDateFormat = "MMMM DD, YYYY";
  const datePickerFormat = (value) => `${value.format(displayDateFormat)}`;
  const [excusedate, setExcuseDate] = useState("");
  const [starttime, setStartTime] = useState("");
  const [endtime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [add, setAdd] = useState(false);
  const [hours, setHours] = useState(0);
  const [under, setUnder] = useState(0);

  const loadAttendances = attendances.map((res) => {
    return {
      id: res.emp_id,
      date: res.attend_date,
      under: res.attend_under,
      status: res.attend_status,
    };
  });

  const loadExcuses = excuses.map((res) => {
    return {
      id: res.emp_id,
      date: res.exc_date,
      start: res.exc_start,
      end: res.exc_end,
      reason: res.exc_reason,
      total: res.exc_total,
    };
  });

  const newExcuse = () => {
    setSubmit(false);
    setSuccess(false);
    setAdd(true);
    setExcuseDate("");
    setStartTime("");
    setEndTime("");
    setReason("");
    setAdd(true);
    setHours(0);
    setUnder(0);
  };

  const updateField = (value, step) => {
    const fieldMap = {
      1: [setExcuseDate, setStep],
      2: [setStartTime, setStep],
      3: [setEndTime, setStep],
      4: [setReason, setStep],
    };
    const [updateState, setStepState] = fieldMap[step];
    updateState(value);
    setStepState(step);
  };

  const viewExcuse = () => {
    setSubmit(false);
    setSuccess(false);
    setAdd(false);
  };

  const countExcuse = () => {
    var excuse = 0;
    var excs = loadExcuses
      .filter((res) => res.id === empid)
      .map((excuse) => {
        return {
          date: excuse.date,
          total: excuse.total,
        };
      });
    for (var i = 0; i < excs.length; i++) {
      var dateExc = excs[i]["date"];
      if (
        String(moment(excusedate).format("MMMM YYYY")) ===
        String(moment(dateExc).format("MMMM YYYY"))
      ) {
        excuse += parseFloat(excs[i]["total"]);
      }
    }
    return excuse;
  };

  const checkAttendance = () => {
    var onAttend = false;
    var attends = loadAttendances
      .filter((res) => res.id === empid)
      .map((attend) => {
        return {
          date: attend.date,
          under: attend.under,
          status: attend.status,
        };
      });
    if (attends.length < 1) {
      onAttend = true;
    }
    for (var i = 0; i < attends.length; i++) {
      var dateAttend = attends[i]["date"];
      var underAttend = attends[i]["under"];
      var statusAttend = attends[i]["status"];
      if (
        excusedate.format(dateFormat) !== moment(dateAttend).format(dateFormat)
      ) {
        onAttend = true;
      } else {
        if (statusAttend === "Attended Today") {
          onAttend = false;
          setUnder(underAttend);
          break;
        } else {
          onAttend = true;
          break;
        }
      }
    }
    return onAttend;
  };

  const checkExcuse = () => {
    var onExcuse = false;
    var excs = loadExcuses
      .filter((res) => res.id === empid)
      .map((excuse) => {
        return {
          date: excuse.date,
          start: excuse.start,
          end: excuse.end,
        };
      });
    for (var i = 0; i < excs.length; i++) {
      var dateExc = excs[i]["date"];
      if (
        excusedate.format(dateFormat) === moment(dateExc).format(dateFormat)
      ) {
        onExcuse = true;
        break;
      } else {
        onExcuse = false;
      }
    }
    return onExcuse;
  };

  const addExcuseButton = () => {
    return (
      <div className="flex-end-row">
        <Button type="primary" onClick={newExcuse}>
          ADD
        </Button>
      </div>
    );
  };

  const columns = [
    {
      title: "Excuse Date",
      dataIndex: "date",
      key: "date",
      width: "200px",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      defaultSortOrder: "ascend",
    },
    {
      title: "Start Time",
      dataIndex: "start",
      key: "start",
      sorter: (a, b) => a.start.localeCompare(b.start),
      defaultSortOrder: "ascend",
    },
    {
      title: "End Time",
      dataIndex: "end",
      key: "end",
      sorter: (a, b) => a.end.localeCompare(b.end),
      defaultSortOrder: "ascend",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      sorter: (a, b) => a.total - b.total,
      defaultSortOrder: "ascend",
    },
    {
      title: addExcuseButton,
      dataIndex: "addExcuseButton",
      key: "addExcuseButton",
    },
  ];

  const addExcuse = (h) => {
    var excData = {
      emp_id: empid,
      exc_date: moment(excusedate).format(dateFormat),
      exc_start: moment(starttime).format(timeFormat),
      exc_end: moment(endtime).format(timeFormat),
      exc_reason: reason,
      exc_total: h,
    };
    const token = sessionStorage.getItem("token");
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/api/excuse`,
      data: excData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then(() => {
        var attendData = {
          emp_id: empid,
          attend_date: excusedate.format(dateFormat),
          attend_under: under - h,
          attend_excuse: h,
        };
        const token = sessionStorage.getItem("token");
        axios({
          method: "PATCH",
          url: `${process.env.REACT_APP_API_URL}/api/emp_attendance`,
          data: attendData,
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
      })
      .catch(() => {
        setLoading(false);
        setSuccess(false);
      });
  };

  const createExcuse = () => {
    setSubmit(true);
    setLoading(true);
    var valid = true;
    if (excusedate === "") {
      valid = false;
      setErrorMessage("No excuse date selected.");
    } else if (starttime === "") {
      valid = false;
      setErrorMessage("No start time selected.");
    } else if (endtime === "") {
      valid = false;
      setErrorMessage("No end time selected.");
    } else if (starttime > endtime || starttime === endtime) {
      valid = false;
      setErrorMessage("End time must be after start time.");
    } else if (reason === "") {
      valid = false;
      setErrorMessage("No valid reason.");
    } else if (
      excusedate.format(dateFormat) === moment().format(dateFormat) ||
      excusedate.format(dateFormat) > moment().format(dateFormat)
    ) {
      valid = false;
      setErrorMessage("Cannot apply excuse for current or future date.");
    } else if (checkAttendance()) {
      valid = false;
      setErrorMessage(
        "Cannot apply excuse when attendance status is not attended."
      );
    } else if (checkExcuse()) {
      valid = false;
      setErrorMessage("Excuse exist for this date.");
    } else if (
      parseFloat(countExcuse()) +
        parseFloat(
          moment
            .duration(moment(endtime).diff(moment(starttime)))
            .asHours()
            .toFixed(2)
        ) >
      8
    ) {
      valid = false;
      setErrorMessage("Total excuse hours limit already reached.");
    }
    if (valid) {
      var h = moment
        .duration(moment(endtime).diff(moment(starttime)))
        .asHours();
      setHours(parseFloat(h).toFixed(2));
      addExcuse(parseFloat(h).toFixed(2));
    } else {
      setLoading(false);
      setSuccess(false);
    }
  };

  const { mutate } = useMutation(createExcuse);

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
                ? "Successfully applied excuse."
                : "Failed to apply excuse."
            }
            subTitle={
              success
                ? `${moment(excusedate).format(
                    displayDateFormat
                  )} From ${moment(starttime).format(timeFormat)} To ${moment(
                    endtime
                  ).format(timeFormat)} (${
                    hours > 1 ? hours + " hours" : hours + " hour"
                  })`
                : errorMessage
            }
            extra={
              <Row className="space-between-row">
                <Col span={12}>
                  <Button
                    type="default"
                    onClick={() => {
                      viewExcuse();
                      queryClient.invalidateQueries("excuses");
                    }}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
                <Col span={12} style={{ paddingLeft: "10px" }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      newExcuse();
                    }}
                    block
                  >
                    NEW EXCUSE
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
                >
                  <Card className="card-no-padding">
                    <Row>
                      <Col span={16} style={{ paddingRight: "24px" }}>
                        <div
                          className=" card-with-background"
                          style={{ padding: "24px" }}
                        >
                          <Form.Item
                            name={["excusedate"]}
                            label="Excuse Date"
                            rules={[
                              {
                                required: true,
                                message: "Excuse date required",
                              },
                            ]}
                          >
                            <DatePicker
                              placeholder=""
                              format={datePickerFormat}
                              onChange={(value) => updateField(value, 1)}
                              inputReadOnly
                            />
                          </Form.Item>
                          <Form.Item
                            name={["starttime"]}
                            label="Start Time"
                            rules={[
                              {
                                required: true,
                                message: "Start time required",
                              },
                            ]}
                          >
                            <TimePicker
                              placeholder=""
                              onChange={(value) => updateField(value, 2)}
                              inputReadOnly
                            />
                          </Form.Item>
                          <Form.Item
                            name={["endtime"]}
                            label="End Time"
                            rules={[
                              {
                                required: true,
                                message: "End time required",
                              },
                            ]}
                          >
                            <TimePicker
                              placeholder=""
                              onChange={(value) => updateField(value, 3)}
                              inputReadOnly
                            />
                          </Form.Item>
                          <Form.Item
                            name={["reason"]}
                            label="Excuse Reason"
                            rules={[
                              {
                                required: true,
                                message: "Vacation reason required",
                              },
                            ]}
                          >
                            <Input
                              onChange={(e) => updateField(e.target.value, 4)}
                            />
                          </Form.Item>
                          <div
                            className="space-between-row"
                            style={{ paddingTop: "24px" }}
                          >
                            <Button
                              type="default"
                              onClick={() => {
                                viewExcuse();
                                queryClient.invalidateQueries("excuses");
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
                                title: "Excuse Date",
                                description: moment(
                                  excusedate,
                                  displayDateFormat,
                                  true
                                ).isValid()
                                  ? moment(excusedate).format(displayDateFormat)
                                  : "Invalid date",
                                status: moment(
                                  excusedate,
                                  displayDateFormat,
                                  true
                                ).isValid()
                                  ? "finish"
                                  : "error",
                              },
                              {
                                title: "Start Time",
                                description: moment(
                                  starttime,
                                  timeFormat
                                ).isValid()
                                  ? moment(starttime, timeFormat).format(
                                      timeFormat
                                    )
                                  : "Invalid time",
                                status: moment(starttime, timeFormat).isValid()
                                  ? "finish"
                                  : "error",
                              },
                              {
                                title: "End Time",
                                description: moment(
                                  endtime,
                                  timeFormat
                                ).isValid()
                                  ? moment(endtime, timeFormat).format(
                                      timeFormat
                                    )
                                  : "Invalid time",
                                status: moment(endtime, timeFormat).isValid()
                                  ? "finish"
                                  : "error",
                              },
                              {
                                title: "Excuse Reason",
                                description: reason === "" ? "Empty" : reason,
                                status: reason === "" ? "error" : "finish",
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
                dataSource={loadExcuses
                  .filter((res) => res.id === empid)
                  .map((exc) => {
                    return {
                      date: moment(exc.date).format(displayDateFormat),
                      start: exc.start,
                      end: exc.end,
                      reason: exc.reason,
                      total: exc.total,
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

export default Excuse;
