import React, { useState } from "react";
import QRCode from "react-qr-code";
import {
  Card,
  Typography,
  Tag,
  Col,
  Row,
  Descriptions,
  Button,
  Table,
} from "antd";
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

  const columns = [
    {
      title: "Warehouse Code",
      dataIndex: "warehouse_code",
      key: "warehouse_code",
    },
    {
      title: "On Hand",
      dataIndex: "item_onhand",
      key: "item_onhand",
    },
    {
      title: "Location",
      dataIndex: "item_location",
      key: "item_location",
    },
  ];

  const data = warehouseitems
    .filter(
      (wi) => wi.item_code === itemcode && wi.warehouse_code !== sectionCode
    )
    .map((wi) => ({
      key: wi.warehouse_code,
      warehouse_code: wi.warehouse_code,
      item_onhand: wi.item_onhand,
      item_location: wi.item_location,
    }));

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
            <p className="small-card-title" style={{ paddingBottom: "24px" }}>
              Stock On Other Warehouse
            </p>
            <Table
              rowClassName={() => "table-row"}
              columns={columns}
              dataSource={data}
              pagination={false}
              size="small"
              scroll={{
                x: "100%",
                y: "fit-content",
              }}
            />
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
                                    <Button
                                      size="large"
                                      type="primary"
                                      onClick={() => setUpdate(true)}
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
