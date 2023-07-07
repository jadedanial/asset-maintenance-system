import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, Layout, Row, Col } from "antd";
import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";

const { Header } = Layout;

const NavigationEvent = () => {
  return (
    <>
      <Layout style={{ position: "sticky", top: "0", zIndex: "1" }}>
        <Header style={{ padding: "0", background: "#000", height: "63px" }}>
          <Row>
            <Col span={3}>
              <div style={{ padding: "0 0 0 25px" }}>
                <img
                  src="images/danialsoft.png"
                  alt="logo"
                  style={{ width: "100px" }}
                />
              </div>
            </Col>
            <Col span={21}>
              <Menu
                mode="horizontal"
                style={{ padding: "0", background: "#000" }}
              >
                <Menu.Item
                  key="login"
                  icon={<LoginOutlined style={{ color: "#FFF" }} />}
                >
                  <Link
                    to="/login"
                    className="small-font"
                    style={{ color: "#FFF" }}
                  >
                    Login
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="register"
                  icon={<UserAddOutlined style={{ color: "#FFF" }} />}
                >
                  <Link
                    to="/register"
                    className="small-font"
                    style={{ color: "#FFF" }}
                  >
                    Register
                  </Link>
                </Menu.Item>
              </Menu>
            </Col>
          </Row>
        </Header>
      </Layout>
      <Outlet />
    </>
  );
};

export default NavigationEvent;
