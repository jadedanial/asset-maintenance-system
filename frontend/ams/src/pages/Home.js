import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Col, Row } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import MainPage from "../components/MainPage";
import ResultEvent from "../components/ResultEvent";

const HomePage = () => {
  const [theme, setTheme] = useState("light");
  const [empid, setEmpID] = useState(0);
  const [username, setUsername] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/user`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        setLoginFailed(false);
        setEmpID(response.data.id);
        setUsername(response.data.username);
      })
      .catch((err) => {
        console.log(err.response.data.detail);
        setLoginFailed(true);
      });
  }, []);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const modeCookie = cookies.find((row) => row.startsWith("mode="));
    const mode = modeCookie?.split("=")[1];
    if (mode) {
      setTheme(mode);
    } else {
      setTheme("light");
    }
  }, []);

  return (
    <>
      {loginFailed ? (
        <>
          <div
            className={theme}
            style={{
              paddingTop: "50px",
              background: theme === "light" ? "#cdf5fd" : "#1c2755",
              height: "100vh",
            }}
          >
            <ResultEvent
              icon={<FrownOutlined style={{ color: "#cdf5fd" }} />}
              status="403"
              title="Unauthorized User!"
              subTitle="Sorry, you are not authorized to access this page. Please login or register."
              extra={
                <Row className="space-between-row" style={{ width: "40%" }}>
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
        </>
      ) : (
        <>
          <MainPage empid={empid} username={username} />
        </>
      )}
    </>
  );
};

export default HomePage;
