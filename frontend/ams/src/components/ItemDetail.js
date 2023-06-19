import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from "react-qr-code";
import { Card, Typography, Tag, Col, Row, Descriptions, Button } from 'antd';
import AddUpdateItem from './AddUpdateItem';

const { Title } = Typography;

const ItemDetail = (props) => {

  const [item, setItem] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/items')
    .then(response => {
      setItem(response.data);
    });
  },[]);

  return (
    <>
      {item.map(i => (i.item_code === props.itemcode ? 
        <>
          {update ?
            <>
              <AddUpdateItem 
              update={true}
              code={i.item_code}
              name={i.item_name}
              category={i.item_category}
              measurement={i.item_measurement}
              location={i.item_location}
              reorder={i.item_reorder}
              onhand={i.item_onhand}
              cost={i.item_cost}
              description={i.item_description}>
              </AddUpdateItem>
            </>:
            <>
              <div className="justified-row">
                <div style={{margin: "40px", marginTop: "2%", width: "50%"}}>
                  <Card size="large" extra={<Button size="middle" type="primary" onClick={() => setUpdate(true)} block>UPDATE</Button>} title={
                    <Title>
                      <Row><p className="big-card-title" style={{width: "90%", textWrap: "wrap"}}>{i.item_name}</p></Row>
                    </Title>} hoverable>
                    <Row>
                      <Col span={15}>
                        <Row><p className="big-font">{i.item_code}</p></Row>
                        <Row><p className="big-card-title">{i.item_cost} Php.</p></Row>
                        <Descriptions layout="horizontal" column={1} className="small-font">
                          <Descriptions.Item label="Quantity On Hand">{i.item_onhand}</Descriptions.Item>
                          <Descriptions.Item label="Unit Of Measurement">{i.item_measurement}</Descriptions.Item>
                          <Descriptions.Item label="Physical Location">{i.item_location}</Descriptions.Item>
                          <Descriptions.Item label="Reorder Quantity">{i.item_reorder}</Descriptions.Item>
                        </Descriptions>
                      </Col>
                      <Col span={9}>
                        <QRCode size={256} style={{height: "auto", width: "100%"}} value={i.item_code} />
                      </Col>
                    </Row>
                    <Row style={{margin: "20px 0 10px 0"}}><Tag color="blue"><p className="medium-font" style={{color: "#318CE7"}}>{i.item_category}</p></Tag></Row>
                    <Row><p className="medium-font">{i.item_description}</p></Row>
                  </Card>
                </div>  
              </div>
            </>
          }
        </>:<></>
      ))}
    </>
  );

};

export default ItemDetail;