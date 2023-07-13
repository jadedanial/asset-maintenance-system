import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Space, Dropdown, Badge, Col, Avatar, Row } from "antd";
import {
  UserOutlined,
  UnlockOutlined,
  SettingOutlined,
  BarChartOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import WorkRequest from "../modules/WorkRequest";
import Employee from "../modules/Employee";
import Stock from "../modules/Stock";
import Reorder from "../modules/Reorder";
import DrawerEvent from "../components/DrawerEvent";

const { Header, Sider, Content } = Layout;

const MainPage = (props) => {
  const [openDrawer, setOpenDrawer] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [previousMenuItem, setPreviousMenuItem] = useState("");
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  const items = [
    {
      label: <p className="small-font">Profile</p>,
      key: "0",
      icon: <UserOutlined />,
    },
    {
      label: <p className="small-font">Logout</p>,
      key: "1",
      icon: <UnlockOutlined />,
    },
  ];

  useEffect(() => {
    try {
      axios.get("http://localhost:8000/api/module").then((response) => {
        setModules(response.data);
        setModules((modules) => {
          return modules.map((module) => {
            return { ...module, icon: iconsSwitch(module.icon) };
          });
        });
      });
    } catch (err) {
      console.log(err.response.data[0]);
    }
  }, []);

  async function logout() {
    try {
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      navigate("/login");
    } catch (err) {
      console.log(err.response.data[0]);
    }
  }

  function onClick({ key }) {
    if (key === "0") {
      setPreviousMenuItem(selectedMenuItem);
      setSelectedMenuItem(0);
      showDrawer();
    }
    if (key === "1") {
      return logout();
    }
  }

  function showDrawer() {
    setOpenDrawer(true);
  }

  function onCloseDrawer() {
    setOpenDrawer(false);
    setSelectedMenuItem(previousMenuItem);
  }

  function iconsSwitch(icon) {
    switch (icon) {
      case "SettingOutlined":
        return (
          <SettingOutlined style={{ fontSize: "20px", color: "#318ce7" }} />
        );
      case "TeamOutlined":
        return <TeamOutlined style={{ fontSize: "20px", color: "#318ce7" }} />;
      case "ShoppingCartOutlined":
        return (
          <ShoppingCartOutlined
            style={{ fontSize: "20px", color: "#318ce7" }}
          />
        );
      case "CarOutlined":
        return <CarOutlined style={{ fontSize: "20px", color: "#318ce7" }} />;
      case "BarChartOutlined":
        return (
          <BarChartOutlined style={{ fontSize: "20px", color: "#318ce7" }} />
        );
      default:
        break;
    }
  }

  function componentSwitch(key) {
    switch (key) {
      case 0:
        return (
          <>
            <DrawerEvent
              empid={props.empid}
              showDrawer={openDrawer}
              onCloseDrawer={onCloseDrawer}
              col={collapsed}
              comp={"Profile"}
            ></DrawerEvent>
          </>
        );
      case "Work Request":
        return (
          <>
            <WorkRequest></WorkRequest>
          </>
        );
      case "Employee":
        return (
          <>
            <Employee col={collapsed}></Employee>
          </>
        );
      case "Stock":
        return (
          <>
            <Stock col={collapsed}></Stock>
          </>
        );
      case "Reorder":
        return (
          <>
            <Reorder col={collapsed}></Reorder>
          </>
        );
      default:
        break;
    }
  }

  return (
    <>
      <Header
        style={{
          padding: "0",
          background: "#fff",
          height: "65px",
          borderBottom: "1px solid #318ce7",
          position: "sticky",
          top: "0",
          zIndex: "1",
        }}
      >
        <Row>
          <Col span={4}>
            <div style={{ padding: "0 0 0 50px" }}>
              <img
                src="images/danialsoft.png"
                alt="logo"
                style={{ width: "65%" }}
              />
            </div>
          </Col>
          <Col span={20} style={{ paddingRight: "20px" }}>
            <div className="flex-end-row">
              <Space size="large">
                <Dropdown
                  menu={{ items, onClick }}
                  placement="bottomRight"
                  arrow
                >
                  <span className="avatar-item">
                    <Badge size="small">
                      <Space size="middle">
                        <Col span={12}>
                          <p
                            className="small-font"
                            style={{ cursor: "pointer", color: "#318ce7" }}
                          >
                            {props.empid}
                          </p>
                        </Col>
                        <Col span={12}>
                          <p
                            className="small-font"
                            style={{ cursor: "pointer", color: "#318ce7" }}
                          >
                            {props.username}
                          </p>
                        </Col>
                        <Col span={12}>
                          <Avatar
                            size="small"
                            style={{
                              backgroundColor: "#318ce7",
                              cursor: "pointer",
                            }}
                            icon={<UserOutlined />}
                          />
                        </Col>
                      </Space>
                    </Badge>
                  </span>
                </Dropdown>
              </Space>
            </div>
          </Col>
        </Row>
        <div
          style={{
            marginTop: "1px",
            marginLeft: collapsed ? "80px" : "200px",
            transition: "0.2s ease-in-out",
            height: "22px",
            background: "#F0F2F5",
          }}
        ></div>
      </Header>
      <Layout hasSider>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            paddingTop: "50px",
            background: "#fff",
          }}
        >
          <div className="justified-row" style={{ marginBottom: "30px" }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </div>
          <Menu
            defaultSelectedKeys={[1]}
            mode="inline"
            items={modules}
            style={{ fontSize: "12px", background: "#fff" }}
            onClick={(e) => setSelectedMenuItem(e.key)}
          />
        </Sider>
        <Layout
          className="site-layout"
          style={{
            marginLeft: collapsed ? "80px" : "200px",
            transition: "0.2s ease-in-out",
          }}
        >
          <Content
            className="site-layout-background"
            style={{ margin: "20px" }}
          >
            {componentSwitch(selectedMenuItem)}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default MainPage;
