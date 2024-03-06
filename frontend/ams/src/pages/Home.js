import React, { useState, useEffect, Suspense } from "react";
import { useQuery } from "react-query";
import { Button, Col, Row, Spin } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import axios from "axios";
import MainPage from "../components/MainPage";
import ResultEvent from "../components/ResultEvent";

const HomePage = () => {
  const [theme, setTheme] = useState("light");
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchDataForUser = async () => {
      try {
        const userResponse = await axios({
          method: "GET",
          url: `${process.env.REACT_APP_API_URL}/api/user`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          withCredentials: true,
        });
        const userData = userResponse.data;
        setUserId(userData.userid);
        setUserName(userData.username);
        setLoginFailed(false);
      } catch (err) {
        console.log(err.response.data.detail);
        setLoginFailed(true);
      }
    };
    fetchDataForUser();
  }, [token]);

  const fetchData = async (endpoint, token) => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/api/${endpoint}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  };

  const useComponentsData = (token) => {
    return useQuery("components", () => fetchData("components", token));
  };
  const useModulesData = (token) => {
    return useQuery("modules", () => fetchData("modules", token));
  };
  const useCategoriesData = (token) => {
    return useQuery("categories", () => fetchData("categories", token));
  };
  const useOptionsData = (token) => {
    return useQuery("options", () => fetchData("options", token));
  };
  const useBranchesData = (token) => {
    return useQuery("branches", () => fetchData("branches", token));
  };
  const useSectionsData = (token) => {
    return useQuery("sections", () => fetchData("sections", token));
  };
  const useShiftsData = (token) => {
    return useQuery("shifts", () => fetchData("shifts", token));
  };
  const useSchedulesData = (token) => {
    return useQuery("schedules", () => fetchData("schedules", token));
  };
  const useEmployeesData = (token) => {
    return useQuery("employees", () => fetchData("employees", token));
  };
  const useAttendancesData = (token) => {
    return useQuery("attendances", () => fetchData("attendances", token));
  };
  const useVacationsData = (token) => {
    return useQuery("vacations", () => fetchData("vacations", token));
  };
  const useExcusesData = (token) => {
    return useQuery("excuses", () => fetchData("excuses", token));
  };
  const useItemsData = (token) => {
    return useQuery("items", () => fetchData("items", token));
  };
  const useWarehouseitemsData = (token) => {
    return useQuery("warehouseitems", () => fetchData("warehouseitems", token));
  };
  const useVehiclesData = (token) => {
    return useQuery("vehicles", () => fetchData("vehicles", token));
  };
  const useTransactionsData = (token) => {
    return useQuery("transactions", () => fetchData("transactions", token));
  };

  const { data: componentsData, isError: componentsError } =
    useComponentsData(token);
  const { data: modulesData, isError: modulesError } = useModulesData(token);
  const { data: categoriesData, isError: categoriesError } =
    useCategoriesData(token);
  const { data: optionsData, isError: optionsError } = useOptionsData(token);
  const { data: branchesData, isError: branchesError } = useBranchesData(token);
  const { data: sectionsData, isError: sectionsError } = useSectionsData(token);
  const { data: shiftsData, isError: shiftsError } = useShiftsData(token);
  const { data: schedulesData, isError: schedulesError } =
    useSchedulesData(token);
  const { data: employeesData, isError: employeesError } =
    useEmployeesData(token);
  const { data: attendancesData, isError: attendancesError } =
    useAttendancesData(token);
  const { data: vacationsData, isError: vacationsError } =
    useVacationsData(token);
  const { data: excusesData, isError: excusesError } = useExcusesData(token);
  const { data: itemsData, isError: itemsError } = useItemsData(token);
  const { data: warehouseitemsData, isError: warehouseitemsError } =
    useWarehouseitemsData(token);
  const { data: vehiclesData, isError: vehiclesError } = useVehiclesData(token);
  const { data: transactionsData, isError: transactionsError } =
    useTransactionsData(token);

  if (
    componentsError ||
    modulesError ||
    categoriesError ||
    optionsError ||
    branchesError ||
    sectionsError ||
    shiftsError ||
    schedulesError ||
    employeesError ||
    attendancesError ||
    vacationsError ||
    excusesError ||
    itemsError ||
    warehouseitemsError ||
    vehiclesError ||
    transactionsError
  ) {
    console.log(
      "Error fetching data:",
      componentsError ||
        modulesError ||
        categoriesError ||
        optionsError ||
        branchesError ||
        sectionsError ||
        shiftsError ||
        schedulesError ||
        employeesError ||
        attendancesError ||
        vacationsError ||
        excusesError ||
        itemsError ||
        warehouseitemsError ||
        vehiclesError ||
        transactionsError
    );
  }

  if (
    !componentsData ||
    !modulesData ||
    !categoriesData ||
    !optionsData ||
    !branchesData ||
    !sectionsData ||
    !shiftsData ||
    !schedulesData ||
    !employeesData ||
    !attendancesData ||
    !vacationsData ||
    !excusesData ||
    !itemsData ||
    !warehouseitemsData ||
    !vehiclesData ||
    !transactionsData
  ) {
    console.log("Loading data...");
  }

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
              background: theme === "light" ? "#ecf3f9" : "#1c2755",
              height: "100vh",
            }}
          >
            <ResultEvent
              icon={<FrownOutlined style={{ color: "#ecf3f9" }} />}
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
        <Suspense fallback={<Spin size="large" />}>
          <MainPage
            userId={userId}
            userName={userName}
            components={componentsData}
            modules={modulesData}
            categories={categoriesData}
            options={optionsData}
            branches={branchesData}
            sections={sectionsData}
            shifts={shiftsData}
            schedules={schedulesData}
            employees={employeesData}
            attendances={attendancesData}
            vacations={vacationsData}
            excuses={excusesData}
            items={itemsData}
            warehouseitems={warehouseitemsData}
            vehicles={vehiclesData}
            transactions={transactionsData}
          />
        </Suspense>
      )}
    </>
  );
};

export default HomePage;
