import React, { useState } from "react";
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
  const [itemDetails, setItemDetails] = useState({
    0: { id: "", code: "", name: "", cost: "", measurement: "" },
  });
  const [total, setTotal] = useState("");
  const [quantity, setQuantity] = useState("");
  const [item, setItem] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [inputStatus, setInputStatus] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  async function searchItem(value) {
    setItem(value);
    clearSearch();
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

  function newItem(id, code, name, cost, measurement, quantity) {
    if (total !== "0.00") {
      removeItem(code);
      addItem(id, code, name, cost, measurement, quantity, total);
      setInputStatus("");
      api.info(NotificationEvent(true, "Item " + code + " added to Cart."));
    } else {
      setInputStatus("error");
    }
  }

  function clearSearch() {
    setItemDetails({
      0: { id: "", code: "", name: "", cost: "", measurement: "" },
    });
    setTotal("0.00");
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
            <Row>
              <Col span={16} style={{ paddingTop: "20px" }}>
                <ItemDetail
                  itemcode={itemDetails["0"]["code"]}
                  mode={"view"}
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
                    itemDetails["0"]["id"],
                    itemDetails["0"]["code"],
                    itemDetails["0"]["name"],
                    itemDetails["0"]["cost"],
                    itemDetails["0"]["measurement"],
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
        item={item}
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
