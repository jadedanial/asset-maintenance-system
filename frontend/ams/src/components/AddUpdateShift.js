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
  TimePicker,
  Steps,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ResultEvent from "./ResultEvent";
import Spinner from "../components/Spinner";
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

const AddUpdateShift = ({
  update,
  id,
  name,
  from,
  to,
  onCloseDrawer,
  theme,
}) => {
  const queryClient = useCustomQueryClient();
  const timeFormat = "HH:mm:ss";
  const [updateData, setUpdateData] = useState(update);
  const [step, setStep] = useState(updateData ? 3 : 0);
  const [label, setLabel] = useState(
    updateData ? "Update Shift" : "Add New Shift"
  );
  const shiftID = updateData ? id : "";
  const [shiftName, setShiftName] = useState(updateData ? name : "");
  const [shiftFrom, setShiftFrom] = useState(
    updateData ? moment(from, timeFormat).format(timeFormat) : ""
  );
  const [shiftTo, setShiftTo] = useState(
    updateData ? moment(to, timeFormat).format(timeFormat) : ""
  );
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [nameReq, setNameReq] = useState(false);
  const [fromReq, setFromReq] = useState(false);
  const [toReq, setToReq] = useState(false);

  const newShift = () => {
    setUpdateData(false);
    setSubmit(false);
    setLabel("Add New Shift");
    setShiftName("");
    setShiftFrom("");
    setShiftTo("");
    setFromReq(true);
    setToReq(true);
  };

  const updateField = (value, req, step) => {
    const fieldMap = {
      1: [setShiftName, setNameReq, setStep],
      2: [setShiftFrom, setFromReq, setStep],
      3: [setShiftTo, setToReq, setStep],
    };
    const [updateState, setReqState, setStepState] = fieldMap[step];
    updateState(value);
    setReqState(req);
    setStepState(step);
  };

  const createShift = () => {
    setSubmit(true);
    setLoading(true);
    var shiftData = {
      id: shiftID,
      shift_name: shiftName,
      shift_description:
        moment(shiftFrom, timeFormat).format(timeFormat) +
        " - " +
        moment(shiftTo, timeFormat).format(timeFormat),
      shift_from: moment(shiftFrom, timeFormat).format(timeFormat),
      shift_to: moment(shiftTo, timeFormat).format(timeFormat),
    };
    const token = sessionStorage.getItem("token");
    axios({
      method: updateData ? "PATCH" : "POST",
      url: `${process.env.REACT_APP_API_URL}/api/shift`,
      data: shiftData,
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

  const { mutate } = useMutation(createShift);

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
                  ? "Successfully updated shift."
                  : "Successfully added new shift."
                : updateData
                ? "Failed to update shift."
                : "Failed to add new shift."
            }
            subTitle={success ? "Shift name " + shiftName : ""}
            extra={
              <Row className="space-between-row">
                <Col span={12} style={{ paddingRight: "10px" }}>
                  <Button
                    size="large"
                    type="default"
                    onClick={() => {
                      onCloseDrawer();
                      queryClient.invalidateQueries("shifts");
                      queryClient.invalidateQueries("schedules");
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
                      newShift();
                    }}
                    block
                  >
                    NEW SHIFT
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
              size="large"
              name="add-new-shift"
              onFinish={onFinish}
            >
              <Card
                size="large"
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
                        label="Shift Name"
                        initialValue={shiftName}
                        rules={[
                          {
                            required: updateData ? nameReq : true,
                            message: "Shift name required",
                          },
                        ]}
                      >
                        <Input
                          value={shiftName}
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
                            name={["shiftFrom"]}
                            label="Shift From"
                            initialValue={
                              shiftFrom === ""
                                ? ""
                                : moment(shiftFrom, timeFormat)
                            }
                            rules={[
                              {
                                required: updateData ? fromReq : true,
                                message: "Shift from required",
                              },
                            ]}
                          >
                            <TimePicker
                              placeholder=""
                              value={
                                shiftFrom === ""
                                  ? ""
                                  : moment(shiftFrom, timeFormat)
                              }
                              onChange={(value) => updateField(value, true, 2)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={["shiftTo"]}
                            label="Shift To"
                            initialValue={
                              shiftTo === "" ? "" : moment(shiftTo, timeFormat)
                            }
                            rules={[
                              {
                                required: updateData ? toReq : true,
                                message: "Shift to required",
                              },
                            ]}
                          >
                            <TimePicker
                              placeholder=""
                              value={
                                shiftTo === ""
                                  ? ""
                                  : moment(shiftTo, timeFormat)
                              }
                              onChange={(value) => updateField(value, true, 3)}
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
                          onClick={() => {
                            onCloseDrawer();
                            queryClient.invalidateQueries("shifts");
                            queryClient.invalidateQueries("schedules");
                          }}
                          block
                        >
                          CANCEL
                        </Button>
                        <Button
                          size="large"
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
                    <div
                      className="card-with-background"
                      style={{ padding: "24px" }}
                    >
                      <Steps
                        current={step}
                        direction="vertical"
                        items={[
                          {
                            title: "Shift Name",
                            description: shiftName === "" ? "Empty" : shiftName,
                            status: shiftName === "" ? "error" : "finish",
                          },
                          {
                            title: "Shift From",
                            description: moment(shiftFrom, timeFormat).isValid()
                              ? moment(shiftFrom, timeFormat).format(timeFormat)
                              : "Invalid time",
                            status: moment(shiftFrom, timeFormat).isValid()
                              ? "finish"
                              : "error",
                          },
                          {
                            title: "Shift From",
                            description: moment(shiftTo, timeFormat).isValid()
                              ? moment(shiftTo, timeFormat).format(timeFormat)
                              : "Invalid time",
                            status: moment(shiftTo, timeFormat).isValid()
                              ? "finish"
                              : "error",
                          },
                        ]}
                      />
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

export default AddUpdateShift;
