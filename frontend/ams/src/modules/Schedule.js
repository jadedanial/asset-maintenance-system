import React, { useState, useCallback } from "react";
import { CalendarOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";

const Schedule = ({ schedules, shifts, collapsed, theme }) => {
  const [searchedtext, setSearchedText] = useState("");

  const columns = [
    {
      title: "Schedule Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchedtext],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.sun).toLowerCase().includes(value.toLowerCase()) ||
          String(record.mon).toLowerCase().includes(value.toLowerCase()) ||
          String(record.tue).toLowerCase().includes(value.toLowerCase()) ||
          String(record.wed).toLowerCase().includes(value.toLowerCase()) ||
          String(record.thu).toLowerCase().includes(value.toLowerCase()) ||
          String(record.fri).toLowerCase().includes(value.toLowerCase()) ||
          String(record.sat).toLowerCase().includes(value.toLowerCase())
        );
      },
      width: "200px",
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: "ascend",
    },
    {
      title: "Sunday",
      dataIndex: "sun",
      key: "sun",
      width: "200px",
      sorter: (a, b) => a.sun.localeCompare(b.sun),
      defaultSortOrder: "ascend",
    },
    {
      title: "Monday",
      dataIndex: "mon",
      key: "mon",
      width: "200px",
      sorter: (a, b) => a.mon.localeCompare(b.mon),
      defaultSortOrder: "ascend",
    },
    {
      title: "Tuesday",
      dataIndex: "tue",
      key: "tue",
      width: "200px",
      sorter: (a, b) => a.tue.localeCompare(b.tue),
      defaultSortOrder: "ascend",
    },
    {
      title: "Wednesday",
      dataIndex: "wed",
      key: "wed",
      width: "200px",
      sorter: (a, b) => a.wed.localeCompare(b.wed),
      defaultSortOrder: "ascend",
    },
    {
      title: "Thursday",
      dataIndex: "thu",
      key: "thu",
      width: "200px",
      sorter: (a, b) => a.thu.localeCompare(b.thu),
      defaultSortOrder: "ascend",
    },
    {
      title: "Friday",
      dataIndex: "fri",
      key: "fri",
      width: "200px",
      sorter: (a, b) => a.fri.localeCompare(b.fri),
      defaultSortOrder: "ascend",
    },
    {
      title: "Saturday",
      dataIndex: "sat",
      key: "sat",
      width: "200px",
      sorter: (a, b) => a.sat.localeCompare(b.sat),
      defaultSortOrder: "ascend",
    },
  ];

  const loadAPILists = useCallback(() => {
    return schedules.map((res) => ({
      name: res.sched_name,
      sun: res.sched_sun,
      mon: res.sched_mon,
      tue: res.sched_tue,
      wed: res.sched_wed,
      thu: res.sched_thu,
      fri: res.sched_fri,
      sat: res.sched_sat,
    }));
  }, [schedules]);

  const searchedText = (text) => {
    setSearchedText(text);
  };

  return (
    <>
      <SearchTableEvent
        shifts={shifts}
        loadAPILists={loadAPILists}
        tooltipIcon={<CalendarOutlined className="large-card-title" />}
        tooltipTitle={"Add New Schedule"}
        inputPlaceHolder={"Search Schedule"}
        compItemAdd={"AddUpdateSchedule"}
        compItemUpdate={"UpdateSchedule"}
        tableColumns={columns}
        tableDataSource={loadAPILists()}
        searchedText={searchedText}
        collapsed={collapsed}
        theme={theme}
      />
    </>
  );
};

export default Schedule;
