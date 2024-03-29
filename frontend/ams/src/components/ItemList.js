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

const ItemList = ({
  itemList,
  setFilteredItem,
  filteredItem,
  view,
  segment,
  handleCheckChange,
  setWarning,
  warning,
  deleteItem,
  changeQuantity,
  theme,
}) => {
  const itemListLocal = itemList;
  const [searchItemCode, setSearchItemCode] = useState("");
  const [codeAscending, setCodeAscending] = useState(true);
  const [nameAscending, setNameAscending] = useState(false);
  const [costAscending, setCostAscending] = useState(false);
  const [checkedAll, setCheckedAll] = useState(false);

  const showAll = () => {
    setSearchItemCode("");
    sortItems("code", true);
    setFilteredItem(itemList);
  };

  const sortItems = (key, ascending) => {
    let itemsToSort = filteredItem.length > 0 ? filteredItem : itemList;
    itemsToSort.sort((a, b) => {
      let valA, valB;
      if (key === "code") {
        valA = parseInt(a["id"], 10);
        valB = parseInt(b["id"], 10);
      }
      if (key === "name") {
        valA = a[key].toLowerCase();
        valB = b[key].toLowerCase();
      }
      if (key === "cost") {
        valA = parseInt(a[key], 10);
        valB = parseInt(b[key], 10);
      }
      if (valA < valB) {
        return ascending ? -1 : 1;
      }
      if (valA > valB) {
        return ascending ? 1 : -1;
      }
      return 0;
    });
    setFilteredItem(itemsToSort);
    if (key === "code") {
      setCodeAscending(ascending);
      setNameAscending("");
      setCostAscending("");
    } else if (key === "name") {
      setCodeAscending("");
      setNameAscending(ascending);
      setCostAscending("");
    } else if (key === "cost") {
      setCodeAscending("");
      setNameAscending("");
      setCostAscending(ascending);
    }
  };

  return (
    <>
      {!view ? (
        <Row
          className="card-with-background space-between-row"
          style={{
            padding: "10px",
            marginBottom: "24px",
          }}
        >
          <Col span={17}>
            <Input
              placeholder="Search Item Code"
              value={searchItemCode}
              style={{
                borderRadius: "50px",
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                setSearchItemCode(inputValue);
                setFilteredItem([]);
                const filteredData = itemList.filter(
                  (item) => item.code.toLowerCase() === inputValue.toLowerCase()
                );
                setFilteredItem(filteredData);
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
                      sortItems("cost", costAscending ? false : true)
                    }
                  />
                </Tooltip>
              </Col>
              {segment === "Receive" ? (
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
                        handleCheckChange(
                          itemList,
                          filteredItem.length > 0
                            ? filteredItem.map((item) => item.code)
                            : itemList.map((item) => item.code),
                          !checkedAll,
                          false,
                          filteredItem
                        );
                        setCheckedAll(!checkedAll);
                        setWarning(false);
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
          height: "calc(-324px + 100vh)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        dataSource={
          view
            ? itemListLocal
            : filteredItem.length > 0
            ? filteredItem
            : itemList
        }
        renderItem={(item) => (
          <List.Item>
            <Card className="card-no-padding card-no-padding-top" hoverable>
              <Row>
                <Col
                  span={!view ? 3 : 6}
                  className="justified-row card-with-background"
                  style={{ padding: "12px 0" }}
                >
                  <QRCode
                    value={item.code}
                    style={{
                      height: "auto",
                      width: "40%",
                    }}
                  />
                </Col>
                <Col
                  className="card-with-background align-items-center"
                  span={!view ? (segment === "Receive" ? 19 : 21) : 18}
                >
                  <Card
                    className="card-item card-with-background"
                    size="small"
                    title={
                      <Title>
                        <div className="space-between-row align-items-center">
                          <Col
                            span={
                              !view ? (segment === "Receive" ? 20 : 16) : 23
                            }
                          >
                            <Row>
                              <Col
                                span={
                                  !view ? (segment === "Receive" ? 13 : 10) : 16
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
                                  !view ? (segment === "Receive" ? 5 : 6) : 6
                                }
                              >
                                <p
                                  className="medium-card-title"
                                  style={{ textAlign: "center" }}
                                >
                                  Quantity
                                </p>
                              </Col>
                              {!view ? (
                                <Col
                                  span={
                                    !view ? (segment === "Receive" ? 5 : 6) : 6
                                  }
                                >
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
                          {!view ? (
                            segment === "Reorder" ? (
                              <Col span={8} className="flex-end-row">
                                <Tooltip title="Remove">
                                  <Button
                                    className="btn-normal no-hover"
                                    danger
                                    type="link"
                                    onClick={() => deleteItem(item.code)}
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
                      paddingRight: "24px",
                    }}
                  >
                    <div
                      className="space-between-row medium-font"
                      style={{
                        alignItems: "center",
                        color: theme === "light" ? "#000" : "#fff",
                      }}
                    >
                      <Col
                        span={!view ? (segment === "Receive" ? 24 : 16) : 24}
                      >
                        <Row>
                          <Col
                            span={!view ? 8 : 13}
                            style={{ marginRight: "24px" }}
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
                          {!view ? (
                            <Col
                              span={segment === "Receive" ? 3 : 6}
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
                      {!view ? (
                        segment === "Reorder" ? (
                          <Col span={8} className="flex-end-row">
                            <Tooltip>
                              <Button
                                size="small"
                                type="primary"
                                onClick={() =>
                                  changeQuantity(
                                    "add",
                                    item.id,
                                    item.code,
                                    item.name,
                                    item.cost,
                                    item.measurement,
                                    item.quantity,
                                    item.max,
                                    codeAscending !== ""
                                      ? `code-${codeAscending}`
                                      : nameAscending !== ""
                                      ? `name-${nameAscending}`
                                      : costAscending !== ""
                                      ? `cost-${costAscending}`
                                      : ""
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
                                  changeQuantity(
                                    "less",
                                    item.id,
                                    item.code,
                                    item.name,
                                    item.cost,
                                    item.measurement,
                                    item.quantity,
                                    item.max,
                                    codeAscending !== ""
                                      ? `code-${codeAscending}`
                                      : nameAscending !== ""
                                      ? `name-${nameAscending}`
                                      : costAscending !== ""
                                      ? `cost-${costAscending}`
                                      : ""
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

                {!view ? (
                  segment === "Receive" ? (
                    <Col
                      span={2}
                      className="justified-row align-items-center card-with-background"
                    >
                      <Checkbox
                        className={`${
                          item.checked === "true"
                            ? ""
                            : warning
                            ? "warning"
                            : ""
                        }`}
                        checked={item.checked === "true"}
                        onChange={() => {
                          handleCheckChange(
                            itemList,
                            item.code,
                            false,
                            true,
                            filteredItem
                          );
                          setCheckedAll(false);
                        }}
                      ></Checkbox>
                    </Col>
                  ) : (
                    ""
                  )
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
