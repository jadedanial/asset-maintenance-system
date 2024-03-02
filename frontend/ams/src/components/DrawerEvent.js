import React from "react";
import { Drawer, Tooltip, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Profile from "./Profile";
import AddUpdateEmployee from "./AddUpdateEmployee";
import AddUpdateShift from "./AddUpdateShift";
import AddUpdateSchedule from "./AddUpdateSchedule";
import ItemDetail from "./ItemDetail";
import AddUpdateItem from "./AddUpdateItem";
import Cart from "./Cart";

const DrawerEvent = (props) => {
  function drawerSwitch(key) {
    switch (key) {
      case "User":
        return (
          <>
            <Profile
              employees={props.employees}
              attendances={props.attendances}
              schedules={props.schedules}
              vacations={props.vacations}
              excuses={props.excuses}
              sections={props.sections}
              options={props.options}
              empid={props.userId}
              getSection={props.getSection}
              onCloseDrawer={props.onCloseDrawer}
              theme={props.theme}
            ></Profile>
          </>
        );
      case "Profile":
        return (
          <>
            <Profile
              employees={props.employees}
              attendances={props.attendances}
              schedules={props.schedules}
              vacations={props.vacations}
              excuses={props.excuses}
              sections={props.sections}
              options={props.options}
              empid={props.rowIndex["id"]}
              getSection={props.getSection}
              onCloseDrawer={props.onCloseDrawer}
              theme={props.theme}
            ></Profile>
          </>
        );
      case "AddUpdateEmployee":
        return (
          <>
            <AddUpdateEmployee
              sections={props.sections}
              options={props.options}
              update={false}
              getSection={props.getSection}
              onCloseDrawer={props.onCloseDrawer}
              theme={props.theme}
            />
          </>
        );
      case "AddUpdateShift":
        return (
          <>
            <AddUpdateShift
              update={false}
              onCloseDrawer={props.onCloseDrawer}
              theme={props.theme}
            />
          </>
        );
      case "UpdateShift":
        return (
          <>
            <AddUpdateShift
              update={true}
              id={props.rowIndex["id"]}
              name={props.rowIndex["name"]}
              from={props.rowIndex["from"]}
              to={props.rowIndex["to"]}
              onCloseDrawer={props.onCloseDrawer}
              theme={props.theme}
            />
          </>
        );
      case "AddUpdateSchedule":
        return (
          <>
            <AddUpdateSchedule
              shifts={props.shifts}
              update={false}
              onCloseDrawer={props.onCloseDrawer}
              theme={props.theme}
            />
          </>
        );
      case "UpdateSchedule":
        return (
          <>
            <AddUpdateSchedule
              shifts={props.shifts}
              update={true}
              id={props.rowIndex["id"]}
              name={props.rowIndex["name"]}
              sun={props.rowIndex["sun"]}
              mon={props.rowIndex["mon"]}
              tue={props.rowIndex["tue"]}
              wed={props.rowIndex["wed"]}
              thu={props.rowIndex["thu"]}
              fri={props.rowIndex["fri"]}
              sat={props.rowIndex["sat"]}
              onCloseDrawer={props.onCloseDrawer}
              theme={props.theme}
            />
          </>
        );
      case "ItemDetail":
        return (
          <>
            <ItemDetail
              items={props.items}
              warehouseitems={props.warehouseitems}
              options={props.options}
              itemcode={props.rowIndex["code"]}
              view={false}
              sectionCode={props.sectionCode}
              sectionCategory={props.sectionCategory}
              onCloseDrawer={props.onCloseDrawer}
              theme={props.theme}
            />
          </>
        );
      case "AddUpdateItem":
        return (
          <>
            <AddUpdateItem
              options={props.options}
              update={false}
              sectionCode={props.sectionCode}
              sectionCategory={props.sectionCategory}
              onCloseDrawer={props.onCloseDrawer}
              theme={props.theme}
            />
          </>
        );
      case "Cart":
        return (
          <>
            <Cart
              segment={props.segment}
              setQueryItem={props.setQueryItem}
              setSearchValue={props.setSearchValue}
              addItem={props.addItem}
              removeItem={props.removeItem}
              itemCount={props.itemCount}
              itemList={props.itemList}
              setFilteredItem={props.setFilteredItem}
              filteredItem={props.filteredItem}
              handleCheckChange={props.handleCheckChange}
              reorderOrder={props.reorderOrder}
              receiveOrder={props.receiveOrder}
              success={props.success}
              transactionCode={props.transactionCode}
              warehouseCode={props.warehouseCode}
              warehouseCategory={props.warehouseCategory}
              sectionCode={props.sectionCode}
              clearOrder={props.clearOrder}
              onCloseDrawer={props.onCloseDrawer}
              theme={props.theme}
            ></Cart>
          </>
        );
      default:
        break;
    }
  }

  return (
    <>
      <Drawer
        width="100%"
        height="fit-content"
        placement="right"
        className={`${props.overflow ? "overflow" : "no-overflow"} ${
          props.theme
        }`}
        style={{
          marginTop: "85px",
          marginLeft: props.collapsed ? "100px" : "220px",
          marginRight: "10px",
          transition: "0.2s ease-in-out",
        }}
        open={props.showDrawer}
        destroyOnClose={true}
        extra={
          props.showClose ? (
            <Tooltip title={"Close"}>
              <Button
                className="btn-normal"
                icon={<CloseOutlined className="bigger-font" />}
                onClick={props.onCloseDrawer}
              />
            </Tooltip>
          ) : (
            ""
          )
        }
      >
        {drawerSwitch(props.comp)}
      </Drawer>
    </>
  );
};

export default DrawerEvent;
