import React, { useState } from "react";
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
  Select,
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

const Transact = ({
  items,
  warehouseitems,
  sections,
  options,
  transactions,
  userId,
  userName,
  sectionCode,
  collapsed,
  theme,
}) => {
  const [segment, setSegment] = useState("Issue");
  const [searchValue, setSearchValue] = useState("");
  const [filteredItem, setFilteredItem] = useState([]);
  const [total, setTotal] = useState("");
  const [quantity, setQuantity] = useState("");
  const [queryCode, setQueryCode] = useState("");
  const [queryItem, setQueryItem] = useState([]);
  const [reorderItemList, setReorderItemList] = useState([]);
  const [reorderItemCount, setReorderItemCount] = useState(0);
  const [receiveItemList, setReceiveItemList] = useState([]);
  const [receiveItemCount, setReceiveItemCount] = useState(0);
  const [inputStatus, setInputStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [transactionCode, setTransactionCode] = useState("");
  const [warehouseCode, setWarehouseCode] = useState("Select Warehouse");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const checkItem = (code) => {
    var item = 0;
    const data = warehouseitems.find(
      (data) => data.warehouse_code === sectionCode && data.item_code === code
    );
    if (data) {
      item = data.item_onhand;
    }
    return item;
  };

  const removeItem = (code) => {
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
  };

  const addItem = (id, code, name, cost, measurement, quantity, max, total) => {
    const newOrder = reorderItemList;
    newOrder.push({
      id: id,
      code: code,
      name: name,
      cost: cost,
      measurement: measurement,
      quantity: quantity,
      max: max,
      total: total,
    });
    setReorderItemList(newOrder);
    reorderItemList.sort(function (a, b) {
      return a.id - b.id;
    });
    setReorderItemCount(reorderItemList.length);
  };

  const newItem = (id, code, name, cost, measurement, quantity, max) => {
    if (warehouseCode === "Select Warehouse") {
      api.info(
        NotificationEvent(
          false,
          "Select the warehouse to which you want to transfer the item" +
            String(reorderItemCount > 1 ? "s." : ".")
        )
      );
    } else {
      if (total !== "0.00") {
        if (max >= quantity || warehouseCategory(warehouseCode) === "main") {
          removeItem(code);
          addItem(id, code, name, cost, measurement, quantity, max, total);
          setInputStatus("");
          api.info(NotificationEvent(true, "Item " + code + " added to cart."));
        } else {
          api.info(
            NotificationEvent(
              false,
              "Stock on hand is less than the planned quantity."
            )
          );
        }
      } else {
        setInputStatus("error");
        api.info(NotificationEvent(false, "Add item quantity."));
      }
    }
  };

  const sumOrder = (itemList) => {
    const sum = itemList.reduce(
      (acc, item) => parseFloat(acc) + parseFloat(item.total),
      0
    );
    return sum.toFixed(2);
  };

  const onQuantityChange = (value) => {
    setTotal((parseFloat(queryItem["0"]["cost"]) * value).toFixed(2));
    setQuantity(value);
  };

  const transactionDetail = (action, itemList, warehouseCode) => {
    switch (action) {
      case "Reorder":
        var details = "";
        Object.values(itemList).forEach(
          (val) =>
            (details +=
              "id=" +
              val["id"] +
              ", code=" +
              val["code"] +
              ", name=" +
              val["name"] +
              ", cost=" +
              val["cost"] +
              ", measurement=" +
              val["measurement"] +
              ", quantity=" +
              val["quantity"] +
              ", total=" +
              val["total"] +
              ", checked=" +
              false +
              ", to_warehouse=" +
              warehouseCode +
              "/*/")
        );
        return details;
      case "Receive":
        return "Receive order.";
      default:
        break;
    }
  };

  const transactionStatus = (code, status) => {
    const token = sessionStorage.getItem("token");
    return axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_API_URL}/api/transaction`,
      data: { trans_code: code, trans_status: status },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    }).catch((err) => {
      console.log(err);
      setSuccess(false);
    });
  };

  const addTransaction = (action, detail, status) => {
    var transactionData = {
      trans_code: "",
      trans_action: action,
      trans_date: moment().format("YYYY-MM-DD HH:mm:ss"),
      trans_user: String(userId) + " - " + userName,
      trans_detail: detail,
      trans_status: status,
    };
    const token = sessionStorage.getItem("token");
    return axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/api/transaction`,
      data: transactionData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        setTransactionCode("TRA" + String(response.data["id"]));
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
      });
  };

  const reorderOrder = (itemList, warehouseCode) => {
    addTransaction(
      "Reorder",
      transactionDetail("Reorder", itemList, warehouseCode),
      "Pending",
      userId,
      userName
    );
    setSuccess(true);
    setQueryItem([]);
    setSearchValue("");
    clearOrder();
  };

  const receiveOrder = (itemList) => {
    transactionStatus(queryCode, "Complete")
      .then(() => {
        return addTransaction(
          "Receive",
          transactionDetail("Receive", itemList, ""),
          "Complete",
          userId,
          userName
        );
      })
      .then(() => {
        const token = sessionStorage.getItem("token");
        return axios({
          method: "PATCH",
          url: `${process.env.REACT_APP_API_URL}/api/warehouseitemupdate`,
          data: itemList.map((item) => {
            return {
              id: item.id,
              item_code: item.code,
              warehouse_code: item.to_warehouse,
              item_onhand: item.quantity,
            };
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          withCredentials: true,
        });
      })
      .then(() => {
        setSuccess(true);
        setQueryItem([]);
        setSearchValue("");
        clearOrder();
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
      });
  };

  const clearOrder = () => {
    switch (segment) {
      case "Reorder":
        setReorderItemList([]);
        setReorderItemCount(0);
        break;
      case "Receive":
        setReceiveItemList([]);
        setReceiveItemCount(0);
        break;
      default:
        break;
    }
  };

  const clearSearch = () => {
    setQueryItem([]);
    setTotal("0.00");
  };

  const showDrawer = () => {
    switch (segment) {
      case "Reorder":
        if (warehouseCode === "Select Warehouse") {
          api.info(
            NotificationEvent(
              false,
              "Select the warehouse to which you want to transfer the item" +
                String(reorderItemCount > 1 ? "s." : ".")
            )
          );
        } else {
          if (reorderItemCount !== 0) {
            setOpenDrawer(true);
          } else {
            api.info(NotificationEvent(false, "No item in the cart."));
          }
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
  };

  const onCloseDrawer = () => {
    setOpenDrawer(false);
    setSuccess(false);
  };

  const handleCheckChange = (
    itemsToSort,
    codes,
    setToTrue,
    setToToggle,
    filteredItem
  ) => {
    let mapItems = (items) => {
      return items.map((item) => {
        if (codes.includes(item.code)) {
          if (setToToggle) {
            return {
              ...item,
              checked: item.checked === "true" ? "false" : "true",
            };
          } else {
            if (setToTrue) {
              return { ...item, checked: "true" };
            } else {
              return { ...item, checked: "false" };
            }
          }
        }
        return item;
      });
    };

    let updatedItemList = mapItems(itemsToSort);
    let updatedFilteredItemList =
      filteredItem.length > 0 ? mapItems(filteredItem) : [];

    setReceiveItemList(updatedItemList);
    setFilteredItem(updatedFilteredItemList);
  };

  const parseStringToDictionaries = (inputString) => {
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
  };

  const searchItem = (value, segment) => {
    setQueryCode(value.toUpperCase());
    clearSearch();
    switch (segment) {
      case "Issue":
      case "Return":
        break;
      case "Adjust":
      case "Reorder":
        warehouseitems.forEach((item) => {
          if (
            item.item_code === value.toUpperCase() &&
            item.warehouse_code === sectionCode
          ) {
            items.map((i) =>
              i.item_code === item.item_code
                ? setQueryItem([
                    {
                      id: i.id,
                      code: i.item_code,
                      name: i.item_name,
                      cost: i.item_cost,
                      measurement: i.item_measurement,
                    },
                  ])
                : ""
            );
          }
        });
        break;
      case "Receive":
        transactions.forEach((transaction) => {
          if (transaction.trans_code === value.toUpperCase()) {
            if (transaction.trans_status === "Pending") {
              setQueryItem([
                {
                  code: transaction.trans_code,
                  action: transaction.trans_action,
                  date: transaction.trans_date,
                  detail: transaction.trans_detail,
                  status: transaction.trans_status,
                },
              ]);
              setReceiveItemList(
                parseStringToDictionaries(transaction.trans_detail)
              );
              setReceiveItemCount(
                parseStringToDictionaries(transaction.trans_detail).length
              );
            }
          }
        });
        break;
      default:
        break;
    }
    if (queryItem.length > 0) {
      return segment;
    } else {
      return false;
    }
  };

  const checkResult = () => {
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
  };

  const componentSwitch = (key) => {
    switch (key) {
      case "Reorder":
        return queryItem.length > 0 ? (
          <>
            <Row>
              <Col span={14} style={{ paddingRight: "20px" }}>
                <ItemDetail
                  items={items}
                  warehouseitems={warehouseitems}
                  options={options}
                  itemcode={queryItem["0"]["code"]}
                  view={true}
                  sectionCode={sectionCode}
                  theme={theme}
                />
              </Col>
              <Col span={10} className="flex-start-row">
                <Col
                  span={24}
                  className="card-with-background"
                  style={{
                    padding: "20px 40px",
                    maxHeight: "274px",
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
                        onClick={() => {
                          newItem(
                            queryItem["0"]["id"],
                            queryItem["0"]["code"],
                            queryItem["0"]["name"],
                            queryItem["0"]["cost"],
                            queryItem["0"]["measurement"],
                            quantity,
                            checkItem(queryItem["0"]["code"])
                          );
                        }}
                      >
                        ADD TO CART
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Col>
            </Row>
          </>
        ) : (
          ""
        );
      case "Receive":
        return queryItem.length > 0 ? (
          <>
            <Row>
              <Col span={14} style={{ paddingRight: "20px" }}>
                <ItemList
                  view={true}
                  segment={segment}
                  itemList={receiveItemList}
                  setFilteredItem={setFilteredItem}
                  filteredItem={filteredItem}
                  theme={theme}
                />
              </Col>
              <Col span={10} className="flex-start-row">
                <Col
                  span={24}
                  className="card-with-background"
                  style={{
                    padding: "20px 40px",
                    maxHeight: "274px",
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
                        title: "Status: " + queryItem["0"]["status"],
                      },
                    ]}
                  />
                  <p className="big-card-title" style={{ padding: "10px 0" }}>
                    Php. {sumOrder(receiveItemList)}
                  </p>
                  <Button size="large" type="primary" onClick={showDrawer}>
                    CONFIRM
                  </Button>
                </Col>
              </Col>
            </Row>
          </>
        ) : (
          ""
        );
      case false:
        return <EmptyData theme={theme} />;
      default:
        break;
    }
  };

  const placeholderLabel = () => {
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
  };

  const onWarehouseChange = (value) => {
    const warehouseCode = sections.find(
      (sec) => sec.section_code === value
    )?.section_code;
    setWarehouseCode(warehouseCode);
    setReorderItemList([]);
    setReorderItemCount(0);
  };

  const warehouseCategory = (warehouse) => {
    const category = sections.find(
      (sec) => sec.section_code === warehouse
    )?.section_category;
    return category;
  };

  return (
    <>
      {contextHolder}
      <div className={`justified-row ${theme}`}>
        <div className="card-custom-size-full">
          <Card
            className="custom-card-head-title"
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
                    setFilteredItem("");
                  }}
                />
              </Title>
            }
          >
            <Row
              className="card-with-background space-between-row"
              style={{
                padding: "10px",
                marginBottom: "30px",
              }}
            >
              <Col span={segment === "Reorder" ? 17 : 24}>
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
                <Col span={6}>
                  <Row className="space-between-row ">
                    <Col span={18} className="flex-end-row">
                      <Select
                        size="large"
                        placeholder="To Warehouse"
                        value={warehouseCode}
                        showSearch
                        className="bordered-select"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "").toLowerCase().includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={sections
                          .filter((sec) => sec.section_type === "warehouse")
                          .map((sec) => ({
                            value: sec.section_code,
                            label: sec.section_code,
                          }))}
                        style={{ width: "100%" }}
                        onChange={onWarehouseChange}
                      />
                    </Col>
                    <Col span={5} className="flex-end-row">
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
                  </Row>
                </Col>
              ) : (
                ""
              )}
            </Row>
            <div>{componentSwitch(checkResult())}</div>
          </Card>
        </div>
      </div>
      <DrawerEvent
        segment={segment}
        setQueryItem={setQueryItem}
        setSearchValue={setSearchValue}
        addItem={addItem}
        removeItem={removeItem}
        itemCount={
          segment === "Reorder"
            ? reorderItemCount
            : segment === "Receive"
            ? receiveItemCount
            : 0
        }
        itemList={
          segment === "Reorder"
            ? reorderItemList
            : segment === "Receive"
            ? receiveItemList
            : 0
        }
        setFilteredItem={setFilteredItem}
        filteredItem={filteredItem}
        handleCheckChange={handleCheckChange}
        reorderOrder={reorderOrder}
        receiveOrder={receiveOrder}
        success={success}
        transactionCode={transactionCode}
        warehouseCode={warehouseCode}
        warehouseCategory={warehouseCategory}
        clearOrder={clearOrder}
        showDrawer={openDrawer}
        onCloseDrawer={onCloseDrawer}
        comp="Cart"
        sectionCode={sectionCode}
        collapsed={collapsed}
        theme={theme}
        overflow={false}
        showClose={false}
      />
    </>
  );
};

export default Transact;
