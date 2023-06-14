import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";
import { Layout, Form, Checkbox, Button, Input, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import NavigationMenu from '../components/Navigation';
import HomePage from './Home';

const { Title } = Typography;

const LoginPage = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [inputReq, setInputReq] = useState(true);
  const [isCheck, setIsCheck] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [showunauthorized, setShowunauthorized] = useState(false);

  useEffect(() => {(
    async () => {
      try {
        await axios.get('http://localhost:8000/api/user', {
          headers: {'Content-Type' : 'application/json'},
          withCredentials: true,
        });
        setRedirect(true);
      } catch (err) {
        console.log(err.response.data[0]);
        setRedirect(false);
      }
    }
  )();});

  async function handleSubmit () {
    if (username !== "" && password !== "") {
      try {
        await axios.post('http://localhost:8000/api/login', {
          username: username,
          password: password,
        },{
          headers: {'Content-Type' : 'application/json'},
          withCredentials: true,
        });
        setShowunauthorized(false);
        setRedirect(true);
        if (remember) {
          localStorage.setItem("RememberMe", JSON.stringify(username));
        } else {
          localStorage.removeItem("RememberMe");
        }
      } catch (err) {
        console.log(err.response.data[0]);
        setShowunauthorized(true);
        setRedirect(false);
      }
    }
  };

  function toggleChecked() {
    setIsCheck(!isCheck);
  };

  function rememberUser() {
    if(localStorage.getItem("RememberMe") !== null){
      const remUser = JSON.parse(localStorage.getItem("RememberMe"));
      setUsername(remUser);
      setInputReq(false);
      setIsCheck(true);
      return remUser
    }
  };

  if (redirect) {
    return <><Navigate to="/" /></>
  }

  if (showunauthorized) {
    return <><HomePage /></>
  }

  return (
    <>
      <NavigationMenu />
      <Layout style={{height: "90vh"}}>
        <div className="justified-row">
          <div style={{margin: "40px", marginTop: "5%", width: "30%"}}>
            <Card size="large" title={<Title><p className="big-card-title">Authenticate User</p></Title>} hoverable>
              <Form name="login" className="login-form" size="large" initialValues={{remember: true,}}>
                <Form.Item name="username" rules={[{required: inputReq, message: 'Please input employee username!',},]}>
                  <Input className="medium-font" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" defaultValue={rememberUser} onChange={e => setUsername(e.target.value)} />
                </Form.Item>
                <Form.Item name="password" rules={[{required: true, message: 'Please input employee password!',},]}>
                  <Input className="medium-font" prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </Form.Item>
                <Form.Item name="remember" style={{marginBottom: "20px"}}>
                  <Checkbox className="medium-font" checked={isCheck} onClick={toggleChecked} onChange={e => setRemember(e.target.checked)}>Remember Me</Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{marginTop: "24px"}} icon={<LoginOutlined />} onClick={handleSubmit} block>LOGIN</Button>
                </Form.Item>
              </Form>
            </Card>
          </div>  
        </div>
      </Layout>
    </>
  );

};

export default LoginPage;