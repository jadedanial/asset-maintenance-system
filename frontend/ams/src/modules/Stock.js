import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Row, Card, Button, Input, Tooltip, Table } from "antd";
import { SearchOutlined, ShoppingOutlined } from "@ant-design/icons";
import DrawerEvent from "../components/DrawerEvent";

const cardlayout = {
  bordered: true,
  hoverable: true,
  size: "large",
  style: { width: "100%", minHeight: "calc(100vh - 106px)" },
};

const Stock = (props) => {
  const [searchedtext, setSearchedText] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [compItem, setCompItem] = useState("");
  const [items, setItems] = useState([]);
  const [itemCode, setItemCode] = useState(0);

  const columns = [
    {
      title: "Item Code",
      dataIndex: "code",
      key: "code",
      filteredValue: [searchedtext],
      onFilter: (value, record) => {
        return (
          String(record.code).toLowerCase().includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.location).toLowerCase().includes(value.toLowerCase()) ||
          String(record.measurement).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Physical Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Unit Of Measurement",
      dataIndex: "measurement",
      key: "measurement",
    },
    {
      title: "Reorder Quantity",
      dataIndex: "reorder",
      key: "reorder",
    },
    {
      title: "Quantity On Hand",
      dataIndex: "onhand",
      key: "onhand",
    },
    {
      title: "Unit Cost",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Inventory Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      await axios.get("http://localhost:8000/api/items").then((response) => {
        setItems([]);
        response.data.map((res) =>
          setItems((items) => [
            ...items,
            {
              code: res.item_code,
              name: res.item_name,
              location: res.item_location,
              measurement: res.item_measurement,
              reorder: res.item_reorder,
              onhand: res.item_onhand,
              cost: res.item_cost,
              value: (res.item_cost * res.item_onhand).toFixed(2),
            },
          ])
        );
      });
    } catch (err) {
      console.log(err.response.data[0]);
    }
  }

  function showDrawer() {
    setOpenDrawer(true);
  }

  function onCloseDrawer() {
    setOpenDrawer(false);
    loadItems();
  }

  return (
    <>
      <Card {...cardlayout} className="card-no-top-padding">
        <Col span={24} style={{ position: "sticky", top: "87px", zIndex: "1" }}>
          <div style={{ height: "24px", backgroundColor: "#fff" }}></div>
          <div
            style={{
              background: "#318ce7",
              width: "100%",
              height: "65px",
              padding: "12px",
            }}
          >
            <Row>
              <Col span={2}>
                <Tooltip title="Add New Item">
                  <Button
                    type="primary"
                    shape="circle"
                    className="custom-hover"
                    style={{ margin: "0 20px" }}
                    onClick={() => {
                      showDrawer();
                      setCompItem("AddUpdateItem");
                    }}
                    icon={<ShoppingOutlined />}
                  />
                </Tooltip>
              </Col>
              <Col span={22}>
                <Input
                  size="large"
                  placeholder="Search Item"
                  suffix={
                    <SearchOutlined
                      style={{ fontSize: "26px", color: "#318ce7" }}
                    />
                  }
                  onChange={(e) => setSearchedText(e.target.value)}
                />
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={24}>
          <div
            style={{
              height: "20px",
              backgroundColor: "#fff",
              position: "sticky",
              top: "176px",
              zIndex: "1",
            }}
          ></div>
          <Table
            className="light-color-header-table"
            rowClassName={() => "table-row"}
            columns={columns}
            dataSource={items}
            onRow={(rowIndex) => {
              return {
                onClick: (event) => {
                  showDrawer();
                  setItemCode(rowIndex.code);
                  setCompItem("ItemDetail");
                },
              };
            }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "30"],
            }}
            size="small"
          />
        </Col>
      </Card>
      <DrawerEvent
        itemcode={itemCode}
        showDrawer={openDrawer}
        onCloseDrawer={onCloseDrawer}
        col={props.col}
        comp={compItem}
      ></DrawerEvent>
    </>
  );
};

export default Stock;
