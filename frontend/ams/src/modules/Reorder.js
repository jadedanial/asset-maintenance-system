import React, { useState } from 'react';
import axios from 'axios';
import { Button, Row, Card, Typography, Input, List, Table, InputNumber, Tooltip, Empty, Badge, Avatar } from 'antd';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import DrawerEvent from '../components/DrawerEvent';

const { Title } = Typography;

const cardlayout = {
  bordered: true,
  hoverable: true,
  size: "large",
  style:{width: "100%", minHeight: "calc(100vh - 106px)"},
};

const Reorder = (props) => {

  const [itemDetails, setItemDetails] = useState({"0":{"code":"", "name":"", "cost":""}});
  const [totalCost, setTotalCost] = useState("");
  const [quantity, setQuantity] = useState("");
  const [itemList, setItemList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [inputStatus, setInputStatus] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);

  const data = [
    {
      name: <p className="medium-font">{itemDetails["0"]["name"]}</p>,
      code: <p className="small-font">{itemDetails["0"]["code"]}</p>,
    },
  ];

  const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      width: '52%',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '26%',
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      width: '20%',
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      width: '2%',
    },
  ];

  const items = [
    {
      item:
        <List itemLayout="horizontal" dataSource={data} renderItem={(item, index) => (
          <List.Item style={{padding: "0"}}><List.Item.Meta title={item.name} description={item.code} /></List.Item>)}
        />,
      quantity: <InputNumber status={inputStatus} min={1} max={1000000} onChange={onQuantityChange} />,
      cost: <p className="big-font" style={{fontWeight: "500"}}>{totalCost}</p>,
      action:
        <Tooltip title="Add To Cart">
          <Button shape="circle" icon={<PlusOutlined className="big-card-title" style={{color:"#318CE7", fontWeight: "700",}}
          onClick={() => addItems(itemDetails["0"]["name"], itemDetails["0"]["code"], itemDetails["0"]["measurement"], quantity)} />} />
        </Tooltip>,
    },
  ];

  const contentStyle = {
    lineHeight: "260px",
    color: "#FFF",
    backgroundColor: "#FFF",
    marginTop: 16,
  };

  function searchItem(value) {
    axios.get('http://localhost:8000/api/items')
    .then(response => {
      response.data.map(res => (res.item_code === value.toUpperCase() ?
        setItemDetails([{
          code : res.item_code,
          name : res.item_name,
          cost : res.item_cost,
          measurement : res.item_measurement,
        }]):{}
      ))
    });
    checkResult();
  };

  function checkResult() {
    if(itemDetails["0"]["code"] !== "") {
      return true;
    } else {
      return false;
    }
  };

  function addItems(name, code, measurement, quantity) {
    if (totalCost !== "") {
      const newItem = itemList;
      const newOrder = orderList;
      if (!newItem.includes(code)) {
        newItem.push(code);
      } else {
        const matchItem = newOrder.find(order => order.code === code);
        var index = newOrder.indexOf(matchItem);
        if (index > -1) {newOrder.splice(index, 1);}
      }
      newOrder.push({"name": name, "code": code, "cost": totalCost, "quantity": "Qty. " + quantity + " " + measurement})
      setItemList(newItem);
      setOrderList(newOrder);
      setItemCount(newItem.length);
      setInputStatus("");
    } else {
      setInputStatus("error");
    }
  };

  function clearSearch() {
    setItemDetails({"0":{"code":"", "name":"", "cost":""}});
    setTotalCost("");
  };

  function onQuantityChange(value) {
    setTotalCost((parseFloat(itemDetails["0"]["cost"]) * value).toFixed(2));
    setQuantity(value);
  };

  function componentSwitch(key) {
    switch (key) {
      case true:
        return (<><Table className="light-color-header-table" id="thead-text-align-left"
          rowClassName={() => "table-row-no-color text-align-left"} style={{margin: "21px 0"}}
          columns={columns} dataSource={items} size="small" pagination={false} /></>);
      case false:
        return (<><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></>);
      default:
        break;
    }
  };

  function orderLength() {
    if (itemCount > 1) {
      return "Cart Items";
    } else {
      return "Cart Item";
    }
  };

  function showDrawer() {
    setOpenDrawer(true);
  };

  function onCloseDrawer() {
    setOpenDrawer(false);
  };

  return (
    <>
      <Row>
        <Card {...cardlayout}>
          <Row>
            <div className="justified-row">
              <div className="card-custom-size">
                <Card size="large" extra={
                  <Tooltip title={orderLength()}>
                    <Badge count={itemCount} color="#318CE7">
                      <Avatar shape="square" size="middle" style={{backgroundColor: "#318CE7"}} icon={<ShoppingCartOutlined
                      className="large-card-title" style={{color:"#FFF"}} onClick={showDrawer} />} />
                    </Badge>
                  </Tooltip>} title={
                  <Title>
                    <Row><p className="big-card-title" style={{width: "60%", textWrap: "wrap"}}>Reorder Stock</p></Row>
                  </Title>} hoverable>
                  <div style={contentStyle}>
                    <Row>
                      <div style={{flexDirection: "column", width: "100%"}}>
                        <Card>
                          <Input.Search size="large" placeholder="Search Item Code" onChange={clearSearch} onSearch={searchItem}
                          enterButton={<Button type="primary" className="custom-hover">SEARCH</Button>} />
                        </Card>
                        <Card className="card-no-top-padding" style={{marginTop: "10px"}}>
                          {componentSwitch(checkResult())}
                        </Card>
                      </div>
                    </Row>
                  </div>
                </Card>
              </div>
            </div>
          </Row>
        </Card>
      </Row>
      <DrawerEvent showDrawer={openDrawer} onCloseDrawer={onCloseDrawer} orderList={orderList} col={props.col} comp="CartItem"></DrawerEvent>
    </>
  );

};

export default Reorder;