import React, { useState, useEffect } from "react";
import { useCustomQueryClient } from "../useQueryClient";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import MainPage from "../components/MainPage";
import Spinner from "../components/Spinner";

const HomePage = () => {
  let navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const queryClient = useCustomQueryClient();
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");

  const fetchData = (endpoint, token) => {
    return axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        setLoading(false);
        return response.data;
      })
      .catch((error) => {
        setLoading(false);
        throw new Error(error);
      });
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
  const useAssetsData = (token) => {
    return useQuery("assets", () => fetchData("assets", token));
  };
  const useTransactionsData = (token) => {
    return useQuery("transactions", () => fetchData("transactions", token));
  };
  const useWorkordersData = (token) => {
    return useQuery("workorders", () => fetchData("workorders", token));
  };
  const useOperationsData = (token) => {
    return useQuery("operations", () => fetchData("operations", token));
  };
  const useOperationTypesData = (token) => {
    return useQuery("operationtypes", () => fetchData("operationtypes", token));
  };
  const useWorkorderoperationsData = (token) => {
    return useQuery("workorderoperations", () =>
      fetchData("workorderoperations", token)
    );
  };
  const useOperationTechniciansData = (token) => {
    return useQuery("operationtechnicians", () =>
      fetchData("operationtechnicians", token)
    );
  };
  const useOperationItemsData = (token) => {
    return useQuery("operationitems", () => fetchData("operationitems", token));
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
  const { data: assetsData } = useAssetsData(token);
  const { data: transactionsData } = useTransactionsData(token);
  const { data: workordersData } = useWorkordersData(token);
  const { data: operationsData } = useOperationsData(token);
  const { data: operationTypesData } = useOperationTypesData(token);
  const { data: workorderOperationsData } = useWorkorderoperationsData(token);
  const { data: operationTechniciansData } = useOperationTechniciansData(token);
  const { data: operationItemsData } = useOperationItemsData(token);

  useEffect(() => {
    const fetchDataForUser = () => {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/api/user`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        withCredentials: true,
      })
        .then((userResponse) => {
          const userData = userResponse.data;
          setUserId(userData.userid);
          setUserName(userData.username);
          setLoginFailed(false);
        })
        .catch(() => {
          queryClient.clear();
          setLoginFailed(true);
          navigate("/login");
        });
    };
    fetchDataForUser();
  }, [token, navigate, queryClient]);

  useEffect(() => {
    const mode = document.cookie
      .split("; ")
      .find((row) => row.startsWith("mode="))
      ?.split("=")[1];
    setTheme(mode || "light");
  }, []);

  return (
    <>
      {!loginFailed ? (
        loading ? (
          <Spinner height={"100vh"} theme={theme} />
        ) : (
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
            assets={assetsData}
            transactions={transactionsData}
            workorders={workordersData}
            operations={operationsData}
            operationtypes={operationTypesData}
            workorderoperations={workorderOperationsData}
            operationtechnicians={operationTechniciansData}
            operationitems={operationItemsData}
          />
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default HomePage;
