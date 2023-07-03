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
                <div className="card-custom-size">
                  <Card size="large" extra={<Button size="middle" type="primary" onClick={() => setUpdate(true)}>UPDATE</Button>} title={
                    <Title>
                      <Row><p className="big-card-title" style={{textWrap: "wrap"}}>{i.item_name}</p></Row>
                    </Title>} hoverable>
                    <Row>
                      <div className="space-between-row">
                        <Col span={13}>
                          <Row><p className="big-font">{i.item_code}</p></Row>
                          <Row><p className="big-card-title">{i.item_cost} Php.</p></Row>
                          <Descriptions layout="horizontal" column={1} className="small-font">
                            <Descriptions.Item label="Quantity On Hand">{i.item_onhand}</Descriptions.Item>
                            <Descriptions.Item label="Unit Of Measurement">{i.item_measurement}</Descriptions.Item>
                            <Descriptions.Item label="Physical Location">{i.item_location}</Descriptions.Item>
                            <Descriptions.Item label="Reorder Quantity">{i.item_reorder}</Descriptions.Item>
                          </Descriptions>
                          <Row style={{margin: "20px 0 10px 0"}}><Tag color="blue"><p className="medium-font" style={{color: "#318CE7"}}>{i.item_category}</p></Tag></Row>
                          <Row><p className="medium-font">{i.item_description}</p></Row>
                        </Col>
                        <Col span={9}>
                          <div className="flex-end-row" style={{alignItems: "flex-end"}}>
                            <QRCode size={256} style={{height: "auto", width: "85%"}} value={i.item_code} />
                          </div>
                        </Col>
                      </div>
                    </Row>
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