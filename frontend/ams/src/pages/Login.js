import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Form, Button, Input, Card, Typography, Row, Col } from "antd";
import { UserOutlined, LockOutlined, FrownOutlined } from "@ant-design/icons";
import axios from "axios";
import Slogan from "../components/Slogan";
import ResultEvent from "../components/ResultEvent";

const { Title } = Typography;

const LoginPage = () => {
  let navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);

  const onFinish = () => {
    const loginData = { username, password };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/api/login`,
      data: loginData,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        sessionStorage.setItem("token", response.data.token);
        navigate("/");
      })
      .catch((err) => {
        console.log(err.response.data.detail);
        setLoginFailed(true);
      });
  };

  useEffect(() => {
    const mode = document.cookie
      .split("; ")
      .find((row) => row.startsWith("mode="))
      ?.split("=")[1];
    setTheme(mode || "light");
  }, []);

  return (
    <>
      <div className={theme}>
        {loginFailed ? (
          <div
            style={{
              paddingTop: "50px",
              background: theme === "light" ? "#ecf3f9" : "#1c2755",
              height: "100vh",
            }}
          >
            <ResultEvent
              icon={<FrownOutlined style={{ color: "#ecf3f9" }} />}
              status="403"
              title="Unauthorized User!"
              subTitle="Sorry, you are not authorized to access this page. Please login or register."
              extra={
                <Row className="space-between-row" style={{ width: "30%" }}>
                  <Col span={12}>
                    <Button size="large" type="default" href="/login" block>
                      LOGIN
                    </Button>
                  </Col>
                  <Col span={11}>
                    <Button size="large" type="primary" href="/register" block>
                      REGISTER
                    </Button>
                  </Col>
                </Row>
              }
              theme={theme}
            />
          </div>
        ) : (
          <Row
            style={{
              height: "100vh",
            }}
          >
            <Col
              span={10}
              style={{
                background: theme === "light" ? "#ecf3f9" : "#1c2755",
              }}
            >
              <Slogan />
            </Col>
            <Col
              span={14}
              style={{
                background: theme === "light" ? "#f8f9fa" : "#161d40",
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
                        message: "Input username!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Input password!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined />}
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
                  className="justified-row medium-card-title hover-underline"
                  style={{ padding: "10px" }}
                >
                  Create a new account
                </Link>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default LoginPage;
