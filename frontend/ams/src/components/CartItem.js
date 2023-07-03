import { Typography, Card, Row, Col, List, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const CartItem = (props) => {

  function orderLength() {
    if (props.orderList.length > 1) {
      return "Cart Items";
    } else {
      return "Cart Item";
    }
  };

  return (
    <>
      <div className="justified-row">
        <div className="card-custom-size">
          <Card size="large" title={<Title><p className="big-card-title" style={{color: "#318CE7"}}>{orderLength()}</p></Title>} hoverable>
            <List itemLayout="horizontal" dataSource={props.orderList} renderItem={(item, index) => (
              <List.Item>
                <Card style={{width: "100%"}} hoverable>
                  <Row>
                    <Col span={12}>
                      <List.Item.Meta title={<p className="medium-font" style={{color: "#318CE7"}}>{item.name}</p>} description={<p className="small-font">{item.code}</p>} />
                    </Col>
                    <Col span={5} style={{margin: "0 30px"}}>
                      <Row><List.Item.Meta avatar={<p className="medium-card-title">{item.cost}</p>} /></Row>
                      <Row><p className="small-font">{item.quantity}</p></Row>
                    </Col>
                    <Col span={2} className="flex-end-row">
                      <Tooltip title="Update Quantity">
                        <Button shape="circle" icon={<EditOutlined className="big-card-title" style={{color:"#318CE7", fontWeight: "700",}} />} />
                      </Tooltip>
                    </Col>
                    <Col span={2} className="flex-end-row">
                      <Tooltip title="Remove Item">
                        <Button shape="circle" icon={<DeleteOutlined className="big-card-title" style={{color:"#318CE7", fontWeight: "700",}} />} />
                      </Tooltip>
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