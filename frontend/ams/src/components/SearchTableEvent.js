import React, { useState } from "react";
import {
  Col,
  Row,
  Card,
  Badge,
  Avatar,
  Input,
  Tooltip,
  Table,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DrawerEvent from "./DrawerEvent";
import NotificationEvent from "./NotificationEvent";

const SearchTableEvent = ({
  userId,
  employees,
  attendances,
  schedules,
  vacations,
  excuses,
  shifts,
  items,
  warehouseitems,
  sections,
  options,
  branches,
  assets,
  workorders,
  operations,
  operationtypes,
  workorderoperations,
  operationtechnicians,
  operationitems,
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
  getSection,
  sectionCode,
  collapsed,
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [compItem, setCompItem] = useState("");
  const [rowIndex, setRowIndex] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <>
      {contextHolder}
      <div className={theme}>
        <Card className="card-main-layout">
          <Row
            className="card-with-background space-between-row"
            style={{
              padding: "10px",
              marginBottom: "24px",
            }}
          >
            <Col span={1}>
              <Tooltip title={tooltipTitle}>
                <Badge
                  offset={[10, 10]}
                  count={
                    <PlusOutlined
                      style={{
                        color: "#6841f5",
                        cursor: "pointer",
                      }}
                    />
                  }
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
                >
                  <Avatar
                    className="avatar-btn"
                    shape="square"
                    style={{
                      width: "50px",
                    }}
                    icon={tooltipIcon}
                  />
                </Badge>
              </Tooltip>
            </Col>
            <Col span={22}>
              <Input
                placeholder={inputPlaceHolder}
                style={{ borderRadius: "50px" }}
                onChange={(e) => searchedText(e.target.value)}
              />
            </Col>
          </Row>
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
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
            }}
            scroll={{ x: "100%", y: "calc(-324px + 100vh)" }}
          />
        </Card>
      </div>
      <DrawerEvent
        userId={userId}
        employees={employees}
        attendances={attendances}
        schedules={schedules}
        vacations={vacations}
        excuses={excuses}
        shifts={shifts}
        items={items}
        warehouseitems={warehouseitems}
        sections={sections}
        options={options}
        branches={branches}
        assets={assets}
        workorders={workorders}
        operations={operations}
        operationtypes={operationtypes}
        workorderoperations={workorderoperations}
        operationtechnicians={operationtechnicians}
        operationitems={operationitems}
        rowIndex={rowIndex}
        showDrawer={openDrawer}
        onCloseDrawer={onCloseDrawer}
        comp={compItem}
        getSection={getSection}
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
