import React, { useState } from 'react';
import axios from 'axios';
import { Button, Steps, Row, Card, Typography, Input, List, Table, InputNumber, Tooltip, Empty, Col, Badge, Avatar } from 'antd';
import { AppstoreAddOutlined, ShoppingCartOutlined } from '@ant-design/icons';
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
  const [current, setCurrent] = useState(0);
  const [itemList, setItemList] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [inputStatus, setInputStatus] = useState("");
  const next = () => {setCurrent(current + 1);};
  const prev = () => {setCurrent(current - 1);};
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
          <Button shape="circle" icon={<AppstoreAddOutlined className="big-card-title" style={{color:"#318CE7", fontWeight: "700",}} onClick={() => addItems(itemDetails["0"]["code"])} />} />
        </Tooltip>,
    },
  ];

  const steps = [
    {
      title: 'Add Item',
      content:
        <Row>
          <div style={{flexDirection: "column", width: "100%"}}>
            <Card>
              <Input.Search size="large" placeholder="Search Item Code" onChange={clearSearch} onSearch={searchItem} enterButton={<Button type="primary" className="custom-hover">SEARCH</Button>} />
            </Card>
            <Card className="card-no-top-padding" style={{marginTop: "10px"}}>
              {componentSwitch(checkResult())}
            </Card>
          </div>
        </Row>,
    },
    {
      title: 'Confirm',
      content: '',
    },
    {
      title: 'Submit',
      content: '',
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

  function addItems(item) {
    if (totalCost !== "") {
      const newItemList = itemList;
      if (!newItemList.includes(item)) {
        newItemList.push(item);
      }
      setItemList(newItemList);
      setItemCount(newItemList.length);
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
    setTotalCost(parseFloat(itemDetails["0"]["cost"]) * value);
  };

  function componentSwitch(key) {
    switch (key) {
      case true:
        return (<><Table className="light-color-header-table" id="thead-text-align-left" rowClassName={() => "table-row-no-color text-align-left"} style={{marginTop: "43px"}} columns={columns} dataSource={items} size="small" pagination={false} /></>);
      case false:
        return (<><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></>);
      default:
        break;
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
              <div style={{margin: "40px", marginTop: "2%", width: "70%"}}>
                <Card size="large" extra={<Steps current={current} />} title={
                  <Title>
                    <Row><p className="big-card-title">Reorder Stock</p></Row>
                  </Title>} hoverable>
                  <div style={contentStyle}>{steps[current].content}</div>
                  <div style={{marginTop: 24}}>
                    <Row>
                      <Col span={19}>
                        {current < steps.length - 1 && (<Button size="large" type="primary" style={{margin: "10px 10px 0 0"}} onClick={() => next()}>NEXT</Button>)}
                        {current === steps.length - 1 && (<Button size="large" type="primary" style={{margin: "10px 10px 0 0"}}>SUBMIT</Button>)}
                        {current > 0 && (<Button size="large" type="primary" style={{margin: "10px 0 0 10px"}} onClick={() => prev()}>PREVIOUS</Button>)}
                      </Col>
                      <Col span={4} style={{display: "flex", justifyContent: "flex-end", alignItems: "flex-end"}}>
                        <Tooltip title="Cart Item">
                          <Badge count={itemCount} color="#318CE7">
                            <Avatar shape="square" size="large" style={{backgroundColor: "#318CE7"}} icon={<ShoppingCartOutlined className="big-card-title" style={{color:"#FFF", fontWeight: "800",}} onClick={showDrawer} />} />
                          </Badge>
                        </Tooltip>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </div>
            </div>
          </Row>
        </Card>
      </Row>
      <DrawerEvent showDrawer={openDrawer} onCloseDrawer={onCloseDrawer} itemcode="" col={props.col} comp="CartItem"></DrawerEvent>
    </>
  );

};

export default Reorder;