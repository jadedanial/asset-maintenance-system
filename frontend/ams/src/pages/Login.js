import React, { useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { Layout, Form, Button, Input, Card, Typography, Col, Row } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import HomePage from "./Home";

const { Title } = Typography;

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showunauthorized, setShowunauthorized] = useState(false);
  const [redirect, setRedirect] = useState(false);

  async function onFinish() {
    try {
      await axios.post(
        "http://localhost:8000/api/login",
        {
          username: username,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setShowunauthorized(false);
      setRedirect(true);
    } catch (err) {
      console.log(err.response.data[0]);
      setShowunauthorized(true);
      setRedirect(false);
    }
  }

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
      <Layout style={{ height: "100%" }}>
        <div className="space-between-row" style={{ marginTop: "80px" }}>
          <Col span={11}>
            <div className="flex-end-row">
              <Card
                style={{
                  background: "#f0f2f5",
                  width: "450px",
                  marginTop: "55px",
                }}
              >
                <Row>
                  <img
                    src="images/danialsoft.png"
                    alt="logo"
                    style={{ width: "60%" }}
                  />
                </Row>
                <Row style={{ marginTop: "20px" }}>
                  <p className="big-font">
                    Keeping your assets in top shape for optimal performance.
                  </p>
                </Row>
              </Card>
            </div>
          </Col>
          <Col span={11}>
            <div className="flex-start-row">
              <Card
                size="large"
                title={
                  <Title>
                    <p className="big-card-title">Authenticate User</p>
                  </Title>
                }
                style={{ width: "400px" }}
                hoverable
              >
                <Form
                  name="login"
                  className="login-form ant-form-item-space-bottom-normal"
                  size="large"
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
                      size="large"
                      type="primary"
                      htmlType="submit"
                      style={{ marginTop: "24px" }}
                      icon={<LoginOutlined />}
                      block
                    >
                      LOGIN
                    </Button>
                  </Form.Item>
                </Form>
                <Link to="/register" className="justified-row medium-font">
                  Create a new account
                </Link>
              </Card>
            </div>
          </Col>
        </div>
      </Layout>
    </>
  );
};

export default LoginPage;
