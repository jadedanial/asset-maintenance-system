import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { Card, Typography, Tag, Col, Descriptions, Button, List } from "antd";
import AddUpdateItem from "./AddUpdateItem";

const { Title } = Typography;

const ItemDetail = (props) => {
  const [update, setUpdate] = useState(false);
  const [warehouse, setWarehouse] = useState([]);
  const [item, setItem] = useState([]);
  const [warehouseItem, setWarehouseItem] = useState([]);

  function otherWarehouse() {
    var data = [];
    warehouseItem.map((wi) =>
      wi.item_code === props.itemcode
        ? warehouse.map((w) =>
            w.warehouse_code === wi.warehouse_code
              ? w.warehouse_branch !== props.employeeBranch
                ? data.push({
                    title: w.warehouse_name,
                    description: (
                      <>
                        <p style={{ marginBottom: "0", lineHeight: "1.2" }}>
                          On Hand: {wi.item_onhand}
                        </p>
                        <p style={{ marginBottom: "0", lineHeight: "1.2" }}>
                          Physical Location: {wi.item_location}
                        </p>
                      </>
                    ),
                  })
                : ""
              : ""
          )
        : ""
    );
    return data;
  }

  function itemDetails(i, wi) {
    return (
      <>
        <div className="space-between-row align-items-end">
          <Col span={13} style={{ height: "fit-content" }}>
            <p className="medium-font" style={{ paddingBottom: "18px" }}>
              {i.item_name}
            </p>
            <p className="large-card-title" style={{ paddingBottom: "8px" }}>
              Php. {i.item_cost}
            </p>
            <Descriptions layout="horizontal" column={1} className="small-font">
              <Descriptions.Item label="On Hand">
                {wi.item_onhand}
              </Descriptions.Item>
              <Descriptions.Item
                label="Physical Location"
                style={{
                  display: props.mode === "view" ? "none" : "block",
                }}
              >
                {wi.item_location}
              </Descriptions.Item>
              <Descriptions.Item
                label="Unit Of Measurement"
                style={{
                  display: props.mode === "view" ? "none" : "block",
                }}
              >
                {i.item_measurement}
              </Descriptions.Item>
              <Descriptions.Item
                label="Reorder Quantity"
                style={{
                  display: props.mode === "view" ? "none" : "block",
                }}
              >
                {i.item_reorder}
              </Descriptions.Item>
            </Descriptions>
            <div
              style={{
                marginTop: "10px",
              }}
            >
              <Tag color="blue">
                <p
                  className="small-font"
                  style={{ color: "#318ce7", padding: "2px" }}
                >
                  {i.item_category}
                </p>
              </Tag>
            </div>
          </Col>
          <Col span={9}>
            <QRCode
              value={i.item_code}
              style={{
                height: "auto",
                width: "100%",
              }}
            />
          </Col>
        </div>
        <p
          className="medium-font"
          style={{
            padding: "20px 0",
            display: props.mode === "view" ? "none" : "block",
          }}
        >
          {i.item_description}
        </p>
        <List
          grid={{ gutter: 16, column: 2 }}
          itemLayout="horizontal"
          header={<p className="medium-card-title">Stock On Other Warehouse</p>}
          dataSource={otherWarehouse()}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
          style={{
            display: props.mode === "view" ? "none" : "block",
          }}
        />
      </>
    );
  }

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

  useEffect(() => {
    fetchData("http://localhost:8000/api/warehouses", setWarehouse);
  }, []);

  useEffect(() => {
    fetchData("http://localhost:8000/api/items", setItem);
  }, []);

  useEffect(() => {
    fetchData("http://localhost:8000/api/warehouseitems", setWarehouseItem);
  }, []);

  return (
    <>
      {warehouseItem.map((wi) =>
        wi.item_code === props.itemcode
          ? warehouse.map((w) =>
              w.warehouse_code === wi.warehouse_code
                ? w.warehouse_branch === props.employeeBranch
                  ? item.map((i) =>
                      i.item_code === wi.item_code ? (
                        <>
                          {update ? (
                            <>
                              <AddUpdateItem
                                update={true}
                                code={i.item_code}
                                name={i.item_name}
                                category={i.item_category}
                                measurement={i.item_measurement}
                                location={wi.item_location}
                                reorder={i.item_reorder}
                                onhand={wi.item_onhand}
                                cost={i.item_cost}
                                description={i.item_description}
                              ></AddUpdateItem>
                            </>
                          ) : (
                            <>
                              <div className="justified-row">
                                {props.mode === "view" ? (
                                  <Card
                                    className="card-no-padding"
                                    style={{
                                      padding: "0 20px 0 0",
                                      borderTop: "0",
                                      borderLeft: "0",
                                      borderBottom: "0",
                                      width: "100%",
                                    }}
                                  >
                                    {itemDetails(i, wi)}
                                  </Card>
                                ) : (
                                  <div className="card-custom-size">
                                    <Card
                                      size="large"
                                      extra={
                                        <Button
                                          size="large"
                                          type="primary"
                                          onClick={() => setUpdate(true)}
                                        >
                                          UPDATE
                                        </Button>
                                      }
                                      title={
                                        <Title>
                                          <p
                                            className="big-card-title"
                                            style={{ textWrap: "wrap" }}
                                          >
                                            {i.item_code}
                                          </p>
                                        </Title>
                                      }
                                      hoverable
                                    >
                                      {itemDetails(i, wi)}
                                    </Card>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        ""
                      )
                    )
                  : ""
                : ""
            )
          : ""
      )}
    </>
  );
};

export default ItemDetail;
