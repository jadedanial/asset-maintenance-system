import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography, Tag, Row, Descriptions, } from 'antd';

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
            <div style={{margin: "40px", marginTop: "2%", width: "60%"}}>
              <Card size="large" title={
                <Title>
                  <Row><p className="big-card-title">{item.item_name}</p></Row>
                  <Row><p className="big-font">{item.item_code}</p></Row>
                </Title>} hoverable>
                <Tag color="blue" style={{marginBottom: "20px"}}><p className="medium-font" style={{color: "#318CE7"}}>{item.item_category}</p></Tag>
                <Row><p className="medium-font">{item.item_description}</p></Row>
                <Row style={{margin: "20px 0"}}><p className="big-card-title">{item.item_cost} Php.</p></Row>
                <Descriptions layout="horizontal" column={1} className="small-font">
                  <Descriptions.Item label="Quantity On Hand">{item.item_onhand}</Descriptions.Item>
                  <Descriptions.Item label="Unit Of Measurement">{item.item_measurement}</Descriptions.Item>
                  <Descriptions.Item label="Physical Location">{item.item_location}</Descriptions.Item>
                  <Descriptions.Item label="Reorder Quantity">{item.item_reorder}</Descriptions.Item>
                </Descriptions>
              </Card>
            </div>  
          </div>
        </>:<></>
      ))}
    </>
  );

};

export default ItemDetail;