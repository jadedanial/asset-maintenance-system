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
  const {
    loadAPILists,
    theme,
    tooltipTitle,
    compItemAdd,
    sectionCategory,
    tooltipIcon,
    inputPlaceHolder,
    searchedText,
    tableColumns,
    tableDataSource,
    compItemUpdate,
    updateEmployeeSection,
    sectionCode,
    collapsed,
  } = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [compItem, setCompItem] = useState("");
  const [rowIndex, setRowIndex] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  function showDrawer() {
    setOpenDrawer(true);
  }

  function onCloseDrawer() {
    setOpenDrawer(false);
    loadAPILists();
  }

  useEffect(() => {
    loadAPILists();
  }, [loadAPILists]);

  return (
    <>
      {contextHolder}
      <div className={theme}>
        <Card className="card-main-layout" size="large" hoverable>
          <div
            span={24}
            style={{ position: "sticky", top: "87px", zIndex: "1" }}
          >
            <div
              style={{
                background: theme === "light" ? "#f8f8ff" : "#161d40",
                width: "100%",
                height: "65px",
                padding: "12px",
              }}
            >
              <Row>
                <Col span={1} style={{ marginLeft: "10px" }}>
                  <Tooltip title={tooltipTitle}>
                    <Button
                      id="big-icon"
                      className="btn-normal "
                      style={{ margin: "0 20px" }}
                      shape="circle"
                      size="large"
                      onClick={() => {
                        if (
                          compItemAdd !== "AddUpdateItem" ||
                          sectionCategory === "main"
                        ) {
                          showDrawer();
                          setCompItem(compItemAdd);
                        } else {
                          api.info(
                            NotificationEvent(
                              false,
                              "Item addition access is limited only to employee in main warehouse branch."
                            )
                          );
                        }
                      }}
                      icon={tooltipIcon}
                    >
                      +
                    </Button>
                  </Tooltip>
                </Col>
                <Col span={22} style={{ marginLeft: "20px" }}>
                  <Input
                    placeholder={inputPlaceHolder}
                    style={{ borderRadius: "50px" }}
                    onChange={(e) => searchedText(e.target.value)}
                  />
                </Col>
              </Row>
            </div>
          </div>
          <div
            style={{
              height: "20px",
              background: theme === "light" ? "#f8f8ff" : "#161d40",
              position: "sticky",
              top: "176px",
              zIndex: "1",
              padding: "0 24px 24px 24px",
            }}
          ></div>
          <Table
            rowClassName={() => "table-row"}
            columns={tableColumns}
            dataSource={tableDataSource}
            onRow={(rowIndex) => {
              return {
                onClick: () => {
                  setRowIndex(rowIndex);
                  showDrawer();
                  setCompItem(compItemUpdate);
                },
              };
            }}
            style={{ marginBottom: "30px" }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
            size="large"
            scroll={{
              x: "calc(0px + 100%)",
              y: 300,
            }}
          />
        </Card>
      </div>
      <DrawerEvent
        rowIndex={rowIndex}
        showDrawer={openDrawer}
        onCloseDrawer={onCloseDrawer}
        comp={compItem}
        updateEmployeeSection={updateEmployeeSection}
        sectionCode={sectionCode}
        sectionCategory={sectionCategory}
        collapsed={collapsed}
        theme={theme}
        overflow={true}
      />
    </>
  );
};

export default SearchTableEvent;
