import React, { useState, useEffect } from "react";
import { Col, Row, Card, Button, Input, Tooltip, Table } from "antd";
import DrawerEvent from "./DrawerEvent";

const Shift = (props) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [compItem, setCompItem] = useState("");
  const [rowIndex, setRowIndex] = useState([]);

  useEffect(() => {
    (async () => {
      await props.loadAPILists();
    })();
  }, []);

  function showDrawer() {
    setOpenDrawer(true);
  }

  function onCloseDrawer() {
    setOpenDrawer(false);
    props.loadAPILists();
  }

  return (
    <>
      <Card size="large" className="card-main-layout" bordered hoverable>
        <div span={24} style={{ position: "sticky", top: "87px", zIndex: "1" }}>
          <div style={{ height: "24px", backgroundColor: "#fff" }}></div>
          <div
            style={{
              background: "#318ce7",
              width: "100%",
              height: "65px",
              padding: "12px",
            }}
          >
            <Row>
              <Col span={2}>
                <Tooltip title={props.tooltipTitle}>
                  <Button
                    className="custom-hover"
                    style={{ margin: "0 20px" }}
                    shape="circle"
                    size="large"
                    type="primary"
                    onClick={() => {
                      showDrawer();
                      setCompItem(props.compItemAdd);
                    }}
                    icon={props.tooltipIcon}
                  />
                </Tooltip>
              </Col>
              <Col span={22}>
                <Input
                  size="large"
                  placeholder={props.inputPlaceHolder}
                  onChange={(e) => props.searchedText(e.target.value)}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div
          style={{
            height: "20px",
            backgroundColor: "#fff",
            position: "sticky",
            top: "176px",
            zIndex: "1",
            padding: "0 24px 24px 24px",
          }}
        ></div>
        <Table
          className="custom-table"
          rowClassName={() => "table-row"}
          columns={props.tableColumns}
          dataSource={props.tableDataSource}
          onRow={(rowIndex) => {
            return {
              onClick: (event) => {
                setRowIndex(rowIndex);
                showDrawer();
                setCompItem(props.compItemUpdate);
              },
            };
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
          size="small"
          scroll={{
            y: "50vh",
          }}
        />
      </Card>
      <DrawerEvent
        rowIndex={rowIndex}
        showDrawer={openDrawer}
        onCloseDrawer={onCloseDrawer}
        col={props.col}
        comp={compItem}
      ></DrawerEvent>
    </>
  );
};

export default Shift;
