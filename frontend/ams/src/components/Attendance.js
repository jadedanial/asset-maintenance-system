import React, { useState } from "react";
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
import AddUpdateAttendance from "./AddUpdateAttendance";
import NotificationEvent from "./NotificationEvent";
import moment from "moment";

const { Title } = Typography;

const Attendance = ({
  attendances,
  employees,
  schedules,
  vacations,
  excuses,
  empid,
  theme,
}) => {
  const dateFormat = "YYYY-MM-DD";
  const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
  const displayDateFormat = "MMMM DD, YYYY";
  const [selectedDate, setSelectedDate] = useState(
    String(moment().format(dateFormat))
  );
  const [schedid, setSchedId] = useState(0);
  const [attendStatus, setAttendStatus] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceMode, setAttendanceMode] = useState("ADD ATTENDANCE");
  const [checkInTime, setCheckInTime] = useState("--:--:--");
  const [checkOutTime, setCheckOutTime] = useState("--:--:--");
  const [attendButton, setAttendButton] = useState("none");
  const [add, setAdd] = useState(false);
  const [withData, setWithData] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const loadAttendances = () => {
    return attendances
      .filter((res) => res.emp_id === empid)
      .map((res) => ({
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
      }));
  };

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
        moment(selectedDate).format(dateFormat) ===
        moment(dateExc).format(dateFormat)
      ) {
        onExcuse = true;
        break;
      } else {
        onExcuse = false;
      }
    }
    return onExcuse;
  };

  const [employeeAttendance, setEmployeeAttendance] = useState(
    loadAttendances()
  );

  const updateStatus = (stat, data, mode) => {
    setAttendStatus(stat);
    setAttendanceData(data);
    setAttendanceMode(mode);
  };

  const onSelect = (newValue) => {
    setWithData(true);
    setAttendButton("");
    setSelectedDate(String(moment(newValue).format(displayDateFormat)));
    updateStatus("No Attendance Data", [], "ADD ATTENDANCE");
    setCheckInTime("--:--:--");
    setCheckOutTime("--:--:--");
    for (const [, value] of Object.entries(employeeAttendance)) {
      if (
        String(value["Date"]) === String(moment(newValue).format(dateFormat))
      ) {
        var attendData = [];
        for (let key in value) {
          if (key === "Date") {
            attendData.push(
              key + " : " + moment(value[key]).format(displayDateFormat)
            );
          } else if (key === "Check In" || key === "Check Out") {
            if (value[key] !== "--:--:--") {
              attendData.push(
                key + " : " + moment(value[key]).format("HH:mm:ss")
              );
            } else {
              attendData.push(key + " : " + value[key]);
            }
          } else {
            attendData.push(key + " : " + value[key]);
          }
        }
        updateStatus(String(value["Status"]), attendData, "UPDATE ATTENDANCE");
        setCheckInTime(String(value["Check In"]));
        setCheckOutTime(String(value["Check Out"]));
      }
    }
  };

  const attendanceStatus = (key) => {
    switch (key) {
      case "Attended Today":
        return (
          <>
            <CheckOutlined />
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
            <CheckSquareOutlined />
          </>
        );
      case "Vacation Today":
        return (
          <>
            <CarryOutOutlined />
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
  };

  const getListData = (value) => {
    let listData;
    employeeAttendance?.forEach((attendance) => {
      switch (String(moment(value).format(dateFormat))) {
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
  };

  const dateCellRender = (value) => {
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
  };

  const monthlyAttendanceData = (selecteddate) => {
    var workdays = 0,
      absences = 0,
      dayoffs = 0,
      vacations = 0,
      hoursworked = 0,
      hoursrequired = 0,
      hoursexcused = 0;
    employeeAttendance?.forEach((attendance) => {
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
            icon: <CheckOutlined />,
          },
          {
            title: "Absences",
            value: absences,
            icon: <CloseOutlined />,
          },
          {
            title: "Day Offs",
            value: dayoffs,
            icon: <CheckSquareOutlined />,
          },
          {
            title: "Vacations",
            value: vacations,
            icon: <CarryOutOutlined />,
          },
          {
            title: "Hours Worked",
            value: hoursworked.toFixed(2),
            icon: <ClockCircleOutlined />,
          },
          {
            title: "Hours Required",
            value: hoursrequired.toFixed(2),
            icon: <HourglassOutlined />,
          },
          {
            title: "Hours Excused",
            value: hoursexcused.toFixed(2),
            icon: <MinusCircleOutlined />,
          },
        ].map((item) => (
          <Col>
            <Statistic
              className="small-font-statistic"
              title={
                <Title>
                  <div className="justified-row">
                    <p className="small-font text">{item.title}</p>
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
  };

  const getSchedule = () => {
    const employee = employees.find((res) => res.emp_id === empid);
    return employee ? employee.emp_sched : "";
  };

  const newAttendance = () => {
    const schedule = getSchedule();
    if (schedule) {
      if (!checkExcuse()) {
        setSchedId(schedule);
        setAdd(true);
      } else {
        api.info(
          NotificationEvent(
            false,
            "Not allowed to update attendance with excuse applied."
          )
        );
      }
    } else {
      api.info(
        NotificationEvent(false, "No shift schedule assigned to this employee.")
      );
    }
  };

  const updateAttendance = (newAttendances) => {
    setEmployeeAttendance(newAttendances);
  };

  const viewAttendance = () => {
    setAdd(false);
  };

  return (
    <>
      {contextHolder}
      <div style={{ marginTop: "24px" }}>
        {add ? (
          <Card className="card-no-padding">
            <AddUpdateAttendance
              schedules={schedules}
              vacations={vacations}
              empid={empid}
              schedid={schedid}
              mode={attendanceMode}
              attenddate={selectedDate}
              employeeAttendance={employeeAttendance}
              updateAttendance={updateAttendance}
              updateOnSelect={onSelect}
              checkInTime={checkInTime}
              checkOutTime={checkOutTime}
              viewAttendance={viewAttendance}
              theme={theme}
            />
          </Card>
        ) : (
          <Card className="card-no-padding card-with-background">
            <div className="justified-row" style={{ margin: "24px 0" }}>
              <p className="medium-card-title">
                {String(moment(selectedDate).format("MMMM YYYY"))} Attendance
                Summary
              </p>
            </div>
            <div className="justified-row">
              <Space size={70}>{monthlyAttendanceData(selectedDate)}</Space>
            </div>
            <div style={{ marginTop: "24px" }}>
              <div className="space-between-row ">
                <Col span={withData ? 8 : 0} className="card-with-background">
                  <Card
                    className="card-with-background"
                    style={{ padding: "36px 24px" }}
                  >
                    <div>
                      <p className="medium-card-title">{attendStatus}</p>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <Button
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
                              dot={<ClockCircleOutlined />}
                              className="small-font text"
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
          </Card>
        )}
      </div>
    </>
  );
};

export default Attendance;
