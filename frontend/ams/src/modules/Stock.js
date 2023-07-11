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
          String(record.category).toLowerCase().includes(value.toLowerCase()) ||
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
      title: "Category",
      dataIndex: "category",
      key: "category",
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
              category: res.item_category,
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
      <Card {...cardlayout}>
        <Col span={24}>
          <Card size="small" style={{ background: "#318CE7", width: "100%" }}>
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
                  placeholder="Search Employee"
                  suffix={
                    <SearchOutlined
                      style={{ fontSize: "26px", color: "#318CE7" }}
                    />
                  }
                  onChange={(e) => setSearchedText(e.target.value)}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Row style={{ marginTop: "20px" }}>
          <Col span={24}>
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
        </Row>
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
