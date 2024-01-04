import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShopOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";

const Vehicle = () => {
  const [searchedtext, setSearchedText] = useState("");
  const [warehouses, setWarehouses] = useState([]);

  const columns = [
    {
      title: "Warehouse Code",
      dataIndex: "code",
      key: "code",
      filteredValue: [searchedtext],
      onFilter: (value, record) => {
        return (
          String(record.code).toLowerCase().includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.type).toLowerCase().includes(value.toLowerCase()) ||
          String(record.branch).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
  ];

  function loadAPILists() {
    try {
      axios({
        method: "GET",
        url: "http://localhost:8000/api/warehouses",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((response) => {
        setWarehouses([]);
        response.data.map((res) =>
          setWarehouses((warehouses) => [
            ...warehouses,
            {
              id: res.id,
              code: res.warehouse_code,
              name: res.warehouse_name,
              type: res.warehouse_type,
              branch: res.warehouse_branch,
            },
          ])
        );
      });
    } catch (err) {
      console.log(err);
    }
  }

  function searchedText(text) {
    setSearchedText(text);
  }

  useEffect(() => {
    loadAPILists();
  }, []);

  return (
    <>
      <SearchTableEvent
        loadAPILists={loadAPILists}
        tooltipIcon={<ShopOutlined />}
        tooltipTitle={"Add New Warehouse"}
        inputPlaceHolder={"Search Warehouse"}
        compItemAdd={"AddUpdateWarehouse"}
        compItemUpdate={"UpdateWarehouse"}
        tableColumns={columns}
        tableDataSource={warehouses}
        searchedText={searchedText}
      ></SearchTableEvent>
    </>
  );
};

export default Vehicle;
