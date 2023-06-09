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
import { CheckSquareOutlined } from "@ant-design/icons";

const { Title } = Typography;

const cardlayout = {
  bordered: true,
  hoverable: true,
  size: "large",
  style: { width: "100%", minHeight: "calc(100vh - 106px)" },
};

const Schedule = (props) => {
  const empID = props.empid;
  const [schedules, setSchedules] = useState([]);
  const [schedid, setSchedId] = useState(0);
  const [schedname, setSchedName] = useState("");
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    try {
      axios.get("http://localhost:8000/api/employees").then((response) => {
        response.data.map((res) =>
          res.emp_id === props.empid ? setSchedId(res.emp_sched) : {}
        );
      });
    } catch (err) {
      console.log(err.response.data[0]);
    }
  }, [props.empid]);

  useEffect(() => {
    try {
      axios.get("http://localhost:8000/api/schedule").then((response) => {
        setSchedules(response.data);
        response.data.map((res) =>
          res.id === schedid ? setSchedName(res.sched_name) : {}
        );
      });
    } catch (err) {
      console.log(err.response.data[0]);
    }
  }, [schedid]);

  async function handleSubmit(placement) {
    var empData = {
      empID: empID,
      schedid: schedid,
    };
    try {
      await axios({
        method: "PATCH",
        url: "http://localhost:8000/api/emp_schedule/",
        data: empData,
      });
      api.success({
        message: <p className="medium-card-title">Notification</p>,
        description: (
          <p className="small-font">Schedule successfully changed.</p>
        ),
        placement,
        duration: 2,
        icon: <CheckSquareOutlined style={{ color: "#318ce7" }} />,
      });
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
                    title={
                      <Title>
                        <p className="medium-card-title">{item.title}</p>
                      </Title>
                    }
                    {...cardlayout}
                    style={{ margin: "10px" }}
                    className="ant-card-custom-hover"
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
