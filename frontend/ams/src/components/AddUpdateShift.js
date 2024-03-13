import React, { useState } from "react";
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
  const timeFormat = "HH:mm:ss";
  const [updateData, setUpdateData] = useState(update);
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
    changeLabel();
  };

  const onFromChange = (value) => {
    setShiftFrom(value);
    setFromReq(true);
    changeLabel();
  };

  const onToChange = (value) => {
    setShiftTo(value);
    setToReq(true);
    changeLabel();
  };

  const onFinish = () => {
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
            icon={<CheckOutlined style={{ color: "#318ce7" }} />}
            status="success"
            title={
              updateData
                ? "Successfully updated Shift."
                : "Successfully added new Shift."
            }
            subTitle={shiftName}
            extra={
              <Row className="space-between-row" style={{ width: "40%" }}>
                <Col span={12}>
                  <Button
                    size="large"
                    type="default"
                    onClick={onCloseDrawer}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
                <Col span={11}>
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
              <Form.Item
                name={["name"]}
                label="Shift Name"
                initialValue={shiftName}
                rules={[
                  {
                    required: updateData ? nameReq : true,
                    message: "Required!",
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
                      shiftFrom === "" ? "" : moment(shiftFrom, timeFormat)
                    }
                    rules={[
                      {
                        required: updateData ? fromReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <TimePicker
                      placeholder=""
                      value={
                        shiftFrom === "" ? "" : moment(shiftFrom, timeFormat)
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
                        message: "Required!",
                      },
                    ]}
                  >
                    <TimePicker
                      placeholder=""
                      value={shiftTo === "" ? "" : moment(shiftTo, timeFormat)}
                      onChange={onToChange}
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

export default AddUpdateShift;
