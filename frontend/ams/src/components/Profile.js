import React, { useState } from "react";
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
import Attendance from "./Attendance";
import ShiftSchedule from "./ShiftSchedule";
import Vacation from "./Vacation";
import Excuse from "./Excuse";
import moment from "moment";

const { Title } = Typography;

const Profile = ({
  employees,
  attendances,
  schedules,
  vacations,
  excuses,
  sections,
  options,
  empid,
  getSection,
  onCloseDrawer,
  theme,
}) => {
  const [update, setUpdate] = useState(false);

  const items = [
    {
      label: <>ATTENDANCE</>,
      key: "1",
      children: (
        <>
          <Attendance
            attendances={attendances}
            employees={employees}
            schedules={schedules}
            vacations={vacations}
            empid={empid}
            theme={theme}
          />
        </>
      ),
    },
    {
      label: <>SCHEDULE</>,
      key: "2",
      children: (
        <>
          <ShiftSchedule
            schedules={schedules}
            employees={employees}
            empid={empid}
            theme={theme}
          />
        </>
      ),
    },
    {
      label: <>VACATION</>,
      key: "3",
      children: (
        <>
          <Vacation
            vacations={vacations}
            options={options}
            empid={empid}
            theme={theme}
          />
        </>
      ),
    },
    {
      label: <>EXCUSE</>,
      key: "4",
      children: (
        <>
          <Excuse
            excuses={excuses}
            attendances={attendances}
            empid={empid}
            theme={theme}
          />
        </>
      ),
    },
  ];

  const expYears = (yearHired) => {
    return moment().diff(moment(yearHired, "YYYY-MM-DD"), "years");
  };

  const star = (starNum) => {
    const av = parseInt(starNum) / 10;
    return av * 5;
  };

  const getInitials = (name) => {
    var parts = name.split(" ");
    var initials = "";
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].length > 0 && parts[i] !== "") {
        initials += parts[i][0];
      }
    }
    return initials.toUpperCase();
  };

  return (
    <>
      {employees &&
        employees.map((e) =>
          e.emp_id === empid ? (
            <>
              {update ? (
                <>
                  <AddUpdateEmployee
                    sections={sections}
                    options={options}
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
                    section={e.emp_section}
                    getSection={getSection}
                    onCloseDrawer={onCloseDrawer}
                  />
                </>
              ) : (
                <>
                  <Card
                    size="large"
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
                    extra={
                      <div className="space-between-row">
                        <Button
                          size="large"
                          type="default"
                          style={{
                            marginRight: "10px",
                          }}
                          onClick={onCloseDrawer}
                          block
                        >
                          CANCEL
                        </Button>
                        <Button
                          size="large"
                          type="primary"
                          onClick={() => setUpdate(true)}
                        >
                          UPDATE
                        </Button>
                      </div>
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
                          <p className="medium-font text">{e.emp_position}</p>
                        </Row>
                        <Row style={{ marginTop: "12px" }}>
                          <IdcardOutlined className="detail-icon-label" />
                          <p className="small-font text">{e.emp_id}</p>
                        </Row>
                        <Row style={{ marginTop: "12px" }}>
                          <CalendarOutlined className="detail-icon-label" />
                          <p className="small-font text">
                            Hired on{" "}
                            {moment(e.emp_hired).format("MMMM DD, YYYY")}
                          </p>
                        </Row>
                        <Row style={{ marginTop: "12px" }}>
                          <HeartOutlined className="detail-icon-label" />
                          <p className="small-font text">
                            {expYears(e.emp_bdate)} Years old
                          </p>
                        </Row>
                      </Col>
                      <Col>
                        <Row style={{ marginTop: "12px" }}>
                          <MailOutlined className="detail-icon-label" />
                          <p className="small-font text">{e.emp_email}</p>
                        </Row>
                        <Row style={{ marginTop: "12px" }}>
                          <PhoneOutlined className="detail-icon-label" />
                          <p className="small-font text">{e.emp_phone}</p>
                        </Row>
                        <Row style={{ marginTop: "12px" }}>
                          <EnvironmentOutlined className="detail-icon-label" />
                          <p className="small-font text">{e.emp_address}</p>
                        </Row>
                        <Row style={{ marginTop: "12px" }}>
                          <ApartmentOutlined className="detail-icon-label" />
                          <p className="small-font text">{e.emp_section}</p>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <Statistic
                            title={
                              <Title style={{ margin: 0 }}>
                                <p
                                  className="small-font text"
                                  style={{ margin: 0 }}
                                >
                                  Years of Experience
                                </p>
                              </Title>
                            }
                            value={expYears(e.emp_hired)}
                            prefix={<TrophyOutlined />}
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
                          style={{ textAlign: "right" }}
                        >
                          {getInitials(e.emp_name)}
                        </p>
                      </Col>
                    </Row>
                  </Card>
                  <Card size="large" style={{ borderTop: "0" }}>
                    <Tabs
                      type="card"
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
