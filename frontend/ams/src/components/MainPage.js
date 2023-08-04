import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Space, Dropdown, Badge, Col, Avatar } from "antd";
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
    (async () => {
      try {
        await axios
          .get("http://localhost:8000/api/module", {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          })
          .then((response) => {
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
    })();
  }, []);

  function logout() {
    Cookies.remove("jwt");
    navigate("/login");
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
        return <SettingOutlined style={{ fontSize: "20px", color: "#fff" }} />;
      case "TeamOutlined":
        return <TeamOutlined style={{ fontSize: "20px", color: "#fff" }} />;
      case "ShoppingCartOutlined":
        return (
          <ShoppingCartOutlined style={{ fontSize: "20px", color: "#fff" }} />
        );
      case "CarOutlined":
        return <CarOutlined style={{ fontSize: "20px", color: "#fff" }} />;
      case "BarChartOutlined":
        return <BarChartOutlined style={{ fontSize: "20px", color: "#fff" }} />;
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
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            height: "100vh",
            background: "#108ee9",
          }}
        >
          <Menu
            defaultSelectedKeys={[1]}
            mode="inline"
            items={modules}
            style={{
              fontSize: "12px",
              background: "#108ee9",
              marginTop: "85px",
            }}
            onClick={(e) => setSelectedMenuItem(e.key)}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: "0",
              background: "#fff",
              height: "65px",
              position: "sticky",
              top: "0",
              zIndex: "1",
            }}
          >
            <div className="space-between-row" style={{ padding: "0 20px" }}>
              <Col>
                <div>
                  {React.createElement(
                    collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                    {
                      className: "trigger",
                      onClick: () => setCollapsed(!collapsed),
                    }
                  )}
                </div>
              </Col>
              <Col>
                <Space size="large">
                  <Dropdown
                    menu={{ items, onClick }}
                    placement="bottomRight"
                    arrow
                  >
                    <span className="avatar-item">
                      <Badge size="small">
                        <Space size="large">
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
              </Col>
            </div>
            <div
              style={{
                marginTop: "1px",
                height: "22px",
                background: "#F0F2F5",
              }}
            ></div>
          </Header>
          <Layout className="site-layout">
            <Content
              className="site-layout-background"
              style={{ margin: "20px" }}
            >
              {componentSwitch(selectedMenuItem)}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default MainPage;
