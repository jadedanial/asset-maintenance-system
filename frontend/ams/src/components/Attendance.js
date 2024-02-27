import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Col,
  Calendar,
  Card,
  Timeline,
  Statistic,
  Typography,
  Space,
  Button,
  notification,
} from "antd";
import {
  CarryOutOutlined,
  MinusCircleOutlined,
  HourglassOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CheckSquareOutlined,
  CloseOutlined,
  IssuesCloseOutlined,
} from "@ant-design/icons";
import AddAttendance from "./AddAttendance";
import NotificationEvent from "./NotificationEvent";
import moment from "moment";

const { Title } = Typography;

const Attendance = (props, ref) => {
  const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
  const [selectedDate, setSelectedDate] = useState(
    String(moment().format("YYYY-MM-DD"))
  );
  const [schedid, setSchedId] = useState(0);
  const [attendances, setAttendances] = useState([]);
  const [attendStatus, setAttendStatus] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceMode, setAttendanceMode] = useState("ADD ATTENDANCE");
  const [checkInTime, setCheckInTime] = useState("--:--:--");
  const [checkOutTime, setCheckOutTime] = useState("--:--:--");
  const [attendButton, setAttendButton] = useState("none");
  const [add, setAdd] = useState(false);
  const [withData, setWithData] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  async function getSchedule() {
    let sched;
    const token = sessionStorage.getItem("token");
    await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/employees`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        response.data.map((res) =>
          res.emp_id === props.empid ? (sched = res.emp_sched) : ""
        );
      })
      .catch((err) => {
        console.log(err);
      });
    return sched;
  }

  function updateAttendances(newAttendances) {
    setAttendances(newAttendances);
  }

  function updateStatus(stat, data, mode) {
    setAttendStatus(stat);
    setAttendanceData(data);
    setAttendanceMode(mode);
  }

  function onSelect(newValue) {
    setWithData(true);
    setAttendButton("");
    setSelectedDate(String(moment(newValue).format("MMMM DD, YYYY")));
    updateStatus("No Attendance Data", [], "ADD ATTENDANCE");
    setCheckInTime("--:--:--");
    setCheckOutTime("--:--:--");
    for (const [, value] of Object.entries(attendances)) {
      if (
        String(value["Date"]) === String(moment(newValue).format("YYYY-MM-DD"))
      ) {
        var attendData = [];
        for (let key in value) {
          attendData.push(key + " : " + value[key]);
        }
        updateStatus(String(value["Status"]), attendData, "UPDATE ATTENDANCE");
        setCheckInTime(String(value["Check In"]));
        setCheckOutTime(String(value["Check Out"]));
      }
    }
  }

  function attendanceStatus(key) {
    switch (key) {
      case "Attended Today":
        return (
          <>
            <CheckOutlined style={{ color: "#318ce7" }} />
          </>
        );
      case "Absent Today":
        return (
          <>
            <CloseOutlined style={{ color: "#e65c5c" }} />
          </>
        );
      case "Day Off Today":
        return (
          <>
            <CheckSquareOutlined style={{ color: "#318ce7" }} />
          </>
        );
      case "Vacation Today":
        return (
          <>
            <CarryOutOutlined style={{ color: "#318ce7" }} />
          </>
        );
      case "Incomplete Attendance":
        return (
          <>
            <IssuesCloseOutlined style={{ color: "#e65c5c" }} />
          </>
        );
      default:
        break;
    }
  }

  function getListData(value) {
    let listData;
    attendances?.forEach((attendance) => {
      switch (String(moment(value).format("YYYY-MM-DD"))) {
        case attendance.Date:
          listData = [
            {
              status: attendance.Status,
            },
          ];
          break;
        default:
      }
    });
    return listData || [];
  }

  function dateCellRender(value) {
    if (
      String(moment(value).format("MMMM YYYY")) ===
      String(moment(selectedDate).format("MMMM YYYY"))
    ) {
      const listData = getListData(value);
      return (
        <>
          {listData.map((item) => (
            <Col span={24} key={item.status} style={{ marginTop: "0" }}>
              <p
                style={{
                  margin: "0",
                  fontSize: "24px",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {attendanceStatus(item.status)}
              </p>
            </Col>
          ))}
        </>
      );
    }
  }

  function monthlyAttendanceData(selecteddate) {
    var workdays = 0,
      absences = 0,
      dayoffs = 0,
      vacations = 0,
      hoursworked = 0,
      hoursrequired = 0,
      hoursexcused = 0;
    attendances?.forEach((attendance) => {
      if (
        String(moment(attendance.Date).format("MMMM YYYY")) ===
        String(moment(selecteddate).format("MMMM YYYY"))
      ) {
        hoursworked += parseFloat(attendance.Worked);
        hoursrequired += parseFloat(attendance.Required);
        hoursexcused += parseFloat(attendance.Excuse);
        switch (attendance.Status) {
          case "Attended Today":
            return workdays++;
          case "Absent Today":
            return absences++;
          case "Day Off Today":
            return dayoffs++;
          case "Vacation Today":
            return vacations++;
          default:
            break;
        }
      }
    });

    return (
      <>
        {[
          {
            title: "Work Days",
            value: workdays,
            icon: <CheckOutlined style={{ color: "#318ce7" }} />,
          },
          {
            title: "Absences",
            value: absences,
            icon: <CloseOutlined style={{ color: "#318ce7" }} />,
          },
          {
            title: "Day Offs",
            value: dayoffs,
            icon: <CheckSquareOutlined style={{ color: "#318ce7" }} />,
          },
          {
            title: "Vacations",
            value: vacations,
            icon: <CarryOutOutlined style={{ color: "#318ce7" }} />,
          },
          {
            title: "Hours Worked",
            value: hoursworked.toFixed(2),
            icon: <ClockCircleOutlined style={{ color: "#318ce7" }} />,
          },
          {
            title: "Hours Required",
            value: hoursrequired.toFixed(2),
            icon: <HourglassOutlined style={{ color: "#318ce7" }} />,
          },
          {
            title: "Hours Excused",
            value: hoursexcused.toFixed(2),
            icon: <MinusCircleOutlined style={{ color: "#318ce7" }} />,
          },
        ].map((item) => (
          <Col>
            <Statistic
              className="small-font-statistic"
              title={
                <Title>
                  <div className="justified-row">
                    <p className="small-font">{item.title}</p>
                  </div>
                </Title>
              }
              value={item.value}
              prefix={item.icon}
            />
          </Col>
        ))}
      </>
    );
  }

  function newAttendance() {
    getSchedule().then((schedule) => {
      if (schedule) {
        setSchedId(schedule);
        setAdd(true);
      } else {
        api.info(
          NotificationEvent(
            false,
            "No shift schedule assigned to this employee."
          )
        );
      }
    });
  }

  function viewAttendance() {
    setAdd(false);
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/attendances`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        setAttendances([]);
        response.data.map((res) =>
          res.emp_id === props.empid
            ? setAttendances((attendances) => [
                ...attendances,
                {
                  Date: res.attend_date,
                  "Check In": res.attend_checkin
                    ? String(moment(res.attend_checkin).format(dateTimeFormat))
                    : "--:--:--",
                  "Check Out": res.attend_checkout
                    ? String(moment(res.attend_checkout).format(dateTimeFormat))
                    : "--:--:--",
                  "Late In": res.attend_latein,
                  "Early Out": res.attend_earlyout,
                  Worked: res.attend_work,
                  Required: res.attend_req,
                  Undertime: res.attend_under,
                  Overtime: res.attend_over,
                  Excuse: res.attend_excuse,
                  Status: res.attend_status,
                },
              ])
            : []
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.empid]);

  return (
    <>
      {contextHolder}
      <div style={{ marginTop: "20px" }}>
        <Card size="small" style={{ width: "100%" }}>
          {add ? (
            <AddAttendance
              empid={props.empid}
              schedid={schedid}
              mode={attendanceMode}
              attenddate={selectedDate}
              attendances={attendances}
              updateAttendances={updateAttendances}
              updateOnSelect={onSelect}
              checkInTime={checkInTime}
              checkOutTime={checkOutTime}
              viewAttendance={viewAttendance}
            />
          ) : (
            <>
              <div className="justified-row" style={{ margin: "30px 0" }}>
                <p className="medium-card-title">
                  {String(moment(selectedDate).format("MMMM YYYY"))} Attendance
                  Summary
                </p>
              </div>
              <div className="justified-row">
                <Space size={70}>{monthlyAttendanceData(selectedDate)}</Space>
              </div>
              <div style={{ marginTop: "40px" }}>
                <div className="space-between-row">
                  <Col span={withData ? 8 : 0}>
                    <Card
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      <div>
                        <p className="medium-card-title">{attendStatus}</p>
                      </div>
                      <div style={{ marginTop: "10px" }}>
                        <Button
                          size="large"
                          type="primary"
                          className="custom-hover"
                          style={{ margin: "0", display: attendButton }}
                          onClick={newAttendance}
                        >
                          {attendanceMode}
                        </Button>
                      </div>
                      <div style={{ marginTop: "38px" }}>
                        <Timeline>
                          {attendanceData.map((data) => (
                            <div>
                              <Timeline.Item
                                dot={
                                  <ClockCircleOutlined
                                    style={{ fontSize: "" }}
                                  />
                                }
                                className="small-font"
                              >
                                {data}
                              </Timeline.Item>
                            </div>
                          ))}
                        </Timeline>
                      </div>
                    </Card>
                  </Col>
                  <Col span={withData ? 16 : 24}>
                    <Card>
                      <Calendar
                        fullscreen={true}
                        mode="month"
                        onSelect={onSelect}
                        dateCellRender={dateCellRender}
                      />
                    </Card>
                  </Col>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default Attendance;
