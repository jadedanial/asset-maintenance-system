import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserAddOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";

const Employee = () => {
  const [searchedtext, setSearchedText] = useState("");
  const [employees, setEmployees] = useState([]);

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "id",
      key: "id",
      filteredValue: [searchedtext],
      onFilter: (value, record) => {
        return (
          String(record.id).toLowerCase().includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.position).toLowerCase().includes(value.toLowerCase()) ||
          String(record.phone).toLowerCase().includes(value.toLowerCase()) ||
          String(record.email).toLowerCase().includes(value.toLowerCase())
        );
      },
      width: "80px",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "150px",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: "100px",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: "100px",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "150px",
    },
  ];

  function loadAPILists() {
    axios({
      method: "GET",
      url: "http://localhost:8000/api/employees",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        setEmployees([]);
        response.data.map((res) =>
          setEmployees((employees) => [
            ...employees,
            {
              id: res.emp_id,
              name: res.emp_name,
              position: res.emp_position,
              phone: res.emp_phone,
              email: res.emp_email,
            },
          ])
        );
      })
      .catch((err) => {
        console.log(err);
      });
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
        tooltipIcon={<UserAddOutlined />}
        tooltipTitle={"Add New Employee"}
        inputPlaceHolder={"Search Employee"}
        compItemAdd={"AddUpdateEmployee"}
        compItemUpdate={"Profile"}
        tableColumns={columns}
        tableDataSource={employees}
        searchedText={searchedText}
      ></SearchTableEvent>
    </>
  );
};

export default Employee;
