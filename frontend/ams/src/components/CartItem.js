import React, { useState } from "react";
import { Typography, Card, Row, Col, List, Button, Tooltip } from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

const CartItem = (props) => {
  const [orderList, setOrderList] = useState(props.orderList);
  const [totalOrder, setTotalOrder] = useState(0);

  function orderLength() {
    if (props.orderList.length > 1) {
      return "Cart Items";
    } else {
      return "Cart Item";
    }
  }

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  function changeQuantity(id, code, name, cost, measurement, quantity) {
    setTotalOrder(0);
    quantity += 1;
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
    delay(1).then(() => setTotalOrder(sum.toFixed(2)));
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
                  <Card style={{ width: "100%" }} hoverable>
                    <div className="space-between-row">
                      <Col span={10}>
                        <List.Item.Meta
                          title={
                            <p
                              className="large-font"
                              style={{ color: "#318CE7" }}
                            >
                              {item.name}
                            </p>
                          }
                          description={
                            <p className="medium-font">{item.code}</p>
                          }
                        />
                      </Col>
                      <Col span={6} style={{ margin: "0 30px" }}>
                        <Row>
                          <List.Item.Meta
                            avatar={
                              <p className="medium-card-title">{item.total}</p>
                            }
                          />
                        </Row>
                        <Row>
                          <p className="medium-font">
                            Qty. {item.quantity}{" "}
                            {item.quantity > 1
                              ? item.measurement + "s"
                              : item.measurement}
                          </p>
                        </Row>
                      </Col>
                      <Col
                        span={3}
                        className="flex-end-row"
                        style={{ alignItems: "center" }}
                      >
                        <Card
                          size="small"
                          className="card-zero-padding"
                          style={{ width: "100%" }}
                        >
                          <div className="space-between-row">
                            <Col span={11}>
                              <Tooltip title="Add Quantity">
                                <Button
                                  type="primary"
                                  icon={
                                    <PlusOutlined
                                      className="medium-card-title"
                                      onClick={() =>
                                        changeQuantity(
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
                                  type="primary"
                                  icon={
                                    <MinusOutlined className="medium-card-title" />
                                  }
                                  block
                                />
                              </Tooltip>
                            </Col>
                          </div>
                        </Card>
                      </Col>
                      <Col
                        span={2}
                        className="flex-end-row"
                        style={{ alignItems: "center", margin: "0 0 0 30px" }}
                      >
                        <Tooltip title="Remove Item">
                          <Button
                            icon={
                              <DeleteOutlined
                                className="big-card-title"
                                style={{ color: "#318CE7" }}
                              />
                            }
                          />
                        </Tooltip>
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
