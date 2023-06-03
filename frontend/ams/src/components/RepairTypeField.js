import React from 'react';
import { Row, Col, Card, Typography, Form, Select } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const cardlayout = {
  bordered: true,
  hoverable: true,
  size: "small",
  style:{marginBottom: "20px"},
};

const RepairTypeField = () => {

  return (
    <>
      <Card title={<Title><p className="large-card-title">Repair Type</p></Title>} {...cardlayout}>
        <div className="site-card-wrapper">
          <Row gutter={16}>
            <Col span={12}>
              <Card title={<Title><p className="medium-card-title">Workshop</p></Title>} {...cardlayout}>
                <Form.Item rules={[{required: true, message: "Please select workshop!"}]} style={{marginBottom: 0}}>
                  <Select placeholder="Select Workshop">
                    <Option value="DAM">DAM</Option>
                    <Option value="RUH">RUH</Option>
                  </Select>
                </Form.Item>
              </Card>
            </Col>
            <Col span={12}>
              <Card title={<Title><p className="medium-card-title">Physical Location</p></Title>} {...cardlayout}>
                <Form.Item rules={[{required: true, message: "Please select physical location!"}]} style={{marginBottom: 0}}>
                  <Select placeholder="Select Physical Location">
                    <Option value="Readyline">Readyline</Option>
                    <Option value="Deadline">Deadline</Option>
                  </Select>
                </Form.Item>
              </Card>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Card title={<Title><p className="medium-card-title">Maintenance Type</p></Title>} {...cardlayout}>
                <Form.Item rules={[{required: true, message: "Please select maintenance type!"}]} style={{marginBottom: 0}}>
                  <Select placeholder="Select Maintenance Type">
                    <Option value="Corrective">Corrective</Option>
                    <Option value="Preventive">Preventive</Option>
                  </Select>
                </Form.Item>
              </Card>
            </Col>
            <Col span={12}>
              <Card title={<Title><p className="medium-card-title">Repair Type</p></Title>} {...cardlayout}>
                <Form.Item rules={[{required: true, message: "Please select repair type!"}]} style={{marginBottom: 0}}>
                  <Select placeholder="Select Repair Type">
                    <Option value="Running Repair">Running Repair</Option>
                    <Option value="Heavy Repair">Heavy Repair</Option>
                    <Option value="Heavy Repair">Accident</Option>
                    <Option value="Heavy Repair">Emergency Road Call</Option>
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

export default RepairTypeField;