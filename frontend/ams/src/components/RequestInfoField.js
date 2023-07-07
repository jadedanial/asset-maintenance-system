import React from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";

const { Title } = Typography;
const { Option } = Select;

const cardlayout = {
  bordered: true,
  hoverable: true,
  size: "small",
  style: { marginBottom: "20px" },
};

const RequestInfoField = () => {
  return (
    <>
      <Card
        title={
          <Title>
            <p className="large-card-title">Request Info</p>
          </Title>
        }
        {...cardlayout}
      >
        <div className="site-card-wrapper">
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title={
                  <Title>
                    <p className="medium-card-title">Date</p>
                  </Title>
                }
                {...cardlayout}
              >
                <Form.Item
                  rules={[{ required: true, message: "Please select date!" }]}
                  style={{ marginBottom: 0 }}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Select Date"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={
                  <Title>
                    <p className="medium-card-title">Check By</p>
                  </Title>
                }
                {...cardlayout}
              >
                <Form.Item
                  rules={[
                    { required: true, message: "Please input checked by!" },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="Input Checked By" />
                </Form.Item>
              </Card>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title={
                  <Title>
                    <p className="medium-card-title">Created By</p>
                  </Title>
                }
                {...cardlayout}
              >
                <Form.Item
                  rules={[
                    { required: true, message: "Please input created by!" },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="Input Created By" />
                </Form.Item>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={
                  <Title>
                    <p className="medium-card-title">Status</p>
                  </Title>
                }
                {...cardlayout}
              >
                <Form.Item
                  rules={[{ required: true, message: "Please select status!" }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select placeholder="Select Work Request Status">
                    <Option value="New">New</Option>
                    <Option value="Closed">Closed</Option>
                  </Select>
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </>
  );
};

export default RequestInfoField;
