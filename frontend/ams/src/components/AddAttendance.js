import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
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
  const timeFormat = "HH:mm:ss";
  const attendDate = moment(props.attenddate).format(dateFormat);
  const [attendCheckin, setAttendCheckIn] = useState(props.checkInTime);
  const [attendCheckout, setAttendCheckOut] = useState(props.checkOutTime);
  const [schedules, setSchedules] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [success, setSuccess] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    (async () => {
      await loadSchedules();
      await loadVacations();
    })();
  }, []);

  async function loadSchedules() {
    try {
      await axios({
        method: "GET",
        url: "http://localhost:8000/api/schedule",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((response) => {
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
      console.log(err);
    }
  }

  async function loadVacations() {
    try {
      await axios({
        method: "GET",
        url: "http://localhost:8000/api/vacations",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((response) => {
        setVacations([]);
        response.data.map((res) =>
          setVacations((vacations) => [
            ...vacations,
            {
              id: res.emp_id,
              type: res.vac_type,
              start: res.vac_start,
              end: res.vac_end,
            },
          ])
        );
      });
    } catch (err) {
      console.log(err);
    }
  }

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
    if (checkVacation()) {
      req = 0;
    }
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

  function checkVacation() {
    var onVacation = false;
    var vacs = vacations
      .filter((res) => res.id === props.empid)
      .map((vac) => {
        return {
          type: vac.type,
          start: vac.start,
          end: vac.end,
        };
      });
    for (var i = 0; i < vacs.length; i++) {
      var startVac = vacs[i]["start"];
      var endVac = vacs[i]["end"];
      if (moment(attendDate).isBetween(startVac, endVac, undefined, [])) {
        onVacation = true;
        break;
      } else {
        onVacation = false;
      }
    }
    return onVacation;
  }

  function checkStatus(work, shiftStart, shiftEnd) {
    var status = "No Attendance Data";
    if (checkVacation()) {
      status = "Vacation Today";
    } else {
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
    }
    return status;
  }

  async function addAttendance(
    apiMethod,
    emp_id,
    date,
    checkin,
    checkout,
    latein,
    earlyout,
    work,
    req,
    under,
    over,
    excuse,
    status
  ) {
    var attendData = {
      emp_id: emp_id,
      attend_date: date,
      attend_checkin: checkin,
      attend_checkout: checkout,
      attend_latein: latein,
      attend_earlyout: earlyout,
      attend_work: work,
      attend_req: req,
      attend_under: under,
      attend_over: over,
      attend_excuse: excuse,
      attend_status: status,
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
      console.log(err);
    }
  }

  function applyAttendance() {
    loadSchedules();
    loadVacations();
    var valid = true;
    var err = 0;
    if (
      moment(attendCheckin, dateTimeFormat).isValid() === true &&
      moment(attendCheckout, dateTimeFormat).isValid() === true
    ) {
      if (attendCheckin > attendCheckout) {
        valid = false;
        err = 0;
      }
    }
    if (moment(attendCheckin, dateTimeFormat).isValid() === true) {
      if (
        moment(attendCheckin).format(dateFormat) !==
        moment(attendDate).format(dateFormat)
      ) {
        valid = false;
        err = 1;
      }
    }
    if (
      moment(attendCheckin, dateTimeFormat).isValid() === false &&
      moment(attendCheckout, dateTimeFormat).isValid() === true
    ) {
      if (
        moment(attendCheckout).format(dateFormat) !==
        moment(attendDate).format(dateFormat)
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
      var latein = parseFloat(checkIfLateIn(shiftStart, shiftEnd)).toFixed(2);
      var earlyout = parseFloat(checkIfEarlyOut(shiftStart, shiftEnd)).toFixed(
        2
      );
      var work = parseFloat(totalWorked(shiftStart, shiftEnd)).toFixed(2);
      var req = parseFloat(totalRequired(shiftStart, shiftEnd)).toFixed(2);
      if (isNaN(moment(checkin, dateTimeFormat))) {
        checkin = "";
        work = "0.00";
      }
      if (isNaN(moment(checkout, dateTimeFormat))) {
        checkout = "";
        work = "0.00";
      }
      var under = parseFloat(
        totalUndertime(work, shiftStart, shiftEnd)
      ).toFixed(2);
      var over = parseFloat(totalOvertime(work, shiftStart, shiftEnd)).toFixed(
        2
      );
      var excuse = "0.00";
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
            ? "Check Out time must greater than Check In time!"
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
          subTitle={
            "Date " +
            String(moment(attendDate).format(dateFormat)) +
            " From " +
            String(
              moment(attendCheckin).isValid()
                ? moment(attendCheckin).format(timeFormat)
                : "--:--:--"
            ) +
            " To " +
            String(
              moment(attendCheckout).isValid()
                ? moment(attendCheckout).format(timeFormat)
                : "--:--:--"
            )
          }
          extra={[
            <Button size="large" type="primary" onClick={props.viewAttendance}>
              VIEW ATTENDANCE
            </Button>,
          ]}
        />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="justified-row">
        <div className="card-custom-size">
          <Form
            {...layout}
            layout="vertical"
            size="large"
            name="add-new-attendance"
          >
            <Card
              size="large"
              title={
                <Title>
                  <p className="big-card-title">Update Attendance</p>
                </Title>
              }
              hoverable
            >
              <Form.Item
                name="date"
                label="Date"
                initialValue={String(
                  moment(props.attenddate).format(dateFormat)
                )}
              >
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Check In">
                <DatePicker
                  onChange={(value) =>
                    setAttendCheckIn(moment(value).format(dateTimeFormat))
                  }
                  defaultValue={
                    attendCheckin !== "--:--:--"
                      ? moment(attendCheckin, dateTimeFormat)
                      : null
                  }
                  showTime
                  inputReadOnly
                />
              </Form.Item>
              <Form.Item label="Check Out">
                <DatePicker
                  onChange={(value) =>
                    setAttendCheckOut(moment(value).format(dateTimeFormat))
                  }
                  defaultValue={
                    attendCheckout !== "--:--:--"
                      ? moment(attendCheckout, dateTimeFormat)
                      : null
                  }
                  showTime
                  inputReadOnly
                />
              </Form.Item>
              <div className="space-between-row" style={{ paddingTop: "30px" }}>
                <Button
                  size="large"
                  type="default"
                  style={{
                    marginRight: "10px",
                  }}
                  onClick={props.viewAttendance}
                  block
                >
                  CANCEL
                </Button>
                <Button
                  size="large"
                  type="primary"
                  onClick={applyAttendance}
                  block
                >
                  APPLY
                </Button>
              </div>
            </Card>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddAttendance;
