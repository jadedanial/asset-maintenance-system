import React from 'react';
import { Row, Col, Card, Typography, Form, Input } from 'antd';

const { Title } = Typography;

const cardlayout = {
  bordered: true,
  hoverable: true,
  size: "small",
  style:{marginBottom: "20px"},
};

const DescriptionField = () => {

  return (
    <>
      <Card title={<Title><p className="large-card-title">Description</p></Title>} {...cardlayout}>
        <div className="site-card-wrapper">
          <Row gutter={16}>
            <Col span={24}>
              <Card title={<Title><p className="medium-card-title"></p></Title>} {...cardlayout}>
                <Form.Item rules={[{required: true, message: "Please description!"}]} style={{marginBottom: 0}}>
                  <Input.TextArea placeholder="Input Description" />
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </>
  );

};

export default DescriptionField;