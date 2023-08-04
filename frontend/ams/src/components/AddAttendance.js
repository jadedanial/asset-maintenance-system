import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Col,
  Row,
  Space,
  Button,
  Modal,
  TimePicker,
  Input,
  notification,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import moment from "moment";
import NotificationEvent from "./NotificationEvent";

const AddAttendance = (props) => {
  const timeFormat = "HH:mm:ss";
  const dateFormat = "YYYY-MM-DD";
  const attendDate = moment(props.attenddate).format(dateFormat);
  const [attendCheckin, setAttendCheckIn] = useState(props.checkInTime);
  const [attendCheckout, setAttendCheckOut] = useState(props.checkOutTime);
  const [schedules, setSchedules] = useState([]);
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
        moment(shiftEnd, timeFormat).diff(moment(shiftStart, timeFormat))
      )
      .asHours();
    return req;
  }

  function checkIfLateIn(shiftStart, shiftEnd) {
    var late = 0;
    if (parseFloat(totalRequired(shiftStart, shiftEnd)) > parseFloat(0)) {
      if (
        moment(attendCheckin, timeFormat).isAfter(
          moment(shiftStart, timeFormat)
        )
      ) {
        late = moment
          .duration(
            moment(attendCheckin, timeFormat).diff(
              moment(shiftStart, timeFormat)
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
        moment(attendCheckout, timeFormat).isBefore(
          moment(shiftEnd, timeFormat)
        )
      ) {
        early = moment
          .duration(
            moment(shiftEnd, timeFormat).diff(
              moment(attendCheckout, timeFormat)
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
        moment(attendCheckin, timeFormat).isAfter(
          moment(shiftStart, timeFormat)
        )
      ) {
        work = moment
          .duration(
            moment(attendCheckout, timeFormat).diff(
              moment(attendCheckin, timeFormat)
            )
          )
          .asHours();
      } else {
        work = moment
          .duration(
            moment(attendCheckout, timeFormat).diff(
              moment(shiftStart, timeFormat)
            )
          )
          .asHours();
      }
    } else {
      work = moment
        .duration(
          moment(attendCheckout, timeFormat).diff(
            moment(attendCheckin, timeFormat)
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
          isNaN(moment(attendCheckin, timeFormat)) &&
          isNaN(moment(attendCheckout, timeFormat))
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

  function onFinish() {
    var validdate = true;

    if (
      !isNaN(moment(attendCheckin, timeFormat)) &&
      !isNaN(moment(attendCheckout, timeFormat))
    ) {
      if (attendCheckin < attendCheckout) {
        validdate = true;
      } else {
        validdate = false;
      }
    }

    if (validdate) {
      var shiftStart = String(
        dayOfTheWeek(
          "sched_" + String(moment(attendDate).format("ddd")).toLowerCase()
        )
      ).split(" To ")[0];
      var shiftEnd = String(
        dayOfTheWeek(
          "sched_" + String(moment(attendDate).format("ddd")).toLowerCase()
        )
      ).split(" To ")[1];
      var date = attendDate;
      var checkin = attendCheckin;
      var checkout = attendCheckout;
      var latein = checkIfLateIn(shiftStart, shiftEnd);
      var earlyout = checkIfEarlyOut(shiftStart, shiftEnd);
      var work = totalWorked(shiftStart, shiftEnd);
      var req = totalRequired(shiftStart, shiftEnd);
      if (isNaN(moment(checkin, timeFormat))) {
        checkin = "";
        work = 0;
      }
      if (isNaN(moment(checkout, timeFormat))) {
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
        checkin !== "" ? checkin : moment("", timeFormat),
        checkout !== "" ? checkout : moment("", timeFormat),
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
      api.info(NotificationEvent(true, "Attendance saved successfully."));
    } else {
      api.info(
        NotificationEvent(false, "Check In must less than Check Out time.")
      );
    }
  }

  return (
    <>
      {contextHolder}
      <Modal
        width="350px"
        closeIcon={<CloseOutlined style={{ color: "#318ce7" }} />}
        centered
        maskClosable={false}
        open={props.showModal}
        onCancel={props.onCloseModal}
        footer={""}
      >
        <Row style={{ marginTop: "0" }}>
          <Form
            size="large"
            layout="vertical"
            className="ant-form-item-space-bottom-normal"
            onFinish={onFinish}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  name="date"
                  label="Date"
                  initialValue={String(
                    moment(props.attenddate).format(dateFormat)
                  )}
                >
                  <Input className="medium-font" readOnly />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Space>
                <Col>
                  <Form.Item label="Check In">
                    <TimePicker
                      onChange={(value) =>
                        setAttendCheckIn(moment(value).format(timeFormat))
                      }
                      value={
                        attendCheckin !== "--:--:--"
                          ? moment(attendCheckin, timeFormat)
                          : null
                      }
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="Check Out">
                    <TimePicker
                      onChange={(value) =>
                        setAttendCheckOut(moment(value).format(timeFormat))
                      }
                      value={
                        attendCheckout !== "--:--:--"
                          ? moment(attendCheckout, timeFormat)
                          : null
                      }
                    />
                  </Form.Item>
                </Col>
              </Space>
            </Row>
            <Row>
              <Form.Item style={{ margin: "20px 0 0 0" }}>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  style={{ width: "300px" }}
                >
                  SAVE
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Row>
      </Modal>
    </>
  );
};

export default AddAttendance;
