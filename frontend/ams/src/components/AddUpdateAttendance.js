import React, { useState } from "react";
import { useCustomQueryClient } from "../useQueryClient";
import { useMutation } from "react-query";
import axios from "axios";
import {
  Form,
  Button,
  Typography,
  DatePicker,
  Input,
  Card,
  Col,
  Row,
  notification,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";
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

const AddUpdateAttendance = ({
  schedules,
  vacations,
  empid,
  schedid,
  mode,
  attenddate,
  employeeAttendance,
  updateAttendance,
  updateOnSelect,
  checkInTime,
  checkOutTime,
  viewAttendance,
  theme,
}) => {
  const queryClient = useCustomQueryClient();
  const dateFormat = "YYYY-MM-DD";
  const timeFormat = "HH:mm:ss";
  const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
  const displayDateFormat = "MMMM DD, YYYY";
  const datePickerFormat = (value) =>
    `${value.format(displayDateFormat + " HH:mm:ss")}`;
  const attendDate = moment(attenddate).format(dateFormat);
  const [attendCheckin, setAttendCheckIn] = useState(checkInTime);
  const [attendCheckout, setAttendCheckOut] = useState(checkOutTime);
  const [success, setSuccess] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const loadSchedules = () => {
    return schedules
      .map((res) =>
        res.id === schedid
          ? {
              sched_sun: res.sched_sun,
              sched_mon: res.sched_mon,
              sched_tue: res.sched_tue,
              sched_wed: res.sched_wed,
              sched_thu: res.sched_thu,
              sched_fri: res.sched_fri,
              sched_sat: res.sched_sat,
            }
          : null
      )
      .filter(Boolean);
  };

  const loadVacations =
    vacations && vacations.length > 0
      ? vacations.map((res) => {
          return {
            id: res.emp_id,
            type: res.vac_type,
            start: res.vac_start,
            end: res.vac_end,
          };
        })
      : [];

  const dayOfTheWeek = (day) => {
    const schedules = loadSchedules();
    return schedules.map((schedule) => schedule[day]);
  };

  const totalRequired = (shiftStart, shiftEnd) => {
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
  };

  const checkIfLateIn = (shiftStart, shiftEnd) => {
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
  };

  const checkIfEarlyOut = (shiftStart, shiftEnd) => {
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
  };

  const totalWorked = (shiftStart, shiftEnd) => {
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
  };

  const totalUndertime = (work, shiftStart, shiftEnd) => {
    var under = 0;
    if (parseFloat(work) < parseFloat(totalRequired(shiftStart, shiftEnd))) {
      under = totalRequired(shiftStart, shiftEnd) - work;
    } else {
      under = 0;
    }
    return under;
  };

  const totalOvertime = (work, shiftStart, shiftEnd) => {
    var over = 0;
    if (parseFloat(work) > parseFloat(totalRequired(shiftStart, shiftEnd))) {
      over = work - totalRequired(shiftStart, shiftEnd);
    } else {
      over = 0;
    }
    return over;
  };

  const checkVacation = () => {
    var onVacation = false;
    var vacs = loadVacations
      .filter((res) => res.id === empid)
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
  };

  const checkStatus = (work, shiftStart, shiftEnd) => {
    var status = "No Attendance Data";
    if (checkVacation()) {
      status = "Vacation Today";
    } else {
      if (parseFloat(work) > parseFloat(0)) {
        status = "Attended Today";
      } else {
        if (parseFloat(totalRequired(shiftStart, shiftEnd)) === parseFloat(0)) {
          status = "Day Off Today";
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
  };

  const addAttendance = (
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
  ) => {
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
    const token = sessionStorage.getItem("token");
    axios({
      method: apiMethod,
      url: `${process.env.REACT_APP_API_URL}/api/emp_attendance`,
      data: attendData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then(() => {
        queryClient.invalidateQueries("attendances");
      })
      .catch((err) => {
        console.log(err);
        NotificationEvent(false, "Employee attendance failed to apply.");
      });
  };

  const createAttendance = () => {
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
        ).split(" - ")[0];
      var shiftEnd =
        attendDate +
        " " +
        String(
          dayOfTheWeek(
            "sched_" + String(moment(attendDate).format("ddd")).toLowerCase()
          )
        ).split(" - ")[1];
      if (shiftStart > shiftEnd) {
        shiftEnd = moment(shiftEnd).add(1, "days").format(dateTimeFormat);
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
      if (mode === "Add Attendance") {
        apiMethod = "POST";
      } else {
        apiMethod = "PATCH";
      }
      addAttendance(
        apiMethod,
        empid,
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
      const attendItem = employeeAttendance;
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
      updateAttendance(attendItem);
      updateOnSelect(date);
      setSuccess(true);
    } else {
      setSuccess(false);
      api.info(
        NotificationEvent(
          false,
          err === 0
            ? "Check-out time must be after check-in time."
            : err === 1
            ? "Check-in date must be equal to attendance date."
            : err === 2
            ? "Check-out date must be equal to attendance date."
            : ""
        )
      );
    }
  };

  const { mutateAttendance } = useMutation(createAttendance);

  const onFinish = () => {
    mutateAttendance();
  };

  if (success) {
    return (
      <>
        <ResultEvent
          icon={<CheckOutlined />}
          status="success"
          title={"Successfully applied employee attendance."}
          subTitle={
            String(moment(attendDate).format(displayDateFormat)) +
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
          extra={
            <Row className="space-between-row">
              <Col span={12} style={{ paddingRight: "10px" }}>
                <Button
                  size="large"
                  type="default"
                  onClick={viewAttendance}
                  block
                >
                  CLOSE
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  size="large"
                  type="primary"
                  onClick={viewAttendance}
                  block
                >
                  NEW ATTENDANCE
                </Button>
              </Col>
            </Row>
          }
          height="70%"
          theme={theme}
        />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="justified-row">
        <div className="card-custom-size-60">
          <Form
            {...layout}
            layout="vertical"
            size="large"
            name="add-new-attendance"
            onFinish={onFinish}
          >
            <Card
              size="large"
              title={
                <Title>
                  <p className="big-card-title">Update Attendance</p>
                </Title>
              }
            >
              <Form.Item
                name="date"
                label="Date"
                initialValue={String(
                  moment(attenddate).format(displayDateFormat)
                )}
              >
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Check In">
                <DatePicker
                  placeholder=""
                  format={datePickerFormat}
                  onChange={(value) =>
                    setAttendCheckIn(moment(value).format(dateTimeFormat))
                  }
                  defaultValue={
                    attendCheckin !== "--:--:--"
                      ? moment(attendCheckin, dateTimeFormat)
                      : ""
                  }
                  showTime
                  inputReadOnly
                />
              </Form.Item>
              <Form.Item label="Check Out">
                <DatePicker
                  placeholder=""
                  format={datePickerFormat}
                  onChange={(value) =>
                    setAttendCheckOut(moment(value).format(dateTimeFormat))
                  }
                  defaultValue={
                    attendCheckout !== "--:--:--"
                      ? moment(attendCheckout, dateTimeFormat)
                      : ""
                  }
                  showTime
                  inputReadOnly
                />
              </Form.Item>
              <div className="space-between-row" style={{ paddingTop: "24px" }}>
                <Button
                  size="large"
                  type="default"
                  style={{
                    marginRight: "10px",
                  }}
                  onClick={viewAttendance}
                  block
                >
                  CANCEL
                </Button>
                <Button size="large" type="primary" htmlType="submit" block>
                  SAVE
                </Button>
              </div>
            </Card>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddUpdateAttendance;
