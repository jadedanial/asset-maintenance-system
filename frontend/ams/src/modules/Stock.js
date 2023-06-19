import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Card, Button, Select, Tooltip, Table } from 'antd';
import { ShoppingOutlined, } from '@ant-design/icons';
import DrawerEvent from '../components/DrawerEvent';

const cardlayout = {
  bordered: true,
  hoverable: true,
  size: "large",
  style:{width: "100%"},
};

const Stock = (props) => {

  const [openDrawer, setOpenDrawer] = useState(false);
  const [compItem, setCompItem] = useState(0);
  const [items, setItems] = useState([]);
  const [itemCode, setItemCode] = useState(0);

  const columns = [
    {
      title: 'Item Code',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Physical Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Unit Of Measurement',
      dataIndex: 'measurement',
      key: 'measurement',
    },
    {
      title: 'Reorder Quantity',
      dataIndex: 'reorder',
      key: 'reorder',
    },
    {
      title: 'Quantity On Hand',
      dataIndex: 'onhand',
      key: 'onhand',
    },
    {
      title: 'Unit Cost',
      dataIndex: 'cost',
      key: 'cost',
    },
    {
      title: 'Inventory Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  useEffect(() => {
    loadItems();
  },[]);

  function loadItems() {
    axios.get('http://localhost:8000/api/items')
    .then(response => {
      setItems([]);
      response.data.map(res => (
        setItems(items => [...items,
          {
            item: res.item_code,
            name: res.item_name,
            category: res.item_category,
            location: res.item_location,
            measurement: res.item_measurement,
            reorder: res.item_reorder,
            onhand: res.item_onhand,
            cost: res.item_cost,
            value: res.item_cost * res.item_onhand,
          }
        ])
      ))
    });
  };

  function showDrawer() {
    setOpenDrawer(true);
  };

  function onCloseDrawer() {
    setOpenDrawer(false);
    loadItems();
  };

  return (
    <>
      <Row>
        <Card {...cardlayout}>
          <Row>
            <Col span={24}>
              <Card size="small" style={{background: "#318CE7", width: "100%"}}>
                <Row>
                  <Col span={2}>
                    <Tooltip title="Add New Item"><Button type="primary" shape="circle" className="custom-hover" style={{margin: "0 20px"}} onClick={() => {showDrawer(); setCompItem("AddUpdateItem")}} icon={<ShoppingOutlined />} /></Tooltip>
                  </Col>
                  <Col span={19}>
                    <Select className="small-font" showSearch style={{width: "100%"}} optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />  
                  </Col>
                  <Col span={2}>
                    <Button size="middle" type="primary" className="custom-hover" style={{margin: "0 20px"}} block>SEARCH</Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row style={{marginTop: "50px"}}>
            <Col span={24}>
              <Table className="light-color-header-table" rowClassName={() => "table-row"} columns={columns} dataSource={items}
              onRow={(rowIndex) => {return {onClick: (event) => {showDrawer(); setItemCode(rowIndex.item); setCompItem("ItemDetail")},};}} pagination={{pageSize: 10, showSizeChanger: true,
              pageSizeOptions: ['10', '20', '30']}} size="small" />
            </Col>
          </Row>
        </Card>
      </Row>
      <DrawerEvent showDrawer={openDrawer} onCloseDrawer={onCloseDrawer} itemcode={itemCode} col={props.col} comp={compItem}></DrawerEvent>
    </>
  );

};

export default Stock;