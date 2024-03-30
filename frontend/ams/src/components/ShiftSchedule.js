import React, { useState } from "react";
import { useCustomQueryClient } from "../useQueryClient";
import { useMutation } from "react-query";
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

const ShiftSchedule = ({ schedules, employees, empid }) => {
  const queryClient = useCustomQueryClient();
  const timeFormat = "HH:mm:ss";
  const schedId = employees.find((res) => res.emp_id === empid)?.emp_sched;
  const schedName = schedules.find((res) => res.id === schedId)?.sched_name;
  const [schedid, setSchedId] = useState(schedId);
  const [schedname, setSchedName] = useState(schedName);
  const [api, contextHolder] = notification.useNotification();

  const onChange = (value, label) => {
    setSchedId(value);
    setSchedName(label);
  };

  const scheduleSwitch = (id) => {
    return schedules.map((schedule) =>
      schedule.id === id ? (
        <>
          <div style={{ paddingTop: "24px", flexWrap: "wrap" }}>
            <List
              grid={{ gutter: 20, column: 3 }}
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
                      <Badge color="blue" text="Day Off" />
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
                      <Badge color="blue" text="Day Off" />
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
                      <Badge color="blue" text="Day Off" />
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
                      <Badge color="blue" text="Day Off" />
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
                      <Badge color="blue" text="Day Off" />
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
                      <Badge color="blue" text="Day Off" />
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
                      <Badge color="blue" text="Day Off" />
                    ) : (
                      schedule.sched_sat
                    ),
                },
              ]}
              renderItem={(item) => (
                <List.Item style={{ marginBottom: "0" }}>
                  <Card size="small" className="card-with-background">
                    <p className="small-card-title">{item.title}</p>
                    <p className="small-font text">{item.description}</p>
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
  };

  const createShiftSchedule = () => {
    var empData = {
      empid: empid,
      schedid: schedid,
    };
    const token = sessionStorage.getItem("token");
    axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_API_URL}/api/emp_schedule`,
      data: empData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then(() => {
        queryClient.invalidateQueries("employees");
        api.info(NotificationEvent(true, "Employee shift schedule updated."));
      })
      .catch((err) => {
        console.log(err);
        api.info(
          NotificationEvent(false, "Employee shift schedule failed to apply.")
        );
      });
  };

  const { mutate } = useMutation(createShiftSchedule);

  const onFinish = () => {
    mutate();
  };

  return (
    <>
      {contextHolder}
      <div style={{ marginTop: "24px" }}>
        <Card size="small" style={{ width: "100%", minHeight: "460px" }}>
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
                >
                  <div>
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
                    style={{ paddingTop: "24px" }}
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
