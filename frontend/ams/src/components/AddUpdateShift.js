import React, { useState } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Form,
  Card,
  Col,
  TimePicker,
  notification,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import ResultEvent from "../components/ResultEvent";
import NotificationEvent from "./NotificationEvent";
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

const AddUpdateShift = (props) => {
  const timeFormat = "HH:mm:ss";
  const [update, setUpdate] = useState(props.update);
  const [label, setLabel] = useState(update ? "Update Shift" : "Add New Shift");
  const [color, setColor] = useState("#318ce7");
  const [shiftName, setShiftName] = useState(update ? props.name : "");
  const [shiftFrom, setShiftFrom] = useState(update ? props.from : "");
  const [shiftTo, setShiftTo] = useState(update ? props.to : "");
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fromReq, setFromReq] = useState(false);
  const [toReq, setToReq] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  function newShift() {
    setUpdate(false);
    setSubmit(false);
    setLabel("Add New Shift");
    setColor("#318ce7");
    setShiftName("");
    setShiftFrom("");
    setShiftTo("");
    setFromReq(true);
    setToReq(true);
  }

  function onFromChange(value) {
    setShiftFrom(value);
    setFromReq(true);
  }

  function onToChange(value) {
    setShiftTo(value);
    setToReq(true);
  }

  async function onFinish() {
    if (shiftFrom > shiftTo) {
      api.info(
        NotificationEvent(false, "Shift To must greater than Shift From!")
      );
    } else {
      setSubmit(true);
      setLabel(update ? "Update Shift" : "Add New Shift");
      setColor("#318ce7");
      var shiftData = {
        shift_name: shiftName,
        shift_from: moment(shiftFrom).format(timeFormat),
        shift_to: moment(shiftTo).format(timeFormat),
      };
      try {
        await axios({
          method: update ? "PATCH" : "POST",
          url: "http://localhost:8000/api/shift/",
          data: shiftData,
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }).then((response) => {
          setShiftName(response.data["shift_name"]);
        });
        setSuccess(true);
      } catch (err) {
        console.log(err.response.data[0]);
        setSuccess(false);
      }
      if (!success) {
        api.info(NotificationEvent(false, "err.response.data[0]"));
      }
    }
  }

  if (submit) {
    if (success) {
      return (
        <>
          <ResultEvent
            icon={<CheckCircleOutlined style={{ color: "#318ce7" }} />}
            status="success"
            title={
              update
                ? "Successfully updated Shift."
                : "Successfully added new Shift."
            }
            subTitle={"Shift name " + shiftName}
            extra={
              <Button size="large" type="primary" onClick={() => newShift()}>
                ADD NEW SHIFT
              </Button>
            }
          />
        </>
      );
    }
  }

  return (
    <>
      {contextHolder}
      <div className="justified-row">
        <div className="card-custom-size">
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
              hoverable
            >
              <div className="space-between-row">
                <Col span={12}>
                  <Form.Item
                    name={["shiftFrom"]}
                    label="Shift From"
                    initialValue={shiftFrom === "" ? "" : moment(shiftFrom)}
                    rules={[
                      {
                        required: update ? fromReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <TimePicker
                      placeholder=""
                      value={shiftFrom === "" ? "" : moment(shiftFrom)}
                      onChange={onFromChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    name={["shiftTo"]}
                    label="Shift To"
                    initialValue={shiftTo === "" ? "" : moment(shiftTo)}
                    rules={[
                      {
                        required: update ? toReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <TimePicker
                      placeholder=""
                      value={shiftTo === "" ? "" : moment(shiftTo)}
                      onChange={onToChange}
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

export default AddUpdateShift;
