import React, { useState, useEffect } from "react";
import axios from "axios";
import { CalendarOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";

const Schedule = (props) => {
  const [searchedtext, setSearchedText] = useState("");
  const [schedules, setSchedules] = useState([]);

  const columns = [
    {
      title: "Name",
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
    },
    {
      title: "Sunday",
      dataIndex: "sun",
      key: "sun",
      width: "200px",
    },
    {
      title: "Monday",
      dataIndex: "mon",
      key: "mon",
      width: "200px",
    },
    {
      title: "Tuesday",
      dataIndex: "tue",
      key: "tue",
      width: "200px",
    },
    {
      title: "Wednesday",
      dataIndex: "wed",
      key: "wed",
      width: "200px",
    },
    {
      title: "Thursday",
      dataIndex: "thu",
      key: "thu",
      width: "200px",
    },
    {
      title: "Friday",
      dataIndex: "fri",
      key: "fri",
      width: "200px",
    },
    {
      title: "Saturday",
      dataIndex: "sat",
      key: "sat",
      width: "200px",
    },
  ];

  function loadAPILists() {
    axios({
      method: "GET",
      url: "http://localhost:8000/api/schedules",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        setSchedules([]);
        response.data.map((res) =>
          setSchedules((schedules) => [
            ...schedules,
            {
              id: res.id,
              name: res.sched_name,
              sun: res.sched_sun,
              mon: res.sched_mon,
              tue: res.sched_tue,
              wed: res.sched_wed,
              thu: res.sched_thu,
              fri: res.sched_fri,
              sat: res.sched_sat,
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
        tooltipIcon={<CalendarOutlined />}
        tooltipTitle={"Add New Schedule"}
        inputPlaceHolder={"Search Schedule"}
        compItemAdd={"AddUpdateSchedule"}
        compItemUpdate={"UpdateSchedule"}
        tableColumns={columns}
        tableDataSource={schedules}
        searchedText={searchedText}
        collapsed={props.collapsed}
        theme={props.theme}
      ></SearchTableEvent>
    </>
  );
};

export default Schedule;
