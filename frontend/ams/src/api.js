import axios from "axios";

export const fetchItems = () => {
  const token = sessionStorage.getItem("token");
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_API_URL}/api/items`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    withCredentials: true,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const fetchWarehouseItems = () => {
  const token = sessionStorage.getItem("token");
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_API_URL}/api/warehouseitems`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    withCredentials: true,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error);
    });
};
