import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Button,
  Input,
  Tooltip,
  Table,
  notification,
} from "antd";
import DrawerEvent from "./DrawerEvent";
import NotificationEvent from "./NotificationEvent";

const SearchTableEvent = (props) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [compItem, setCompItem] = useState("");
  const [rowIndex, setRowIndex] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  function showDrawer() {
    setOpenDrawer(true);
  }

  function onCloseDrawer() {
    setOpenDrawer(false);
    props.loadAPILists();
  }

  useEffect(() => {
    props.loadAPILists();
  }, []);

  return (
    <>
      {contextHolder}
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
                      if (
                        props.compItemAdd !== "AddUpdateItem" ||
                        props.mainBranch === true
                      ) {
                        showDrawer();
                        setCompItem(props.compItemAdd);
                      } else {
                        api.info(
                          NotificationEvent(
                            false,
                            "Item addition access is limited only to employee in Main Warehouse branch."
                          )
                        );
                      }
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
          size="large"
          scroll={{
            x: "calc(0px + 100%)",
            y: 300,
          }}
        />
      </Card>
      <DrawerEvent
        rowIndex={rowIndex}
        showDrawer={openDrawer}
        onCloseDrawer={onCloseDrawer}
        col={props.col}
        comp={compItem}
        employeeBranch={props.employeeBranch}
        updateEmployeeBranch={props.updateEmployeeBranch}
      ></DrawerEvent>
    </>
  );
};

export default SearchTableEvent;
