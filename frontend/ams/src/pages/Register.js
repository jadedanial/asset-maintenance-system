import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Form, Button, Input, Card, Typography, Col } from "antd";
import {
  UserOutlined,
  UserAddOutlined,
  MailOutlined,
  LockOutlined,
  CheckCircleOutlined,
  LoginOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import ResultEvent from "../components/ResultEvent";
import Slogan from "../components/Slogan";

const { Title } = Typography;

const RegisterPage = () => {
  const [label, setLabel] = useState("Add New User");
  const [color, setColor] = useState("#318ce7");
  const [empID, setEmployeeID] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  async function onFinish() {
    setLabel("");
    try {
      await axios.post(
        "http://localhost:8000/api/register/",
        {
          empID: empID,
          username: username,
          email: email,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setSuccess(true);
    } catch (err) {
      console.log(err.response.data[0]);
      setSuccess(false);
      setLabel(err.response.data[0]);
      setColor("#F50");
    }
  }

  function onFieldsChange() {
    setLabel("Add New User");
    setColor("#318ce7");
  }

  return (
    <>
      <div className="space-between-row" style={{ height: "100vh" }}>
        <Slogan />
        <Col span={12} style={{ top: "15%" }}>
          <div className="flex-start-row">
            {success ? (
              <Card size="large" style={{ width: "60%" }} hoverable>
                <ResultEvent
                  icon={<CheckCircleOutlined style={{ color: "#318ce7" }} />}
                  status="success"
                  title="Successfully added new User."
                  subTitle={"Username: " + username + "   Email: " + email}
                  extra={
                    <Button
                      icon={<LoginOutlined />}
                      size="large"
                      type="primary"
                      href="/login"
                    >
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
                style={{ width: "60%" }}
                hoverable
              >
                <Form
                  name="register"
                  className="login-form ant-form-item-space-bottom-normal"
                  size="large"
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
                      className="medium-font"
                      prefix={
                        <IdcardOutlined className="site-form-item-icon" />
                      }
                      placeholder="Employee ID"
                      onChange={(e) => setEmployeeID(e.target.value)}
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
                      className="medium-font"
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}
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
                      className="medium-font"
                      prefix={<MailOutlined className="site-form-item-icon" />}
                      type="email"
                      placeholder="Email"
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
                      className="medium-font"
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Password"
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
                      className="medium-font"
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Confirm Password"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      icon={<UserAddOutlined />}
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
                <Link to="/login" className="justified-row medium-font">
                  Already have an account
                </Link>
              </Card>
            )}
          </div>
        </Col>
      </div>
    </>
  );
};

export default RegisterPage;
