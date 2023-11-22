import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserAddOutlined } from "@ant-design/icons";
import SearchListEvent from "../components/SearchListEvent";

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
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
    },
  ];

  useEffect(() => {
    (async () => {
      await loadAPILists();
    })();
  }, []);

  async function loadAPILists() {
    try {
      await axios({
        method: "GET",
        url: "http://localhost:8000/api/employees",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((response) => {
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
      });
    } catch (err) {
      console.log(err);
    }
  }

  function searchedText(text) {
    setSearchedText(text);
  }

  return (
    <>
      <SearchListEvent
        loadAPILists={loadAPILists}
        tooltipIcon={<UserAddOutlined />}
        tooltipTitle={"Add New Employee"}
        inputPlaceHolder={"Search Employee"}
        compItemAdd={"AddUpdateEmployee"}
        compItemUpdate={"Profile"}
        tableColumns={columns}
        tableDataSource={employees}
        searchedText={searchedText}
      ></SearchListEvent>
    </>
  );
};

export default Employee;
