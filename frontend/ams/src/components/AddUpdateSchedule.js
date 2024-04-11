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
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ResultEvent from "./ResultEvent";
import Spinner from "../components/Spinner";

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
  const [loading, setLoading] = useState(false);
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

  const updateField = (value, req, step) => {
    const fieldMap = {
      1: [setSchedName, setNameReq, setStep],
      2: [setSchedSun, setSunReq, setStep],
      3: [setSchedMon, setMonReq, setStep],
      4: [setSchedTue, setTueReq, setStep],
      5: [setSchedWed, setWedReq, setStep],
      6: [setSchedThu, setThuReq, setStep],
      7: [setSchedFri, setFriReq, setStep],
      8: [setSchedSat, setSatReq, setStep],
    };
    const [updateState, setReqState, setStepState] = fieldMap[step];
    updateState(value);
    setReqState(req);
    setStepState(step);
  };

  const createSchedule = () => {
    setSubmit(true);
    setLoading(true);
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
        setLoading(false);
        setSuccess(true);
      })
      .catch(() => {
        setLoading(false);
        setSuccess(false);
      });
  };

  const { mutate } = useMutation(createSchedule);

  const onFinish = () => {
    mutate();
  };

  return (
    <>
      {submit ? (
        loading ? (
          <Spinner height={"60%"} theme={theme} />
        ) : (
          <ResultEvent
            icon={success ? <CheckOutlined /> : <CloseOutlined />}
            status={success ? "success" : "error"}
            title={
              success
                ? updateData
                  ? "Successfully updated schedule."
                  : "Successfully added new schedule."
                : updateData
                ? "Failed to update schedule."
                : "Failed to add new schedule."
            }
            subTitle={success ? "Schedule name " + schedName : "System error."}
            extra={
              <Row className="space-between-row">
                <Col span={12} style={{ paddingRight: "10px" }}>
                  <Button
                    type="default"
                    onClick={() => {
                      onCloseDrawer();
                      queryClient.invalidateQueries("schedules");
                    }}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
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
        )
      ) : (
        <div className="justified-row" style={{ paddingTop: "12px" }}>
          <div className="card-custom-size-full">
            <Form
              {...layout}
              layout="vertical"
              name="add-new-schedule"
              onFinish={onFinish}
            >
              <Card
                title={
                  <Title>
                    <p className="big-card-title">{label}</p>
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
                          onChange={(e) => updateField(e.target.value, true, 1)}
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
                              onChange={(value) => updateField(value, true, 2)}
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
                              onChange={(value) => updateField(value, true, 4)}
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
                              onChange={(value) => updateField(value, true, 6)}
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
                              onChange={(value) => updateField(value, true, 8)}
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
                              onChange={(value) => updateField(value, true, 3)}
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
                              onChange={(value) => updateField(value, true, 5)}
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
                              onChange={(value) => updateField(value, true, 7)}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <div
                        className="space-between-row"
                        style={{ paddingTop: "24px" }}
                      >
                        <Button
                          type="default"
                          onClick={() => {
                            onCloseDrawer();
                            queryClient.invalidateQueries("schedules");
                          }}
                          block
                        >
                          CANCEL
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{
                            marginLeft: "10px",
                          }}
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
                              description:
                                schedName === "" ? "Empty" : schedName,
                              status: schedName === "" ? "error" : "finish",
                            },
                            {
                              title: "Sunday",
                              description: schedSun === "" ? "Empty" : schedSun,
                              status: schedSun === "" ? "error" : "finish",
                            },
                            {
                              title: "Monday",
                              description: schedMon === "" ? "Empty" : schedMon,
                              status: schedMon === "" ? "error" : "finish",
                            },
                            {
                              title: "Tuesday",
                              description: schedTue === "" ? "Empty" : schedTue,
                              status: schedTue === "" ? "error" : "finish",
                            },
                            {
                              title: "Wednesday",
                              description: schedWed === "" ? "Empty" : schedWed,
                              status: schedWed === "" ? "error" : "finish",
                            },
                            {
                              title: "Thursday",
                              description: schedThu === "" ? "Empty" : schedThu,
                              status: schedThu === "" ? "error" : "finish",
                            },
                            {
                              title: "Friday",
                              description: schedFri === "" ? "Empty" : schedFri,
                              status: schedFri === "" ? "error" : "finish",
                            },
                            {
                              title: "Saturday",
                              description: schedSat === "" ? "Empty" : schedSat,
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
      )}
    </>
  );
};

export default AddUpdateSchedule;
