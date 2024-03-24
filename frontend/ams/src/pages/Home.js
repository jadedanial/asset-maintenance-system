import React, { useState, useEffect } from "react";
import { useCustomQueryClient } from "../useQueryClient";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import MainPage from "../components/MainPage";

const HomePage = () => {
  let navigate = useNavigate();
  const queryClient = useCustomQueryClient();
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
        queryClient.clear();
        setLoginFailed(true);
        navigate("/login");
      }
    };
    fetchDataForUser();
  }, [token, navigate, queryClient]);

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

  const { data: componentsData } = useComponentsData(token);
  const { data: modulesData } = useModulesData(token);
  const { data: categoriesData } = useCategoriesData(token);
  const { data: optionsData } = useOptionsData(token);
  const { data: branchesData } = useBranchesData(token);
  const { data: sectionsData } = useSectionsData(token);
  const { data: shiftsData } = useShiftsData(token);
  const { data: schedulesData } = useSchedulesData(token);
  const { data: employeesData } = useEmployeesData(token);
  const { data: attendancesData } = useAttendancesData(token);
  const { data: vacationsData } = useVacationsData(token);
  const { data: excusesData } = useExcusesData(token);
  const { data: itemsData } = useItemsData(token);
  const { data: warehouseitemsData } = useWarehouseitemsData(token);
  const { data: vehiclesData } = useVehiclesData(token);
  const { data: transactionsData } = useTransactionsData(token);

  return (
    <>
      {!loginFailed ? (
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
      ) : (
        <></>
      )}
    </>
  );
};

export default HomePage;
