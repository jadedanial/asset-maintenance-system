import React, { useState, useEffect, useCallback } from "react";
import { Typography, Card, Button, Col, Row, notification } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ResultEvent from "./ResultEvent";
import Spinner from "../components/Spinner";
import NotificationEvent from "./NotificationEvent";
import ItemList from "./ItemList";
import EmptyData from "./EmptyData";

const { Title } = Typography;

const Cart = ({
  itemCount,
  segment,
  itemList,
  warehouseCategory,
  warehouseCode,
  removeItem,
  addItem,
  filteredItem,
  setFilteredItem,
  submit,
  loading,
  success,
  transactionCode,
  reorderOrder,
  receiveOrder,
  handleCheckChange,
  onCloseDrawer,
  theme,
}) => {
  const [totalOrder, setTotalOrder] = useState("0.00");
  const [warning, setWarning] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const messageMap = {
    Reorder: "Successfully ordered",
    Receive: "Successfully received",
  };

  const itemWord = itemCount > 1 ? "items" : "item";
  const message = `${messageMap[segment]} ${itemWord}.`;

  const sortItems = (key, ascending) => {
    let itemsToSort = filteredItem;
    if (itemsToSort.length > 0) {
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
    }
    setFilteredItem(itemsToSort);
  };

  const sumOrder = useCallback(() => {
    setTotalOrder("0.00");
    const sum = itemList.reduce(
      (acc, item) => parseFloat(acc) + parseFloat(item.total),
      0
    );
    setTotalOrder(sum.toFixed(2));
  }, [itemList]);

  const changeQuantity = (
    action,
    id,
    code,
    name,
    cost,
    measurement,
    quantity,
    max,
    sort
  ) => {
    if (quantity >= 1) {
      if (action === "add") {
        if (max <= quantity && warehouseCategory(warehouseCode) !== "main") {
          quantity = max;
          api.info(
            NotificationEvent(
              false,
              "Stock on hand is less than the planned quantity."
            )
          );
        } else {
          quantity += 1;
        }
      } else {
        if (quantity !== 1) {
          quantity -= 1;
        }
      }
      var total = parseFloat(cost * quantity).toFixed(2);
      removeItem(code);
      addItem(id, code, name, cost, measurement, quantity, max, total);
    }
    sumOrder();
    sortItems(sort.split("-")[0], sort.split("-")[1] === "true" ? true : false);
    if (filteredItem.length === 1) {
      const filteredData = itemList.filter(
        (item) => item.code.toLowerCase() === code.toLowerCase()
      );
      setFilteredItem(filteredData);
    }
  };

  const deleteItem = (code) => {
    removeItem(code);
    sumOrder();
    setFilteredItem("");
  };

  const checkAllState = (checkedState) => {
    if (checkedState.every((item) => item.checked === "true")) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    sumOrder();
  }, [sumOrder]);

  return (
    <>
      {contextHolder}
      {submit ? (
        loading ? (
          <Spinner height={"60%"} theme={theme} />
        ) : (
          <ResultEvent
            icon={success ? <CheckOutlined /> : <CloseOutlined />}
            status={success ? "success" : "error"}
            title={success ? message : "Transaction failed."}
            subTitle={
              success
                ? "Transaction ID " + String(transactionCode)
                : "System error."
            }
            extra={
              <Row className="space-between-row">
                <Col span={12}>
                  <Button type="default" onClick={onCloseDrawer} block>
                    CLOSE
                  </Button>
                </Col>
                <Col span={12} style={{ paddingLeft: "10px" }}>
                  <Button type="primary" onClick={onCloseDrawer} block>
                    NEW TRANSACTION
                  </Button>
                </Col>
              </Row>
            }
            height="70%"
            theme={theme}
          />
        )
      ) : (
        <div className={`justified-row ${theme}`}>
          <div className="card-custom-size-full">
            <Card
              title={
                <Title>
                  <p className="big-card-title">
                    Cart ({itemCount}
                    {itemCount > 1 ? " Items" : " Item"}){" | "}
                    {"Php. "}
                    {totalOrder}
                  </p>
                </Title>
              }
              extra={
                <div className="space-between-row">
                  <Button type="default" onClick={onCloseDrawer} block>
                    CANCEL
                  </Button>
                  {totalOrder > 0.0 ? (
                    segment === "Reorder" ? (
                      <div className="space-between-row">
                        <Button
                          type="primary"
                          onClick={() => {
                            if (warehouseCode !== "") {
                              reorderOrder(itemList, warehouseCode);
                            } else {
                              api.info(
                                NotificationEvent(
                                  false,
                                  "Select the warehouse to which you want to transfer the items."
                                )
                              );
                            }
                          }}
                          style={{
                            marginLeft: "10px",
                          }}
                          block
                        >
                          CHECK OUT
                        </Button>
                      </div>
                    ) : segment === "Receive" ? (
                      <Button
                        type="primary"
                        onClick={() => {
                          if (checkAllState(itemList)) {
                            receiveOrder(itemList);
                          } else {
                            setFilteredItem(
                              itemList.filter(
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
                        style={{
                          marginLeft: "10px",
                        }}
                        block
                      >
                        APPLY
                      </Button>
                    ) : (
                      ""
                    )
                  ) : (
                    <></>
                  )}
                </div>
              }
            >
              {itemCount > 0 ? (
                <>
                  <ItemList
                    view={false}
                    segment={segment}
                    itemList={itemList}
                    setFilteredItem={setFilteredItem}
                    filteredItem={filteredItem}
                    handleCheckChange={handleCheckChange}
                    changeQuantity={changeQuantity}
                    deleteItem={deleteItem}
                    setWarning={setWarning}
                    warning={warning}
                    theme={theme}
                  />
                </>
              ) : (
                <EmptyData theme={theme} />
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
