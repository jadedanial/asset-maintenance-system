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
import { CheckOutlined } from "@ant-design/icons";
import ResultEvent from "./ResultEvent";
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
  const [color, setColor] = useState("#318ce7");
  const shiftID = updateData ? id : "";
  const [shiftName, setShiftName] = useState(updateData ? name : "");
  const [shiftFrom, setShiftFrom] = useState(updateData ? from : "");
  const [shiftTo, setShiftTo] = useState(updateData ? to : "");
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nameReq, setNameReq] = useState(false);
  const [fromReq, setFromReq] = useState(false);
  const [toReq, setToReq] = useState(false);

  const newShift = () => {
    setUpdateData(false);
    setSubmit(false);
    setLabel("Add New Shift");
    setColor("#318ce7");
    setShiftName("");
    setShiftFrom("");
    setShiftTo("");
    setFromReq(true);
    setToReq(true);
  };

  const changeLabel = () => {
    setLabel(updateData ? "Update Shift" : "Add New Shift");
    setColor("#318ce7");
  };

  const onNameChange = (value) => {
    setShiftName(value);
    setNameReq(true);
    setStep(1);
    changeLabel();
  };

  const onFromChange = (value) => {
    setShiftFrom(value);
    setFromReq(true);
    setStep(2);
    changeLabel();
  };

  const onToChange = (value) => {
    setShiftTo(value);
    setToReq(true);
    setStep(3);
    changeLabel();
  };

  const createShift = () => {
    setSubmit(true);
    changeLabel();
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
        queryClient.invalidateQueries("shifts");
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

  const { mutate } = useMutation(createShift);

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
                ? "Successfully updated shift."
                : "Successfully added new shift."
            }
            subTitle={shiftName}
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
                    onClick={() => newShift()}
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
            name="add-new-shift"
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
                        onChange={(e) => onNameChange(e.target.value)}
                      />
                    </Form.Item>
                    <div className="space-between-row">
                      <Col span={12}>
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
                            onChange={onFromChange}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={11}>
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
                              shiftTo === "" ? "" : moment(shiftTo, timeFormat)
                            }
                            onChange={onToChange}
                          />
                        </Form.Item>
                      </Col>
                    </div>
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
                        onClick={onCloseDrawer}
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
                          description: shiftName === "" ? " " : shiftName,
                          status: shiftName === "" ? "error" : "finish",
                        },
                        {
                          title: "Shift From",
                          description:
                            shiftFrom === ""
                              ? " "
                              : moment(shiftFrom).format(timeFormat),
                          status: shiftFrom === "" ? "error" : "finish",
                        },
                        {
                          title: "Shift To",
                          description:
                            shiftTo === ""
                              ? " "
                              : moment(shiftTo).format(timeFormat),
                          status: shiftTo === "" ? "error" : "finish",
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
    </>
  );
};

export default AddUpdateShift;
