import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Space, Dropdown, Badge, Row, Col, Avatar } from 'antd';
import { UserOutlined, UnlockOutlined, SettingOutlined, BarChartOutlined, TeamOutlined, ShoppingCartOutlined, CarOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import WorkRequest from '../modules/WorkRequest';
import Employee from '../modules/Employee';
import CurrentStock from '../modules/CurrentStock';
import DrawerEvents from '../components/Drawer';

const { Header, Sider, Content } = Layout;

const MainPage = (props) => {

  const [openDrawer, setOpenDrawer] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem]= useState("");
  const [previousMenuItem, setPreviousMenuItem]= useState("");
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  const items = [
    {
      label: <p className="small-font">Profile</p>,
      key: '0',
      icon: <UserOutlined />,
    },
    {
      label: <p className="small-font">Logout</p>,
      key: '1',
      icon: <UnlockOutlined />,
    },
  ];

  useEffect(() => {
    axios.get('http://localhost:8000/api/module')
    .then(response => {
      setModules(response.data);
      setModules(modules => {
        return modules.map((module) => {
          return {...module, icon: iconsSwitch(module.icon)}
        })
      });
    });
  },[]);

  function logout() {
    try {
      axios.post('http://localhost:8000/api/logout', {},{
        headers: {'Content-Type' : 'application/json'},
        withCredentials: true,
      });
      navigate("/login");
    } catch (err) {
      console.log(err.response.data[0]);
    }
  };

  function onClick({ key }) {
    if (key === "0") {
      setPreviousMenuItem(selectedMenuItem);
      setSelectedMenuItem(0);
      showDrawer();
    }
    if (key === "1") {
      return logout();
    }
  };

  function showDrawer() {
    setOpenDrawer(true);
  };

  function onCloseDrawer() {
    setOpenDrawer(false);
    setSelectedMenuItem(previousMenuItem);
  };

  function iconsSwitch(icon) {
    switch (icon) {
      case "SettingOutlined":
        return (<SettingOutlined style={{fontSize: "20px", color: "#08c"}}/>);
      case "TeamOutlined":
        return (<TeamOutlined style={{fontSize: "20px", color: "#08c"}}/>);
      case "BarChartOutlined":
        return (<BarChartOutlined  style={{fontSize: "20px", color: "#08c"}}/>);
      case "ShoppingCartOutlined":
        return (<ShoppingCartOutlined style={{fontSize: "20px", color: "#08c"}}/>);
      case "CarOutlined":
        return (<CarOutlined style={{fontSize: "20px", color: "#08c"}}/>);
      default:
        break;
    }
  };

  function componentSwitch(key) {
    switch (key) {
      case 0:
        return (<><DrawerEvents showDrawer={openDrawer} onCloseDrawer={onCloseDrawer} empid={props.empid} col={collapsed} comp={"Profile"}></DrawerEvents></>);
      case "Work Request":
        return (<><WorkRequest></WorkRequest></>);
      case "Employee":
        return (<><Employee col={collapsed}></Employee></>);
      case "Current Stock":
        return (<><CurrentStock col={collapsed}></CurrentStock></>);
      default:
        break;
    }
  };

  return (
    <>
      <Layout hasSider>
        <Sider trigger={null} collapsible collapsed={collapsed} style={{overflow: "auto", height: "100vh", position: "fixed", left: 0, top: 0, bottom: 0, background: "#000"}}>
          <div className="logo"><img src="images/danialsoft.png" alt="logo"/></div>
          <Menu theme="dark" defaultSelectedKeys={[1]} mode="inline" items={modules} style={{fontSize: "12px", background: "#000"}} onClick={(e) => setSelectedMenuItem(e.key)} />
        </Sider>
        <Layout className="site-layout" style={{marginLeft: collapsed ? "80px" : "200px", transition: "0.2s ease-in-out"}}>
          <Header style={{padding: "0", height: "65px", width: "100%", background: "#FFF", position: "sticky", top: "0", zIndex: "1"}}>
            <div className="header-menu">
              <div>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {className: "trigger", onClick: () => setCollapsed(!collapsed)})}
              </div>
              <div>
                <Space size="large">
                  <Dropdown menu={{items, onClick}} placement="bottomRight" arrow>
                    <span className="avatar-item">
                      <Badge size="small">
                        <Row>
                          <Space size="middle">
                            <Col span={12}><p className="small-font" style={{cursor: "pointer", color: "#318CE7"}}>{props.empid}</p></Col>
                            <Col span={12}><p className="small-font" style={{cursor: "pointer", color: "#318CE7"}}>{props.username}</p></Col>
                            <Col span={12}><Avatar size="small" style={{backgroundColor: "#108ee9", cursor: "pointer"}} icon={<UserOutlined />} /></Col>
                          </Space>
                        </Row>
                      </Badge>
                    </span>
                  </Dropdown>
                </Space>
              </div>
            </div>
            <div style={{height: "22px", background: "#F0F2F5"}}></div>
          </Header>
          <Content className="site-layout-background" style={{margin: "20px"}}>
            {componentSwitch(selectedMenuItem)}
          </Content>
        </Layout>
      </Layout>
    </>
  );

};

export default MainPage;