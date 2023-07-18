import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, Layout, Row, Col } from "antd";

const { Header } = Layout;

const NavigationEvent = () => {
  const items = [
    {
      label: (
        <Link
          to="/login"
          className="medium-card-title"
          style={{ color: "#318ce7" }}
        >
          Login
        </Link>
      ),
      key: "login",
    },
    {
      label: (
        <Link
          to="/register"
          className="medium-card-title"
          style={{ color: "#318ce7" }}
        >
          Register
        </Link>
      ),
      key: "register",
    },
  ];

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
              <Menu
                mode="horizontal"
                items={items}
                style={{ padding: "0", background: "#fff" }}
              />
            </div>
          </Col>
        </Row>
      </Header>
      <Outlet />
    </>
  );
};

export default NavigationEvent;
