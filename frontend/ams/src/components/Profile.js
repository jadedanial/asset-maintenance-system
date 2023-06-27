import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Card, Typography, Tabs, Statistic, Rate } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, TrophyOutlined, HeartOutlined, IdcardOutlined, CalendarOutlined } from '@ant-design/icons';
import Attendance from '../components/Attendance';
import Schedule from '../components/Schedule';
import moment from 'moment';

const { Title } = Typography;

const cardlayout = {
  bordered: true,
  hoverable: true,
  size: "small",
  style:{width: "100%"},
};

const Profile = (props) => {

  const [employees, setEmployees] = useState([]);

  const items = [
    {
      label: <>ATTENDANCE</>,
      key: '1',
      children: <><Attendance empid={props.empid}></Attendance></>,
    },
    {
      label: <>SCHEDULE</>,
      key: '2',
      children: <><Schedule empid={props.empid}></Schedule></>,
    },
  ];

  useEffect(() => {
    axios.get('http://localhost:8000/api/employees')
    .then(response => {
      setEmployees(response.data);
    });
  },[]);

  function expYears(yearHired) {
    return moment().diff(moment(yearHired, "YYYY-MM-DD"), "years");
  };

  function star(starNum) {
    const av = parseInt(starNum)/10;
    return av*5;
  };
  
  function getInitials(name) {
    var parts = name.split(" ")
    var initials = ""
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].length > 0 && parts[i] !== "") {
        initials += parts[i][0]
      }
    }
    return initials.toUpperCase();
  };

  return (
    <>
      {employees.map(employee => (employee.emp_id === props.empid ? 
        <>
          <Row>
            <Card title={
              <Title>
                <Row style={{paddingLeft: "20px"}}>
                  <p className="big-card-title" style={{textTransform: "capitalize"}}>{employee.emp_name}</p> 
                </Row>
              </Title>} {...cardlayout}>
              <Row style={{justifyContent: "space-between", padding: "0 20px"}}>
                <Col>
                  <Row style={{marginBottom: "6px"}}><UserOutlined style={{fontSize: "20px", color: "#318CE7", paddingRight: "10px"}} /><p className="medium-font">{employee.emp_position}</p></Row>
                  <Row style={{marginBottom: "6px"}}><IdcardOutlined style={{fontSize: "20px", color: "#318CE7", paddingRight: "10px"}} /><p className="small-font">{employee.emp_id}</p></Row>
                  <Row style={{marginBottom: "6px"}}><CalendarOutlined style={{fontSize: "20px", color: "#318CE7", paddingRight: "10px"}} /><p className="small-font">Hired {moment(employee.emp_hired).format('MMMM DD, YYYY')}</p></Row>
                  <Row style={{marginBottom: "6px"}}><HeartOutlined style={{fontSize: "20px", color: "#318CE7", paddingRight: "10px"}} /><p className="small-font">{expYears(employee.emp_bdate)} years old</p></Row>
                </Col>
                <Col>
                  <Row style={{marginBottom: "6px"}}><MailOutlined style={{fontSize: "20px", color: "#318CE7", paddingRight: "10px"}} /><p className="small-font">{employee.emp_email}</p></Row>
                  <Row style={{marginBottom: "6px"}}><PhoneOutlined style={{fontSize: "20px", color: "#318CE7", paddingRight: "10px"}} /><p className="small-font">{employee.emp_phone}</p></Row>
                  <Row style={{marginBottom: "6px"}}><EnvironmentOutlined style={{fontSize: "20px", color: "#318CE7", paddingRight: "10px"}} /><p className="small-font">{employee.emp_address}</p></Row>
                </Col>
                <Col>
                  <Row><Statistic title={<Title style={{margin: 0}}><p className="small-font" style={{margin: 0}}>Years of Experience</p></Title>} value={expYears(employee.emp_hired)} prefix={<TrophyOutlined style={{color: "#318CE7"}} />} /></Row>
                  <Row><Rate disabled allowHalf count={5} value={star(expYears(employee.emp_hired))} /></Row>
                </Col>
                <Col>
                  <p className="biggest-card-title" style={{color: "#318CE7", textAlign: "right"}}>{getInitials(employee.emp_name)}</p>
                </Col>
              </Row>  
            </Card>
          </Row>
          <Row style={{marginTop: "20px"}}>
            <Card {...cardlayout}>
              <Col span={24}>
                <Tabs type="card" style={{background: "#FFF"}} defaultActiveKey="1" size="large" tabBarGutter={4} items={items} />
              </Col>
            </Card>
          </Row>
        </>:<></>
      ))}
    </>
  );

};

export default Profile;