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
              empid={props.empid}
              updateEmployeeSection={props.updateEmployeeSection}
              onCloseDrawer={props.onCloseDrawer}
              theme={props.theme}
            ></Profile>
          </>
        );
      case "Profile":
        return (
          <>
            <Profile
              empid={props.rowIndex["id"]}
              updateEmployeeSection={props.updateEmployeeSection}
              onCloseDrawer={props.onCloseDrawer}
              theme={props.theme}
            ></Profile>
          </>
        );
      case "AddUpdateEmployee":
        return (
          <>
            <AddUpdateEmployee
              update={false}
              updateEmployeeSection={props.updateEmployeeSection}
              onCloseDrawer={props.onCloseDrawer}
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
              itemCode={props.itemCode}
              setQueryItem={props.setQueryItem}
              setSearchValue={props.setSearchValue}
              addItem={props.addItem}
              removeItem={props.removeItem}
              itemCount={props.itemCount}
              itemList={props.itemList}
              setFilteredItem={props.setFilteredItem}
              filteredItem={props.filteredItem}
              handleCheckChange={props.handleCheckChange}
              clearOrder={props.clearOrder}
              onCloseDrawer={props.onCloseDrawer}
              empid={props.empid}
              username={props.username}
              sectionCode={props.sectionCode}
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
          <Tooltip title={"Close"}>
            <Button
              className="btn-normal"
              icon={<CloseOutlined className="bigger-font" />}
              onClick={props.onCloseDrawer}
            />
          </Tooltip>
        }
      >
        {drawerSwitch(props.comp)}
      </Drawer>
    </>
  );
};

export default DrawerEvent;
