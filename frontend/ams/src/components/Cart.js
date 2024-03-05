import React, { useState, useEffect, useCallback } from "react";
import { Typography, Card, Button, Col, Row, notification } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import ResultEvent from "./ResultEvent";
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
    let itemsToSort = filteredItem.length > 0 ? filteredItem : itemList;

    itemsToSort.sort((a, b) => {
      let valA = key === "total" ? parseInt(a[key], 10) : a[key];
      let valB = key === "total" ? parseInt(b[key], 10) : b[key];

      if (valA < valB) {
        return ascending === "false" ? -1 : 1;
      }
      if (valA > valB) {
        return ascending === "true" ? 1 : -1;
      }
      return 0;
    });
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
    sortItems(sort.split("-")[0], sort.split("-")[1]);
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

  if (success) {
    return (
      <>
        <ResultEvent
          icon={<CheckOutlined style={{ color: "#318ce7" }} />}
          status="success"
          title={message}
          subTitle={"Transaction ID " + String(transactionCode)}
          extra={
            <Row className="space-between-row" style={{ width: "40%" }}>
              <Col span={12}>
                <Button
                  size="large"
                  type="default"
                  onClick={onCloseDrawer}
                  block
                >
                  CLOSE
                </Button>
              </Col>
              <Col span={11}>
                <Button
                  size="large"
                  type="primary"
                  onClick={onCloseDrawer}
                  block
                >
                  NEW TRANSACTION
                </Button>
              </Col>
            </Row>
          }
          theme={theme}
        />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <div className={`justified-row ${theme}`}>
        <div className="card-custom-size-full">
          <Card
            size="large"
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
                <Button
                  size="large"
                  type="default"
                  style={{
                    marginRight: "10px",
                  }}
                  onClick={onCloseDrawer}
                  block
                >
                  CANCEL
                </Button>
                {totalOrder > 0.0 ? (
                  segment === "Reorder" ? (
                    <div className="space-between-row">
                      <Button
                        size="large"
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
                        block
                      >
                        CHECK OUT
                      </Button>
                    </div>
                  ) : segment === "Receive" ? (
                    <Button
                      size="large"
                      type="primary"
                      onClick={() => {
                        if (checkAllState(itemList)) {
                          receiveOrder(itemList);
                        } else {
                          setFilteredItem(
                            itemList.filter((item) => item.checked === "false")
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
    </>
  );
};

export default Cart;
