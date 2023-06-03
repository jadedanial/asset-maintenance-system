import React from 'react';
import { Card, Divider, Space, Tag, Row, Col, Form, Typography, Button } from 'antd';
import AssetDetail from '../components/AssetDetail';
import DescriptionField from '../components/DescriptionField';
import RequestInfoField from '../components/RequestInfoField';
import RepairTypeField from '../components/RepairTypeField';

const { Title } = Typography;

const WorkRequest = () => {

  return (
    <>
      <Form size="large">
        <Card title={
          <Title>
            <Row>
              <Col span={16}>
                <Divider orientation="left" orientationMargin={0}>
                  <Space size="large" style={{fontSize: "22px"}}>
                    Work Request ID<Tag color="blue">CWO5558550</Tag>
                  </Space>
                </Divider>
              </Col>
              <Col span={8}>
                <Divider orientation="right" orientationMargin={0} style={{borderBlockColor: "white"}}>
                  <Space size="small">
                    <Button type="primary" size="default">SAVE</Button>
                    <Button type="primary" size="default">APPROVE</Button>
                    <Button type="primary" size="default">CLEAR</Button>
                  </Space>
                </Divider>
              </Col>
            </Row>
          </Title>}>
          <Row gutter={16}>
            <Col span={8}>
              <AssetDetail></AssetDetail>
            </Col>
            <Col span={16}>
              <DescriptionField></DescriptionField>
              <RequestInfoField></RequestInfoField>
              <RepairTypeField></RepairTypeField>
            </Col>
          </Row>
        </Card>
      </Form>
    </>
  );

};

export default WorkRequest;