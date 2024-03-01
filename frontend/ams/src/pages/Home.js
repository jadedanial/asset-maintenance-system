import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Button, Col, Row } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import axios from "axios";
import MainPage from "../components/MainPage";
import ResultEvent from "../components/ResultEvent";
import {
  fetchComponents,
  fetchModules,
  fetchCategories,
  fetchOptions,
  fetchBranches,
  fetchSections,
  fetchShifts,
  fetchSchedules,
  fetchEmployees,
  fetchAttendances,
  fetchVacations,
  fetchExcuses,
  fetchItems,
  fetchWarehouseItems,
  fetchVehicles,
  fetchTransactions,
} from "../api";

const HomePage = ({ client }) => {
  const [theme, setTheme] = useState("light");
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const { data: components } = useQuery("components", fetchComponents);
  const { data: modules } = useQuery("modules", fetchModules);
  const { data: categories } = useQuery("categories", fetchCategories);
  const { data: options } = useQuery("options", fetchOptions);
  const { data: branches } = useQuery("branches", fetchBranches);
  const { data: sections } = useQuery("sections", fetchSections);
  const { data: shifts } = useQuery("shifts", fetchShifts);
  const { data: schedules } = useQuery("schedules", fetchSchedules);
  const { data: employees } = useQuery("employees", fetchEmployees);
  const { data: attendances } = useQuery("attendances", fetchAttendances);
  const { data: vacations } = useQuery("vacations", fetchVacations);
  const { data: excuses } = useQuery("excuses", fetchExcuses);
  const { data: items } = useQuery("items", fetchItems);
  const { data: warehouseitems } = useQuery(
    "warehouseitems",
    fetchWarehouseItems
  );
  const { data: vehicles } = useQuery("vehicles", fetchVehicles);
  const { data: transactions } = useQuery("transactions", fetchTransactions);

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
        setUserId(response.data.userid);
        setUserName(response.data.username);
      })
      .catch((err) => {
        console.log(err.response.data.detail);
        setLoginFailed(true);
      });
  }, []);

  useEffect(() => {
    const mode = document.cookie
      .split("; ")
      .find((row) => row.startsWith("mode="))
      ?.split("=")[1];
    setTheme(mode || "light");
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
                <Row className="space-between-row" style={{ width: "30%" }}>
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
          <MainPage
            client={client}
            userId={userId}
            userName={userName}
            components={components}
            modules={modules}
            categories={categories}
            options={options}
            branches={branches}
            sections={sections}
            shifts={shifts}
            schedules={schedules}
            employees={employees}
            attendances={attendances}
            vacations={vacations}
            excuses={excuses}
            items={items}
            warehouseitems={warehouseitems}
            vehicles={vehicles}
            transactions={transactions}
          />
        </>
      )}
    </>
  );
};

export default HomePage;
