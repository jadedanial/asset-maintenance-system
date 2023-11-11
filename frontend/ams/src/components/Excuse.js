import React, { useState, useEffect } from "react";
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
  notification,
} from "antd";
import { CheckCircleOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import NotificationEvent from "./NotificationEvent";
import ResultEvent from "../components/ResultEvent";

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const Excuse = (props) => {
  const dateFormat = "YYYY-MM-DD";
  const timeFormat = "HH:mm:ss";
  const [attendances, setAttendances] = useState([]);
  const [excuses, setExcuses] = useState([]);
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
                <p className="medium-font">
                  {moment(excusedate).format(dateFormat)}
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
                <p className="medium-font">
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
              description: <p className="medium-font">{reason}</p>,
            },
          ]}
          renderItem={(item, index) => (
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

  const columns = [
    {
      title: "Excuse Date",
      dataIndex: "date",
      key: "date",
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

  useEffect(() => {
    (async () => {
      await loadExcuses();
    })();
  }, []);

  async function loadExcuses() {
    try {
      await axios({
        method: "GET",
        url: "http://localhost:8000/api/excuses",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((response) => {
        setExcuses([]);
        response.data.map((res) =>
          setExcuses((excuses) => [
            ...excuses,
            {
              id: res.emp_id,
              date: res.exc_date,
              start: res.exc_start,
              end: res.exc_end,
              reason: res.exc_reason,
              total: res.exc_total,
            },
          ])
        );
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function loadAttendances() {
    try {
      await axios({
        method: "GET",
        url: "http://localhost:8000/api/attendance",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((response) => {
        setAttendances([]);
        response.data.map((res) =>
          setAttendances((attendances) => [
            ...attendances,
            {
              id: res.emp_id,
              date: res.attend_date,
              under: res.attend_under,
              status: res.attend_status,
            },
          ])
        );
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function updateAttendance() {
    var attendData = {
      emp_id: props.empid,
      attend_date: excusedate.format(dateFormat),
      attend_under: under - hours,
      attend_excuse: hours,
    };
    try {
      await axios({
        method: "PATCH",
        url: "http://localhost:8000/api/emp_attendance/",
        data: attendData,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function newExcuse() {
    setSuccess(false);
    setCurrent(0);
    setExcuseDate("");
    setStartTime("");
    setEndTime("");
    setReason("");
    setAdd(true);
    setHours(0);
    setUnder(0);
    loadExcuses();
    loadAttendances();
  }

  function viewExcuse() {
    setAdd(false);
    setSuccess(false);
  }

  function addExcuseButton() {
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
  }

  function checkExcuse() {
    var onExcuse = false;
    var excs = excuses
      .filter((res) => res.id === props.empid)
      .map((exc) => {
        return {
          date: exc.date,
          start: exc.start,
          end: exc.end,
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
  }

  function checkAttendance() {
    var onAttend = false;
    var attends = attendances
      .filter((res) => res.id === props.empid)
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
  }

  function next() {
    var valid = true;
    if (excusedate === "") {
      valid = false;
      api.info(NotificationEvent(false, "No Excuse Date selected!!"));
    } else if (starttime === "") {
      valid = false;
      api.info(NotificationEvent(false, "No Start Time selected!"));
    } else if (endtime === "") {
      valid = false;
      api.info(NotificationEvent(false, "No End Time selected!"));
    } else if (starttime > endtime || starttime === endtime) {
      valid = false;
      api.info(
        NotificationEvent(false, "End Time must greater than Start Time!")
      );
    } else if (reason === "") {
      valid = false;
      api.info(NotificationEvent(false, "No valid Reason!"));
    } else if (
      excusedate.format(dateFormat) === moment().format(dateFormat) ||
      excusedate.format(dateFormat) > moment().format(dateFormat)
    ) {
      valid = false;
      api.info(
        NotificationEvent(
          false,
          "Cannot apply excuse for current or future date!"
        )
      );
    } else if (checkExcuse()) {
      valid = false;
      api.info(NotificationEvent(false, "Excuse exist for this date!"));
    } else if (checkAttendance()) {
      valid = false;
      api.info(
        NotificationEvent(
          false,
          "Cannot apply excuse when attendance status is not Attended!"
        )
      );
    }
    if (valid) {
      var h = moment
        .duration(moment(endtime).diff(moment(starttime)))
        .asHours();
      setHours(parseFloat(h).toFixed(2));
      setCurrent(current + 1);
    }
  }

  function prev() {
    setCurrent(current - 1);
  }

  async function applyExcuse() {
    var excData = {
      emp_id: props.empid,
      exc_date: moment(excusedate).format(dateFormat),
      exc_start: moment(starttime).format(timeFormat),
      exc_end: moment(endtime).format(timeFormat),
      exc_reason: reason,
      exc_total: hours,
    };
    try {
      await axios({
        method: "POST",
        url: "http://localhost:8000/api/excuse/",
        data: excData,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      updateAttendance();
      loadExcuses();
      setSuccess(true);
    } catch (err) {
      console.log(err);
      setSuccess(false);
      api.info(NotificationEvent(false, "Employee vacation failed to apply!"));
    }
  }

  if (success) {
    return (
      <>
        <ResultEvent
          icon={<CheckCircleOutlined style={{ color: "#318ce7" }} />}
          status="success"
          title={"Successfully applied employee excuse."}
          subTitle={`From ${moment(starttime).format(timeFormat)} To ${moment(
            endtime
          ).format(timeFormat)} (${
            hours > 1 ? hours + " hours" : hours + " hour"
          })`}
          extra={[
            <Button
              size="large"
              type="primary"
              style={{
                marginRight: "10px",
              }}
              onClick={newExcuse}
            >
              ADD NEW EXCUSE
            </Button>,
            <Button size="large" type="primary" onClick={viewExcuse}>
              VIEW EXCUSES
            </Button>,
          ]}
        />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <div style={{ marginTop: "20px" }}>
        <Card size="small" style={{ width: "100%" }}>
          {add ? (
            <div className="justified-row">
              <div className="card-custom-size">
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
                    hoverable
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
                          style={{ marginRight: "20px" }}
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
              className="light-color-header-table"
              rowClassName={() => "table-row"}
              columns={columns}
              dataSource={excuses
                .filter((res) => res.id === props.empid)
                .map((exc) => {
                  return {
                    date: exc.date,
                    start: exc.start,
                    end: exc.end,
                    reason: exc.reason,
                    total: exc.total,
                  };
                })}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
              }}
              size="small"
              scroll={{
                y: "50vh",
              }}
            />
          )}
        </Card>
      </div>
    </>
  );
};

export default Excuse;
