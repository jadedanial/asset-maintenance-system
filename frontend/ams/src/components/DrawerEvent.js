import React from "react";
import { Drawer, Tooltip, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Profile from "./Profile";
import AddEmployee from "./AddEmployee";
import ItemDetail from "./ItemDetail";
import AddUpdateItem from "./AddUpdateItem";
import CartItem from "./CartItem";

const DrawerEvent = (props) => {
  function drawerSwitch(key) {
    switch (key) {
      case "Profile":
        return (
          <>
            <Profile empid={props.empid} destroy={true}></Profile>
          </>
        );
      case "AddEmployee":
        return (
          <>
            <AddEmployee></AddEmployee>
          </>
        );
      case "ItemDetail":
        return (
          <>
            <ItemDetail itemcode={props.itemcode} destroy={true}></ItemDetail>
          </>
        );
      case "AddUpdateItem":
        return (
          <>
            <AddUpdateItem update={false} destroy={true}></AddUpdateItem>
          </>
        );
      case "CartItem":
        return (
          <>
            <CartItem orderList={props.orderList} destroy={false}></CartItem>
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
          marginRight: "35px",
          transition: "0.2s ease-in-out",
        }}
        open={props.showDrawer}
        destroyOnClose={props.destroy}
        extra={
          <Tooltip title={"Close"}>
            <Button
              onClick={props.onCloseDrawer}
              icon={
                <CloseOutlined style={{ color: "#318CE7", fontSize: "22px" }} />
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
