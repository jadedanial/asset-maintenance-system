import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Select,
  Button,
  Typography,
  List,
  Badge,
  Form,
  notification,
} from "antd";
import NotificationEvent from "./NotificationEvent";
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

const ShiftSchedule = (props) => {
  const timeFormat = "HH:mm:ss";
  const [schedules, setSchedules] = useState([]);
  const [schedid, setSchedId] = useState(0);
  const [schedname, setSchedName] = useState("");
  const [api, contextHolder] = notification.useNotification();

  function onFinish() {
    var empData = {
      empID: props.empid,
      schedid: schedid,
    };
    axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_API_URL}/api/emp_schedule`,
      data: empData,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then(() => {
        api.info(NotificationEvent(true, "Employee shift schedule updated."));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onChange(value) {
    setSchedId(value);
  }

  function scheduleSwitch(id) {
    return schedules.map((schedule) =>
      schedule.id === id ? (
        <>
          <div style={{ paddingTop: "20px", flexWrap: "wrap" }}>
            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={[
                {
                  title: "SUNDAY",
                  description:
                    moment
                      .duration(
                        moment(
                          schedule.sched_sun.split(" - ")[1],
                          timeFormat
                        ).diff(
                          moment(schedule.sched_sun.split(" - ")[0], timeFormat)
                        )
                      )
                      .asHours() === 0 ? (
                      <Badge
                        color="blue"
                        text="Day Off"
                        style={{ color: "#318ce7" }}
                      />
                    ) : (
                      schedule.sched_sun
                    ),
                },
                {
                  title: "MONDAY",
                  description:
                    moment
                      .duration(
                        moment(
                          schedule.sched_mon.split(" - ")[1],
                          timeFormat
                        ).diff(
                          moment(schedule.sched_mon.split(" - ")[0], timeFormat)
                        )
                      )
                      .asHours() === 0 ? (
                      <Badge
                        color="blue"
                        text="Day Off"
                        style={{ color: "#318ce7" }}
                      />
                    ) : (
                      schedule.sched_mon
                    ),
                },
                {
                  title: "TUESDAY",
                  description:
                    moment
                      .duration(
                        moment(
                          schedule.sched_tue.split(" - ")[1],
                          timeFormat
                        ).diff(
                          moment(schedule.sched_tue.split(" - ")[0], timeFormat)
                        )
                      )
                      .asHours() === 0 ? (
                      <Badge
                        color="blue"
                        text="Day Off"
                        style={{ color: "#318ce7" }}
                      />
                    ) : (
                      schedule.sched_tue
                    ),
                },
                {
                  title: "WEDNESDAY",
                  description:
                    moment
                      .duration(
                        moment(
                          schedule.sched_wed.split(" - ")[1],
                          timeFormat
                        ).diff(
                          moment(schedule.sched_wed.split(" - ")[0], timeFormat)
                        )
                      )
                      .asHours() === 0 ? (
                      <Badge
                        color="blue"
                        text="Day Off"
                        style={{ color: "#318ce7" }}
                      />
                    ) : (
                      schedule.sched_wed
                    ),
                },
                {
                  title: "THURSDAY",
                  description:
                    moment
                      .duration(
                        moment(
                          schedule.sched_thu.split(" - ")[1],
                          timeFormat
                        ).diff(
                          moment(schedule.sched_thu.split(" - ")[0], timeFormat)
                        )
                      )
                      .asHours() === 0 ? (
                      <Badge
                        color="blue"
                        text="Day Off"
                        style={{ color: "#318ce7" }}
                      />
                    ) : (
                      schedule.sched_thu
                    ),
                },
                {
                  title: "FRIDAY",
                  description:
                    moment
                      .duration(
                        moment(
                          schedule.sched_fri.split(" - ")[1],
                          timeFormat
                        ).diff(
                          moment(schedule.sched_fri.split(" - ")[0], timeFormat)
                        )
                      )
                      .asHours() === 0 ? (
                      <Badge
                        color="blue"
                        text="Day Off"
                        style={{ color: "#318ce7" }}
                      />
                    ) : (
                      schedule.sched_fri
                    ),
                },
                {
                  title: "SATURDAY",
                  description:
                    moment
                      .duration(
                        moment(
                          schedule.sched_sat.split(" - ")[1],
                          timeFormat
                        ).diff(
                          moment(schedule.sched_sat.split(" - ")[0], timeFormat)
                        )
                      )
                      .asHours() === 0 ? (
                      <Badge
                        color="blue"
                        text="Day Off"
                        style={{ color: "#318ce7" }}
                      />
                    ) : (
                      schedule.sched_sat
                    ),
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Card size="small">
                    <p className="small-card-title">{item.title}</p>
                    <p className="small-font">{item.description}</p>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </>
      ) : (
        ""
      )
    );
  }

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/employees`,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        response.data.map((res) =>
          res.emp_id === props.empid ? setSchedId(res.emp_sched) : ""
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.empid]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/schedules`,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        setSchedules(response.data);
        response.data.map((res) =>
          res.id === schedid ? setSchedName(res.sched_name) : ""
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [schedid]);

  return (
    <>
      {contextHolder}
      <div style={{ marginTop: "20px" }}>
        <Card size="small" style={{ width: "100%" }}>
          <div className="justified-row">
            <div className="card-custom-size-60">
              <Form
                {...layout}
                layout="vertical"
                size="large"
                name="add-new-shiftschedule"
                onFinish={onFinish}
              >
                <Card
                  size="large"
                  title={
                    <Title>
                      <p className="big-card-title">Shift Schedule</p>
                    </Title>
                  }
                  hoverable
                >
                  <div style={{ marginBottom: "10px" }}>
                    <Select
                      size="large"
                      showSearch
                      placeholder="Search Schedule"
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      value={schedname}
                      options={schedules.map((sched) => {
                        return {
                          value: sched.id,
                          label: sched.sched_name,
                        };
                      })}
                      onChange={onChange}
                    />
                  </div>
                  <div>{scheduleSwitch(schedid)}</div>
                  <div
                    className="space-between-row"
                    style={{ paddingTop: "30px" }}
                  >
                    <Button size="large" type="primary" htmlType="submit" block>
                      SAVE
                    </Button>
                  </div>
                </Card>
              </Form>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ShiftSchedule;
