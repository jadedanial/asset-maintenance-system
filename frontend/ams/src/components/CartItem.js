import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  Col,
  List,
  Button,
  Tooltip,
  Select,
  notification,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  CloseOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import ResultEvent from "../components/ResultEvent";
import NotificationEvent from "./NotificationEvent";
import moment from "moment";

const { Title } = Typography;

const CartItem = (props) => {
  const [totalOrder, setTotalOrder] = useState("0.00");
  const [itemCount, setItemCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [transactionID, setTransactionID] = useState("");
  const [warehouseCode, setWarehouseCode] = useState("");
  const [sections, setSections] = useState([]);
  const [api, contextHolder] = notification.useNotification();

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
  }

  function deleteItem(code) {
    props.removeItem(code);
    sumOrder();
  }

  function sumOrder() {
    setTotalOrder("0.00");
    const sum = props.orderList.reduce(
      (acc, item) => parseFloat(acc) + parseFloat(item.total),
      0
    );
    setTotalOrder(sum.toFixed(2));
  }

  function transactionDetail() {
    var details = "";
    Object.values(props.orderList).forEach(
      (val) =>
        (details +=
          "Item: " +
          val["item_code"] +
          ", Name: " +
          val["item_name"] +
          ", Cost: " +
          val["item_cost"] +
          ", Quantity: " +
          val["item_onhand"] +
          ", Total: " +
          val["total"] +
          ", Warehouse: " +
          warehouseCode +
          "\n")
    );
    return details;
  }

  function addTransaction() {
    var transactionData = {
      trans_id: "",
      trans_type: "Reorder Item",
      trans_action: "Add",
      trans_date: moment().format("YYYY-MM-DD HH:mm:ss"),
      trans_user: String(props.empid) + " - " + props.username,
      trans_detail: transactionDetail(),
    };
    axios({
      method: "POST",
      url: "http://localhost:8000/api/transaction/",
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

  function warehouseItemOrder(orderList) {
    let newList = orderList.map((item) => {
      return {
        id: item.id,
        item_code: item.item_code,
        warehouse_code: warehouseCode,
        item_onhand: item.item_onhand,
      };
    });
    return newList;
  }

  function checkoutOrder() {
    axios({
      method: "PATCH",
      url: "http://localhost:8000/api/warehouseitemupdate/",
      data: warehouseItemOrder(props.orderList),
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then(() => {
        setItemCount(props.itemCount);
        setSuccess(true);
        addTransaction();
        props.clearOrder();
        props.searchItem(props.item);
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
            itemCount > 1
              ? "Successfully added Items to inventory."
              : "Successfully added Item to inventory."
          }
          subTitle={"Transaction ID " + String(transactionID)}
          extra={[
            <Button size="large" type="primary" onClick={props.onCloseDrawer}>
              REORDER ANOTHER ITEM
            </Button>,
          ]}
        />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="justified-row">
        <div className="card-custom-size">
          <Card
            size="large"
            extra={
              totalOrder > 0.0 ? (
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
                            "Select the warehouse to which the items will be transferred."
                          )
                        );
                      }
                    }}
                    block
                  >
                    CHECK OUT
                  </Button>
                </div>
              ) : (
                ""
              )
            }
            title={
              <Title>
                <p className="big-card-title" style={{ color: "#318ce7" }}>
                  Cart ({props.itemCount}
                  {props.itemCount > 1 ? " Items" : " Item"})
                </p>
              </Title>
            }
            hoverable
          >
            {totalOrder > 0.0 ? (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <Select
                    size="large"
                    placeholder="Select Warehouse"
                    showSearch
                    className="small-font"
                    style={{ width: "100%" }}
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
                </div>
                <Card
                  size="small"
                  id="card-content-justify-center"
                  style={{
                    padding: "10px 20px",
                    fontWeight: "800",
                  }}
                >
                  <div className="space-between-row">
                    <p className="large-font">Total Cost</p>
                    <p className="large-font">Php. {totalOrder}</p>
                  </div>
                </Card>
              </>
            ) : (
              ""
            )}
            <List
              itemLayout="horizontal"
              dataSource={props.orderList}
              renderItem={(item, index) => (
                <List.Item>
                  <Card
                    size="small"
                    id="card-content-justify-center"
                    title={
                      <Title>
                        <div
                          className="space-between-row align-items-center"
                          style={{ height: "25px" }}
                        >
                          <Col span={10}>
                            <p className="medium-card-title">
                              {item.item_code}
                            </p>
                          </Col>
                          <Col span={8}>
                            <p className="medium-card-title">Quantity</p>
                          </Col>
                          <Col
                            span={6}
                            className="space-between-row"
                            style={{ paddingBottom: "15px" }}
                          >
                            <Col span={8}>
                              <Tooltip>
                                <Button
                                  className="btn-blue"
                                  type="link"
                                  onClick={() =>
                                    changeQuantity(
                                      "add",
                                      item.id,
                                      item.item_code,
                                      item.item_name,
                                      item.item_cost,
                                      item.item_measurement,
                                      item.item_onhand
                                    )
                                  }
                                >
                                  <PlusOutlined className="medium-card-title" />
                                </Button>
                              </Tooltip>
                            </Col>
                            <Col span={8}>
                              <Tooltip>
                                <Button
                                  className="btn-blue"
                                  type="link"
                                  onClick={() =>
                                    changeQuantity(
                                      "less",
                                      item.id,
                                      item.item_code,
                                      item.item_name,
                                      item.item_cost,
                                      item.item_measurement,
                                      item.item_onhand
                                    )
                                  }
                                >
                                  <MinusOutlined className="medium-card-title" />
                                </Button>
                              </Tooltip>
                            </Col>
                            <Col span={8}>
                              <Tooltip>
                                <Button
                                  className="btn-blue"
                                  danger
                                  type="link"
                                  onClick={() => deleteItem(item.item_code)}
                                >
                                  <CloseOutlined className="large-card-title" />
                                </Button>
                              </Tooltip>
                            </Col>
                          </Col>
                        </div>
                      </Title>
                    }
                    style={{
                      width: "100%",
                      padding: "20px",
                      background: "#e6fcff",
                    }}
                    hoverable
                  >
                    <div
                      className="space-between-row"
                      style={{ alignItems: "center" }}
                    >
                      <Col span={8} style={{ marginRight: "30px" }}>
                        <p className="medium-font">{item.item_name}</p>
                      </Col>
                      <Col span={7}>
                        <p className="medium-font">
                          {item.item_onhand}{" "}
                          {item.item_onhand > 1
                            ? item.item_measurement + "s"
                            : item.item_measurement}
                        </p>
                      </Col>
                      <Col
                        span={6}
                        className="flex-end-row"
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <p
                          className="medium-font"
                          style={{ textAlign: "right" }}
                        >
                          {item.total}
                        </p>
                      </Col>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default CartItem;
