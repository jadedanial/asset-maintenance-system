import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Row, Card, Button, Input, Tooltip, Table } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import DrawerEvent from "../components/DrawerEvent";

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
          String(record.name).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "40%",
    },
    {
      title: "On Hand",
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
    (async () => {
      await loadItems();
    })();
  }, []);

  async function loadItems() {
    try {
      await axios({
        method: "GET",
        url: "http://localhost:8000/api/items",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((response) => {
        setItems([]);
        response.data.map((res) =>
          setItems((items) => [
            ...items,
            {
              code: res.item_code,
              name: res.item_name,
              onhand: res.item_onhand,
              cost: res.item_cost,
              value: (res.item_cost * res.item_onhand).toFixed(2),
            },
          ])
        );
      });
    } catch (err) {
      console.log(err);
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
      <Card
        size="large"
        className="card-no-top-padding card-main-layout"
        bordered
        hoverable
      >
        <div span={24} style={{ position: "sticky", top: "87px", zIndex: "1" }}>
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
                    className="custom-hover"
                    style={{ margin: "0 20px" }}
                    shape="circle"
                    size="large"
                    type="primary"
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
                  onChange={(e) => setSearchedText(e.target.value)}
                />
              </Col>
            </Row>
          </div>
        </div>
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
            showSizeChanger: false,
          }}
          size="small"
          scroll={{
            y: "50vh",
          }}
        />
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
