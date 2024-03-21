import React, { useState } from "react";
import axios from "axios";
import { Typography, Button, Form, Card, Col, Row, Input, Select } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import ResultEvent from "./ResultEvent";

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const AddUpdateSchedule = ({
  shifts,
  update,
  id,
  name,
  sun,
  mon,
  tue,
  wed,
  thu,
  fri,
  sat,
  onCloseDrawer,
  theme,
}) => {
  const [updateData, setUpdateData] = useState(update);
  const [label, setLabel] = useState(
    updateData ? "Update Schedule" : "Add New Schedule"
  );
  const [color, setColor] = useState("#318ce7");
  const schedID = updateData ? id : "";
  const [schedName, setSchedName] = useState(updateData ? name : "");
  const [schedSun, setSchedSun] = useState(updateData ? sun : "");
  const [schedMon, setSchedMon] = useState(updateData ? mon : "");
  const [schedTue, setSchedTue] = useState(updateData ? tue : "");
  const [schedWed, setSchedWed] = useState(updateData ? wed : "");
  const [schedThu, setSchedThu] = useState(updateData ? thu : "");
  const [schedFri, setSchedFri] = useState(updateData ? fri : "");
  const [schedSat, setSchedSat] = useState(updateData ? sat : "");
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

  const newSchedule = () => {
    setUpdateData(false);
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
  };

  const changeLabel = () => {
    setLabel(updateData ? "Update Schedule" : "Add New Schedule");
    setColor("#318ce7");
  };

  const onNameChange = (value) => {
    setSchedName(value);
    setNameReq(true);
    changeLabel();
  };

  const onSunChange = (value) => {
    setSchedSun(value);
    setSunReq(true);
    changeLabel();
  };

  const onMonChange = (value) => {
    setSchedMon(value);
    setMonReq(true);
    changeLabel();
  };

  const onTueChange = (value) => {
    setSchedTue(value);
    setTueReq(true);
    changeLabel();
  };

  const onWedChange = (value) => {
    setSchedWed(value);
    setWedReq(true);
    changeLabel();
  };

  const onThuChange = (value) => {
    setSchedThu(value);
    setThuReq(true);
    changeLabel();
  };

  const onFriChange = (value) => {
    setSchedFri(value);
    setFriReq(true);
    changeLabel();
  };

  const onSatChange = (value) => {
    setSchedSat(value);
    setSatReq(true);
    changeLabel();
  };

  const onFinish = () => {
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
    const token = sessionStorage.getItem("token");
    axios({
      method: updateData ? "PATCH" : "POST",
      url: `${process.env.REACT_APP_API_URL}/api/schedule`,
      data: scheduleData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
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
  };

  if (submit) {
    if (success) {
      return (
        <>
          <ResultEvent
            icon={<CheckOutlined />}
            status="success"
            title={
              updateData
                ? "Successfully updated schedule."
                : "Successfully added new schedule."
            }
            subTitle={schedName}
            extra={
              <Row className="space-between-row">
                <Col span={12} style={{ paddingRight: "10px" }}>
                  <Button
                    size="large"
                    type="default"
                    onClick={onCloseDrawer}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => newSchedule()}
                    block
                  >
                    NEW SCHEDULE
                  </Button>
                </Col>
              </Row>
            }
            theme={theme}
          />
        </>
      );
    }
  }

  return (
    <>
      <div className="justified-row" style={{ paddingTop: "12px" }}>
        <div className="card-custom-size-60">
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
            >
              <Form.Item
                name={["name"]}
                label="Schedule Name"
                initialValue={schedName}
                rules={[
                  {
                    required: updateData ? nameReq : true,
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
                        required: updateData ? sunReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
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
                      options={
                        shifts
                          ? shifts.map((shift) => {
                              return {
                                value: shift.shift_description,
                                label: shift.shift_description,
                              };
                            })
                          : ""
                      }
                      onChange={onSunChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["tuesday"]}
                    label="Tuesday"
                    initialValue={schedTue}
                    rules={[
                      {
                        required: updateData ? tueReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
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
                      options={
                        shifts
                          ? shifts.map((shift) => {
                              return {
                                value: shift.shift_description,
                                label: shift.shift_description,
                              };
                            })
                          : ""
                      }
                      onChange={onTueChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["thursday"]}
                    label="Thursday"
                    initialValue={schedThu}
                    rules={[
                      {
                        required: updateData ? thuReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
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
                      options={
                        shifts
                          ? shifts.map((shift) => {
                              return {
                                value: shift.shift_description,
                                label: shift.shift_description,
                              };
                            })
                          : ""
                      }
                      onChange={onThuChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["saturday"]}
                    label="Saturday"
                    initialValue={schedSat}
                    rules={[
                      {
                        required: updateData ? satReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
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
                      options={
                        shifts
                          ? shifts.map((shift) => {
                              return {
                                value: shift.shift_description,
                                label: shift.shift_description,
                              };
                            })
                          : ""
                      }
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
                        required: updateData ? monReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
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
                      options={
                        shifts
                          ? shifts.map((shift) => {
                              return {
                                value: shift.shift_description,
                                label: shift.shift_description,
                              };
                            })
                          : ""
                      }
                      onChange={onMonChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["wednesday"]}
                    label="Wednesday"
                    initialValue={schedWed}
                    rules={[
                      {
                        required: updateData ? wedReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
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
                      options={
                        shifts
                          ? shifts.map((shift) => {
                              return {
                                value: shift.shift_description,
                                label: shift.shift_description,
                              };
                            })
                          : ""
                      }
                      onChange={onWedChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["friday"]}
                    label="Friday"
                    initialValue={schedFri}
                    rules={[
                      {
                        required: updateData ? friReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
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
                      options={
                        shifts
                          ? shifts.map((shift) => {
                              return {
                                value: shift.shift_description,
                                label: shift.shift_description,
                              };
                            })
                          : ""
                      }
                      onChange={onFriChange}
                    />
                  </Form.Item>
                </Col>
              </div>
              <div className="space-between-row" style={{ paddingTop: "30px" }}>
                <Button
                  size="large"
                  type="default"
                  style={{
                    marginRight: "10px",
                  }}
                  onClick={onCloseDrawer}
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

export default AddUpdateSchedule;
