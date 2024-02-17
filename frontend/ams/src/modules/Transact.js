import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Typography,
  Segmented,
  Button,
  Input,
  Row,
  Col,
  InputNumber,
  Tooltip,
  Badge,
  Avatar,
  Steps,
  notification,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import DrawerEvent from "../components/DrawerEvent";
import ItemDetail from "../components/ItemDetail";
import ItemList from "../components/ItemList";
import NotificationEvent from "../components/NotificationEvent";
import EmptyData from "../components/EmptyData";
import moment from "moment";

const { Title } = Typography;

const Transact = (props) => {
  const [segment, setSegment] = useState("Issue");
  const [searchValue, setSearchValue] = useState("");
  const [searchItemCode, setSearchItemCode] = useState("");
  const [filteredItem, setFilteredItem] = useState("");
  const [total, setTotal] = useState("");
  const [quantity, setQuantity] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [item, setItem] = useState([]);
  const [queryItem, setQueryItem] = useState([]);
  const [reorderItemList, setReorderItemList] = useState([]);
  const [reorderItemCount, setReorderItemCount] = useState(0);
  const [receiveItemList, setReceiveItemList] = useState([]);
  const [receiveItemCount, setReceiveItemCount] = useState(0);
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

  function sumOrder(itemList) {
    const sum = itemList.reduce(
      (acc, item) => parseFloat(acc) + parseFloat(item.total),
      0
    );
    return sum.toFixed(2);
  }

  function addItem(id, code, name, cost, measurement, quantity, total) {
    const newOrder = reorderItemList;
    newOrder.push({
      id: id,
      code: code,
      name: name,
      cost: cost,
      measurement: measurement,
      quantity: quantity,
      total: total,
    });
    setReorderItemList(newOrder);
    reorderItemList.sort(function (a, b) {
      return a.id - b.id;
    });
    setReorderItemCount(reorderItemList.length);
  }

  function removeItem(code) {
    const newOrder = reorderItemList;
    const matchItem = newOrder.find((order) => order.code === code);
    var index = newOrder.indexOf(matchItem);
    if (index > -1) {
      newOrder.splice(index, 1);
    }
    setReorderItemList(newOrder);
    reorderItemList.sort(function (a, b) {
      return a.id - b.id;
    });
    setReorderItemCount(reorderItemList.length);
  }

  function newItem(id, code, name, cost, measurement, quantity) {
    if (total !== "0.00") {
      removeItem(code);
      addItem(id, code, name, cost, measurement, quantity, total);
      setInputStatus("");
      api.info(NotificationEvent(true, "Item " + code + " added to cart."));
    } else {
      setInputStatus("error");
      api.info(NotificationEvent(false, "Add item quantity."));
    }
  }

  function onQuantityChange(value) {
    setTotal((parseFloat(queryItem["0"]["cost"]) * value).toFixed(2));
    setQuantity(value);
  }

  function showDrawer() {
    switch (segment) {
      case "Reorder":
        if (reorderItemCount !== 0) {
          setOpenDrawer(true);
        } else {
          api.info(
            NotificationEvent(
              false,
              "Please search for an item, specify quantity, and click ‘Add to Cart’ button."
            )
          );
        }
        break;
      case "Receive":
        if (receiveItemCount !== 0) {
          setOpenDrawer(true);
        }
        break;
      default:
        break;
    }
  }

  function onCloseDrawer() {
    setOpenDrawer(false);
  }

  function clearOrder() {
    switch (segment) {
      case "Reorder":
        setReorderItemList([]);
        setReorderItemCount(0);
        break;
      default:
        break;
    }
  }

  function clearSearch() {
    setQueryItem([]);
    setTotal("0.00");
  }

  function handleCheckChange(code) {
    let updatedItemList = receiveItemList.map((item) => {
      if (item.code === code) {
        return { ...item, checked: item.checked === "true" ? "false" : "true" };
      } else {
        return item;
      }
    });
    setReceiveItemList(updatedItemList);
  }

  function parseStringToDictionaries(inputString) {
    const dictionaryList = [];
    const items = inputString.split("/*/");

    for (const item of items) {
      const keyValuePairs = item.split(", ");
      const dictionary = {};

      for (const pair of keyValuePairs) {
        const [key, value] = pair.split("=");
        if (key && value) {
          dictionary[key.trim()] = value.trim();
        }
      }
      dictionaryList.push(dictionary);
    }
    dictionaryList.pop();
    return dictionaryList;
  }

  function searchItem(value, segment) {
    setItemCode(value);
    clearSearch();
    var apiEndpoint = "";
    apiEndpoint =
      segment === "Issue" || segment === "Return"
        ? "workorders"
        : segment === "Adjust" || segment === "Reorder"
        ? "warehouseitems"
        : segment === "Receive"
        ? "transactions"
        : null;
    axios({
      method: "GET",
      url: `http://localhost:8000/api/${apiEndpoint}`,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        response.data.forEach((res) => {
          switch (segment) {
            case "Issue":
            case "Return":
              break;
            case "Adjust":
            case "Reorder":
              if (
                res.item_code === value.toUpperCase() &&
                res.warehouse_code === props.sectionCode
              ) {
                item.map((i) =>
                  i.item_code === res.item_code
                    ? setQueryItem([
                        {
                          id: i.id,
                          code: i.item_code,
                          name: i.item_name,
                          cost: i.item_cost,
                          measurement: i.item_measurement,
                        },
                      ])
                    : null
                );
              }
              break;
            case "Receive":
              if (res.trans_code === value.toUpperCase()) {
                setQueryItem([
                  {
                    code: res.trans_code,
                    action: res.trans_action,
                    date: res.trans_date,
                    detail: res.trans_detail,
                  },
                ]);
                setReceiveItemList(parseStringToDictionaries(res.trans_detail));
                setReceiveItemCount(
                  parseStringToDictionaries(res.trans_detail).length
                );
              }
              break;
            default:
              break;
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
    if (queryItem.length > 0) {
      return segment;
    } else {
      return false;
    }
  }

  function checkResult() {
    return queryItem.length > 0
      ? segment === "Issue"
        ? "Issue"
        : segment === "Return"
        ? "Return"
        : segment === "Adjust"
        ? "Adjust"
        : segment === "Reorder"
        ? "Reorder"
        : segment === "Receive"
        ? "Receive"
        : false
      : false;
  }

  function componentSwitch(key) {
    switch (key) {
      case "Reorder":
        return (
          <>
            <Row>
              <Col span={14} style={{ paddingLeft: "50px" }}>
                <ItemDetail
                  itemcode={queryItem["0"]["code"]}
                  view={true}
                  sectionCode={props.sectionCode}
                  theme={props.theme}
                />
              </Col>
              <Col
                span={9}
                className="flex-start-row"
                style={{ paddingLeft: "50px" }}
              >
                <Col
                  className="card-with-background"
                  style={{
                    padding: "20px 40px",
                  }}
                >
                  <p
                    className="large-card-title"
                    style={{ paddingBottom: "50px" }}
                  >
                    Item Code: {queryItem["0"]["code"]}
                  </p>
                  <p
                    className="big-card-title"
                    style={{ paddingBottom: "15px" }}
                  >
                    Php. {total}
                  </p>
                  <Row>
                    <Col span={8} style={{ paddingRight: "10px" }}>
                      <InputNumber
                        placeholder="Qnty."
                        status={inputStatus}
                        min={1}
                        max={1000000}
                        onChange={onQuantityChange}
                      />
                    </Col>
                    <Col span={12}>
                      <Button
                        size="large"
                        type="primary"
                        onClick={() =>
                          newItem(
                            queryItem["0"]["id"],
                            queryItem["0"]["code"],
                            queryItem["0"]["name"],
                            queryItem["0"]["cost"],
                            queryItem["0"]["measurement"],
                            quantity,
                            "topRight"
                          )
                        }
                      >
                        ADD TO CART
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Col>
            </Row>
          </>
        );
      case "Receive":
        return (
          <>
            <Row>
              <Col span={14} style={{ paddingLeft: "50px" }}>
                <ItemList
                  view={true}
                  segment={props.segment}
                  itemList={receiveItemList}
                  handleCheckChange={handleCheckChange}
                  setSearchItemCode={setSearchItemCode}
                  searchItemCode={searchItemCode}
                  setFilteredItem={setFilteredItem}
                  filteredItem={filteredItem}
                  theme={props.theme}
                />
              </Col>
              <Col
                span={9}
                className="flex-start-row"
                style={{ paddingLeft: "50px" }}
              >
                <Col
                  className="card-with-background"
                  span={24}
                  style={{
                    padding: "20px 40px",
                  }}
                >
                  <p
                    className="large-card-title"
                    style={{ paddingBottom: "20px" }}
                  >
                    Transaction Code: {queryItem["0"]["code"]}
                  </p>
                  <Steps
                    progressDot
                    current={2}
                    direction="vertical"
                    items={[
                      {
                        title:
                          "Order Date:  " +
                          String(
                            moment(queryItem["0"]["date"]).format(
                              "MMMM DD, YYYY"
                            )
                          ),
                      },
                      {
                        title: "Total Items:  " + String(receiveItemCount),
                      },
                      {
                        title: queryItem["0"]["action"],
                      },
                    ]}
                  />
                  <p
                    className="big-card-title"
                    style={{ paddingTop: "20px", paddingBottom: "15px" }}
                  >
                    Php. {sumOrder(receiveItemList)}
                  </p>
                  <Button size="large" type="primary" onClick={showDrawer}>
                    RECEIVE
                  </Button>
                </Col>
              </Col>
            </Row>
          </>
        );
      case false:
        return <EmptyData theme={props.theme} />;
      default:
        break;
    }
  }

  function placeholderLabel() {
    switch (segment) {
      case "Issue":
      case "Return":
        return "Search Work Order Code";
      case "Adjust":
      case "Reorder":
        return "Search Item Code";
      case "Receive":
        return "Search Transaction Code";
      default:
        break;
    }
  }

  useEffect(() => {
    fetchData("http://localhost:8000/api/items", setItem);
  }, []);

  return (
    <>
      {contextHolder}
      <div className={`justified-row ${props.theme}`}>
        <div className="card-custom-size-full">
          <Card
            size="large"
            style={{ minHeight: "100vh" }}
            title={
              <Title>
                <Segmented
                  className="large-card-title"
                  options={["Issue", "Return", "Adjust", "Reorder", "Receive"]}
                  onChange={(e) => {
                    setSegment(e);
                    searchItem(searchValue, e);
                  }}
                />
              </Title>
            }
          >
            <div style={{ marginTop: "10px" }}>
              <div className="space-between-row">
                <Col
                  span={segment === "Reorder" ? 22 : 24}
                  style={{ marginBottom: "20px" }}
                >
                  <Input
                    placeholder={placeholderLabel()}
                    value={searchValue}
                    style={{ borderRadius: "50px" }}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      searchItem(e.target.value, segment);
                    }}
                  />
                </Col>
                {segment === "Reorder" ? (
                  <Col span={2} style={{ paddingLeft: "20px" }}>
                    <Tooltip
                      title={
                        reorderItemCount > 1
                          ? "Cart (" + reorderItemCount.toString() + " Items)"
                          : "Cart (" + reorderItemCount.toString() + " Item)"
                      }
                    >
                      <Badge
                        count={reorderItemCount}
                        color="#318ce7"
                        onClick={showDrawer}
                      >
                        <Avatar
                          className="avatar-btn"
                          shape="square"
                          size="large"
                          style={{
                            background: "#318ce7",
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
                  </Col>
                ) : (
                  ""
                )}
              </div>
              <div style={{ paddingTop: "20px" }}>
                {componentSwitch(checkResult())}
              </div>
            </div>
          </Card>
        </div>
      </div>
      <DrawerEvent
        segment={segment}
        item={itemCode}
        addItem={addItem}
        removeItem={removeItem}
        itemCount={
          segment === "Reorder"
            ? reorderItemCount
            : segment === "Receive"
            ? receiveItemCount
            : ""
        }
        itemList={
          segment === "Reorder"
            ? reorderItemList
            : segment === "Receive"
            ? receiveItemList
            : ""
        }
        handleCheckChange={handleCheckChange}
        clearOrder={clearOrder}
        showDrawer={openDrawer}
        onCloseDrawer={onCloseDrawer}
        comp="Cart"
        empid={props.empid}
        username={props.username}
        collapsed={props.collapsed}
        sectionCode={props.sectionCode}
        theme={props.theme}
        overflow={false}
      />
    </>
  );
};

export default Transact;
