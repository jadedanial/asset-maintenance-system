import React from 'react';
import { Drawer, Tooltip, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Profile from './Profile';
import AddEmployee from './AddEmployee';
import ItemDetail from './ItemDetail';
import AddItem from './AddItem';

const DrawerEvents = (props) => {

  function drawerSwitch(key) {
    switch (key) {
      case "Profile":
        return (<><Profile empid={props.empid}></Profile></>);
      case "AddEmployee":
        return (<><AddEmployee></AddEmployee></>);
      case "ItemDetail":
        return (<><ItemDetail itemid={props.itemid}></ItemDetail></>);
      case "AddItem":
        return (<><AddItem></AddItem></>);
      default:
        break;
    }
  };

  return (
    <>
      <Drawer width="100%" height="fit-content" placement="right" style={{marginTop: "85px", marginLeft: props.col ? "100px" : "220px", marginRight: "35px", transition: "0.2s ease-in-out"}} open={props.showDrawer} extra={
        <Tooltip title="Close Profile">
          <Button onClick={props.onCloseDrawer} icon={<CloseOutlined style={{color: "#318CE7", fontSize: "22px"}} />} />
        </Tooltip>}>
        {drawerSwitch(props.comp)}
      </Drawer>
    </>
  );

};

export default DrawerEvents;