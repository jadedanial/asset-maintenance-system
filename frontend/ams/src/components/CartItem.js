import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, Col, List, Button, Tooltip } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  CloseOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import ResultEvent from "../components/ResultEvent";
import moment from "moment";

const { Title } = Typography;

const CartItem = (props) => {
  const [totalOrder, setTotalOrder] = useState("0.00");
  const [itemCount, setItemCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [transactionID, setTransactionID] = useState("");

  useEffect(() => {
    sumOrder();
  }, []);

  function changeQuantity(action, id, code, name, cost, measurement, quantity) {
    if (quantity >= 1) {
      if (action === "add") {
        quantity += 1;
      } else {
        if (quantity !== 1) {
          quantity -= 1;
        }
      }
      var total = parseFloat(cost * quantity).toFixed(2);
      props.removeItem(code);
      props.addItem(id, code, name, cost, measurement, quantity, total);
    }
    sumOrder();
  }

  function deleteItem(code) {
    props.removeItem(code);
    sumOrder();
  }

  function sumOrder() {
    setTotalOrder("0.00");
    const sum = props.orderList.reduce(
      (acc, item) => parseFloat(acc) + parseFloat(item.total),
      0
    );
    setTotalOrder(sum.toFixed(2));
  }

  function transactionDetail() {
    var details = "";
    Object.values(props.orderList).forEach(
      (val) =>
        (details +=
          "Item: " +
          val["item_code"] +
          ", Name: " +
          val["item_name"] +
          ", Cost: " +
          val["item_cost"] +
          ", Quantity: " +
          val["item_onhand"] +
          ", Total: " +
          val["total"] +
          "\n")
    );
    return details;
  }

  async function addTransaction() {
    var transactionData = {
      trans_id: "",
      trans_type: "Reorder Item",
      trans_action: "Add",
      trans_date: moment().format("YYYY-MM-DD HH:mm:ss"),
      trans_user: String(props.empid) + " - " + props.username,
      trans_detail: transactionDetail(),
    };
    try {
      await axios({
        method: "POST",
        url: "http://localhost:8000/api/transaction/",
        data: transactionData,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((response) => {
        setTransactionID(response.data["trans_id"]);
      });
    } catch (err) {
      console.log(err);
      setSuccess(false);
    }
  }

  async function checkoutOrder() {
    try {
      await axios({
        method: "PUT",
        url: "http://localhost:8000/api/item/",
        data: props.orderList,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setItemCount(props.itemCount);
      setSuccess(true);
      addTransaction();
      props.clearOrder();
      props.searchItem(props.item);
    } catch (err) {
      console.log(err);
      setSuccess(false);
    }
  }

  if (success) {
    return (
      <>
        <ResultEvent
          icon={<CheckCircleOutlined style={{ color: "#318ce7" }} />}
          status="success"
          title={
            itemCount > 1
              ? "Successfully added Items to inventory."
              : "Successfully added Item to inventory."
          }
          subTitle={"Transaction ID " + String(transactionID)}
          extra={[
            <Button size="large" type="primary" onClick={props.onCloseDrawer}>
              REORDER ANOTHER ITEM
            </Button>,
          ]}
        />
      </>
    );
  }

  return (
    <>
      <div className="justified-row">
        <div className="card-custom-size">
          <Card
            size="large"
            extra={
              totalOrder > 0.0 ? (
                <div className="space-between-row">
                  <Button
                    size="large"
                    type="default"
                    style={{
                      marginRight: "10px",
                    }}
                    onClick={props.onCloseDrawer}
                    block
                  >
                    ADD ITEM
                  </Button>
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => checkoutOrder()}
                    block
                  >
                    CHECK OUT
                  </Button>
                </div>
              ) : (
                ""
              )
            }
            title={
              <Title>
                <p className="big-card-title" style={{ color: "#318ce7" }}>
                  Cart ({props.itemCount}
                  {props.itemCount > 1 ? " Items" : " Item"})
                </p>
              </Title>
            }
            hoverable
          >
            {totalOrder > 0.0 ? (
              <Card
                size="small"
                id="card-content-justify-center"
                style={{
                  padding: "10px 20px",
                  fontWeight: "800",
                }}
              >
                <div className="space-between-row">
                  <p className="large-font">Total Cost</p>
                  <p className="large-font">Php. {totalOrder}</p>
                </div>
              </Card>
            ) : (
              ""
            )}
            <List
              itemLayout="horizontal"
              dataSource={props.orderList}
              renderItem={(item, index) => (
                <List.Item>
                  <Card
                    size="small"
                    id="card-content-justify-center"
                    title={
                      <Title>
                        <div
                          className="space-between-row align-items-center"
                          style={{ height: "25px" }}
                        >
                          <Col span={10}>
                            <p className="medium-card-title">
                              {item.item_code}
                            </p>
                          </Col>
                          <Col span={8}>
                            <p className="medium-card-title">Quantity</p>
                          </Col>
                          <Col
                            span={6}
                            className="space-between-row"
                            style={{ paddingBottom: "15px" }}
                          >
                            <Col span={8}>
                              <Tooltip>
                                <Button
                                  className="btn-blue"
                                  type="link"
                                  onClick={() =>
                                    changeQuantity(
                                      "add",
                                      item.id,
                                      item.item_code,
                                      item.item_name,
                                      item.item_cost,
                                      item.item_measurement,
                                      item.item_onhand
                                    )
                                  }
                                >
                                  <PlusOutlined className="medium-card-title" />
                                </Button>
                              </Tooltip>
                            </Col>
                            <Col span={8}>
                              <Tooltip>
                                <Button
                                  className="btn-blue"
                                  type="link"
                                  onClick={() =>
                                    changeQuantity(
                                      "less",
                                      item.id,
                                      item.item_code,
                                      item.item_name,
                                      item.item_cost,
                                      item.item_measurement,
                                      item.item_onhand
                                    )
                                  }
                                >
                                  <MinusOutlined className="medium-card-title" />
                                </Button>
                              </Tooltip>
                            </Col>
                            <Col span={8}>
                              <Tooltip>
                                <Button
                                  className="btn-blue"
                                  danger
                                  type="link"
                                  onClick={() => deleteItem(item.item_code)}
                                >
                                  <CloseOutlined className="large-card-title" />
                                </Button>
                              </Tooltip>
                            </Col>
                          </Col>
                        </div>
                      </Title>
                    }
                    style={{
                      width: "100%",
                      padding: "20px",
                      background: "#e6fcff",
                    }}
                    hoverable
                  >
                    <div
                      className="space-between-row"
                      style={{ alignItems: "center" }}
                    >
                      <Col span={8} style={{ marginRight: "30px" }}>
                        <p className="medium-font">{item.item_name}</p>
                      </Col>
                      <Col span={7}>
                        <p className="medium-font">
                          {item.item_onhand}{" "}
                          {item.item_onhand > 1
                            ? item.item_measurement + "s"
                            : item.item_measurement}
                        </p>
                      </Col>
                      <Col
                        span={6}
                        className="flex-end-row"
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <p
                          className="medium-font"
                          style={{ textAlign: "right" }}
                        >
                          {item.total}
                        </p>
                      </Col>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default CartItem;
