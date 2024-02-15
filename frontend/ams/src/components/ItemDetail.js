import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { Card, Typography, Tag, Col, Descriptions, Button, List } from "antd";
import AddUpdateItem from "./AddUpdateItem";

const { Title } = Typography;

const ItemDetail = (props) => {
  const [update, setUpdate] = useState(false);
  const [item, setItem] = useState([]);
  const [warehouseItem, setWarehouseItem] = useState([]);

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

  function otherWarehouse() {
    var data = [];
    warehouseItem.map((wi) =>
      wi.item_code === props.itemcode
        ? wi.warehouse_code !== props.sectionCode
          ? data.push({
              title: wi.warehouse_code,
              description: (
                <>
                  <p style={{ marginBottom: "0", lineHeight: "1.2" }}>
                    On Hand: {wi.item_onhand}
                  </p>
                  <p style={{ marginBottom: "0", lineHeight: "1.2" }}>
                    Location: {wi.item_location}
                  </p>
                </>
              ),
            })
          : ""
        : ""
    );
    return data;
  }

  function itemDetails(i, wi) {
    return (
      <>
        <div
          className={`space-between-row  ${props.theme}`}
          style={{
            background: props.view
              ? props.theme === "light"
                ? "#fff"
                : "#1d2b5365"
              : "",
          }}
        >
          <Col span={13}>
            <p className="big-font" style={{ paddingBottom: "18px" }}>
              {i.item_name}
            </p>
            <p className="large-card-title">Php. {i.item_cost}</p>
            <Descriptions layout="horizontal" column={1} className="small-font">
              <Descriptions.Item label="On Hand">
                {wi.item_onhand}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {wi.item_location}
              </Descriptions.Item>
              <Descriptions.Item label="Unit Of Measurement">
                {i.item_measurement}
              </Descriptions.Item>
              <Descriptions.Item label="Reorder Quantity">
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
            <div
              style={{
                padding: "20px 0",
                display: props.view ? "none" : "block",
              }}
            >
              <p
                className="small-font"
                style={{
                  margin: "0",
                  color: props.theme === "light" ? "#000" : "#fff",
                }}
              >
                {i.item_description}
              </p>
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
        <List
          grid={{ column: 3, gutter: 100 }}
          itemLayout="horizontal"
          header={<p className="medium-card-title">Stock On Other Warehouse</p>}
          dataSource={otherWarehouse()}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
          style={{
            display: props.view ? "none" : "block",
          }}
        />
      </>
    );
  }

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
          ? wi.warehouse_code === props.sectionCode
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
                          sectionCode={props.sectionCode}
                          sectionCategory={props.sectionCategory}
                          onCloseDrawer={props.onCloseDrawer}
                        />
                      </>
                    ) : (
                      <>
                        <div className={`justified-row ${props.theme}`}>
                          {props.view ? (
                            <div
                              style={{
                                background:
                                  props.theme === "light"
                                    ? "#fff"
                                    : "#1d2b5365",
                                padding: "20px 40px",
                                height: "fit-content",
                              }}
                            >
                              <Card
                                className="card-no-padding"
                                style={{
                                  borderTop: "0",
                                  borderLeft: "0",
                                  borderBottom: "0",
                                  width: "100%",
                                }}
                              >
                                {itemDetails(i, wi)}
                              </Card>
                            </div>
                          ) : (
                            <div className="card-custom-size-60">
                              <Card
                                size="large"
                                className={props.theme}
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
                                extra={
                                  <Button
                                    size="large"
                                    type="primary"
                                    onClick={() => setUpdate(true)}
                                  >
                                    UPDATE
                                  </Button>
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
      )}
    </>
  );
};

export default ItemDetail;
