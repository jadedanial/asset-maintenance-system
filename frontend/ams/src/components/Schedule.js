import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Select,
  Row,
  Button,
  Typography,
  List,
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
              grid={{ gutter: 16, column: 3 }}
              dataSource={[
                {
                  title: "SUN",
                  description: schedule.sched_sun,
                },
                {
                  title: "MON",
                  description: schedule.sched_mon,
                },
                {
                  title: "TUE",
                  description: schedule.sched_tue,
                },
                {
                  title: "WED",
                  description: schedule.sched_wed,
                },
                {
                  title: "THU",
                  description: schedule.sched_thu,
                },
                {
                  title: "FRI",
                  description: schedule.sched_fri,
                },
                {
                  title: "SAT",
                  description: schedule.sched_sat,
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Card size="small" className="ant-card-custom-hover">
                    <p className="medium-card-title">{item.title}</p>
                    <p className="small-font">{item.description}</p>
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
          <Row className="justified-row">
            <div className="card-custom-size">
              <Card
                size="large"
                extra={
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => handleSubmit("topRight")}
                  >
                    APPLY
                  </Button>
                }
                title={
                  <Title>
                    <p className="big-card-title">Shift Schedule</p>
                  </Title>
                }
                hoverable
              >
                <Row style={{ marginBottom: "10px" }}>
                  <Select
                    size="large"
                    showSearch
                    className="small-font"
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
                    options={schedules.map((schedule) => {
                      return {
                        value: schedule.id,
                        label: schedule.sched_name,
                      };
                    })}
                    onChange={onChange}
                  />
                </Row>
                <Row>{scheduleSwitch(schedid)}</Row>
              </Card>
            </div>
          </Row>
        </Card>
      </Row>
    </>
  );
};

export default Schedule;
