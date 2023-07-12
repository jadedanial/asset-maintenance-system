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

const { Title } = Typography;

const CartItem = (props) => {
  const [totalOrder, setTotalOrder] = useState(0.0);
  const [itemCount, setItemCount] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    sumOrder();
  });

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
    setTotalOrder(0.0);
    const sum = props.orderList.reduce(
      (acc, item) => parseFloat(acc) + parseFloat(item.total),
      0
    );
    setTotalOrder(sum.toFixed(2));
  }

  async function applyOrder() {
    try {
      await axios({
        method: "PUT",
        url: "http://localhost:8000/api/item/",
        data: props.orderList,
      });
      setItemCount(props.itemCount);
      setSuccess(true);
      props.clearOrder();
    } catch (err) {
      console.log(err.response.data[0]);
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
              ? "Successfully added " +
                itemCount.toString() +
                " Items to inventory!"
              : "Successfully added " +
                itemCount.toString() +
                " Item to inventory!"
          }
          subTitle={"Transaction ID 0587864"}
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
                <Button
                  size="middle"
                  type="primary"
                  onClick={() => applyOrder()}
                >
                  APPLY
                </Button>
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
                style={{ width: "100%", padding: "10px 20px" }}
              >
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <p className="medium-font" style={{ marginRight: "20px" }}>
                    Total Cost {totalOrder}
                  </p>
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
                        <p className="medium-font" style={{ color: "#318ce7" }}>
                          {item.item_code}
                        </p>
                      </Title>
                    }
                    style={{ width: "100%", padding: "20px" }}
                    hoverable
                  >
                    <div
                      className="space-between-row"
                      style={{ alignItems: "center" }}
                    >
                      <Col span={8} style={{ marginRight: "30px" }}>
                        <List.Item.Meta
                          title={
                            <p className="medium-font">{item.item_name}</p>
                          }
                        />
                      </Col>
                      <Col span={4}>
                        <List.Item.Meta
                          avatar={
                            <p className="medium-card-title">{item.total}</p>
                          }
                        />
                      </Col>
                      <Col span={5}>
                        <p className="medium-font">
                          Qty. {item.item_onhand}{" "}
                          {item.item_onhand > 1
                            ? item.item_measurement + "s"
                            : item.item_measurement}
                        </p>
                      </Col>
                      <Col
                        span={4}
                        className="flex-end-row"
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <div
                          className="space-between-row"
                          style={{ marginTop: "5px" }}
                        >
                          <Col span={8}>
                            <Tooltip title="Add Quantity">
                              <Button
                                icon={
                                  <PlusOutlined
                                    className="medium-card-title"
                                    style={{ color: "#318ce7" }}
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
                                  />
                                }
                                block
                              />
                            </Tooltip>
                          </Col>
                          <Col span={8}>
                            <Tooltip title="Less Quantity">
                              <Button
                                icon={
                                  <MinusOutlined
                                    className="medium-card-title"
                                    style={{ color: "#318ce7" }}
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
                                  />
                                }
                                block
                              />
                            </Tooltip>
                          </Col>
                          <Col span={8}>
                            <Tooltip title="Remove Item">
                              <Button
                                danger
                                type="link"
                                onClick={() => deleteItem(item.item_code)}
                              >
                                <CloseOutlined
                                  className="large-card-title"
                                  style={{ color: "#FF4D4F" }}
                                />
                              </Button>
                            </Tooltip>
                          </Col>
                        </div>
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
