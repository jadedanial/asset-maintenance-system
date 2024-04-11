import React, { useState, useCallback } from "react";
import { UserOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";

const Employee = ({
  employees,
  attendances,
  schedules,
  vacations,
  excuses,
  sections,
  options,
  getSection,
  collapsed,
  theme,
}) => {
  const [searchedtext, setSearchedText] = useState("");

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
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: "ascend",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "150px",
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: "ascend",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: "100px",
      sorter: (a, b) => a.position.localeCompare(b.position),
      defaultSortOrder: "ascend",
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

  const loadAPILists = useCallback(() => {
    return employees.map((res) => ({
      id: res.emp_id,
      name: res.emp_name,
      position: res.emp_position,
      phone: res.emp_phone,
      email: res.emp_email,
    }));
  }, [employees]);

  const searchedText = (text) => {
    setSearchedText(text);
  };

  return (
    <>
      <SearchTableEvent
        employees={employees}
        attendances={attendances}
        schedules={schedules}
        vacations={vacations}
        excuses={excuses}
        sections={sections}
        options={options}
        loadAPILists={loadAPILists}
        tooltipIcon={<UserOutlined className="large-card-title" />}
        tooltipTitle={"Add New Employee"}
        inputPlaceHolder={"Search Employee"}
        compItemAdd={"AddUpdateEmployee"}
        compItemUpdate={"Profile"}
        tableColumns={columns}
        tableDataSource={loadAPILists()}
        searchedText={searchedText}
        getSection={getSection}
        collapsed={collapsed}
        theme={theme}
      />
    </>
  );
};

export default Employee;
