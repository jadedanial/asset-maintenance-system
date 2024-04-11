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
  notification,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";
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
  const [success, setSuccess] = useState(false);
  const [add, setAdd] = useState(false);
  const [hours, setHours] = useState(0);
  const [under, setUnder] = useState(0);
  const [api, contextHolder] = notification.useNotification();

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
    setSuccess(false);
    setExcuseDate("");
    setStartTime("");
    setEndTime("");
    setReason("");
    setAdd(true);
    setHours(0);
    setUnder(0);
  };

  const onExcuseDateChange = (value) => {
    setExcuseDate(value);
    setStep(1);
  };

  const onStartTimeChange = (value) => {
    setStartTime(value);
    setStep(2);
  };

  const onEndTimeChange = (value) => {
    setEndTime(value);
    setStep(3);
  };

  const onReasonChange = (value) => {
    setReason(value);
    setStep(4);
  };

  const viewExcuse = () => {
    setAdd(false);
    setSuccess(false);
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
    },
    {
      title: "Start Time",
      dataIndex: "start",
      key: "start",
    },
    {
      title: "End Time",
      dataIndex: "end",
      key: "end",
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
    },
    {
      title: addExcuseButton,
      dataIndex: "addExcuseButton",
      key: "addExcuseButton",
    },
  ];

  const createExcuse = (h) => {
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
        }).then(() => {
          setSuccess(true);
        });
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
        api.info(NotificationEvent(false, "Employee excuse failed to apply."));
      });
  };

  const { mutate } = useMutation(createExcuse);

  const onFinish = () => {
    var valid = true;
    if (excusedate === "") {
      valid = false;
      api.info(NotificationEvent(false, "No excuse date selected."));
    } else if (starttime === "") {
      valid = false;
      api.info(NotificationEvent(false, "No start time selected."));
    } else if (endtime === "") {
      valid = false;
      api.info(NotificationEvent(false, "No end time selected."));
    } else if (starttime > endtime || starttime === endtime) {
      valid = false;
      api.info(NotificationEvent(false, "End time must be after start time."));
    } else if (reason === "") {
      valid = false;
      api.info(NotificationEvent(false, "No valid reason."));
    } else if (
      excusedate.format(dateFormat) === moment().format(dateFormat) ||
      excusedate.format(dateFormat) > moment().format(dateFormat)
    ) {
      valid = false;
      api.info(
        NotificationEvent(
          false,
          "Cannot apply excuse for current or future date."
        )
      );
    } else if (checkAttendance()) {
      valid = false;
      api.info(
        NotificationEvent(
          false,
          "Cannot apply excuse when attendance status is not attended."
        )
      );
    } else if (checkExcuse()) {
      valid = false;
      api.info(NotificationEvent(false, "Excuse exist for this date."));
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
      api.info(
        NotificationEvent(false, "Total excuse hours limit already reached.")
      );
    }
    if (valid) {
      var h = moment
        .duration(moment(endtime).diff(moment(starttime)))
        .asHours();
      setHours(parseFloat(h).toFixed(2));
      mutate(parseFloat(h).toFixed(2));
    }
  };

  if (success) {
    return (
      <>
        <div style={{ minHeight: "460px" }}>
          <ResultEvent
            icon={<CheckOutlined />}
            status="success"
            title={"Successfully applied employee excuse."}
            subTitle={`${moment(excusedate).format(
              displayDateFormat
            )} From ${moment(starttime).format(timeFormat)} To ${moment(
              endtime
            ).format(timeFormat)} (${
              hours > 1 ? hours + " hours" : hours + " hour"
            })`}
            extra={
              <Row className="space-between-row">
                <Col span={12} style={{ paddingRight: "10px" }}>
                  <Button
                    size="large"
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
                <Col span={12}>
                  <Button
                    size="large"
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
              >
                <Card size="large" className="card-no-padding">
                  <Row>
                    <Col span={16} style={{ paddingRight: "24px" }}>
                      <div
                        className=" card-with-background"
                        style={{ padding: "24px" }}
                      >
                        <Form.Item
                          name={["excusedate"]}
                          label="Excuse Date"
                          initialValue={
                            excusedate === "" ? "" : moment(excusedate)
                          }
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
                            onChange={onExcuseDateChange}
                            inputReadOnly
                          />
                        </Form.Item>
                        <Form.Item
                          name={["starttime"]}
                          label="Start Time"
                          initialValue={
                            starttime === "" ? "" : moment(starttime)
                          }
                          rules={[
                            {
                              required: true,
                              message: "Start time required",
                            },
                          ]}
                        >
                          <TimePicker
                            placeholder=""
                            onChange={onStartTimeChange}
                            inputReadOnly
                          />
                        </Form.Item>
                        <Form.Item
                          name={["endtime"]}
                          label="End Time"
                          initialValue={endtime === "" ? "" : moment(endtime)}
                          rules={[
                            {
                              required: true,
                              message: "End time required",
                            },
                          ]}
                        >
                          <TimePicker
                            placeholder=""
                            onChange={onEndTimeChange}
                            inputReadOnly
                          />
                        </Form.Item>
                        <Form.Item
                          name={["reason"]}
                          label="Excuse Reason"
                          initialValue={reason}
                          rules={[
                            {
                              required: true,
                              message: "Vacation reason required",
                            },
                          ]}
                        >
                          <Input
                            onChange={(e) => onReasonChange(e.target.value)}
                          />
                        </Form.Item>
                        <div
                          className="space-between-row"
                          style={{ paddingTop: "24px" }}
                        >
                          <Button
                            size="large"
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
                            size="large"
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
                              description:
                                excusedate === ""
                                  ? " "
                                  : moment(excusedate).format(
                                      displayDateFormat
                                    ),
                              status: excusedate === "" ? "error" : "finish",
                            },
                            {
                              title: "Start Time",
                              description:
                                starttime === ""
                                  ? " "
                                  : moment(starttime).format(timeFormat),
                              status: starttime === "" ? "error" : "finish",
                            },
                            {
                              title: "End Time",
                              description:
                                endtime === ""
                                  ? " "
                                  : moment(endtime).format(timeFormat),
                              status: endtime === "" ? "error" : "finish",
                            },
                            {
                              title: "Excuse Reason",
                              description: reason === "" ? " " : reason,
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

export default Excuse;
