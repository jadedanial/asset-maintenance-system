import React, { useState } from "react";
import { useCustomQueryClient } from "../useQueryClient";
import { useMutation } from "react-query";
import axios from "axios";
import { Form, Button, DatePicker, Input, Card, Col, Row, Steps } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ResultEvent from "./ResultEvent";
import Spinner from "../components/Spinner";
import moment from "moment";

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
  const [step, setStep] = useState(0);
  const dateFormat = "YYYY-MM-DD";
  const timeFormat = "HH:mm:ss";
  const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
  const displayDateFormat = "MMMM DD, YYYY";
  const datePickerFormat = (value) =>
    `${value.format(displayDateFormat + " HH:mm:ss")}`;
  const attendDate = moment(attenddate).format(dateFormat);
  const [attendCheckin, setAttendCheckIn] = useState(checkInTime);
  const [attendCheckout, setAttendCheckOut] = useState(checkOutTime);
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        setLoading(false);
        setSuccess(true);
      })
      .catch(() => {
        setLoading(false);
        setSuccess(false);
      });
  };

  const createAttendance = () => {
    setSubmit(true);
    setLoading(true);
    var valid = true;
    if (
      moment(attendCheckin, dateTimeFormat).isValid() === true &&
      moment(attendCheckout, dateTimeFormat).isValid() === true
    ) {
      if (attendCheckin > attendCheckout) {
        valid = false;
        setErrorMessage("Check-out time must be after check-in time.");
      }
    }
    if (moment(attendCheckin, dateTimeFormat).isValid() === true) {
      if (
        moment(attendCheckin).format(dateFormat) !==
        moment(attendDate).format(dateFormat)
      ) {
        valid = false;
        setErrorMessage("Check-in date must be equal to attendance date.");
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
        setErrorMessage("Check-out date must be equal to attendance date.");
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
    } else {
      setLoading(false);
      setSuccess(false);
    }
  };

  const { mutate } = useMutation(createAttendance);

  const onFinish = () => {
    mutate();
  };

  return (
    <>
      {submit ? (
        loading ? (
          <Spinner height={"40vh"} theme={theme} />
        ) : (
          <ResultEvent
            icon={success ? <CheckOutlined /> : <CloseOutlined />}
            status={success ? "success" : "error"}
            title={
              success
                ? "Successfully applied attendance."
                : "Failed to apply attendance."
            }
            subTitle={
              success
                ? "Date " +
                  String(moment(attendDate).format(displayDateFormat)) +
                  " from " +
                  String(
                    moment(attendCheckin).isValid()
                      ? moment(attendCheckin).format(timeFormat)
                      : "--:--:--"
                  ) +
                  " to " +
                  String(
                    moment(attendCheckout).isValid()
                      ? moment(attendCheckout).format(timeFormat)
                      : "--:--:--"
                  )
                : errorMessage
            }
            extra={
              <Row className="space-between-row">
                <Col span={12} style={{ paddingRight: "10px" }}>
                  <Button
                    type="default"
                    onClick={() => {
                      viewAttendance();
                      queryClient.invalidateQueries("attendances");
                    }}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={() => {
                      viewAttendance();
                    }}
                    block
                  >
                    NEW ATTENDANCE
                  </Button>
                </Col>
              </Row>
            }
            height="50vh"
            theme={theme}
          />
        )
      ) : (
        <div className="justified-row">
          <div className="card-custom-size-full">
            <Form
              {...layout}
              layout="vertical"
              name="add-new-attendance"
              onFinish={onFinish}
            >
              <Card className="card-no-padding">
                <Row>
                  <Col span={16} style={{ paddingRight: "24px" }}>
                    <div
                      className=" card-with-background"
                      style={{ padding: "24px" }}
                    >
                      <Form.Item
                        name="date"
                        label="Attendance Date"
                        initialValue={String(
                          moment(attenddate).format(displayDateFormat)
                        )}
                      >
                        <Input readOnly />
                      </Form.Item>
                      <Form.Item label="Check In Time">
                        <DatePicker
                          placeholder=""
                          format={datePickerFormat}
                          onChange={(value) => {
                            setAttendCheckIn(
                              moment(value).format(dateTimeFormat)
                            );
                            setStep(2);
                          }}
                          defaultValue={
                            attendCheckin !== "--:--:--"
                              ? moment(attendCheckin, dateTimeFormat)
                              : ""
                          }
                          showTime
                          inputReadOnly
                        />
                      </Form.Item>
                      <Form.Item label="Check Out Time">
                        <DatePicker
                          placeholder=""
                          format={datePickerFormat}
                          onChange={(value) => {
                            setAttendCheckOut(
                              moment(value).format(dateTimeFormat)
                            );
                            setStep(3);
                          }}
                          defaultValue={
                            attendCheckout !== "--:--:--"
                              ? moment(attendCheckout, dateTimeFormat)
                              : ""
                          }
                          showTime
                          inputReadOnly
                        />
                      </Form.Item>
                      <div
                        className="space-between-row"
                        style={{ paddingTop: "24px" }}
                      >
                        <Button
                          type="default"
                          onClick={() => {
                            viewAttendance();
                            queryClient.invalidateQueries("attendances");
                          }}
                          block
                        >
                          CANCEL
                        </Button>
                        <Button
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
                            title: "Attendance Date",
                            description:
                              attendDate === ""
                                ? " "
                                : moment(attendDate).format(displayDateFormat),
                            status: attendDate === "" ? "error" : "finish",
                          },
                          {
                            title: "Check In Time",
                            description:
                              attendCheckin === ""
                                ? " "
                                : moment(attendCheckin).format(
                                    displayDateFormat + " HH:mm:ss"
                                  ),
                            status: attendCheckin === "" ? "error" : "finish",
                          },
                          {
                            title: "Check Out Time",
                            description:
                              attendCheckout === ""
                                ? " "
                                : moment(attendCheckout).format(
                                    displayDateFormat + " HH:mm:ss"
                                  ),
                            status: attendCheckout === "" ? "error" : "finish",
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
      )}
    </>
  );
};

export default AddUpdateAttendance;
