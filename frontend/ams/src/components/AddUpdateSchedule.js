import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Button, Form, Card, Col, Input, Select } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import ResultEvent from "../components/ResultEvent";

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const AddUpdateSchedule = (props) => {
  const [shifts, setShifts] = useState([]);
  const [update, setUpdate] = useState(props.update);
  const [label, setLabel] = useState(
    update ? "Update Schedule" : "Add New Schedule"
  );
  const [color, setColor] = useState("#318ce7");
  const schedID = update ? props.id : "";
  const [schedName, setSchedName] = useState(update ? props.name : "");
  const [schedSun, setSchedSun] = useState(update ? props.sun : "");
  const [schedMon, setSchedMon] = useState(update ? props.mon : "");
  const [schedTue, setSchedTue] = useState(update ? props.tue : "");
  const [schedWed, setSchedWed] = useState(update ? props.wed : "");
  const [schedThu, setSchedThu] = useState(update ? props.thu : "");
  const [schedFri, setSchedFri] = useState(update ? props.fri : "");
  const [schedSat, setSchedSat] = useState(update ? props.sat : "");
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nameReq, setNameReq] = useState(false);
  const [sunReq, setSunReq] = useState(false);
  const [monReq, setMonReq] = useState(false);
  const [tueReq, setTueReq] = useState(false);
  const [wedReq, setWedReq] = useState(false);
  const [thuReq, setThuReq] = useState(false);
  const [friReq, setFriReq] = useState(false);
  const [satReq, setSatReq] = useState(false);

  function newSchedule() {
    setUpdate(false);
    setSubmit(false);
    setLabel("Add New Schedule");
    setColor("#318ce7");
    setSchedName("");
    setSchedSun("");
    setSchedMon("");
    setSchedTue("");
    setSchedWed("");
    setSchedThu("");
    setSchedFri("");
    setSchedSat("");
    setSunReq(true);
    setMonReq(true);
    setTueReq(true);
    setWedReq(true);
    setThuReq(true);
    setFriReq(true);
    setSatReq(true);
  }

  function changeLabel() {
    setLabel(update ? "Update Schedule" : "Add New Schedule");
    setColor("#318ce7");
  }

  function onNameChange(value) {
    setSchedName(value);
    setNameReq(true);
    changeLabel();
  }

  function onSunChange(value) {
    setSchedSun(value);
    setSunReq(true);
    changeLabel();
  }

  function onMonChange(value) {
    setSchedMon(value);
    setMonReq(true);
    changeLabel();
  }

  function onTueChange(value) {
    setSchedTue(value);
    setTueReq(true);
    changeLabel();
  }

  function onWedChange(value) {
    setSchedWed(value);
    setWedReq(true);
    changeLabel();
  }

  function onThuChange(value) {
    setSchedThu(value);
    setThuReq(true);
    changeLabel();
  }

  function onFriChange(value) {
    setSchedFri(value);
    setFriReq(true);
    changeLabel();
  }

  function onSatChange(value) {
    setSchedSat(value);
    setSatReq(true);
    changeLabel();
  }

  function onFinish() {
    setSubmit(true);
    changeLabel();
    var scheduleData = {
      id: schedID,
      sched_name: schedName,
      sched_sun: schedSun,
      sched_mon: schedMon,
      sched_tue: schedTue,
      sched_wed: schedWed,
      sched_thu: schedThu,
      sched_fri: schedFri,
      sched_sat: schedSat,
    };
    axios({
      method: update ? "PATCH" : "POST",
      url: "http://localhost:8000/api/schedule/",
      data: scheduleData,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err.response.data[0]);
        setSuccess(false);
        setLabel(err.response.data[0]);
        setColor("#ff0000");
      });
  }

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:8000/api/shifts",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        setShifts(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (submit) {
    if (success) {
      return (
        <>
          <ResultEvent
            icon={<CheckCircleOutlined style={{ color: "#318ce7" }} />}
            status="success"
            title={
              update
                ? "Successfully updated Schedule."
                : "Successfully added new Schedule."
            }
            subTitle={schedName}
            extra={
              <Button size="large" type="primary" onClick={() => newSchedule()}>
                ADD NEW SCHEDULE
              </Button>
            }
          />
        </>
      );
    }
  }

  return (
    <>
      <div className="justified-row">
        <div className="card-custom-size">
          <Form
            {...layout}
            layout="vertical"
            size="large"
            name="add-new-schedule"
            onFinish={onFinish}
          >
            <Card
              size="large"
              title={
                <Title>
                  <p
                    className="big-card-title"
                    style={{ textWrap: "wrap", color: color }}
                  >
                    {label}
                  </p>
                </Title>
              }
              hoverable
            >
              <Form.Item
                name={["name"]}
                label="Schedule Name"
                initialValue={schedName}
                rules={[
                  {
                    required: update ? nameReq : true,
                    message: "Required!",
                  },
                ]}
              >
                <Input
                  value={schedName}
                  maxLength={300}
                  onChange={(e) => onNameChange(e.target.value)}
                />
              </Form.Item>
              <div className="space-between-row">
                <Col span={12}>
                  <Form.Item
                    name={["sunday"]}
                    label="Sunday"
                    initialValue={schedSun}
                    rules={[
                      {
                        required: update ? sunReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      className="small-font"
                      style={{ width: "100%" }}
                      value={schedSun}
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={shifts.map((shift) => {
                        return {
                          value: shift.shift_description,
                          label: shift.shift_description,
                        };
                      })}
                      onChange={onSunChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["tuesday"]}
                    label="Tuesday"
                    initialValue={schedTue}
                    rules={[
                      {
                        required: update ? tueReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      className="small-font"
                      style={{ width: "100%" }}
                      value={schedTue}
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={shifts.map((shift) => {
                        return {
                          value: shift.shift_description,
                          label: shift.shift_description,
                        };
                      })}
                      onChange={onTueChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["thursday"]}
                    label="Thursday"
                    initialValue={schedThu}
                    rules={[
                      {
                        required: update ? thuReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      className="small-font"
                      style={{ width: "100%" }}
                      value={schedThu}
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={shifts.map((shift) => {
                        return {
                          value: shift.shift_description,
                          label: shift.shift_description,
                        };
                      })}
                      onChange={onThuChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["saturday"]}
                    label="Saturday"
                    initialValue={schedSat}
                    rules={[
                      {
                        required: update ? satReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      className="small-font"
                      style={{ width: "100%" }}
                      value={schedSat}
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={shifts.map((shift) => {
                        return {
                          value: shift.shift_description,
                          label: shift.shift_description,
                        };
                      })}
                      onChange={onSatChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    name={["monday"]}
                    label="Monday"
                    initialValue={schedMon}
                    rules={[
                      {
                        required: update ? monReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      className="small-font"
                      style={{ width: "100%" }}
                      value={schedMon}
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={shifts.map((shift) => {
                        return {
                          value: shift.shift_description,
                          label: shift.shift_description,
                        };
                      })}
                      onChange={onMonChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["wednesday"]}
                    label="Wednesday"
                    initialValue={schedWed}
                    rules={[
                      {
                        required: update ? wedReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      className="small-font"
                      style={{ width: "100%" }}
                      value={schedWed}
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={shifts.map((shift) => {
                        return {
                          value: shift.shift_description,
                          label: shift.shift_description,
                        };
                      })}
                      onChange={onWedChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["friday"]}
                    label="Friday"
                    initialValue={schedFri}
                    rules={[
                      {
                        required: update ? friReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      className="small-font"
                      style={{ width: "100%" }}
                      value={schedFri}
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={shifts.map((shift) => {
                        return {
                          value: shift.shift_description,
                          label: shift.shift_description,
                        };
                      })}
                      onChange={onFriChange}
                    />
                  </Form.Item>
                </Col>
              </div>
              <div style={{ paddingTop: "30px" }}>
                <Button
                  size="large"
                  type="primary"
                  style={{
                    width: "100%",
                  }}
                  htmlType="submit"
                >
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

export default AddUpdateSchedule;
