import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Space, Col, Card, Timeline, Tag, Descriptions, Typography, Form, Select } from 'antd';

const { Title } = Typography;

const cardlayout = {
  bordered: true,
  hoverable: true,
  size: "small",
  style:{marginBottom: "20px"},
};

const AssetDetail = () => {

  const [assets, setAssets] = useState([]);
  
  const [assetDetails, setAssetDetails] = useState([
    {
      'desc': 'Area:',
      'val': '',
    },
    {
      'desc': 'Model:',
      'val': '',
    },
    {
      'desc': 'Sector:',
      'val': '',
    },
    {
      'desc': 'Serial:',
      'val': '',
    },
    {
      'desc': 'Plate Number:',
      'val': '',
    },
  ]);
  
  useEffect(() => {
    axios.get('http://localhost:8000/api/asset')
    .then(response => {
      setAssets(response.data);
    });
  },[]);
  
  function selectedAsset(value) {
    assets.map((asset) => (asset.id === value ?
      (setAssetDetails([
        {
          'desc': 'Area:',
          'val': asset.asset_area,
        },
        {
          'desc': 'Model:',
          'val': asset.asset_model,
        },
        {
          'desc': 'Sector:',
          'val': asset.asset_sector,
        },
        {
          'desc': 'Serial:',
          'val': asset.asset_serial,
        },
        {
          'desc': 'Plate Number:',
          'val': asset.asset_plate,
        },
      ])
    ):[]))
  };
  
  function showAssetDetails() {
    return (
      <>
        {assetDetails.map(assetDetail => {
          return (
            <Timeline.Item style={{padding: "2px 0", margin: "4px", fontSize: 12}}>
              <Space size="small">{assetDetail.desc}
                <Tag>{assetDetail.val}</Tag>
              </Space>
            </Timeline.Item>
          );
        })}
      </>
    );
  };
  
  return (
    <>
      <Card title={<Title><p className="large-card-title">Asset</p></Title>} {...cardlayout}>
        <div className="site-card-wrapper">
          <Row gutter={16}>
            <Col span={24}>
              <Card title={<Title><p className="medium-card-title">Asset ID</p></Title>} {...cardlayout}>
                <Form.Item rules={[{required: true, message: "Please select asset ID!"}]} style={{marginBottom: 0}}>
                  <Select onSelect={selectedAsset} showSearch placeholder="Search Asset ID" optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').includes(input)}
                  filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                  options={assets.map((asset) => {return {value: asset.id, label: asset.asset_id};})} />
                </Form.Item>
              </Card>
              <Card title={<Title><p className="medium-card-title">Details</p></Title>} {...cardlayout}>
                <Timeline mode="left" size="small" style={{padding: "30px 5px 0 2px" }}>
                  {showAssetDetails()}
                </Timeline>
              </Card>
              <Card title={<Title><p className="medium-card-title">Last PMS</p></Title>} {...cardlayout}>
                <Descriptions layout="vertical" size='small' bordered>
                  <Descriptions.Item style={{fontSize: 12}} label={<Title style={{fontSize: 14, color: "#69b1ff", fontWeight: 400}}>Date</Title>}>22-Jan-2022</Descriptions.Item>
                  <Descriptions.Item style={{fontSize: 12}} label={<Title style={{fontSize: 14, color: "#69b1ff", fontWeight: 400}}>Work Order</Title>} span={2}>CWO2918550</Descriptions.Item>
                  <Descriptions.Item style={{fontSize: 12}} label={<Title style={{fontSize: 14, color: "#69b1ff", fontWeight: 400}}>Type</Title>}>PMS Major</Descriptions.Item>
                </Descriptions>
              </Card>
              <Card title={<Title><p className="medium-card-title">Last Road Call</p></Title>} {...cardlayout}>
                <Descriptions layout="vertical" size='small' bordered>
                  <Descriptions.Item style={{fontSize: 12}} label={<Title style={{fontSize: 14, color: "#69b1ff", fontWeight: 400}}>Date</Title>}>4-Sep-2022</Descriptions.Item>
                  <Descriptions.Item style={{fontSize: 12}} label={<Title style={{fontSize: 14, color: "#69b1ff", fontWeight: 400}}>Work Order</Title>} span={2}>CWO5558550</Descriptions.Item>
                  <Descriptions.Item style={{fontSize: 12}} label={<Title style={{fontSize: 14, color: "#69b1ff", fontWeight: 400}}>Defect</Title>}>Engine belt cut</Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </>
  );

};

export default AssetDetail;