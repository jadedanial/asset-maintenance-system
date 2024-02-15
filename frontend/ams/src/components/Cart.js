import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Card, Button, Select, notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import ResultEvent from "./ResultEvent";
import NotificationEvent from "./NotificationEvent";
import ItemList from "./ItemList";
import EmptyData from "./EmptyData";
import moment from "moment";

const { Title } = Typography;

const Cart = (props) => {
  const [totalOrder, setTotalOrder] = useState("0.00");
  const [searchItemCode, setSearchItemCode] = useState("");
  const [filteredItem, setFilteredItem] = useState("");
  const [success, setSuccess] = useState(false);
  const [transactionID, setTransactionID] = useState("");
  const [warehouseCode, setWarehouseCode] = useState("");
  const [sections, setSections] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  function sumOrder() {
    setTotalOrder("0.00");
    const sum = props.itemList.reduce(
      (acc, item) => parseFloat(acc) + parseFloat(item.total),
      0
    );
    setTotalOrder(sum.toFixed(2));
  }

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
    if (filteredItem.length > 0) {
      const filteredData = props.itemList.filter(
        (item) => item.code.toLowerCase() === code.toLowerCase()
      );
      setFilteredItem(filteredData);
    } else {
      setFilteredItem("");
    }
  }

  function deleteItem(code) {
    props.removeItem(code);
    sumOrder();
    setSearchItemCode("");
    setFilteredItem("");
  }

  function transactionDetail() {
    var details = "";
    Object.values(props.itemList).forEach(
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
          ", warehouse=" +
          warehouseCode +
          "/*/")
    );
    return details;
  }

  function addTransaction() {
    var transactionData = {
      trans_code: "",
      trans_action:
        "Reorder from " + props.sectionCode + " to " + warehouseCode,
      trans_date: moment().format("YYYY-MM-DD HH:mm:ss"),
      trans_user: String(props.empid) + " - " + props.username,
      trans_detail: transactionDetail(),
    };
    axios({
      method: "POST",
      url: "http://localhost:8000/api/transaction",
      data: transactionData,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        setTransactionID("TRA" + String(response.data["id"]));
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
      });
  }

  function warehouseItemOrder(itemList) {
    let newList = itemList.map((item) => {
      return {
        id: item.id,
        item_code: item.code,
        warehouse_code: warehouseCode,
        item_onhand: item.quantity,
      };
    });
    return newList;
  }

  function checkoutOrder() {
    axios({
      method: "PATCH",
      url: "http://localhost:8000/api/warehouseitemupdate",
      data: warehouseItemOrder(props.itemList),
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then(() => {
        setSuccess(true);
        addTransaction();
        props.clearOrder();
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
      });
  }

  function onWarehouseChange(value) {
    const warehouseCode = sections.find(
      (sec) => sec.section_code === value
    )?.section_code;
    setWarehouseCode(warehouseCode);
  }

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:8000/api/sections",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        setSections(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    sumOrder();
  }, []);

  if (success) {
    return (
      <>
        <ResultEvent
          icon={<CheckCircleOutlined style={{ color: "#318ce7" }} />}
          status="success"
          title={
            props.itemCount > 1
              ? "Successfully added Items to inventory."
              : "Successfully added Item to inventory."
          }
          subTitle={"Transaction ID " + String(transactionID)}
          extra={[
            <Button size="large" type="primary" onClick={props.onCloseDrawer}>
              REORDER ITEM
            </Button>,
          ]}
        />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <div className={`justified-row ${props.theme}`}>
        <div className="card-custom-size-full">
          <Card
            size="large"
            title={
              <Title>
                <p className="big-card-title">
                  Cart ({props.itemCount}
                  {props.itemCount > 1 ? " Items" : " Item"}){" | "}
                  {"Php. "}
                  {totalOrder}
                </p>
              </Title>
            }
            extra={
              totalOrder > 0.0 ? (
                props.segment === "Reorder" ? (
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
                    <Select
                      size="large"
                      placeholder="Select Warehouse"
                      showSearch
                      className="bordered-select"
                      style={{
                        marginRight: "10px",
                      }}
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
                      onChange={onWarehouseChange}
                    />
                    <Button
                      size="large"
                      type="primary"
                      onClick={() => {
                        if (warehouseCode !== "") {
                          checkoutOrder();
                        } else {
                          api.info(
                            NotificationEvent(
                              false,
                              "Select the warehouse to which you want to transfer the items."
                            )
                          );
                        }
                      }}
                      block
                    >
                      CHECK OUT
                    </Button>
                  </div>
                ) : props.segment === "Receive" ? (
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => {
                      if (warehouseCode !== "") {
                        checkoutOrder();
                      } else {
                        api.info(
                          NotificationEvent(
                            false,
                            "Select the warehouse to which you want to transfer the items."
                          )
                        );
                      }
                    }}
                    block
                  >
                    APPLY
                  </Button>
                ) : (
                  ""
                )
              ) : (
                ""
              )
            }
          >
            {props.itemCount > 0 ? (
              <>
                <ItemList
                  view={false}
                  segment={props.segment}
                  itemList={props.itemList}
                  changeQuantity={changeQuantity}
                  deleteItem={deleteItem}
                  setSearchItemCode={setSearchItemCode}
                  searchItemCode={searchItemCode}
                  setFilteredItem={setFilteredItem}
                  filteredItem={filteredItem}
                  theme={props.theme}
                />
              </>
            ) : (
              <EmptyData theme={props.theme} />
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Cart;
