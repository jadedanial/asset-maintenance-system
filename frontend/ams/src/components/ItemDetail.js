import React, { useState } from "react";
import QRCode from "react-qr-code";
import { Card, Typography, Tag, Col, Descriptions, Button, List } from "antd";
import AddUpdateItem from "./AddUpdateItem";

const { Title } = Typography;

const ItemDetail = ({
  items,
  warehouseitems,
  options,
  itemcode,
  view,
  sectionCode,
  sectionCategory,
  onCloseDrawer,
  theme,
}) => {
  const [update, setUpdate] = useState(false);

  const otherWarehouse = () => {
    var data = [];
    warehouseitems.map((wi) =>
      wi.item_code === itemcode
        ? wi.warehouse_code !== sectionCode
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
  };

  const itemDetails = (i, wi) => {
    return (
      <>
        <div
          className={`space-between-row  ${theme} ${
            view ? "card-with-background" : ""
          }`}
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
                display: view ? "none" : "block",
              }}
            >
              <p
                className="small-font"
                style={{
                  margin: "0",
                  color: theme === "light" ? "#000" : "#fff",
                }}
              >
                {i.item_description}
              </p>
            </div>
          </Col>
          <Col span={9} className="justified-row flex-end-row">
            <QRCode
              value={i.item_code}
              style={{
                height: "auto",
                width: "80%",
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
            display: view ? "none" : "block",
          }}
        />
      </>
    );
  };

  return (
    <>
      {warehouseitems.map((wi) =>
        wi.item_code === itemcode
          ? wi.warehouse_code === sectionCode
            ? items.map((i) =>
                i.item_code === wi.item_code ? (
                  <>
                    {update ? (
                      <>
                        <AddUpdateItem
                          options={options}
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
                          sectionCode={sectionCode}
                          sectionCategory={sectionCategory}
                          onCloseDrawer={onCloseDrawer}
                          theme={theme}
                        />
                      </>
                    ) : (
                      <>
                        <div className={`justified-row ${theme}`}>
                          {view ? (
                            <div
                              className="card-with-background"
                              style={{
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
                                className={theme}
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
