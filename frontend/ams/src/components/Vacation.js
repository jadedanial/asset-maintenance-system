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
  Empty,
} from "antd";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const Vacation = (props) => {
  const [vactypes, setVacationType] = useState([]);
  const [vacation, setVacation] = useState("");
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

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

  function onStartDateChange(value) {
    setStartDate(value);
  }

  function onEndDateChange(value) {
    setEndDate(value);
  }

  function onReasonChange(value) {
    setReason(value);
  }

  function componentSwitch(key) {
    switch (key) {
      case true:
        return (
          <>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </>
        );
      case false:
        return (
          <>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </>
        );
      default:
        break;
    }
  }

  async function onFinish() {}

  return (
    <>
      <Row style={{ marginTop: "20px" }}>
        <Card size="small" style={{ width: "100%" }}>
          <Form
            {...layout}
            layout="vertical"
            size="large"
            name="add-vacation"
            onFinish={onFinish}
            style={{ padding: "12px" }}
          >
            <div className="space-between-row">
              <Col span={20}>
                <div className="space-between-row">
                  <Col span={6}>
                    <Form.Item
                      name={["vacation"]}
                      className="no-margin"
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
                        placeholder="Vacation Type"
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
                        value=""
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
                  <Col span={9}>
                    <Form.Item
                      name={["reason"]}
                      className="no-margin"
                      initialValue=""
                      rules={[
                        {
                          required: true,
                          message: "Required!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Reason"
                        value=""
                        onChange={(e) => onReasonChange(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name={["startdate"]}
                      className="no-margin"
                      initialValue=""
                      rules={[
                        {
                          required: true,
                          message: "Required!",
                        },
                      ]}
                    >
                      <DatePicker
                        placeholder="Start Date"
                        value=""
                        onChange={onStartDateChange}
                        inputReadOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name={["enddate"]}
                      className="no-margin"
                      initialValue=""
                      rules={[
                        {
                          required: true,
                          message: "Required!",
                        },
                      ]}
                    >
                      <DatePicker
                        placeholder="End Date"
                        value=""
                        onChange={onEndDateChange}
                        inputReadOnly
                      />
                    </Form.Item>
                  </Col>
                </div>
              </Col>
              <Col span={3}>
                <Form.Item className="no-margin">
                  <Button size="large" type="primary" htmlType="submit" block>
                    APPLY
                  </Button>
                </Form.Item>
              </Col>
            </div>
          </Form>
        </Card>
        <Card
          className="card-no-top-padding"
          style={{ marginTop: "40px", width: "100%" }}
        >
          {componentSwitch(true)}
        </Card>
      </Row>
    </>
  );
};

export default Vacation;
