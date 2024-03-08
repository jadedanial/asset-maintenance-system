import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Card,
  Button,
  Typography,
  List,
  Table,
  Row,
  Col,
  notification,
} from "antd";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import NotificationEvent from "./NotificationEvent";
import ResultEvent from "./ResultEvent";
import moment from "moment";

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const Excuse = ({ excuses, attendances, empid, theme }) => {
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
  const [current, setCurrent] = useState(0);

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

  const loadAttendances = attendances.map((res) => {
    return {
      id: res.emp_id,
      date: res.attend_date,
      under: res.attend_under,
      status: res.attend_status,
    };
  });

  const updateAttendance = () => {
    var attendData = {
      emp_id: empid,
      attend_date: excusedate.format(dateFormat),
      attend_under: under - hours,
      attend_excuse: hours,
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
    }).catch((err) => {
      console.log(err);
    });
  };

  const newExcuse = () => {
    setSuccess(false);
    setCurrent(0);
    setExcuseDate("");
    setStartTime("");
    setEndTime("");
    setReason("");
    setAdd(true);
    setHours(0);
    setUnder(0);
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

  const next = () => {
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
    } else if (parseFloat(countExcuse()) > 8) {
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
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const applyExcuse = () => {
    var excData = {
      emp_id: empid,
      exc_date: moment(excusedate).format(dateFormat),
      exc_start: moment(starttime).format(timeFormat),
      exc_end: moment(endtime).format(timeFormat),
      exc_reason: reason,
      exc_total: hours,
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
        updateAttendance();
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
        api.info(NotificationEvent(false, "Employee excuse failed to apply."));
      });
  };

  const addExcuseButton = () => {
    return (
      <div className="flex-end-row">
        <Button
          icon={<PlusOutlined />}
          size="medium"
          type="primary"
          onClick={newExcuse}
        >
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

  const steps = [
    {
      title: "Details",
      content: (
        <>
          <Form.Item
            name={["excusedate"]}
            label="Excuse Date"
            initialValue={excusedate === "" ? "" : moment(excusedate)}
            rules={[
              {
                required: true,
                message: "Required!",
              },
            ]}
          >
            <DatePicker
              placeholder=""
              format={datePickerFormat}
              onChange={(value) => setExcuseDate(moment(value))}
              inputReadOnly
            />
          </Form.Item>
          <Form.Item
            name={["starttime"]}
            label="Start Time"
            initialValue={starttime === "" ? "" : moment(starttime)}
            rules={[
              {
                required: true,
                message: "Required!",
              },
            ]}
          >
            <TimePicker
              placeholder=""
              onChange={(value) => setStartTime(moment(value))}
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
                message: "Required!",
              },
            ]}
          >
            <TimePicker
              placeholder=""
              onChange={(value) => setEndTime(moment(value))}
              inputReadOnly
            />
          </Form.Item>
          <Form.Item
            name={["reason"]}
            label="Reason"
            initialValue={reason}
            rules={[
              {
                required: true,
                message: "Required!",
              },
            ]}
          >
            <Input value={reason} onChange={(e) => setReason(e.target.value)} />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Confirm",
      content: (
        <List
          style={{ width: "100%" }}
          itemLayout="horizontal"
          dataSource={[
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  Date
                </p>
              ),
              description: (
                <p className="medium-font text">
                  {moment(excusedate).format(displayDateFormat)}
                </p>
              ),
            },
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  Time
                </p>
              ),
              description: (
                <p className="medium-font text">
                  From {moment(starttime).format(timeFormat)} To{" "}
                  {moment(endtime).format(timeFormat)} (
                  {hours > 1 ? hours + " hours" : hours + " hour"})
                </p>
              ),
            },
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  Reason
                </p>
              ),
              description: <p className="medium-font text">{reason}</p>,
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      ),
    },
  ];

  if (success) {
    return (
      <>
        <ResultEvent
          icon={<CheckOutlined style={{ color: "#318ce7" }} />}
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
            <Row className="space-between-row" style={{ width: "40%" }}>
              <Col span={12}>
                <Button size="large" type="default" onClick={viewExcuse} block>
                  CLOSE
                </Button>
              </Col>
              <Col span={11}>
                <Button size="large" type="primary" onClick={newExcuse} block>
                  NEW EXCUSE
                </Button>
              </Col>
            </Row>
          }
          theme={theme}
        />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <div style={{ marginTop: "20px" }}>
        <Card size="small" style={{ width: "100%", minHeight: "460px" }}>
          {add ? (
            <div className="justified-row">
              <div className="card-custom-size-60">
                <Form
                  {...layout}
                  layout="vertical"
                  size="large"
                  name="add-vacation"
                  style={{ width: "100%" }}
                >
                  <Card
                    size="large"
                    title={
                      <Title>
                        <p className="big-card-title">Excuse Application</p>
                      </Title>
                    }
                  >
                    <div>{steps[current].content}</div>
                    <div
                      className="space-between-row"
                      style={{ paddingTop: "30px" }}
                    >
                      <Button
                        size="large"
                        type="default"
                        style={{
                          marginRight: "10px",
                          display: current > 0 ? "none" : "inline",
                        }}
                        onClick={viewExcuse}
                        block
                      >
                        CANCEL
                      </Button>
                      {current < steps.length - 1 && (
                        <Button
                          size="large"
                          type="primary"
                          onClick={next}
                          block
                        >
                          NEXT
                        </Button>
                      )}
                      {current > 0 && (
                        <Button
                          size="large"
                          type="default"
                          style={{ marginRight: "10px" }}
                          onClick={prev}
                          block
                        >
                          BACK
                        </Button>
                      )}
                      {current === steps.length - 1 && (
                        <Button
                          size="large"
                          type="primary"
                          onClick={applyExcuse}
                          block
                        >
                          APPLY
                        </Button>
                      )}
                    </div>
                  </Card>
                </Form>
              </div>
            </div>
          ) : (
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
                x: "calc(0px + 100%)",
                y: 300,
              }}
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default Excuse;
