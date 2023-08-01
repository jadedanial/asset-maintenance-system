import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Select,
  Col,
  Row,
  Button,
  Typography,
  List,
  Tag,
  notification,
} from "antd";
import NotificationEvent from "./NotificationEvent";

const { Title } = Typography;

const Schedule = (props) => {
  const empID = props.empid;
  const [schedules, setSchedules] = useState([]);
  const [schedid, setSchedId] = useState(0);
  const [schedname, setSchedName] = useState("");
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    (async () => {
      try {
        await axios
          .get("http://localhost:8000/api/employees", {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          })
          .then((response) => {
            response.data.map((res) =>
              res.emp_id === props.empid ? setSchedId(res.emp_sched) : {}
            );
          });
      } catch (err) {
        console.log(err.response.data[0]);
      }
    })();
  }, [props.empid]);

  useEffect(() => {
    (async () => {
      try {
        await axios
          .get("http://localhost:8000/api/schedule", {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          })
          .then((response) => {
            setSchedules(response.data);
            response.data.map((res) =>
              res.id === schedid ? setSchedName(res.sched_name) : {}
            );
          });
      } catch (err) {
        console.log(err.response.data[0]);
      }
    })();
  }, [schedid]);

  async function handleSubmit() {
    var empData = {
      empID: empID,
      schedid: schedid,
    };
    try {
      await axios({
        method: "PATCH",
        url: "http://localhost:8000/api/emp_schedule/",
        data: empData,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      api.info(NotificationEvent(true, "Employee shift schedule updated."));
    } catch (err) {
      console.log(err.response.data[0]);
    }
  }

  function onChange(value) {
    setSchedId(value);
  }

  function scheduleSwitch(id) {
    return schedules.map((schedule) =>
      schedule.id === id ? (
        <>
          <Row style={{ paddingTop: "20px", flexWrap: "wrap" }}>
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={[
                {
                  title: "Sunday",
                  description: schedule.sched_sun,
                },
                {
                  title: "Monday",
                  description: schedule.sched_mon,
                },
                {
                  title: "Tuesday",
                  description: schedule.sched_tue,
                },
                {
                  title: "Wednesday",
                  description: schedule.sched_wed,
                },
                {
                  title: "Thursday",
                  description: schedule.sched_thu,
                },
                {
                  title: "Friday",
                  description: schedule.sched_fri,
                },
                {
                  title: "Saturday",
                  description: schedule.sched_sat,
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    size="small"
                    title={
                      <Title>
                        <p className="medium-card-title">{item.title}</p>
                      </Title>
                    }
                    style={{ margin: "10px" }}
                    className="ant-card-custom-hover"
                    bordered
                    hoverable
                  >
                    <Tag color="blue" style={{ width: "100%" }}>
                      <p className="small-font" style={{ padding: "10px" }}>
                        {item.description}
                      </p>
                    </Tag>
                  </Card>
                </List.Item>
              )}
            />
          </Row>
        </>
      ) : (
        <></>
      )
    );
  }

  return (
    <>
      {contextHolder}
      <Row style={{ marginTop: "20px" }}>
        <Card size="small" style={{ width: "100%" }}>
          <Row>
            <Col span={4} style={{ margin: "10px 3px 10px 17px" }}>
              <Button
                size="large"
                type="primary"
                onClick={() => handleSubmit("topRight")}
                block
              >
                APPLY SCHEDULE
              </Button>
            </Col>
            <Col
              span={19}
              style={{ margin: "10px 10px 10px 2px", marginLeft: "3px" }}
            >
              <Select
                size="large"
                showSearch
                className="small-font"
                placeholder="Search Schedule"
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                value={schedname}
                options={schedules.map((schedule) => {
                  return { value: schedule.id, label: schedule.sched_name };
                })}
                onChange={onChange}
              />
            </Col>
          </Row>
        </Card>
      </Row>
      <Row style={{ marginTop: "20px" }}>{scheduleSwitch(schedid)}</Row>
    </>
  );
};

export default Schedule;
