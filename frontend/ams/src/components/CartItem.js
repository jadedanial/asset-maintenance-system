import { Typography, Card, Row, Col, List, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CartItem = (props) => {

  const data = [
    {
      avatar: '2355486.75',
      title: 'Samsung Super Fast Charger',
      description: 'ITM000412',
    },
    {
      avatar: '105.00',
      title: 'Xiaomi Smart Watch',
      description: 'ITM000115',
    },
    {
      avatar: '1435.60',
      title: 'Iphone 5s Pro Max Fully Paid Na This Edi Wow',
      description: 'ITM00556',
    },
  ];

  return (
    <>
      <div className="justified-row">
        <div style={{margin: "40px", marginTop: "2%", width: "65%"}}>
          <Card size="large" title={<Title><p className="big-card-title" style={{color: "#318CE7"}}>Cart Items</p></Title>} hoverable>
            <List itemLayout="horizontal" dataSource={data} renderItem={(item, index) => (
              <List.Item>
                <Card style={{width: "100%"}}>
                  <Row>
                    <Col span={12}>
                      <List.Item.Meta title={<p className="medium-font">{item.title}</p>} description={<p className="small-font">{item.description}</p>} />
                    </Col>
                    <Col span={5} style={{margin: "0 30px"}}>
                      <Row><List.Item.Meta avatar={<p className="big-font">{item.avatar}</p>} /></Row>
                      <Row><p className="small-font">Qty. 246</p></Row>
                    </Col>
                    <Col span={2}>
                      <Button shape="circle" icon={<EditOutlined className="big-card-title" style={{color:"#318CE7", fontWeight: "700",}} />} />
                    </Col>
                    <Col span={2}>
                      <Button shape="circle" icon={<DeleteOutlined className="big-card-title" style={{color:"#318CE7", fontWeight: "700",}} />} />
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}/>
          </Card> 
        </div>
      </div>
    </>
  );

};

export default CartItem;