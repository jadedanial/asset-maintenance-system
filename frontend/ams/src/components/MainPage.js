import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  ConfigProvider,
  Layout,
  Menu,
  Space,
  Dropdown,
  Badge,
  Col,
  Avatar,
  Button,
} from "antd";
import {
  UserOutlined,
  UnlockOutlined,
  SettingOutlined,
  BarChartOutlined,
  TeamOutlined,
  ShopOutlined,
  CarOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AlertOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import Employee from "../modules/Employee";
import Shift from "../modules/Shift";
import Schedule from "../modules/Schedule";
import Item from "../modules/Item";
import Transact from "../modules/Transact";
import DrawerEvent from "./DrawerEvent";
import EmptyData from "./EmptyData";

const { Header, Sider, Content } = Layout;

const MainPage = (props) => {
  const [theme, setTheme] = useState("light");
  const [employeeSection, setEmployeeSection] = useState("");
  const [openDrawer, setOpenDrawer] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [previousMenuItem, setPreviousMenuItem] = useState("");
  const [modules, setModules] = useState([]);
  const [sectionCode, setSectionCode] = useState("");
  const [sectionCategory, setSectionCategory] = useState("");
  const navigate = useNavigate();

  const emptyImage = () => (
    <>
      <EmptyData theme={theme} />
    </>
  );

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

  function addMode(mode) {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/api/mode`,
      data: mode,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).catch((err) => {
      console.log(err);
    });
  }

  function changeMode() {
    if (theme === "light") {
      addMode("dark");
      setTheme("dark");
    } else {
      addMode("light");
      setTheme("light");
    }
  }

  function logout() {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/logout`,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    Cookies.remove("jwt_frontend");
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
        return <SettingOutlined style={{ fontSize: "20px" }} />;
      case "ShopOutlined":
        return <ShopOutlined style={{ fontSize: "20px" }} />;
      case "TeamOutlined":
        return <TeamOutlined style={{ fontSize: "20px" }} />;
      case "CarOutlined":
        return <CarOutlined style={{ fontSize: "20px" }} />;
      case "BarChartOutlined":
        return <BarChartOutlined style={{ fontSize: "20px" }} />;
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
              collapsed={collapsed}
              comp={"User"}
              updateEmployeeSection={updateEmployeeSection}
              theme={theme}
              overflow={true}
              showClose={true}
            />
          </>
        );
      case "Employee":
        return (
          <>
            <Employee
              updateEmployeeSection={updateEmployeeSection}
              collapsed={collapsed}
              theme={theme}
            />
          </>
        );
      case "Shift":
        return (
          <>
            <Shift collapsed={collapsed} theme={theme} />
          </>
        );
      case "Schedule":
        return (
          <>
            <Schedule collapsed={collapsed} theme={theme} />
          </>
        );
      case "Item":
        return (
          <>
            <Item
              empid={props.empid}
              collapsed={collapsed}
              sectionCode={sectionCode}
              sectionCategory={sectionCategory}
              theme={theme}
            />
          </>
        );
      case "Transact":
        return (
          <>
            <Transact
              empid={props.empid}
              username={props.username}
              collapsed={collapsed}
              sectionCode={sectionCode}
              theme={theme}
            />
          </>
        );

      default:
        break;
    }
  }

  function fetchData(url, callback) {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/${url}`,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        callback(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getSection() {
    fetchData("employees", (data) => {
      const employee = data.find((res) => res.emp_id === props.empid);
      if (employee) {
        setEmployeeSection(employee.emp_section);
      }
    });
    fetchData("sections", (data) => {
      const section = data.find((res) => res.section_code === employeeSection);
      if (section) {
        setSectionCode(section.section_code);
        setSectionCategory(section.section_category);
      }
    });
  }

  function updateEmployeeSection() {
    getSection();
  }

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/modules`,
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/mode`,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        setTheme(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getSection();
  });

  return (
    <>
      <ConfigProvider renderEmpty={emptyImage}>
        <Layout className={theme}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{
              height: "100vh",
            }}
          >
            <div style={{ margin: "20px 0 15px 32px" }}>
              <img
                src={"images/ams.png"}
                alt="logo"
                style={{
                  width: "35%",
                }}
              />
            </div>
            <Menu
              defaultSelectedKeys={[1]}
              mode="inline"
              theme={theme}
              items={modules}
              style={{
                fontSize: "12px",
                marginTop: "30px",
              }}
              onClick={(e) => setSelectedMenuItem(e.key)}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: "0",
                height: "65px",
                position: "sticky",
                top: "0",
                zIndex: "1",
              }}
            >
              <div className="space-between-row" style={{ padding: "0 20px" }}>
                <Col style={{ color: "#318ce7" }}>
                  {React.createElement(
                    collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                    {
                      className: "trigger",
                      onClick: () => setCollapsed(!collapsed),
                    }
                  )}
                </Col>
                <Col>
                  <Dropdown
                    menu={{ items, onClick }}
                    placement="bottomRight"
                    arrow
                  >
                    <Badge>
                      <Space style={{ marginRight: "20px" }}>
                        <Col>
                          <p
                            className="medium-font"
                            style={{ cursor: "pointer", color: "#318ce7" }}
                          >
                            {props.empid}
                          </p>
                        </Col>
                        <Col>
                          <p
                            className="medium-font"
                            style={{ cursor: "pointer", color: "#318ce7" }}
                          >
                            {props.username}
                          </p>
                        </Col>
                        <Col>
                          <Avatar
                            size="small"
                            style={{
                              background: "#318ce7",
                              cursor: "pointer",
                            }}
                            icon={<UserOutlined />}
                          />
                        </Col>
                      </Space>
                    </Badge>
                  </Dropdown>
                  <Button
                    icon={
                      theme === "light" ? <BulbOutlined /> : <AlertOutlined />
                    }
                    className="btn-normal"
                    onClick={() => changeMode()}
                  />
                </Col>
              </div>
              <div
                style={{
                  marginTop: "1px",
                  height: "22px",
                  background: theme === "light" ? "#cdf5fd" : "#1c2755",
                }}
              ></div>
            </Header>
            <Layout
              style={{
                background: theme === "light" ? "#cdf5fd" : "#1c2755",
                minHeight: "300%",
              }}
            >
              <Content style={{ margin: "20px" }}>
                {componentSwitch(selectedMenuItem)}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  );
};

export default MainPage;
