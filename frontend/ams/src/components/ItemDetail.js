import React, { useState } from "react";
import QRCode from "react-qr-code";
import { Card, Typography, Tag, Col, Row, Descriptions, Button } from "antd";
import { PieChart, Pie, Cell, Text } from "recharts";
import AddUpdateItem from "./AddUpdateItem";
import EmptyData from "./EmptyData";

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

  const data = warehouseitems
    .filter((wi) => wi.item_code === itemcode)
    .map((wi) => ({
      name: wi.warehouse_code,
      value: wi.item_onhand,
    }));

  const totalValue = data.reduce((acc, entry) => acc + entry.value, 0);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    fill,
    value,
    name,
  }) => {
    const radius = outerRadius + 10; // Label position outside the outerRadius
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <Text
        x={x}
        y={y}
        fill={fill}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name}: ${value}`}
      </Text>
    );
  };

  const itemDetails = (i, wi) => {
    return (
      <>
        <Row className={theme}>
          <Col
            span={view ? 24 : 14}
            style={{ paddingRight: view ? "0" : "24px" }}
          >
            <div className="card-with-background">
              <div
                className="space-between-row "
                style={{ padding: view ? 0 : "24px" }}
              >
                <Col
                  span={13}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p className="big-font" style={{ paddingBottom: "24px" }}>
                      {i.item_name}
                    </p>
                    <p
                      className="large-card-title"
                      style={{ paddingBottom: "6px" }}
                    >
                      Php. {i.item_cost}
                    </p>
                    <Descriptions
                      layout="horizontal"
                      column={1}
                      className="small-font"
                    >
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
                  </div>
                  <div style={{ padding: "6px 0" }}>
                    <Tag color="blue">
                      <p className="small-font" style={{ padding: "2px" }}>
                        {i.item_category}
                      </p>
                    </Tag>
                  </div>
                  <div
                    style={{
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
                <Col
                  span={9}
                  className="justified-row flex-end-row align-items-end"
                >
                  <QRCode
                    value={i.item_code}
                    style={{
                      height: "auto",
                      width: "100%",
                    }}
                  />
                </Col>
              </div>
            </div>
          </Col>
          <Col
            span={10}
            style={{
              display: view ? "none" : "block",
            }}
          >
            <div className="card-with-background" style={{ padding: "24px" }}>
              <p className="large-card-title" style={{ textAlign: "center" }}>
                Stock Available On Warehouses
              </p>
              <div
                className="justified-row"
                style={{ padding: totalValue === 0 ? "24px" : "0" }}
              >
                {totalValue !== 0 ? (
                  <PieChart width={500} height={250}>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#318ce7" />
                      ))}
                    </Pie>
                  </PieChart>
                ) : (
                  <EmptyData theme={theme} />
                )}
              </div>
            </div>
          </Col>
        </Row>
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
                                padding: "24px",
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
                            <div className="card-custom-size-full">
                              <Card
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
                                  <div className="space-between-row">
                                    <Button
                                      type="default"
                                      onClick={onCloseDrawer}
                                      block
                                    >
                                      CANCEL
                                    </Button>
                                    <Button
                                      type="primary"
                                      onClick={() => setUpdate(true)}
                                      style={{
                                        marginLeft: "10px",
                                      }}
                                      block
                                    >
                                      UPDATE
                                    </Button>
                                  </div>
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
