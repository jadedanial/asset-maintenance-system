import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Input, Card, Typography, Row, Col } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CheckOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ResultEvent from "../components/ResultEvent";
import Slogan from "../components/Slogan";
import Footer from "../components/Footer";

const { Title } = Typography;

const RegisterPage = () => {
  const [theme, setTheme] = useState("light");
  const [label, setLabel] = useState("Add New User");
  const [color, setColor] = useState("#318ce7");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const onFinish = () => {
    var registerData = {
      userid: userId,
      username: userName,
      email: email,
      password: password,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/api/register`,
      data: registerData,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        setSuccess(false);
        setLabel(err.response.data[0]);
        setColor("#ff0000");
      });
  };

  const onFieldsChange = () => {
    setLabel("Add New User");
    setColor("#318ce7");
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
        <Row
          style={{
            height: "calc(100vh - 80px)",
            background: theme === "light" ? "#ecf3f9" : "#1c2755",
          }}
        >
          <Col span={10}>
            <Slogan />
          </Col>
          <Col
            span={14}
            className="align-items-center"
            style={{
              height: "calc(100vh - 80px)",
            }}
          >
            {success ? (
              <Card style={{ width: "60%", left: "18%" }}>
                <ResultEvent
                  icon={<CheckOutlined />}
                  status="success"
                  title="Successfully added new user."
                  subTitle={"Username " + userName + " and Email " + email}
                  extra={
                    <Button type="primary" href="/login">
                      LOGIN
                    </Button>
                  }
                  height="100%"
                  theme={theme}
                />
              </Card>
            ) : (
              <Card
                title={
                  <Title>
                    <p className="big-card-title" style={{ color: color }}>
                      {label}
                    </p>
                  </Title>
                }
                style={{ width: "60%", left: "18%" }}
              >
                <Form
                  name="register"
                  className="login-form ant-form-item-space-bottom-normal"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFieldsChange={onFieldsChange}
                >
                  <Form.Item
                    name="id"
                    rules={[
                      {
                        required: true,
                        message: "Input employee ID",
                      },
                    ]}
                  >
                    <Input
                      prefix={<IdcardOutlined />}
                      placeholder="Employee ID"
                      onChange={(e) => setUserId(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Input employee username",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Username"
                      maxLength={100}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: "The input is not valid email",
                      },
                      {
                        required: true,
                        message: "Input employee email",
                      },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      type="email"
                      placeholder="Email"
                      maxLength={100}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Item>
                  <Row className="space-between-row">
                    <Col span={12}>
                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Input employee password",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          prefix={<LockOutlined />}
                          type="password"
                          placeholder="Password"
                          maxLength={100}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        name="confirm"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: "Confirm employee password",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  "The two Passwords that you entered do not match!"
                                )
                              );
                            },
                          }),
                        ]}
                      >
                        <Input
                          prefix={<LockOutlined />}
                          type="password"
                          placeholder="Confirm Password"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Button
                      style={{ marginTop: "24px" }}
                      type="primary"
                      htmlType="submit"
                      block
                    >
                      REGISTER
                    </Button>
                  </Form.Item>
                </Form>
                <div
                  className="justified-row medium-card-title"
                  style={{
                    color: theme === "light" ? "#000" : "#fff",
                    paddingTop: "10px",
                  }}
                >
                  <p style={{ margin: "0" }}>Already have an account?&nbsp;</p>
                  <Link to="/login" className="hover-underline">
                    Login
                  </Link>
                </div>
              </Card>
            )}
          </Col>
        </Row>
        <Footer theme={theme} />
      </div>
    </>
  );
};

export default RegisterPage;
