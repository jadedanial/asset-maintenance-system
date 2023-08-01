import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "antd";
import {
  LoginOutlined,
  FrownOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import MainPage from "../components/MainPage";
import ResultEvent from "../components/ResultEvent";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [empid, setEmpID] = useState(0);
  const [showunauthorized, setShowunauthorized] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        const content = await response.data;
        setShowunauthorized(false);
        setUsername(content.username);
        setEmpID(content.empID);
      } catch (err) {
        console.log(err.response.data[0]);
        setShowunauthorized(true);
      }
    })();
  });

  return (
    <>
      {showunauthorized ? (
        <>
          <ResultEvent
            icon={<FrownOutlined style={{ color: "#318ce7" }} />}
            status="403"
            title="Unauthorized User!"
            subTitle="Sorry, you are not authorized to access this page. Please login or register."
            extra={[
              <Button
                size="large"
                type="primary"
                icon={<LoginOutlined />}
                href="/login"
              >
                LOGIN
              </Button>,
              <Button
                size="large"
                type="primary"
                icon={<UserAddOutlined />}
                href="/register"
              >
                REGISTER
              </Button>,
            ]}
          />
        </>
      ) : (
        <>
          <MainPage username={username} empid={empid} />
        </>
      )}
    </>
  );
};

export default HomePage;
