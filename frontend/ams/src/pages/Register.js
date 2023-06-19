import React, { useState } from 'react';
import axios from 'axios';
import { Layout, Form, Button, Input, Card, Typography } from 'antd';
import { UserOutlined, UserAddOutlined, MailOutlined, LockOutlined, SmileTwoTone, LoginOutlined, IdcardOutlined } from '@ant-design/icons';
import ResultEvent from '../components/ResultEvent';
import NavigationEvent from '../components/NavigationEvent';

const { Title } = Typography;

const RegisterPage = () => {

  const [label, setLabel] = useState("Add New User");
  const [color, setColor] = useState("#318CE7");
  const [empID, setEmployeeID] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);

  async function onFinish () {
    setRedirect(true);
    setLabel("");
    try {
      await axios.post('http://localhost:8000/api/register/', {
        empID: empID,
        username: username,
        email: email,
        password: password,
      },{
        headers: {'Content-Type' : 'application/json'},
        withCredentials: true,
      });
      setSuccess(true);
    } catch (err) {
      console.log(err.response.data[0]);
      setSuccess(false);
      setLabel(err.response.data[0]);
      setColor("#F50");
    }
  };

  function onFinishFailed() {
    setRedirect(false);
  };

  function onFieldsChange() {
    setLabel("Add New User");
    setColor("#318CE7");
  };

  if (success && redirect) {
    return (
      <>
        <NavigationEvent />
        <ResultEvent icon={<SmileTwoTone style={{color: "#318CE7"}} />} status="success"
        title="Successfully added new User!"
        subTitle={"Username: " + username + "   Email: " + email}
        extra={<Button size="large" type="primary" icon={<LoginOutlined />} href="/login">Login</Button>} />
      </>
    );
  }

  return (
    <>
      <NavigationEvent />
      <Layout style={{height: "100%"}}>
        <div className="justified-row">
          <div style={{margin: "40px", marginTop: "5%", width: "30%"}}>
            <Card size="large" title={<Title><p className="big-card-title" style={{color: color}}>{label}</p></Title>} hoverable>
              <Form name="register" className="login-form" size="large" initialValues={{remember: true,}} onFinish={onFinish} onFinishFailed={onFinishFailed} onFieldsChange={onFieldsChange}>
                <Form.Item name="id" rules={[{required: true, message: 'Please input employee ID!',},]}>
                  <Input className="medium-font" prefix={<IdcardOutlined className="site-form-item-icon" />} placeholder="Employee ID" onChange={e => setEmployeeID(e.target.value)} />
                </Form.Item>
                <Form.Item name="username" rules={[{required: true, message: 'Please input employee username!',},]}>
                  <Input className="medium-font" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" onChange={e => setUsername(e.target.value)} />
                </Form.Item>
                <Form.Item name="email" rules={[{type: 'email', message: 'The input is not valid Email!',},{required: true, message: 'Please input employee email!',},]}>
                  <Input className="medium-font" prefix={<MailOutlined className="site-form-item-icon" />} type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                </Form.Item>
                <Form.Item name="password" rules={[{required: true, message: 'Please input employee password!',},]} hasFeedback>
                  <Input className="medium-font" prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </Form.Item>
                <Form.Item name="confirm" dependencies={['password']} hasFeedback rules={[{required: true, message: 'Please confirm employee password!',},
                  ({ getFieldValue }) => ({validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two Passwords that you entered do not match!'));
                  },}),]}>
                  <Input className="medium-font" prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Confirm Password" />
                </Form.Item>
                <Form.Item>
                  <Button size="large" type="primary" htmlType="submit" style={{marginTop: "24px"}} icon={<UserAddOutlined />} block>REGISTER</Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>               
      </Layout>
    </>
  );

};

export default RegisterPage;