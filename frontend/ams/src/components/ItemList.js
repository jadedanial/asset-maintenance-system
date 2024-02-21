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
import {
  AppstoreOutlined,
  BorderOutlined,
  CheckSquareOutlined,
  CloseOutlined,
  DollarOutlined,
  OrderedListOutlined,
  PoundOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const ItemList = (props) => {
  const itemList = props.itemList;
  const [searchItemCode, setSearchItemCode] = useState("");
  const [codeAscending, setCodeAscending] = useState(false);
  const [nameAscending, setNameAscending] = useState(false);
  const [costAscending, setCostAscending] = useState(false);
  const [checkedAll, setCheckedAll] = useState(false);

  function showAll() {
    props.setFilteredItem(props.itemList);
    setSearchItemCode("");
  }

  function sortItems(key, ascending) {
    let itemsToSort =
      props.filteredItem.length > 0 ? props.filteredItem : props.itemList;

    itemsToSort.sort((a, b) => {
      let valA = key === "total" ? parseInt(a[key], 10) : a[key];
      let valB = key === "total" ? parseInt(b[key], 10) : b[key];

      if (valA < valB) {
        return ascending ? -1 : 1;
      }
      if (valA > valB) {
        return ascending ? 1 : -1;
      }
      return 0;
    });
    props.setFilteredItem(itemsToSort);
    if (key === "code") {
      setCodeAscending(ascending);
    } else if (key === "name") {
      setNameAscending(ascending);
    } else if (key === "total") {
      setCostAscending(ascending);
    }
  }

  return (
    <>
      {!props.view ? (
        <Row
          className="card-with-background"
          style={{
            maxHeight: "fit-content",
            padding: "10px",
            marginBottom: "30px",
          }}
        >
          <Col span={17} style={{ margin: "0 20px" }}>
            <Input
              placeholder="Search Item Code"
              value={searchItemCode}
              style={{
                borderRadius: "50px",
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                setSearchItemCode(inputValue);
                props.setFilteredItem("");
                const filteredData = props.itemList.filter(
                  (item) => item.code.toLowerCase() === inputValue.toLowerCase()
                );
                props.setFilteredItem(filteredData);
              }}
            />
          </Col>
          <Col span={6} className="flex-end-row">
            <Row className="align-items-center space-between-row">
              <Col span={4} className="justified-row">
                <Tooltip title="Show All">
                  <Button
                    size="large"
                    icon={<AppstoreOutlined style={{ fontSize: "20px" }} />}
                    className="btn-normal"
                    onClick={() => showAll()}
                  />
                </Tooltip>
              </Col>
              <Col span={4} className="justified-row">
                <Tooltip title="Sort By Code">
                  <Button
                    size="large"
                    icon={
                      codeAscending ? (
                        <OrderedListOutlined style={{ fontSize: "20px" }} />
                      ) : (
                        <UnorderedListOutlined style={{ fontSize: "20px" }} />
                      )
                    }
                    className="btn-normal"
                    onClick={() =>
                      sortItems("code", codeAscending ? false : true)
                    }
                  />
                </Tooltip>
              </Col>
              <Col span={4} className="justified-row">
                <Tooltip title="Sort By Name">
                  <Button
                    size="large"
                    icon={
                      nameAscending ? (
                        <SortAscendingOutlined style={{ fontSize: "20px" }} />
                      ) : (
                        <SortDescendingOutlined style={{ fontSize: "20px" }} />
                      )
                    }
                    className="btn-normal"
                    onClick={() =>
                      sortItems("name", nameAscending ? false : true)
                    }
                  />
                </Tooltip>
              </Col>
              <Col span={4} className="justified-row">
                <Tooltip title="Sort By Cost">
                  <Button
                    size="large"
                    icon={
                      costAscending ? (
                        <DollarOutlined style={{ fontSize: "20px" }} />
                      ) : (
                        <PoundOutlined style={{ fontSize: "20px" }} />
                      )
                    }
                    className="btn-normal"
                    onClick={() =>
                      sortItems("total", costAscending ? false : true)
                    }
                  />
                </Tooltip>
              </Col>
              {props.segment === "Receive" ? (
                <Col span={4} className="justified-row">
                  <Tooltip title={checkedAll ? "Uncheck All" : "Check All"}>
                    <Button
                      size="large"
                      icon={
                        checkedAll ? (
                          <CheckSquareOutlined style={{ fontSize: "20px" }} />
                        ) : (
                          <BorderOutlined style={{ fontSize: "20px" }} />
                        )
                      }
                      className="btn-normal"
                      onClick={() => {
                        props.handleCheckChange(
                          props.itemList,
                          props.filteredItem.length > 0
                            ? props.filteredItem.map((item) => item.code)
                            : props.itemList.map((item) => item.code),
                          !checkedAll,
                          false,
                          props.filteredItem
                        );
                        setCheckedAll(!checkedAll);
                        props.setWarning(false);
                      }}
                    />
                  </Tooltip>
                </Col>
              ) : (
                ""
              )}
            </Row>
          </Col>
        </Row>
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
          props.view
            ? itemList
            : props.filteredItem.length > 0
            ? props.filteredItem
            : props.itemList
        }
        renderItem={(item) => (
          <List.Item>
            <Card className="card-no-padding" hoverable>
              <Row>
                <Col
                  span={!props.view ? 3 : 6}
                  className="justified-row card-with-background"
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
                                    className="btn-normal no-hover"
                                    danger
                                    type="link"
                                    onClick={() => props.deleteItem(item.code)}
                                  >
                                    <CloseOutlined className="medium-card-title" />
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
                    className="justified-row align-items-center card-with-background"
                  >
                    <Checkbox
                      className={`${
                        item.checked === "true"
                          ? ""
                          : props.warning
                          ? "warning"
                          : ""
                      }`}
                      checked={item.checked === "true"}
                      onChange={() => {
                        props.handleCheckChange(
                          props.itemList,
                          item.code,
                          false,
                          true,
                          props.filteredItem
                        );
                      }}
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
