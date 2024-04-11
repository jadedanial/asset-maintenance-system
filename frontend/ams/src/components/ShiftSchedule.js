import React, { useState } from "react";
import { useCustomQueryClient } from "../useQueryClient";
import { useMutation } from "react-query";
import axios from "axios";
import { Card, Select, Button, List, Badge, Form, Row, Col } from "antd";
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

const ShiftSchedule = ({ schedules, employees, empid, theme }) => {
  const queryClient = useCustomQueryClient();
  const timeFormat = "HH:mm:ss";
  const schedId = employees.find((res) => res.emp_id === empid)?.emp_sched;
  const schedName = schedules.find((res) => res.id === schedId)?.sched_name;
  const [schedid, setSchedId] = useState(schedId);
  const [schedname, setSchedName] = useState(schedName);
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
              grid={{ gutter: 24, column: 4 }}
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
                  <Card
                    className="card-with-background"
                    style={{ padding: "24px" }}
                  >
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
    setSubmit(true);
    setLoading(true);
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
        setLoading(false);
        setSuccess(true);
      })
      .catch(() => {
        setLoading(false);
        setSuccess(false);
      });
  };

  const { mutate } = useMutation(createShiftSchedule);

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
                ? "Successfully applied schedule."
                : "Failed to apply schedule."
            }
            subTitle={success ? "Schedule name " + schedName : "System error."}
            extra={
              <Row style={{ width: "100px" }}>
                <Col span={24}>
                  <Button
                    type="default"
                    onClick={() => {
                      setSubmit(false);
                      queryClient.invalidateQueries("attendances");
                    }}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
              </Row>
            }
            height="50vh"
            theme={theme}
          />
        )
      ) : (
        <div style={{ marginTop: "24px" }}>
          <Card className="card-no-padding">
            <div className="justified-row">
              <div className="card-custom-size-full">
                <Form
                  {...layout}
                  layout="vertical"
                  name="add-new-shiftschedule"
                  onFinish={onFinish}
                >
                  <Card className="card-no-padding">
                    <Row
                      className="card-with-background"
                      style={{ padding: "24px" }}
                    >
                      <Col span={22} style={{ paddingRight: "24px" }}>
                        <Select
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
                              .localeCompare(
                                (optionB?.label ?? "").toLowerCase()
                              )
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
                      </Col>
                      <Col span={2}>
                        <Button type="primary" htmlType="submit" block>
                          SAVE
                        </Button>
                      </Col>
                    </Row>
                    <div>{scheduleSwitch(schedid)}</div>
                  </Card>
                </Form>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default ShiftSchedule;
