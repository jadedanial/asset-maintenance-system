import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Select, Button, Typography, List, notification } from "antd";
import NotificationEvent from "./NotificationEvent";

const { Title } = Typography;

const Schedule = (props) => {
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
      empID: props.empid,
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
          <div style={{ paddingTop: "20px", flexWrap: "wrap" }}>
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={[
                {
                  title: "SUNDAY",
                  description: schedule.sched_sun,
                },
                {
                  title: "MONDAY",
                  description: schedule.sched_mon,
                },
                {
                  title: "TUESDAY",
                  description: schedule.sched_tue,
                },
                {
                  title: "WEDNESDAY",
                  description: schedule.sched_wed,
                },
                {
                  title: "THURSDAY",
                  description: schedule.sched_thu,
                },
                {
                  title: "FRIDAY",
                  description: schedule.sched_fri,
                },
                {
                  title: "SATURDAY",
                  description: schedule.sched_sat,
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Card size="small" className="ant-card-custom-hover">
                    <p className="small-card-title">{item.title}</p>
                    <p className="small-font">{item.description}</p>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </>
      ) : (
        <></>
      )
    );
  }

  return (
    <>
      {contextHolder}
      <div style={{ marginTop: "20px" }}>
        <Card size="small" style={{ width: "100%" }}>
          <div className="justified-row">
            <div className="card-custom-size">
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
                </div>
                <div>{scheduleSwitch(schedid)}</div>
                <div
                  className="space-between-row"
                  style={{ paddingTop: "30px" }}
                >
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => handleSubmit("topRight")}
                    block
                  >
                    APPLY
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Schedule;
