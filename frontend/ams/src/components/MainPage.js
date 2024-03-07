import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomQueryClient } from "../useQueryClient";
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
import axios from "axios";
import Employee from "../modules/Employee";
import Shift from "../modules/Shift";
import Schedule from "../modules/Schedule";
import Item from "../modules/Item";
import Transact from "../modules/Transact";
import DrawerEvent from "./DrawerEvent";
import EmptyData from "./EmptyData";

const { Header, Sider, Content } = Layout;

const MainPage = ({
  userId,
  userName,
  components,
  modules,
  categories,
  options,
  branches,
  sections,
  shifts,
  schedules,
  employees,
  attendances,
  vacations,
  excuses,
  items,
  warehouseitems,
  vehicles,
  transactions,
}) => {
  const [theme, setTheme] = useState("light");
  const [openDrawer, setOpenDrawer] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [previousMenuItem, setPreviousMenuItem] = useState("");
  const [sectionCode, setSectionCode] = useState("");
  const [sectionCategory, setSectionCategory] = useState("");
  const navigate = useNavigate();
  const queryClient = useCustomQueryClient();

  const addMode = (mode) => {
    document.cookie = "mode=" + mode + "; path=/";
  };

  const changeMode = () => {
    if (theme === "light") {
      addMode("dark");
      setTheme("dark");
    } else {
      addMode("light");
      setTheme("light");
    }
  };

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedMenuItem(previousMenuItem);
  };

  const logout = () => {
    const token = sessionStorage.getItem("token");
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/api/logout`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then(() => {
        queryClient.clear();
      })
      .catch((err) => {
        console.log(err);
      });
    navigate("/login");
  };

  const onClick = ({ key }) => {
    if (key === "0") {
      setPreviousMenuItem(selectedMenuItem);
      setSelectedMenuItem(0);
      showDrawer();
    }
    if (key === "1") {
      return logout();
    }
  };

  const emptyImage = () => (
    <>
      <EmptyData theme={theme} />
    </>
  );

  const dropDownItems = [
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

  const iconComponents = {
    SettingOutlined: <SettingOutlined style={{ fontSize: "20px" }} />,
    ShopOutlined: <ShopOutlined style={{ fontSize: "20px" }} />,
    TeamOutlined: <TeamOutlined style={{ fontSize: "20px" }} />,
    CarOutlined: <CarOutlined style={{ fontSize: "20px" }} />,
    BarChartOutlined: <BarChartOutlined style={{ fontSize: "20px" }} />,
  };

  let newModules = [];
  if (modules && modules.length > 0) {
    newModules = modules.map((module) => ({
      ...module,
      icon: iconComponents[module.icon],
    }));
  }

  const componentSwitch = (key) => {
    switch (key) {
      case 0:
        return (
          <>
            <DrawerEvent
              employees={employees}
              attendances={attendances}
              schedules={schedules}
              vacations={vacations}
              excuses={excuses}
              sections={sections}
              options={options}
              userId={userId}
              showDrawer={openDrawer}
              onCloseDrawer={onCloseDrawer}
              comp={"User"}
              overflow={true}
              showClose={true}
              getSection={getSection}
              collapsed={collapsed}
              theme={theme}
            />
          </>
        );
      case "Employee":
        return (
          <>
            <Employee
              employees={employees}
              attendances={attendances}
              schedules={schedules}
              vacations={vacations}
              excuses={excuses}
              sections={sections}
              options={options}
              getSection={getSection}
              collapsed={collapsed}
              theme={theme}
            />
          </>
        );
      case "Shift":
        return (
          <>
            <Shift shifts={shifts} collapsed={collapsed} theme={theme} />
          </>
        );
      case "Schedule":
        return (
          <>
            <Schedule
              schedules={schedules}
              shifts={shifts}
              collapsed={collapsed}
              theme={theme}
            />
          </>
        );
      case "Item":
        return (
          <>
            <Item
              items={items}
              warehouseitems={warehouseitems}
              options={options}
              sectionCode={sectionCode}
              sectionCategory={sectionCategory}
              collapsed={collapsed}
              theme={theme}
            />
          </>
        );
      case "Transact":
        return (
          <>
            <Transact
              items={items}
              warehouseitems={warehouseitems}
              sections={sections}
              options={options}
              transactions={transactions}
              userId={userId}
              userName={userName}
              sectionCode={sectionCode}
              collapsed={collapsed}
              theme={theme}
            />
          </>
        );

      default:
        break;
    }
  };

  const getSection = useCallback(() => {
    if (employees && employees.length > 0 && sections && sections.length > 0) {
      const employee = employees.find((res) => res.emp_id === userId);
      const section = sections.find(
        (res) => res.section_code === employee?.emp_section
      );

      if (section) {
        setSectionCode(section.section_code);
        setSectionCategory(section.section_category);
      }
    }
  }, [employees, sections, userId]);

  useEffect(() => {
    const mode = document.cookie
      .split("; ")
      .find((row) => row.startsWith("mode="))
      ?.split("=")[1];
    setTheme(mode || "light");
    getSection();
  }, [getSection]);

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
              items={newModules}
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
                    menu={{ items: dropDownItems, onClick }}
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
                            {userId}
                          </p>
                        </Col>
                        <Col>
                          <p
                            className="medium-font"
                            style={{ cursor: "pointer", color: "#318ce7" }}
                          >
                            {userName}
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
                  background: theme === "light" ? "#ecf3f9" : "#1c2755",
                }}
              ></div>
            </Header>
            <Layout
              style={{
                background: theme === "light" ? "#ecf3f9" : "#1c2755",
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
