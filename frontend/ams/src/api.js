import axios from "axios";

const token = sessionStorage.getItem("token");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Token ${token}`,
};

const fetchData = (endpoint) => {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_API_URL}/api/${endpoint}`,
    headers: headers,
    withCredentials: true,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const fetchComponents = () => fetchData("components");
export const fetchModules = () => fetchData("modules");
export const fetchCategories = () => fetchData("categories");
export const fetchOptions = () => fetchData("options");
export const fetchBranches = () => fetchData("branches");
export const fetchSections = () => fetchData("sections");
export const fetchShifts = () => fetchData("shifts");
export const fetchSchedules = () => fetchData("schedules");
export const fetchEmployees = () => fetchData("employees");
export const fetchAttendances = () => fetchData("attendances");
export const fetchVacations = () => fetchData("vacations");
export const fetchExcuses = () => fetchData("excuses");
export const fetchItems = () => fetchData("items");
export const fetchWarehouseItems = () => fetchData("warehouseitems");
export const fetchVehicles = () => fetchData("vehicles");
export const fetchTransactions = () => fetchData("transactions");
