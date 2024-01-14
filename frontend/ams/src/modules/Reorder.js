import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Typography,
  Input,
  Row,
  Col,
  InputNumber,
  Tooltip,
  Empty,
  Badge,
  Avatar,
  notification,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import DrawerEvent from "../components/DrawerEvent";
import ItemDetail from "../components/ItemDetail";
import NotificationEvent from "../components/NotificationEvent";

const { Title } = Typography;

const Reorder = (props) => {
  const [total, setTotal] = useState("");
  const [quantity, setQuantity] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [item, setItem] = useState([]);
  const [warehouseItem, setWarehouseItem] = useState({
    0: { id: "", code: "", name: "", cost: "", measurement: "" },
  });
  const [orderList, setOrderList] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [inputStatus, setInputStatus] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const fetchData = (url, setter) => {
    axios({
      method: "GET",
      url: url,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        setter(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function searchItem(value) {
    setItemCode(value);
    clearSearch();
    axios({
      method: "GET",
      url: "http://localhost:8000/api/warehouseitems",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        response.data.map((res) =>
          res.item_code === value.toUpperCase()
            ? res.warehouse_code === props.sectionCode
              ? item.map((i) =>
                  i.item_code === res.item_code
                    ? setWarehouseItem([
                        {
                          id: i.id,
                          code: i.item_code,
                          name: i.item_name,
                          cost: i.item_cost,
                          measurement: i.item_measurement,
                        },
                      ])
                    : ""
                )
              : ""
            : ""
        );
        checkResult();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function checkResult() {
    if (warehouseItem["0"]["code"] !== "") {
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

  function newItem(id, code, name, cost, measurement, quantity) {
    if (total !== "0.00") {
      removeItem(code);
      addItem(id, code, name, cost, measurement, quantity, total);
      setInputStatus("");
      api.info(NotificationEvent(true, "Item " + code + " added to cart."));
    } else {
      setInputStatus("error");
    }
  }

  function clearSearch() {
    setWarehouseItem({
      0: { id: "", code: "", name: "", cost: "", measurement: "" },
    });
    setTotal("0.00");
  }

  function onQuantityChange(value) {
    setTotal((parseFloat(warehouseItem["0"]["cost"]) * value).toFixed(2));
    setQuantity(value);
  }

  function componentSwitch(key) {
    switch (key) {
      case true:
        return (
          <>
            <Row>
              <Col span={16} style={{ paddingTop: "20px" }}>
                <ItemDetail
                  itemcode={warehouseItem["0"]["code"]}
                  mode="view"
                  sectionCode={props.sectionCode}
                ></ItemDetail>
              </Col>
              <Col
                span={8}
                className="flex-end-col align-items-start"
                style={{
                  padding: "0 0 0 20px",
                }}
              >
                <p
                  className="big-font"
                  style={{ fontWeight: "800", paddingBottom: "20px" }}
                >
                  Php. {total}
                </p>
                <InputNumber
                  status={inputStatus}
                  min={1}
                  max={1000000}
                  onChange={onQuantityChange}
                  addonBefore={<p className="medium-card-title">Qty.</p>}
                />
              </Col>
            </Row>
            <div style={{ paddingTop: "30px" }}>
              <Button
                size="large"
                type="primary"
                onClick={() =>
                  newItem(
                    warehouseItem["0"]["id"],
                    warehouseItem["0"]["code"],
                    warehouseItem["0"]["name"],
                    warehouseItem["0"]["cost"],
                    warehouseItem["0"]["measurement"],
                    quantity,
                    "topRight"
                  )
                }
                block
              >
                ADD TO CART
              </Button>
            </div>
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

  useEffect(() => {
    fetchData("http://localhost:8000/api/items", setItem);
  }, []);

  return (
    <>
      {contextHolder}
      <Card size="large" className="card-main-layout" bordered hoverable>
        <div className="justified-row">
          <div className="card-custom-size" style={{ marginBottom: "0" }}>
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
                  <Badge count={itemCount} color="#318ce7" onClick={showDrawer}>
                    <Avatar
                      className="avatar-btn"
                      shape="square"
                      size="large"
                      style={{
                        backgroundColor: "#318ce7",
                        cursor: "pointer",
                        width: "50px",
                        borderRadius: "5px",
                      }}
                      icon={
                        <ShoppingCartOutlined
                          className="big-card-title"
                          style={{ color: "#fff" }}
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
                    Reorder
                  </p>
                </Title>
              }
              hoverable
            >
              <Input
                size="large"
                placeholder="Search Item Code"
                onChange={(e) => searchItem(e.target.value)}
              />
              {componentSwitch(checkResult())}
            </Card>
          </div>
        </div>
      </Card>
      <DrawerEvent
        searchItem={searchItem}
        item={itemCode}
        addItem={addItem}
        removeItem={removeItem}
        itemCount={itemCount}
        orderList={orderList}
        clearOrder={clearOrder}
        showDrawer={openDrawer}
        onCloseDrawer={onCloseDrawer}
        col={props.col}
        comp="CartItem"
        empid={props.empid}
        username={props.username}
      ></DrawerEvent>
    </>
  );
};

export default Reorder;
