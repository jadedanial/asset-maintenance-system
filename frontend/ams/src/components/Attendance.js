import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Col,
  Row,
  Calendar,
  Card,
  Timeline,
  Statistic,
  Typography,
  Space,
  Button,
} from "antd";
import {
  CarryOutOutlined,
  MinusCircleOutlined,
  HourglassOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CheckSquareOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  IssuesCloseOutlined,
} from "@ant-design/icons";
import moment from "moment";
import AddAttendance from "./AddAttendance";

const { Title } = Typography;

const Attendance = (props, ref) => {
  const [selectedDate, setSelectedDate] = useState(
    String(moment().format("MMMM DD, YYYY"))
  );
  const [attendances, setAttendances] = useState([]);
  const [attendStatus, setAttendStatus] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceMode, setAttendanceMode] = useState("ADD ATTENDANCE");
  const [checkInTime, setCheckInTime] = useState("--:--:--");
  const [checkOutTime, setCheckOutTime] = useState("--:--:--");
  const [attendButton, setAttendButton] = useState("none");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/api/attendance").then((response) => {
      setAttendances([]);
      response.data.map((res) =>
        res.emp_id === props.empid
          ? setAttendances((attendances) => [
              ...attendances,
              {
                Date: res.attend_date,
                "Check In": res.attend_checkin
                  ? res.attend_checkin
                  : "--:--:--",
                "Check Out": res.attend_checkout
                  ? res.attend_checkout
                  : "--:--:--",
                "Late In": res.attend_latein.toFixed(2),
                "Early Out": res.attend_earlyout.toFixed(2),
                Worked: res.attend_work.toFixed(2),
                Required: res.attend_req.toFixed(2),
                Undertime: res.attend_under.toFixed(2),
                Overtime: res.attend_over.toFixed(2),
                Excuse: res.attend_excuse.toFixed(2),
                Status: res.attend_status,
              },
            ])
          : []
      );
    });
  }, [props.empid]);

  function updateAttendances(newAttendances) {
    setAttendances(newAttendances);
  }

  function updateStatus(stat, data, mode) {
    setAttendStatus(stat);
    setAttendanceData(data);
    setAttendanceMode(mode);
  }

  function onSelect(newValue) {
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
            <CheckOutlined style={{ color: "#318CE7" }} />
          </>
        );
      case "Absent Today":
        return (
          <>
            <CloseOutlined style={{ color: "#D90909A9" }} />
          </>
        );
      case "Dayoff Today":
        return (
          <>
            <CheckSquareOutlined style={{ color: "#318CE7" }} />
          </>
        );
      case "Holiday Today":
        return (
          <>
            <CarryOutOutlined style={{ color: "#318CE7" }} />
          </>
        );
      case "Vacation Today":
        return (
          <>
            <CheckCircleOutlined style={{ color: "#318CE7" }} />
          </>
        );
      case "Incomplete Attendance":
        return (
          <>
            <IssuesCloseOutlined style={{ color: "#D90909A9" }} />
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
            <Col span={24} key={item.status} style={{}}>
              <Row style={{ marginTop: "0" }}>
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
              </Row>
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
      holidays = 0,
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
          case "Dayoff Today":
            return dayoffs++;
          case "Holiday Today":
            return holidays++;
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
            icon: <CheckOutlined style={{ color: "#318CE7" }} />,
          },
          {
            title: "Absences",
            value: absences,
            icon: <CloseOutlined style={{ color: "#318CE7" }} />,
          },
          {
            title: "Dayoffs",
            value: dayoffs,
            icon: <CheckSquareOutlined style={{ color: "#318CE7" }} />,
          },
          {
            title: "Holidays",
            value: holidays,
            icon: <CarryOutOutlined style={{ color: "#318CE7" }} />,
          },
          {
            title: "Vacations",
            value: vacations,
            icon: <CheckCircleOutlined style={{ color: "#318CE7" }} />,
          },
          {
            title: "Hours Worked",
            value: hoursworked.toFixed(2),
            icon: <ClockCircleOutlined style={{ color: "#318CE7" }} />,
          },
          {
            title: "Hours Required",
            value: hoursrequired.toFixed(2),
            icon: <HourglassOutlined style={{ color: "#318CE7" }} />,
          },
          {
            title: "Hours Excused",
            value: hoursexcused.toFixed(2),
            icon: <MinusCircleOutlined style={{ color: "#318CE7" }} />,
          },
        ].map((item) => (
          <Col>
            <Statistic
              className="small-font-statistic"
              title={
                <Title>
                  <Row className="justified-row">
                    <p className="extra-small-font">{item.title}</p>
                  </Row>
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

  function componentSwitch(key) {
    switch (key) {
      case true:
        return (
          <>
            <AddAttendance
              empid={props.empid}
              showModal={openModal}
              onCloseModal={onCloseModal}
              mode={attendanceMode}
              attenddate={selectedDate}
              attendances={attendances}
              updateAttendances={updateAttendances}
              updateOnSelect={onSelect}
              checkInTime={checkInTime}
              checkOutTime={checkOutTime}
            ></AddAttendance>
          </>
        );
      default:
        break;
    }
  }

  function showModal() {
    setOpenModal(true);
  }

  function onCloseModal() {
    setOpenModal(false);
    setAttendances(attendances);
  }

  return (
    <>
      <Row style={{ marginTop: "20px" }}>
        <Card size="small" style={{ width: "100%" }}>
          <Row style={{ justifyContent: "center", marginBottom: "20px" }}>
            <p className="medium-card-title">
              {String(moment(selectedDate).format("MMMM YYYY"))} Total Hours
            </p>
          </Row>
          <Row className="justified-row">
            <Space size={50}>{monthlyAttendanceData(selectedDate)}</Space>
          </Row>
        </Card>
      </Row>
      <Row></Row>
      <Row style={{ marginTop: "40px" }}>
        <Col span={7}>
          <Card
            style={{
              background: "#E6F7FF",
              borderColor: "#91D5FF",
              height: "100%",
              padding: "0 10px",
            }}
          >
            <Row>
              <p className="medium-card-title">{attendStatus}</p>
            </Row>
            <Row style={{ marginTop: "10px" }}>
              <Button
                size="large"
                type="primary"
                className="custom-hover"
                style={{ margin: "0", display: attendButton }}
                onClick={() => showModal()}
              >
                {attendanceMode}
              </Button>
            </Row>
            <Row style={{ marginTop: "38px" }}>
              <Timeline>
                {attendanceData.map((data) => (
                  <div>
                    <Timeline.Item
                      dot={<ClockCircleOutlined style={{ fontSize: "" }} />}
                      className="small-font"
                    >
                      {data}
                    </Timeline.Item>
                  </div>
                ))}
              </Timeline>
            </Row>
          </Card>
        </Col>
        <Col span={1}></Col>
        <Col span={16}>
          <Card>
            <p className="medium-card-title" style={{ textAlign: "center" }}>
              Please select date
            </p>
            <Calendar
              fullscreen={true}
              mode="month"
              onSelect={onSelect}
              dateCellRender={dateCellRender}
            />
          </Card>
        </Col>
      </Row>
      {componentSwitch(openModal)}
    </>
  );
};

export default Attendance;
