import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Col,
  Row,
  Card,
  Button,
  Typography,
  List,
  notification,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import NotificationEvent from "./NotificationEvent";
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

const Excuse = (props) => {
  const [excusedate, setExcuseDate] = useState("");
  const [starttime, setStartTime] = useState("");
  const [endtime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: "Details",
      content: (
        <>
          <Form
            {...layout}
            layout="vertical"
            size="large"
            name="add-excuse"
            style={{ width: "100%" }}
          >
            <Col span={24}>
              <div className="space-between-row">
                <Col span={7}>
                  <Form.Item
                    name={["excusedate"]}
                    label="Excuse Date"
                    initialValue={excusedate === "" ? "" : moment(excusedate)}
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder=""
                      onChange={(value) => setExcuseDate(moment(value))}
                      inputReadOnly
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name={["starttime"]}
                    label="Start Time"
                    initialValue={starttime === "" ? "" : moment(starttime)}
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <TimePicker
                      placeholder=""
                      onChange={(value) => setStartTime(moment(value))}
                      inputReadOnly
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name={["endtime"]}
                    label="End Time"
                    initialValue={endtime === "" ? "" : moment(endtime)}
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <TimePicker
                      placeholder=""
                      onChange={(value) => setEndTime(moment(value))}
                      inputReadOnly
                    />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="total" label="Total Hour">
                    <Input readOnly />
                  </Form.Item>
                </Col>
              </div>
            </Col>
            <Form.Item
              name={["reason"]}
              label="Reason"
              initialValue={reason}
              rules={[
                {
                  required: true,
                  message: "Required!",
                },
              ]}
            >
              <Input.TextArea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Form.Item>
          </Form>
        </>
      ),
    },
    {
      title: "Confirm",
      content: (
        <List
          style={{ width: "90%" }}
          itemLayout="horizontal"
          dataSource={[
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  Excuse Date
                </p>
              ),
              description: <p className="small-font">{excusedate}</p>,
            },
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  Start Time
                </p>
              ),
              description: <p className="small-font">{starttime}</p>,
            },
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  End Time
                </p>
              ),
              description: <p className="small-font">{endtime}</p>,
            },
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  Reason
                </p>
              ),
              description: <p className="small-font">{reason}</p>,
            },
          ]}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      ),
    },
  ];

  function newExcuse() {
    setSuccess(false);
    setCurrent(0);
    setExcuseDate("");
    setStartTime("");
    setEndTime("");
    setReason("");
  }

  function next() {
    var valid = true;
    if (moment(excusedate).isValid() === false) {
      valid = false;
      api.info(NotificationEvent(false, "No Excuse Date selected!!"));
    } else if (moment(starttime).isValid() === false) {
      valid = false;
      api.info(NotificationEvent(false, "No Start Time selected!"));
    } else if (moment(endtime).isValid() === false) {
      valid = false;
      api.info(NotificationEvent(false, "No End Time selected!"));
    } else if (starttime > endtime) {
      valid = false;
      api.info(
        NotificationEvent(false, "End Time must greater than Start Time!")
      );
    }
    if (valid) {
      setCurrent(current + 1);
    }
  }

  function prev() {
    setCurrent(current - 1);
  }

  async function applyExcuse() {}

  if (success) {
    return (
      <>
        <ResultEvent
          icon={<CheckCircleOutlined style={{ color: "#318ce7" }} />}
          status="success"
          title={"Successfully applied employee excuse."}
          subTitle={`Date ${excusedate}} From ${starttime} To ${endtime}`}
          extra={[
            <Button size="large" type="primary" onClick={newExcuse}>
              ADD NEW EXCUSE
            </Button>,
          ]}
        />
      </>
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
                  <div>
                    {current < steps.length - 1 && (
                      <Button size="large" type="primary" onClick={next}>
                        NEXT
                      </Button>
                    )}
                    {current > 0 && (
                      <Button
                        size="large"
                        type="primary"
                        onClick={prev}
                        style={{ marginRight: "8px" }}
                      >
                        BACK
                      </Button>
                    )}
                    {current === steps.length - 1 && (
                      <Button size="large" type="primary" onClick={applyExcuse}>
                        APPLY
                      </Button>
                    )}
                  </div>
                }
                title={
                  <Title>
                    <p className="big-card-title">Excuse Application</p>
                  </Title>
                }
                hoverable
              >
                <div className="justified-row">{steps[current].content}</div>
              </Card>
            </div>
          </Row>
        </Card>
      </Row>
    </>
  );
};

export default Excuse;
