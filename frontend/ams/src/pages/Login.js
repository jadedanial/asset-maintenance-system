import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { Form, Button, Input, Card, Typography, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import HomePage from "./Home";
import Slogan from "../components/Slogan";

const { Title } = Typography;

const LoginPage = () => {
  const [theme, setTheme] = useState("light");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showunauthorized, setShowunauthorized] = useState(false);
  const [redirect, setRedirect] = useState(false);

  function onFinish() {
    const loginData = { username, password };
    axios({
      method: "POST",
      url: "http://localhost:8000/api/login",
      data: loginData,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then(() => {
        setShowunauthorized(false);
        setRedirect(true);
      })
      .catch((err) => {
        console.log(err.response.data.detail);
        setShowunauthorized(true);
        setRedirect(false);
      });
  }

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:8000/api/mode",
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

  if (showunauthorized) {
    return (
      <>
        <HomePage />
      </>
    );
  }

  if (redirect) {
    return (
      <>
        <Navigate to="/" />
      </>
    );
  }

  return (
    <>
      <div className={theme}>
        <Row
          style={{
            height: "100vh",
          }}
        >
          <Col
            span={10}
            style={{
              background: theme === "light" ? "#cdf5fd" : "#1c2755",
            }}
          >
            <Slogan />
          </Col>
          <Col
            span={14}
            style={{
              background: theme === "light" ? "#f8f8ff" : "#161d40",
            }}
          >
            <Card
              size="large"
              title={
                <Title>
                  <p className="big-card-title">Authenticate User</p>
                </Title>
              }
              style={{ width: "60%", top: "20%", left: "22%" }}
            >
              <Form
                name="login"
                className="login-form ant-form-item-space-bottom-normal"
                size="small"
                initialValues={{ remember: true }}
                onFinish={onFinish}
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input username!",
                    },
                  ]}
                >
                  <Input
                    className="medium-font"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input password!",
                    },
                  ]}
                >
                  <Input
                    className="medium-font"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    style={{ marginTop: "24px" }}
                    size="large"
                    type="primary"
                    htmlType="submit"
                    block
                  >
                    LOGIN
                  </Button>
                </Form.Item>
              </Form>
              <Link
                to="/register"
                className="justified-row large-card-title hover-underline"
              >
                Create a new account
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default LoginPage;
