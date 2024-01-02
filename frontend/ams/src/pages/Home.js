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
  const [empid, setEmpID] = useState(0);
  const [username, setUsername] = useState("");
  const [showunauthorized, setShowunauthorized] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await axios({
          method: "GET",
          url: "http://localhost:8000/api/users",
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }).then((response) => {
          setShowunauthorized(false);
          setEmpID(response.data.empID);
          setUsername(response.data.username);
        });
      } catch (err) {
        console.log(err.response.data.detail);
        setShowunauthorized(true);
      }
    })();
  }, []);

  return (
    <>
      {showunauthorized ? (
        <>
          <div style={{ paddingTop: "80px" }}>
            <ResultEvent
              icon={<FrownOutlined style={{ color: "#318ce7" }} />}
              status="403"
              title="Unauthorized User!"
              subTitle="Sorry, you are not authorized to access this page. Please login or register."
              extra={[
                <Button
                  icon={<LoginOutlined />}
                  size="large"
                  type="primary"
                  href="/login"
                  style={{
                    marginRight: "10px",
                  }}
                >
                  LOGIN
                </Button>,
                <Button
                  icon={<UserAddOutlined />}
                  size="large"
                  type="primary"
                  href="/register"
                >
                  REGISTER
                </Button>,
              ]}
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
