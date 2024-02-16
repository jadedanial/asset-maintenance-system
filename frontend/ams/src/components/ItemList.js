import React, { useState } from "react";
import QRCode from "react-qr-code";
import {
  Typography,
  Card,
  Col,
  List,
  Button,
  Tooltip,
  Input,
  Row,
  Checkbox,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ItemList = (props) => {
  const [checkedState, setCheckedState] = useState(
    props.itemList.map((item) => ({ code: item.code, checked: false }))
  );

  function handleCheckChange(code) {
    const newState = checkedState.map((item) =>
      item.code === code ? { ...item, checked: !item.checked } : item
    );
    setCheckedState(newState);
    props.checkAllState(newState);
  }

  return (
    <>
      {!props.view ? (
        <Input
          size="large"
          placeholder="Search Item Code"
          value={props.searchItemCode}
          style={{
            borderRadius: "50px",
            marginBottom: "30px",
          }}
          onChange={(e) => {
            const inputValue = e.target.value;
            props.setSearchItemCode(inputValue);
            props.setFilteredItem("");
            const filteredData = props.itemList.filter(
              (item) => item.code.toLowerCase() === inputValue.toLowerCase()
            );
            props.setFilteredItem(filteredData);
          }}
        />
      ) : (
        ""
      )}
      <List
        itemLayout="horizontal"
        pagination={false}
        style={{
          height: "calc(100vh - 350px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        dataSource={
          props.filteredItem.length < 1 ? props.itemList : props.filteredItem
        }
        renderItem={(item) => (
          <List.Item>
            <Card className="card-no-padding" hoverable>
              <Row>
                <Col
                  span={!props.view ? 3 : 6}
                  className="justified-row"
                  style={{
                    background: props.theme === "light" ? "#fff" : "#1d2b5365",
                  }}
                >
                  <QRCode
                    value={item.code}
                    style={{
                      height: "auto",
                      width: "40%",
                      padding: "10px 0",
                    }}
                  />
                </Col>
                <Col
                  span={
                    !props.view ? (props.segment === "Receive" ? 19 : 21) : 18
                  }
                >
                  <Card
                    className="card-item card-with-background"
                    size="small"
                    title={
                      <Title>
                        <div className="space-between-row align-items-center">
                          <Col
                            span={
                              !props.view
                                ? props.segment === "Receive"
                                  ? 20
                                  : 16
                                : 23
                            }
                          >
                            <Row>
                              <Col
                                span={
                                  !props.view
                                    ? props.segment === "Receive"
                                      ? 13
                                      : 10
                                    : 16
                                }
                              >
                                <p
                                  className="medium-card-title"
                                  style={{ textAlign: "left" }}
                                >
                                  {item.code}
                                </p>
                              </Col>
                              <Col
                                span={
                                  !props.view
                                    ? props.segment === "Receive"
                                      ? 5
                                      : 7
                                    : 7
                                }
                              >
                                <p
                                  className="medium-card-title"
                                  style={{ textAlign: "center" }}
                                >
                                  Quantity
                                </p>
                              </Col>
                              {!props.view ? (
                                <Col span={6}>
                                  <p
                                    className="medium-card-title"
                                    style={{ textAlign: "right" }}
                                  >
                                    Cost
                                  </p>
                                </Col>
                              ) : (
                                ""
                              )}
                            </Row>
                          </Col>
                          {!props.view ? (
                            props.segment === "Reorder" ? (
                              <Col span={8} className="flex-end-row">
                                <Tooltip title="Remove">
                                  <Button
                                    className="btn-blue"
                                    style={{ padding: "0" }}
                                    danger
                                    type="link"
                                    onClick={() => props.deleteItem(item.code)}
                                  >
                                    <CloseOutlined className="large-card-title" />
                                  </Button>
                                </Tooltip>
                              </Col>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                        </div>
                      </Title>
                    }
                    style={{
                      height: "80px",
                      paddingRight: "30px",
                    }}
                  >
                    <div
                      className="space-between-row medium-font"
                      style={{
                        alignItems: "center",
                        paddingBottom: "12px",
                        color: props.theme === "light" ? "#000" : "#fff",
                      }}
                    >
                      <Col
                        span={
                          !props.view
                            ? props.segment === "Receive"
                              ? 24
                              : 16
                            : 24
                        }
                      >
                        <Row>
                          <Col
                            span={!props.view ? 8 : 13}
                            style={{ marginRight: "30px" }}
                          >
                            <p style={{ textAlign: "left", margin: "0" }}>
                              {item.name}
                            </p>
                          </Col>
                          <Col span={8}>
                            <p style={{ textAlign: "center", margin: "0" }}>
                              {item.quantity}{" "}
                              {item.quantity > 1
                                ? item.measurement + "s"
                                : item.measurement}
                            </p>
                          </Col>
                          {!props.view ? (
                            <Col
                              span={props.segment === "Receive" ? 3 : 6}
                              className="flex-end-row"
                            >
                              <p style={{ textAlign: "right", margin: "0" }}>
                                {item.total}
                              </p>
                            </Col>
                          ) : (
                            ""
                          )}
                        </Row>
                      </Col>
                      {!props.view ? (
                        props.segment === "Reorder" ? (
                          <Col span={8} className="flex-end-row">
                            <Tooltip>
                              <Button
                                size="small"
                                type="primary"
                                onClick={() =>
                                  props.changeQuantity(
                                    "add",
                                    item.id,
                                    item.code,
                                    item.name,
                                    item.cost,
                                    item.measurement,
                                    item.quantity
                                  )
                                }
                              >
                                ADD
                              </Button>
                            </Tooltip>
                            <Tooltip>
                              <Button
                                size="small"
                                type="default"
                                style={{ marginLeft: "4px" }}
                                onClick={() =>
                                  props.changeQuantity(
                                    "less",
                                    item.id,
                                    item.code,
                                    item.name,
                                    item.cost,
                                    item.measurement,
                                    item.quantity
                                  )
                                }
                              >
                                LESS
                              </Button>
                            </Tooltip>
                          </Col>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </Card>
                </Col>
                {props.segment === "Receive" ? (
                  <Col
                    span={2}
                    className="justified-row align-items-center"
                    style={{
                      background:
                        props.theme === "light" ? "#fff" : "#1d2b5365",
                    }}
                  >
                    <Checkbox
                      onChange={() => handleCheckChange(item.code)}
                    ></Checkbox>
                  </Col>
                ) : (
                  ""
                )}
              </Row>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};

export default ItemList;
