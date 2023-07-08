import React, { useState, useEffect } from "react";
import { Typography, Card, Row, Col, List, Button, Tooltip } from "antd";
import { PlusOutlined, MinusOutlined, CloseOutlined } from "@ant-design/icons";

const { Title } = Typography;

const CartItem = (props) => {
  const [orderList, setOrderList] = useState(props.orderList);
  const [totalOrder, setTotalOrder] = useState(0);

  useEffect(() => {
    setTotalOrder(props.totalOrder);
  }, [props.totalOrder]);

  function orderLength() {
    if (props.orderList.length > 1) {
      return "Cart Items";
    } else {
      return "Cart Item";
    }
  }

  function changeQuantity(action, id, code, name, cost, measurement, quantity) {
    if (quantity >= 1) {
      setTotalOrder(0);
      if (action === "add") {
        quantity += 1;
      } else {
        if (quantity !== 1) {
          quantity -= 1;
        }
      }
      const newOrder = orderList;
      const matchItem = newOrder.find((order) => order.code === code);
      var index = newOrder.indexOf(matchItem);
      if (index > -1) {
        newOrder.splice(index, 1);
      }
      const total = parseFloat(cost * quantity).toFixed(2);
      newOrder.push({
        id: id,
        code: code,
        name: name,
        cost: cost,
        measurement: measurement,
        quantity: quantity,
        total: total,
      });
      setOrderList(newOrder);
      orderList.sort(function (a, b) {
        return a.id - b.id;
      });
      const sum = orderList.reduce(
        (acc, item) => parseFloat(acc) + parseFloat(item.total),
        0
      );
      setTotalOrder(sum.toFixed(2));
    }
  }

  function removeItem(code) {
    setTotalOrder(0);
    const newOrder = orderList;
    const matchItem = newOrder.find((order) => order.code === code);
    var index = newOrder.indexOf(matchItem);
    if (index > -1) {
      newOrder.splice(index, 1);
    }
    setOrderList(newOrder);
    orderList.sort(function (a, b) {
      return a.id - b.id;
    });
    const sum = orderList.reduce(
      (acc, item) => parseFloat(acc) + parseFloat(item.total),
      0
    );
    setTotalOrder(sum.toFixed(2));
    props.minusItemCount();
  }

  return (
    <>
      <div className="justified-row">
        <div className="card-custom-size">
          <Card
            size="large"
            title={
              <Title>
                <p className="big-card-title" style={{ color: "#318CE7" }}>
                  {orderLength()}
                </p>
              </Title>
            }
            hoverable
          >
            <List
              itemLayout="horizontal"
              dataSource={orderList}
              renderItem={(item, index) => (
                <List.Item>
                  <Card
                    size="small"
                    id="card-content-justify-center"
                    title={
                      <Title>
                        <p className="medium-font" style={{ color: "#318CE7" }}>
                          {item.name}
                        </p>
                      </Title>
                    }
                    style={{ width: "100%" }}
                    extra={
                      <Tooltip title="Remove Item">
                        <Button
                          danger
                          type="link"
                          onClick={() => removeItem(item.code)}
                        >
                          <CloseOutlined
                            className="large-card-title"
                            style={{ color: "#FF4D4F" }}
                          />
                        </Button>
                      </Tooltip>
                    }
                    hoverable
                  >
                    <div
                      className="space-between-row"
                      style={{ alignItems: "center" }}
                    >
                      <Col span={5}>
                        <List.Item.Meta
                          title={<p className="medium-font">{item.code}</p>}
                        />
                      </Col>
                      <Col span={4}>
                        <List.Item.Meta
                          avatar={
                            <p className="medium-card-title">{item.total}</p>
                          }
                        />
                      </Col>
                      <Col span={6}>
                        <p className="medium-font">
                          Qty. {item.quantity}{" "}
                          {item.quantity > 1
                            ? item.measurement + "s"
                            : item.measurement}
                        </p>
                      </Col>
                      <Col
                        span={3}
                        className="flex-end-row"
                        style={{
                          alignItems: "center",
                          marginRight: "130px",
                        }}
                      >
                        <div
                          className="space-between-row"
                          style={{ marginTop: "5px" }}
                        >
                          <Col span={11}>
                            <Tooltip title="Add Quantity">
                              <Button
                                icon={
                                  <PlusOutlined
                                    className="medium-card-title"
                                    style={{ color: "#318CE7" }}
                                    onClick={() =>
                                      changeQuantity(
                                        "add",
                                        item.id,
                                        item.code,
                                        item.name,
                                        item.cost,
                                        item.measurement,
                                        item.quantity
                                      )
                                    }
                                  />
                                }
                                block
                              />
                            </Tooltip>
                          </Col>
                          <Col span={11}>
                            <Tooltip title="Less Quantity">
                              <Button
                                icon={
                                  <MinusOutlined
                                    className="medium-card-title"
                                    style={{ color: "#318CE7" }}
                                    onClick={() =>
                                      changeQuantity(
                                        "less",
                                        item.id,
                                        item.code,
                                        item.name,
                                        item.cost,
                                        item.measurement,
                                        item.quantity
                                      )
                                    }
                                  />
                                }
                                block
                              />
                            </Tooltip>
                          </Col>
                        </div>
                      </Col>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
            <Row>
              <p className="big-font">{totalOrder}</p>
            </Row>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CartItem;
