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
        console.log(err.response.data[0]);
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
            {success ? (
              <Card
                size="large"
                style={{ width: "60%", top: "15%", left: "22%" }}
              >
                <ResultEvent
                  icon={<CheckOutlined style={{ color: "#318ce7" }} />}
                  status="success"
                  title="Successfully added new User."
                  subTitle={"Username: " + userName + "\nEmail: " + email}
                  extra={
                    <Button size="large" type="primary" href="/login">
                      Login
                    </Button>
                  }
                />
              </Card>
            ) : (
              <Card
                size="large"
                title={
                  <Title>
                    <p className="big-card-title" style={{ color: color }}>
                      {label}
                    </p>
                  </Title>
                }
                style={{ width: "60%", top: "10%", left: "22%" }}
              >
                <Form
                  name="register"
                  className="login-form ant-form-item-space-bottom-normal"
                  size="small"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFieldsChange={onFieldsChange}
                >
                  <Form.Item
                    name="id"
                    rules={[
                      {
                        required: true,
                        message: "Please input employee ID!",
                      },
                    ]}
                  >
                    <Input
                      prefix={
                        <IdcardOutlined className="site-form-item-icon" />
                      }
                      placeholder="Employee ID"
                      onChange={(e) => setUserId(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please input employee username!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
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
                        message: "The input is not valid Email!",
                      },
                      {
                        required: true,
                        message: "Please input employee email!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="site-form-item-icon" />}
                      type="email"
                      placeholder="Email"
                      maxLength={100}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input employee password!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Password"
                      maxLength={100}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirm"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please confirm employee password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
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
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Confirm Password"
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
                      REGISTER
                    </Button>
                  </Form.Item>
                </Form>
                <Link
                  to="/login"
                  className="justified-row medium-card-title hover-underline"
                  style={{ padding: "10px" }}
                >
                  Already have an account
                </Link>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default RegisterPage;
