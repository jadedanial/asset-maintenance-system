import React from "react";
import { Drawer, Tooltip, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Profile from "./Profile";
import AddUpdateEmployee from "./AddUpdateEmployee";
import AddUpdateShift from "./AddUpdateShift";
import AddUpdateSchedule from "./AddUpdateSchedule";
import ItemDetail from "./ItemDetail";
import AddUpdateItem from "./AddUpdateItem";
import CartItem from "./CartItem";

const DrawerEvent = (props) => {
  function drawerSwitch(key) {
    switch (key) {
      case "User":
        return (
          <>
            <Profile empid={props.empid}></Profile>
          </>
        );
      case "Profile":
        return (
          <>
            <Profile empid={props.rowIndex["id"]}></Profile>
          </>
        );
      case "AddUpdateEmployee":
        return (
          <>
            <AddUpdateEmployee update={false}></AddUpdateEmployee>
          </>
        );

      case "AddUpdateShift":
        return (
          <>
            <AddUpdateShift update={false}></AddUpdateShift>
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
            ></AddUpdateShift>
          </>
        );
      case "AddUpdateSchedule":
        return (
          <>
            <AddUpdateSchedule update={false}></AddUpdateSchedule>
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
            ></AddUpdateSchedule>
          </>
        );
      case "ItemDetail":
        return (
          <>
            <ItemDetail
              itemcode={props.rowIndex["code"]}
              mode="update"
            ></ItemDetail>
          </>
        );
      case "AddUpdateItem":
        return (
          <>
            <AddUpdateItem update={false}></AddUpdateItem>
          </>
        );
      case "CartItem":
        return (
          <>
            <CartItem
              empid={props.empid}
              username={props.username}
              searchItem={props.searchItem}
              item={props.item}
              addItem={props.addItem}
              removeItem={props.removeItem}
              itemCount={props.itemCount}
              orderList={props.orderList}
              clearOrder={props.clearOrder}
              onCloseDrawer={props.onCloseDrawer}
            ></CartItem>
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
        style={{
          marginTop: "85px",
          marginLeft: props.col ? "100px" : "220px",
          marginRight: "10px",
          transition: "0.2s ease-in-out",
        }}
        open={props.showDrawer}
        destroyOnClose={true}
        extra={
          <Tooltip title={"Close"}>
            <Button
              className="btn-blue"
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
