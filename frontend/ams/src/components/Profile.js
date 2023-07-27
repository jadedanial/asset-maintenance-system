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
} from "@ant-design/icons";
import AddUpdateEmployee from "./AddUpdateEmployee";
import Attendance from "../components/Attendance";
import Schedule from "../components/Schedule";
import Vacation from "../components/Vacation";
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
          <Schedule empid={props.empid}></Schedule>
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
  ];

  useEffect(() => {
    (async () => {
      try {
        await axios
          .get("http://localhost:8000/api/employees", {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          })
          .then((response) => {
            setEmployees(response.data);
          });
      } catch (err) {
        console.log(err.response.data[0]);
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
                ></AddUpdateEmployee>
              </>
            ) : (
              <>
                <Row>
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
                    style={{ width: "100%" }}
                    bordered
                    hoverable
                  >
                    <Row
                      style={{
                        justifyContent: "space-between",
                        padding: "20px 20px 0 20px",
                      }}
                    >
                      <Col>
                        <Row style={{ marginBottom: "6px" }}>
                          <UserOutlined
                            style={{
                              fontSize: "20px",
                              color: "#318ce7",
                              paddingRight: "10px",
                            }}
                          />
                          <p className="medium-font">{e.emp_position}</p>
                        </Row>
                        <Row style={{ marginBottom: "6px" }}>
                          <IdcardOutlined
                            style={{
                              fontSize: "20px",
                              color: "#318ce7",
                              paddingRight: "10px",
                            }}
                          />
                          <p className="small-font">{e.emp_id}</p>
                        </Row>
                        <Row style={{ marginBottom: "6px" }}>
                          <CalendarOutlined
                            style={{
                              fontSize: "20px",
                              color: "#318ce7",
                              paddingRight: "10px",
                            }}
                          />
                          <p className="small-font">
                            Hired {moment(e.emp_hired).format("MMMM DD, YYYY")}
                          </p>
                        </Row>
                        <Row style={{ marginBottom: "6px" }}>
                          <HeartOutlined
                            style={{
                              fontSize: "20px",
                              color: "#318ce7",
                              paddingRight: "10px",
                            }}
                          />
                          <p className="small-font">
                            {expYears(e.emp_bdate)} years old
                          </p>
                        </Row>
                      </Col>
                      <Col>
                        <Row style={{ marginBottom: "6px" }}>
                          <MailOutlined
                            style={{
                              fontSize: "20px",
                              color: "#318ce7",
                              paddingRight: "10px",
                            }}
                          />
                          <p className="small-font">{e.emp_email}</p>
                        </Row>
                        <Row style={{ marginBottom: "6px" }}>
                          <PhoneOutlined
                            style={{
                              fontSize: "20px",
                              color: "#318ce7",
                              paddingRight: "10px",
                            }}
                          />
                          <p className="small-font">{e.emp_phone}</p>
                        </Row>
                        <Row style={{ marginBottom: "6px" }}>
                          <EnvironmentOutlined
                            style={{
                              fontSize: "20px",
                              color: "#318ce7",
                              paddingRight: "10px",
                            }}
                          />
                          <p className="small-font">{e.emp_address}</p>
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
                </Row>
                <Row style={{ marginTop: "20px" }}>
                  <Card
                    size="large"
                    style={{ width: "100%" }}
                    bordered
                    hoverable
                  >
                    <Tabs
                      type="card"
                      style={{ background: "#fff" }}
                      defaultActiveKey="1"
                      size="large"
                      tabBarGutter={4}
                      items={items}
                    />
                  </Card>
                </Row>
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
