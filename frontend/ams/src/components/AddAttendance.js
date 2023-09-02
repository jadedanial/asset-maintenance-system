import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Col,
  Row,
  Button,
  Typography,
  DatePicker,
  Input,
  Card,
  notification,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
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

const AddAttendance = (props) => {
  const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
  const dateFormat = "YYYY-MM-DD";
  const attendDate = moment(props.attenddate).format(dateFormat);
  const [attendCheckin, setAttendCheckIn] = useState(props.checkInTime);
  const [attendCheckout, setAttendCheckOut] = useState(props.checkOutTime);
  const [schedules, setSchedules] = useState([]);
  const [success, setSuccess] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    (async () => {
      try {
        await axios
          .get("http://localhost:8000/api/schedule", {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          })
          .then((response) => {
            response.data.map((res) =>
              res.id === props.schedid
                ? setSchedules([
                    {
                      sched_sun: res.sched_sun,
                      sched_mon: res.sched_mon,
                      sched_tue: res.sched_tue,
                      sched_wed: res.sched_wed,
                      sched_thu: res.sched_thu,
                      sched_fri: res.sched_fri,
                      sched_sat: res.sched_sat,
                    },
                  ])
                : {}
            );
          });
      } catch (err) {
        console.log(err.response.data[0]);
      }
    })();
  }, [props.schedid]);

  function dayOfTheWeek(day) {
    return schedules.map((schedule) => schedule[day]);
  }

  function totalRequired(shiftStart, shiftEnd) {
    var req = moment
      .duration(
        moment(shiftEnd, dateTimeFormat).diff(
          moment(shiftStart, dateTimeFormat)
        )
      )
      .asHours();
    return req;
  }

  function checkIfLateIn(shiftStart, shiftEnd) {
    var late = 0;
    if (parseFloat(totalRequired(shiftStart, shiftEnd)) > parseFloat(0)) {
      if (
        moment(attendCheckin, dateTimeFormat).isAfter(
          moment(shiftStart, dateTimeFormat)
        )
      ) {
        late = moment
          .duration(
            moment(attendCheckin, dateTimeFormat).diff(
              moment(shiftStart, dateTimeFormat)
            )
          )
          .asHours();
      } else {
        late = 0;
      }
    } else {
      late = 0;
    }
    return late;
  }

  function checkIfEarlyOut(shiftStart, shiftEnd) {
    var early = 0;
    if (parseFloat(totalRequired(shiftStart, shiftEnd)) > parseFloat(0)) {
      if (
        moment(attendCheckout, dateTimeFormat).isBefore(
          moment(shiftEnd, dateTimeFormat)
        )
      ) {
        early = moment
          .duration(
            moment(shiftEnd, dateTimeFormat).diff(
              moment(attendCheckout, dateTimeFormat)
            )
          )
          .asHours();
      } else {
        early = 0;
      }
    } else {
      early = 0;
    }
    return early;
  }

  function totalWorked(shiftStart, shiftEnd) {
    var work = 0;
    if (parseFloat(totalRequired(shiftStart, shiftEnd)) > parseFloat(0)) {
      if (
        moment(attendCheckin, dateTimeFormat).isAfter(
          moment(shiftStart, dateTimeFormat)
        )
      ) {
        work = moment
          .duration(
            moment(attendCheckout, dateTimeFormat).diff(
              moment(attendCheckin, dateTimeFormat)
            )
          )
          .asHours();
      } else {
        work = moment
          .duration(
            moment(attendCheckout, dateTimeFormat).diff(
              moment(shiftStart, dateTimeFormat)
            )
          )
          .asHours();
      }
    } else {
      work = moment
        .duration(
          moment(attendCheckout, dateTimeFormat).diff(
            moment(attendCheckin, dateTimeFormat)
          )
        )
        .asHours();
    }
    return work;
  }

  function totalUndertime(work, shiftStart, shiftEnd) {
    var under = 0;
    if (parseFloat(work) < parseFloat(totalRequired(shiftStart, shiftEnd))) {
      under = totalRequired(shiftStart, shiftEnd) - work;
    } else {
      under = 0;
    }
    return under;
  }

  function totalOvertime(work, shiftStart, shiftEnd) {
    var over = 0;
    if (parseFloat(work) > parseFloat(totalRequired(shiftStart, shiftEnd))) {
      over = work - totalRequired(shiftStart, shiftEnd);
    } else {
      over = 0;
    }
    return over;
  }

  function checkStatus(work, shiftStart, shiftEnd) {
    var status = "No Attendance Data";
    if (parseFloat(work) > parseFloat(0)) {
      status = "Attended Today";
    } else {
      if (parseFloat(totalRequired(shiftStart, shiftEnd)) === parseFloat(0)) {
        status = "Dayoff Today";
      } else {
        if (
          isNaN(moment(attendCheckin, dateTimeFormat)) &&
          isNaN(moment(attendCheckout, dateTimeFormat))
        ) {
          status = "Absent Today";
        } else {
          status = "Incomplete Attendance";
        }
      }
    }
    return status;
  }

  async function addAttendance(
    apiMethod,
    emp_id,
    attend_date,
    attend_checkin,
    attend_checkout,
    attend_latein,
    attend_earlyout,
    attend_work,
    attend_req,
    attend_under,
    attend_over,
    attend_excuse,
    attend_status
  ) {
    var attendData = {
      emp_id: emp_id,
      attend_date: attend_date,
      attend_checkin: attend_checkin,
      attend_checkout: attend_checkout,
      attend_latein: attend_latein,
      attend_earlyout: attend_earlyout,
      attend_work: attend_work,
      attend_req: attend_req,
      attend_under: attend_under,
      attend_over: attend_over,
      attend_excuse: attend_excuse,
      attend_status: attend_status,
    };
    try {
      await axios({
        method: apiMethod,
        url: "http://localhost:8000/api/emp_attendance/",
        data: attendData,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    } catch (err) {
      console.log(err.response.data[0]);
    }
  }

  function applyAttendance() {
    var valid = true;
    var err = 0;
    if (
      !isNaN(moment(attendCheckin, dateTimeFormat)) &&
      !isNaN(moment(attendCheckout, dateTimeFormat))
    ) {
      if (attendCheckin > attendCheckout) {
        valid = false;
        err = 0;
      }
    }
    if (!isNaN(moment(attendCheckin, dateTimeFormat))) {
      if (
        moment(attendCheckin).format("YYYY-MM-DD") !==
        moment(attendDate).format("YYYY-MM-DD")
      ) {
        valid = false;
        err = 1;
      }
    }
    if (
      isNaN(moment(attendCheckin, dateTimeFormat)) &&
      !isNaN(moment(attendCheckout, dateTimeFormat))
    ) {
      if (
        moment(attendCheckout).format("YYYY-MM-DD") !==
        moment(attendDate).format("YYYY-MM-DD")
      ) {
        valid = false;
        err = 2;
      }
    }

    if (valid) {
      var shiftStart =
        attendDate +
        " " +
        String(
          dayOfTheWeek(
            "sched_" + String(moment(attendDate).format("ddd")).toLowerCase()
          )
        ).split(" To ")[0];
      var shiftEnd =
        attendDate +
        " " +
        String(
          dayOfTheWeek(
            "sched_" + String(moment(attendDate).format("ddd")).toLowerCase()
          )
        ).split(" To ")[1];
      if (shiftStart > shiftEnd) {
        shiftEnd = moment(shiftEnd).add(1, "days");
      }
      var date = attendDate;
      var checkin = attendCheckin;
      var checkout = attendCheckout;
      var latein = checkIfLateIn(shiftStart, shiftEnd);
      var earlyout = checkIfEarlyOut(shiftStart, shiftEnd);
      var work = totalWorked(shiftStart, shiftEnd);
      var req = totalRequired(shiftStart, shiftEnd);
      if (isNaN(moment(checkin, dateTimeFormat))) {
        checkin = "";
        work = 0;
      }
      if (isNaN(moment(checkout, dateTimeFormat))) {
        checkout = "";
        work = 0;
      }
      var under = totalUndertime(work, shiftStart, shiftEnd);
      var over = totalOvertime(work, shiftStart, shiftEnd);
      var excuse = 0;
      var status = checkStatus(work, shiftStart, shiftEnd);
      var apiMethod = "";
      if (props.mode === "Add Attendance") {
        apiMethod = "POST";
      } else {
        apiMethod = "PATCH";
      }
      addAttendance(
        apiMethod,
        props.empid,
        date,
        checkin !== "" ? checkin : moment("", dateTimeFormat),
        checkout !== "" ? checkout : moment("", dateTimeFormat),
        latein,
        earlyout,
        work,
        req,
        under,
        over,
        excuse,
        status
      );
      const attendItem = props.attendances;
      const matchItem = attendItem.find((attend) => attend.Date === date);
      var index = attendItem.indexOf(matchItem);
      if (index > -1) {
        attendItem.splice(index, 1);
      }
      attendItem.push({
        Date: date,
        "Check In": checkin ? checkin : "--:--:--",
        "Check Out": checkout ? checkout : "--:--:--",
        "Late In": latein,
        "Early Out": earlyout,
        Worked: work,
        Required: req,
        Undertime: under,
        Overtime: over,
        Excuse: excuse,
        Status: status,
      });
      props.updateAttendances(attendItem);
      props.updateOnSelect(date);
      setSuccess(true);
    } else {
      setSuccess(false);
      api.info(
        NotificationEvent(
          false,
          err === 0
            ? "Check In time must less than Check Out time!"
            : err === 1
            ? "Check In date must equal to Attendance date!"
            : err === 2
            ? "Check Out date must equal to Attendance date!"
            : ""
        )
      );
    }
  }

  if (success) {
    return (
      <>
        <ResultEvent
          icon={<CheckCircleOutlined style={{ color: "#318ce7" }} />}
          status="success"
          title={"Successfully applied employee attendance."}
          subTitle={`Date ${String(
            moment(props.attenddate).format(dateFormat)
          )} From ${String(
            moment(attendCheckin).format("HH:mm:ss")
          )} To ${String(moment(attendCheckout).format("HH:mm:ss"))} `}
          extra={[
            <Button size="large" type="primary" onClick={props.viewAttendance}>
              VIEW ATTENDANCES
            </Button>,
          ]}
        />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <Row className="justified-row">
        <div className="card-custom-size">
          <Form
            {...layout}
            layout="vertical"
            size="large"
            name="add-new-attendance"
          >
            <Card
              size="large"
              extra={
                <div>
                  <Button
                    size="large"
                    type="primary"
                    style={{
                      marginRight: "8px",
                    }}
                    onClick={props.viewAttendance}
                  >
                    CANCEL
                  </Button>
                  <Button size="large" type="primary" onClick={applyAttendance}>
                    APPLY
                  </Button>
                </div>
              }
              title={
                <Title>
                  <p className="big-card-title">Attendance</p>
                </Title>
              }
              hoverable
            >
              <Col span={24}>
                <div className="space-between-row">
                  <Col span={7}>
                    <Form.Item
                      name="date"
                      label="Date"
                      initialValue={String(
                        moment(props.attenddate).format(dateFormat)
                      )}
                    >
                      <Input readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Check In">
                      <DatePicker
                        placeholder=""
                        onChange={(value) =>
                          setAttendCheckIn(moment(value).format(dateTimeFormat))
                        }
                        value={
                          attendCheckin !== "--:--:--"
                            ? moment(attendCheckin, dateTimeFormat)
                            : null
                        }
                        showTime
                        inputReadOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Check Out">
                      <DatePicker
                        placeholder=""
                        onChange={(value) =>
                          setAttendCheckOut(
                            moment(value).format(dateTimeFormat)
                          )
                        }
                        value={
                          attendCheckout !== "--:--:--"
                            ? moment(attendCheckout, dateTimeFormat)
                            : null
                        }
                        showTime
                        inputReadOnly
                      />
                    </Form.Item>
                  </Col>
                </div>
              </Col>
            </Card>
          </Form>
        </div>
      </Row>
    </>
  );
};

export default AddAttendance;
