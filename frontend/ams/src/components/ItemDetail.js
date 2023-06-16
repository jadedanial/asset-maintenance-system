import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from "react-qr-code";
import { Card, Typography, Tag, Col, Row, Descriptions, Button } from 'antd';

const { Title } = Typography;

const ItemDetail = (props) => {

  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/items')
    .then(response => {
      setItems(response.data);
    });
  },[]);

  return (
    <>
      {items.map(item => (item.item_code === props.itemid ? 
        <>
          <div className="justified-row">
            <div style={{margin: "40px", marginTop: "2%", width: "50%"}}>
              <Card size="large" extra={<Button size="middle" type="primary" block>UPDATE</Button>} title={
                <Title>
                  <Row><p className="big-card-title" style={{width: "90%", textWrap: "wrap"}}>{item.item_name}</p></Row>
                </Title>} hoverable>
                <Row>
                  <Col span={15}>
                    <Row><p className="big-font">{item.item_code}</p></Row>
                    <Row><p className="big-card-title">{item.item_cost} Php.</p></Row>
                    <Descriptions layout="horizontal" column={1} className="small-font">
                      <Descriptions.Item label="Quantity On Hand">{item.item_onhand}</Descriptions.Item>
                      <Descriptions.Item label="Unit Of Measurement">{item.item_measurement}</Descriptions.Item>
                      <Descriptions.Item label="Physical Location">{item.item_location}</Descriptions.Item>
                      <Descriptions.Item label="Reorder Quantity">{item.item_reorder}</Descriptions.Item>
                    </Descriptions>
                  </Col>
                  <Col span={9}>
                    <QRCode size={256} style={{height: "auto", width: "100%"}} value={item.item_code} />
                  </Col>
                </Row>
                <Row style={{margin: "20px 0 10px 0"}}><Tag color="blue"><p className="medium-font" style={{color: "#318CE7"}}>{item.item_category}</p></Tag></Row>
                <Row><p className="medium-font">{item.item_description}</p></Row>
              </Card>
            </div>  
          </div>
        </>:<></>
      ))}
    </>
  );

};

export default ItemDetail;