import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Col,
  Row,
  Card,
  Button,
  Steps,
  List,
  notification,
} from "antd";
import { CloseOutlined, CheckCircleOutlined } from "@ant-design/icons";
import ResultEvent from "../components/ResultEvent";
import moment from "moment";
import NotificationEvent from "./NotificationEvent";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const Vacation = (props) => {
  const dateFormat = "YYYY-MM-DD";
  const [vactypes, setVacationType] = useState([]);
  const [vacation, setVacation] = useState("");
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState("");
  const [showAttachment, setShowAttachment] = useState(false);
  const [success, setSuccess] = useState(false);
  const [days, setDays] = useState(0);
  const [api, contextHolder] = notification.useNotification();
  const [current, setCurrent] = useState(0);

  const contentStyle = {
    lineHeight: "260px",
  };

  const steps = [
    {
      title: "Details",
      content: (
        <>
          <Form
            {...layout}
            layout="vertical"
            size="large"
            name="add-vacation"
            style={{ width: "100%" }}
          >
            <Col span={24}>
              <div className="space-between-row">
                <Col span={10}>
                  <Form.Item
                    name={["vacation"]}
                    label="Type"
                    initialValue={vacation}
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      className="small-font"
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "").includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={vactypes.map((vac) => {
                        return {
                          value: vac.vacation,
                          label: vac.vacation,
                        };
                      })}
                      onChange={onVacationChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name={["startdate"]}
                    label="Start Date"
                    initialValue={startdate === "" ? "" : moment(startdate)}
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder=""
                      onChange={(value) =>
                        setStartDate(moment(value).format(dateFormat))
                      }
                      inputReadOnly
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name={["enddate"]}
                    label="End Date"
                    initialValue={enddate === "" ? "" : moment(enddate)}
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder=""
                      onChange={(value) =>
                        setEndDate(moment(value).format(dateFormat))
                      }
                      inputReadOnly
                    />
                  </Form.Item>
                </Col>
              </div>
            </Col>
            <Col span={24}>
              <div className="space-between-row">
                <Col span={10}>
                  <Form.Item
                    name={["reason"]}
                    label="Reason"
                    initialValue={reason}
                  >
                    <Input onChange={(e) => onReasonChange(e.target.value)} />
                  </Form.Item>
                </Col>
                <Col span={13}>
                  {showAttachment ? (
                    <Form.Item
                      name={["attachment"]}
                      label="Attachment"
                      initialValue={attachment}
                    >
                      <Input
                        readOnly
                        suffix={
                          <Button
                            className="align-items-center "
                            icon={
                              <CloseOutlined
                                className="medium-card-title"
                                style={{ color: "#318ce7" }}
                              />
                            }
                            style={{
                              width: "16px",
                              height: "16px",
                            }}
                            onClick={removeAttachment}
                          />
                        }
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item name={["select_attachment"]} label="Attachment">
                      <Input
                        type="file"
                        onChange={(e) => onAttachmentChange(e.target.value)}
                      />
                    </Form.Item>
                  )}
                </Col>
              </div>
            </Col>
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
                  Vacation Type
                </p>
              ),
              description: <p className="small-font">{vacation}</p>,
            },
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  Date Duration
                </p>
              ),
              description: (
                <p className="small-font">
                  From {startdate} To {enddate} ({days})
                </p>
              ),
            },
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  Reason
                </p>
              ),
              description: <p className="small-font">{reason}</p>,
            },
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  Attachment
                </p>
              ),
              description: <p className="small-font">{attachment}</p>,
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

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  useEffect(() => {
    (async () => {
      try {
        await axios
          .get("http://localhost:8000/api/vacation", {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          })
          .then((response) => {
            setVacationType(response.data);
          });
      } catch (err) {
        console.log(err.response.data[0]);
      }
    })();
  }, []);

  function onVacationChange(value) {
    setVacation(value);
  }

  function onReasonChange(value) {
    setReason(value);
  }

  function onAttachmentChange(value) {
    setAttachment(value);
    setShowAttachment(true);
  }

  function removeAttachment() {
    setShowAttachment(false);
    setAttachment("");
  }

  function next() {
    var valid = true;

    if (vacation === "") {
      valid = false;
      api.info(NotificationEvent(false, "No Vacation Type selected!"));
    } else if (startdate === "") {
      valid = false;
      api.info(NotificationEvent(false, "No Start Date selected!"));
    } else if (enddate === "") {
      valid = false;
      api.info(NotificationEvent(false, "No End Date selected!"));
    } else if (startdate > enddate) {
      valid = false;
      api.info(NotificationEvent(false, "Invalid date duration!"));
    }

    if (valid) {
      var d =
        moment
          .duration(
            moment(enddate, "YYYY-MM-DD").diff(moment(startdate, "YYYY-MM-DD"))
          )
          .asDays() + 1;
      setDays(d > 1 ? d + " days" : d + " day");
      setCurrent(current + 1);
    }
  }

  function prev() {
    setCurrent(current - 1);
  }

  function apply() {
    setSuccess(true);
  }

  function newVacation() {
    setSuccess(false);
    setCurrent(0);
    setVacation("");
    setStartDate("");
    setEndDate("");
    setReason("");
    setAttachment("");
    setShowAttachment(false);
  }

  if (success) {
    return (
      <>
        <ResultEvent
          icon={<CheckCircleOutlined style={{ color: "#318ce7" }} />}
          status="success"
          title={"Successfully applied employee vacation."}
          subTitle={`From ${startdate} To ${enddate} (${days})`}
          extra={
            <Button size="large" type="primary" onClick={newVacation}>
              APPLY NEW VACATION
            </Button>
          }
        />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <Row style={{ marginTop: "20px" }}>
        <Card size="small" style={{ width: "100%" }}>
          <Row style={{ justifyContent: "center", marginBottom: "20px" }}>
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
                    {current === steps.length - 1 && (
                      <Button size="large" type="primary" onClick={apply}>
                        APPLY
                      </Button>
                    )}
                    {current > 0 && (
                      <Button
                        size="large"
                        type="primary"
                        onClick={prev}
                        style={{ margin: "0 0 0 8px" }}
                      >
                        BACK
                      </Button>
                    )}
                  </div>
                }
                title={<Steps current={current} items={items} />}
                hoverable
              >
                <div className="justified-row" style={contentStyle}>
                  {steps[current].content}
                </div>
              </Card>
            </div>
          </Row>
        </Card>
      </Row>
    </>
  );
};

export default Vacation;
