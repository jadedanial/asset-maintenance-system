import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Col,
  Row,
  Card,
  Typography,
  Tabs,
  Statistic,
  Rate,
  Button,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  HeartOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import AddUpdateEmployee from "./AddUpdateEmployee";
import Attendance from "../components/Attendance";
import ShiftSchedule from "./ShiftSchedule";
import Vacation from "../components/Vacation";
import Excuse from "../components/Excuse";
import moment from "moment";

const { Title } = Typography;

const Profile = (props) => {
  const [employees, setEmployees] = useState([]);
  const [update, setUpdate] = useState(false);

  const items = [
    {
      label: <>ATTENDANCE</>,
      key: "1",
      children: (
        <>
          <Attendance empid={props.empid}></Attendance>
        </>
      ),
    },
    {
      label: <>SCHEDULE</>,
      key: "2",
      children: (
        <>
          <ShiftSchedule empid={props.empid}></ShiftSchedule>
        </>
      ),
    },
    {
      label: <>VACATION</>,
      key: "3",
      children: (
        <>
          <Vacation empid={props.empid}></Vacation>
        </>
      ),
    },
    {
      label: <>EXCUSE</>,
      key: "4",
      children: (
        <>
          <Excuse empid={props.empid}></Excuse>
        </>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        await axios({
          method: "GET",
          url: "http://localhost:8000/api/employees",
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }).then((response) => {
          setEmployees(response.data);
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  function expYears(yearHired) {
    return moment().diff(moment(yearHired, "YYYY-MM-DD"), "years");
  }

  function star(starNum) {
    const av = parseInt(starNum) / 10;
    return av * 5;
  }

  function getInitials(name) {
    var parts = name.split(" ");
    var initials = "";
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].length > 0 && parts[i] !== "") {
        initials += parts[i][0];
      }
    }
    return initials.toUpperCase();
  }

  return (
    <>
      {employees.map((e) =>
        e.emp_id === props.empid ? (
          <>
            {update ? (
              <>
                <AddUpdateEmployee
                  update={true}
                  id={e.emp_id}
                  name={e.emp_name}
                  birthdate={e.emp_bdate}
                  nationality={e.emp_nation}
                  address={e.emp_address}
                  email={e.emp_email}
                  phone={e.emp_phone}
                  datehired={e.emp_hired}
                  position={e.emp_position}
                  salary={e.emp_salary}
                  branch={e.emp_branch}
                ></AddUpdateEmployee>
              </>
            ) : (
              <>
                <Card
                  size="large"
                  extra={
                    <Button
                      size="large"
                      type="primary"
                      onClick={() => setUpdate(true)}
                    >
                      UPDATE
                    </Button>
                  }
                  title={
                    <Title>
                      <Row style={{ paddingLeft: "20px" }}>
                        <p
                          className="big-card-title"
                          style={{ textTransform: "capitalize" }}
                        >
                          {e.emp_name}
                        </p>
                      </Row>
                    </Title>
                  }
                  style={{ width: "100%", borderTop: "0" }}
                >
                  <Row
                    style={{
                      justifyContent: "space-between",
                      padding: "20px 20px 0 20px",
                    }}
                  >
                    <Col>
                      <Row style={{ marginTop: "12px" }}>
                        <UserOutlined className="detail-icon-label" />
                        <p className="medium-font">{e.emp_position}</p>
                      </Row>
                      <Row style={{ marginTop: "12px" }}>
                        <IdcardOutlined className="detail-icon-label" />
                        <p className="small-font">{e.emp_id}</p>
                      </Row>
                      <Row style={{ marginTop: "12px" }}>
                        <CalendarOutlined className="detail-icon-label" />
                        <p className="small-font">
                          Hired {moment(e.emp_hired).format("MMMM DD, YYYY")}
                        </p>
                      </Row>
                      <Row style={{ marginTop: "12px" }}>
                        <HeartOutlined className="detail-icon-label" />
                        <p className="small-font">
                          {expYears(e.emp_bdate)} years old
                        </p>
                      </Row>
                    </Col>
                    <Col>
                      <Row style={{ marginTop: "12px" }}>
                        <MailOutlined className="detail-icon-label" />
                        <p className="small-font">{e.emp_email}</p>
                      </Row>
                      <Row style={{ marginTop: "12px" }}>
                        <PhoneOutlined className="detail-icon-label" />
                        <p className="small-font">{e.emp_phone}</p>
                      </Row>
                      <Row style={{ marginTop: "12px" }}>
                        <EnvironmentOutlined className="detail-icon-label" />
                        <p className="small-font">{e.emp_address}</p>
                      </Row>
                      <Row style={{ marginTop: "12px" }}>
                        <ApartmentOutlined className="detail-icon-label" />
                        <p className="small-font">{e.emp_branch}</p>
                      </Row>
                    </Col>
                    <Col>
                      <Row>
                        <Statistic
                          title={
                            <Title style={{ margin: 0 }}>
                              <p className="small-font" style={{ margin: 0 }}>
                                Years of Experience
                              </p>
                            </Title>
                          }
                          value={expYears(e.emp_hired)}
                          prefix={
                            <TrophyOutlined style={{ color: "#318ce7" }} />
                          }
                        />
                      </Row>
                      <Row>
                        <Rate
                          disabled
                          allowHalf
                          count={5}
                          value={star(expYears(e.emp_hired))}
                          style={{ color: "#318ce7" }}
                        />
                      </Row>
                    </Col>
                    <Col>
                      <p
                        className="biggest-card-title"
                        style={{ color: "#318ce7", textAlign: "right" }}
                      >
                        {getInitials(e.emp_name)}
                      </p>
                    </Col>
                  </Row>
                </Card>
                <Card size="large" style={{ borderTop: "0" }}>
                  <Tabs
                    type="card"
                    style={{ background: "#fff" }}
                    defaultActiveKey="1"
                    size="large"
                    tabBarGutter={4}
                    items={items}
                    destroyInactiveTabPane
                  />
                </Card>
              </>
            )}
          </>
        ) : (
          <> </>
        )
      )}
    </>
  );
};

export default Profile;
