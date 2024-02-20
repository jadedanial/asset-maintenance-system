import React, { useState, useEffect, useCallback } from "react";
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
  const [success, setSuccess] = useState(false);
  const [transactionCode, setTransactionCode] = useState("");
  const [warehouseCode, setWarehouseCode] = useState("");
  const [sections, setSections] = useState([]);
  const [warning, setWarning] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const messageMap = {
    Reorder: "Successfully ordered",
    Receive: "Successfully received",
  };

  const itemWord = props.itemCount > 1 ? "items" : "item";
  const message = `${messageMap[props.segment]} ${itemWord}.`;

  const sumOrder = useCallback(() => {
    setTotalOrder("0.00");
    const sum = props.itemList.reduce(
      (acc, item) => parseFloat(acc) + parseFloat(item.total),
      0
    );
    setTotalOrder(sum.toFixed(2));
  }, [props.itemList]);

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
    if (props.filteredItem.length > 0) {
      const filteredData = props.itemList.filter(
        (item) => item.code.toLowerCase() === code.toLowerCase()
      );
      props.setFilteredItem(filteredData);
    } else {
      props.setFilteredItem("");
    }
  }

  function deleteItem(code) {
    props.removeItem(code);
    sumOrder();
    props.setFilteredItem("");
  }

  function onWarehouseChange(value) {
    const warehouseCode = sections.find(
      (sec) => sec.section_code === value
    )?.section_code;
    setWarehouseCode(warehouseCode);
  }

  function warehouseItemOrder(itemList) {
    let newList = itemList.map((item) => {
      return {
        id: item.id,
        item_code: item.code,
        warehouse_code: item.to_warehouse,
        item_onhand: item.quantity,
      };
    });
    return newList;
  }

  function transactionDetail(action) {
    switch (action) {
      case "Reorder":
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
  }

  function transactionStatus(code, status) {
    return axios({
      method: "PATCH",
      url: "http://localhost:8000/api/transaction",
      data: { trans_code: code, trans_status: status },
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).catch((err) => {
      console.log(err);
      setSuccess(false);
    });
  }

  function addTransaction(action, detail, status) {
    var transactionData = {
      trans_code: "",
      trans_action: action,
      trans_date: moment().format("YYYY-MM-DD HH:mm:ss"),
      trans_user: String(props.empid) + " - " + props.username,
      trans_detail: detail,
      trans_status: status,
    };
    return axios({
      method: "POST",
      url: "http://localhost:8000/api/transaction",
      data: transactionData,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        setTransactionCode("TRA" + String(response.data["id"]));
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
      });
  }

  function receiveOrder() {
    transactionStatus(props.itemCode, "Complete")
      .then(() => {
        return addTransaction(
          "Receive",
          transactionDetail("Receive"),
          "Complete"
        );
      })
      .then(() => {
        return axios({
          method: "PATCH",
          url: "http://localhost:8000/api/warehouseitemupdate",
          data: warehouseItemOrder(props.itemList),
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      })
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
      });
  }

  function checkOutOrder() {
    addTransaction("Reorder", transactionDetail("Reorder"), "Pending");
    setSuccess(true);
  }

  function checkAllState(checkedState) {
    if (checkedState.every((item) => item.checked === "true")) {
      return true;
    } else {
      return false;
    }
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
  }, [sumOrder]);

  if (success) {
    return (
      <>
        <ResultEvent
          icon={<CheckCircleOutlined style={{ color: "#318ce7" }} />}
          status="success"
          title={message}
          subTitle={"Transaction ID " + String(transactionCode)}
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
                          checkOutOrder();
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
                      if (checkAllState(props.itemList)) {
                        receiveOrder();
                      } else {
                        props.setFilteredItem(
                          props.itemList.filter(
                            (item) => item.checked === "false"
                          )
                        );
                        setWarning(true);
                        setTimeout(() => {
                          api.info(
                            NotificationEvent(
                              false,
                              "Ensure all item quantities are equal, then confirm by checking the box."
                            )
                          );
                        }, 50);
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
                  setFilteredItem={props.setFilteredItem}
                  filteredItem={props.filteredItem}
                  handleCheckChange={props.handleCheckChange}
                  changeQuantity={changeQuantity}
                  deleteItem={deleteItem}
                  setWarning={setWarning}
                  warning={warning}
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
