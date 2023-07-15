import React from "react";
import { Drawer, Tooltip, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Profile from "./Profile";
import AddUpdateEmployee from "./AddUpdateEmployee";
import ItemDetail from "./ItemDetail";
import AddUpdateItem from "./AddUpdateItem";
import CartItem from "./CartItem";

const DrawerEvent = (props) => {
  function drawerSwitch(key) {
    switch (key) {
      case "Profile":
        return (
          <>
            <Profile empid={props.empid}></Profile>
          </>
        );
      case "AddUpdateEmployee":
        return (
          <>
            <AddUpdateEmployee update={false}></AddUpdateEmployee>
          </>
        );
      case "ItemDetail":
        return (
          <>
            <ItemDetail itemcode={props.itemcode}></ItemDetail>
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
              addItem={props.addItem}
              removeItem={props.removeItem}
              itemCount={props.itemCount}
              orderList={props.orderList}
              clearOrder={props.clearOrder}
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
          marginRight: "20px",
          transition: "0.2s ease-in-out",
        }}
        open={props.showDrawer}
        destroyOnClose={true}
        extra={
          <Tooltip title={"Close"}>
            <Button
              onClick={props.onCloseDrawer}
              icon={
                <CloseOutlined style={{ color: "#318ce7", fontSize: "22px" }} />
              }
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
