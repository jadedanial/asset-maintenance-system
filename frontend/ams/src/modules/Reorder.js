import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Typography,
  Input,
  List,
  Table,
  InputNumber,
  Tooltip,
  Empty,
  Badge,
  Avatar,
  notification,
} from "antd";
import {
  AppstoreAddOutlined,
  ShoppingCartOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import DrawerEvent from "../components/DrawerEvent";

const { Title } = Typography;

const cardlayout = {
  bordered: true,
  hoverable: true,
  size: "large",
  style: { width: "100%", minHeight: "calc(100vh - 106px)" },
};

const Reorder = (props) => {
  const [itemDetails, setItemDetails] = useState({
    0: { id: "", code: "", name: "", cost: "", measurement: "" },
  });
  const [total, setTotal] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [inputStatus, setInputStatus] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const data = [
    {
      name: (
        <p className="medium-font" style={{ textAlign: "center" }}>
          {itemDetails["0"]["name"]}
        </p>
      ),
    },
  ];

  const columns = [
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      width: "52%",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "26%",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      width: "20%",
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      width: "2%",
    },
  ];

  const items = [
    {
      item: (
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item style={{ padding: "0" }}>
              <List.Item.Meta title={item.name} description={item.code} />
            </List.Item>
          )}
        />
      ),
      quantity: (
        <InputNumber
          status={inputStatus}
          min={1}
          max={1000000}
          onChange={onQuantityChange}
        />
      ),
      cost: (
        <p className="big-font" style={{ textAlign: "center" }}>
          {total}
        </p>
      ),
      action: (
        <Tooltip title="Add To Cart">
          <Button
            icon={
              <AppstoreAddOutlined
                className="bigger-card-title"
                style={{ color: "#318ce7" }}
                onClick={() =>
                  newItem(
                    itemDetails["0"]["id"],
                    itemDetails["0"]["code"],
                    itemDetails["0"]["name"],
                    itemDetails["0"]["cost"],
                    itemDetails["0"]["measurement"],
                    quantity,
                    "topRight"
                  )
                }
              />
            }
          />
        </Tooltip>
      ),
    },
  ];

  const contentStyle = {
    lineHeight: "260px",
    color: "#fff",
    backgroundColor: "#fff",
    marginTop: 16,
  };

  async function searchItem(value) {
    try {
      await axios
        .get("http://localhost:8000/api/items", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          response.data.map((res) =>
            res.item_code === value.toUpperCase()
              ? setItemDetails([
                  {
                    id: res.id,
                    code: res.item_code,
                    name: res.item_name,
                    cost: res.item_cost,
                    measurement: res.item_measurement,
                  },
                ])
              : {}
          );
        });
      checkResult();
    } catch (err) {
      console.log(err.response.data[0]);
    }
  }

  function checkResult() {
    if (itemDetails["0"]["code"] !== "") {
      return true;
    } else {
      return false;
    }
  }

  function clearOrder() {
    setOrderList([]);
    setItemCount(0);
  }

  function addItem(id, code, name, cost, measurement, quantity, tot) {
    const newOrder = orderList;
    newOrder.push({
      id: id,
      item_code: code,
      item_name: name,
      item_cost: cost,
      item_measurement: measurement,
      item_onhand: quantity,
      total: tot,
    });
    setOrderList(newOrder);
    orderList.sort(function (a, b) {
      return a.id - b.id;
    });
    setItemCount(orderList.length);
  }

  function removeItem(code) {
    const newOrder = orderList;
    const matchItem = newOrder.find((order) => order.item_code === code);
    var index = newOrder.indexOf(matchItem);
    if (index > -1) {
      newOrder.splice(index, 1);
    }
    setOrderList(newOrder);
    orderList.sort(function (a, b) {
      return a.id - b.id;
    });
    setItemCount(orderList.length);
  }

  function newItem(id, code, name, cost, measurement, quantity, placement) {
    if (total !== "") {
      removeItem(code);
      addItem(id, code, name, cost, measurement, quantity, total);
      setInputStatus("");
      api.success({
        message: <p className="medium-card-title">Notification</p>,
        description: <p className="small-font">Item {code} added to Cart.</p>,
        placement,
        duration: 2,
        icon: <CheckSquareOutlined style={{ color: "#318ce7" }} />,
      });
    } else {
      setInputStatus("error");
    }
  }

  function clearSearch() {
    setItemDetails({
      0: { id: "", code: "", name: "", cost: "", measurement: "" },
    });
    setTotal("");
  }

  function onQuantityChange(value) {
    setTotal((parseFloat(itemDetails["0"]["cost"]) * value).toFixed(2));
    setQuantity(value);
  }

  function componentSwitch(key) {
    switch (key) {
      case true:
        return (
          <>
            <Table
              className="light-color-header-table"
              id="reorder-item-center"
              rowClassName={() => "table-row-no-color text-align-left"}
              style={{ margin: "21px 0" }}
              columns={columns}
              dataSource={items}
              size="small"
              pagination={false}
            />
          </>
        );
      case false:
        return (
          <>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </>
        );
      default:
        break;
    }
  }

  function showDrawer() {
    setOpenDrawer(true);
  }

  function onCloseDrawer() {
    setOpenDrawer(false);
  }

  return (
    <>
      {contextHolder}
      <Card {...cardlayout}>
        <div className="justified-row">
          <div className="card-custom-size">
            <Card
              size="large"
              extra={
                <Tooltip
                  title={
                    itemCount > 1
                      ? "Cart (" + itemCount.toString() + " Items)"
                      : "Cart (" + itemCount.toString() + " Item)"
                  }
                >
                  <Badge count={itemCount} color="#318ce7">
                    <Avatar
                      shape="square"
                      size="middle"
                      style={{ backgroundColor: "#318ce7" }}
                      icon={
                        <ShoppingCartOutlined
                          className="large-card-title"
                          style={{ color: "#fff" }}
                          onClick={showDrawer}
                        />
                      }
                    />
                  </Badge>
                </Tooltip>
              }
              title={
                <Title>
                  <p
                    className="big-card-title"
                    style={{ width: "60%", textWrap: "wrap" }}
                  >
                    Reorder Stock
                  </p>
                </Title>
              }
              hoverable
            >
              <div style={contentStyle}>
                <div style={{ flexDirection: "column", width: "100%" }}>
                  <Card>
                    <Input.Search
                      size="large"
                      placeholder="Search Item Code"
                      onChange={clearSearch}
                      onSearch={searchItem}
                      enterButton={
                        <Button type="primary" className="custom-hover">
                          SEARCH
                        </Button>
                      }
                    />
                  </Card>
                  <Card
                    className="card-no-top-padding"
                    style={{ marginTop: "10px" }}
                  >
                    {componentSwitch(checkResult())}
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>
      <DrawerEvent
        addItem={addItem}
        removeItem={removeItem}
        itemCount={itemCount}
        orderList={orderList}
        clearOrder={clearOrder}
        showDrawer={openDrawer}
        onCloseDrawer={onCloseDrawer}
        col={props.col}
        comp="CartItem"
      ></DrawerEvent>
    </>
  );
};

export default Reorder;
