import React, { useState } from "react";
import { useCustomQueryClient } from "../useQueryClient";
import { useMutation } from "react-query";
import axios from "axios";
import {
  Typography,
  Button,
  Form,
  Card,
  Col,
  Row,
  Input,
  Select,
  Steps,
} from "antd";
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
  const queryClient = useCustomQueryClient();
  const [updateData, setUpdateData] = useState(update);
  const [step, setStep] = useState(updateData ? 8 : 0);
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
    setStep(1);
    changeLabel();
  };

  const onSunChange = (value) => {
    setSchedSun(value);
    setSunReq(true);
    setStep(2);
    changeLabel();
  };

  const onMonChange = (value) => {
    setSchedMon(value);
    setMonReq(true);
    setStep(3);
    changeLabel();
  };

  const onTueChange = (value) => {
    setSchedTue(value);
    setTueReq(true);
    setStep(4);
    changeLabel();
  };

  const onWedChange = (value) => {
    setSchedWed(value);
    setWedReq(true);
    setStep(5);
    changeLabel();
  };

  const onThuChange = (value) => {
    setSchedThu(value);
    setThuReq(true);
    setStep(6);
    changeLabel();
  };

  const onFriChange = (value) => {
    setSchedFri(value);
    setFriReq(true);
    setStep(7);
    changeLabel();
  };

  const onSatChange = (value) => {
    setSchedSat(value);
    setSatReq(true);
    setStep(8);
    changeLabel();
  };

  const createSchedule = () => {
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
        setSubmit(false);
        setSuccess(false);
        setLabel(err.response.data[0]);
        setColor("#ff0000");
      });
  };

  const { mutate } = useMutation(createSchedule);

  const onFinish = () => {
    mutate();
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
                    onClick={() => {
                      queryClient.invalidateQueries("schedules");
                      onCloseDrawer();
                    }}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => {
                      newSchedule();
                    }}
                    block
                  >
                    NEW SCHEDULE
                  </Button>
                </Col>
              </Row>
            }
            height="70%"
            theme={theme}
          />
        </>
      );
    }
  }

  return (
    <>
      <div className="justified-row" style={{ paddingTop: "12px" }}>
        <div className="card-custom-size-full">
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
              <Row>
                <Col span={16} style={{ paddingRight: "24px" }}>
                  <div
                    className=" card-with-background"
                    style={{ padding: "24px" }}
                  >
                    <Form.Item
                      name={["name"]}
                      label="Schedule Name"
                      initialValue={schedName}
                      rules={[
                        {
                          required: updateData ? nameReq : true,
                          message: "Schedule name required",
                        },
                      ]}
                    >
                      <Input
                        value={schedName}
                        maxLength={300}
                        onChange={(e) => onNameChange(e.target.value)}
                      />
                    </Form.Item>
                    <Row>
                      <Col
                        span={12}
                        style={{
                          paddingRight: "24px",
                        }}
                      >
                        <Form.Item
                          name={["sunday"]}
                          label="Sunday"
                          initialValue={schedSun}
                          rules={[
                            {
                              required: updateData ? sunReq : true,
                              message: "Shift required",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            value={schedSun}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
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
                              message: "Shift required",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            value={schedTue}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
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
                              message: "Shift required",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            value={schedThu}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
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
                              message: "Shift required",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            value={schedSat}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
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
                      <Col span={12}>
                        <Form.Item
                          name={["monday"]}
                          label="Monday"
                          initialValue={schedMon}
                          rules={[
                            {
                              required: updateData ? monReq : true,
                              message: "Shift required",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            value={schedMon}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
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
                              message: "Shift required",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            value={schedWed}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
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
                              message: "Shift required",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            value={schedFri}
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
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
                    </Row>
                    <div
                      className="space-between-row"
                      style={{ paddingTop: "24px" }}
                    >
                      <Button
                        size="large"
                        type="default"
                        style={{
                          marginRight: "10px",
                        }}
                        onClick={() => {
                          queryClient.invalidateQueries("schedules");
                          onCloseDrawer();
                        }}
                        block
                      >
                        CANCEL
                      </Button>
                      <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        block
                      >
                        SAVE
                      </Button>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <div
                      className="card-with-background"
                      style={{ padding: "24px" }}
                    >
                      <Steps
                        current={step}
                        direction="vertical"
                        items={[
                          {
                            title: "Schedule Name",
                            description: schedName === "" ? " " : schedName,
                            status: schedName === "" ? "error" : "finish",
                          },
                          {
                            title: "Sunday",
                            description: schedSun === "" ? " " : schedSun,
                            status: schedSun === "" ? "error" : "finish",
                          },
                          {
                            title: "Monday",
                            description: schedMon === "" ? " " : schedMon,
                            status: schedMon === "" ? "error" : "finish",
                          },
                          {
                            title: "Tuesday",
                            description: schedTue === "" ? " " : schedTue,
                            status: schedTue === "" ? "error" : "finish",
                          },
                          {
                            title: "Wednesday",
                            description: schedWed === "" ? " " : schedWed,
                            status: schedWed === "" ? "error" : "finish",
                          },
                          {
                            title: "Thursday",
                            description: schedThu === "" ? " " : schedThu,
                            status: schedThu === "" ? "error" : "finish",
                          },
                          {
                            title: "Friday",
                            description: schedFri === "" ? " " : schedFri,
                            status: schedFri === "" ? "error" : "finish",
                          },
                          {
                            title: "Saturday",
                            description: schedSat === "" ? " " : schedSat,
                            status: schedSat === "" ? "error" : "finish",
                          },
                        ]}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddUpdateSchedule;
