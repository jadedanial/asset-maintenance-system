import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import SearchListEvent from "../components/SearchListEvent";
import moment from "moment";

const Schedule = () => {
  const timeFormat = "HH:mm:ss";
  const [searchedtext, setSearchedText] = useState("");
  const [schedules, setSchedules] = useState([]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchedtext],
      onFilter: (value, record) => {
        return String(record.name).toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Sunday",
      dataIndex: "sunday",
      key: "sunday",
    },
    {
      title: "Monday",
      dataIndex: "monday",
      key: "monday",
    },
    {
      title: "Tuesday",
      dataIndex: "tuesday",
      key: "tuesday",
    },
    {
      title: "Wednesday",
      dataIndex: "wednesday",
      key: "wednesday",
    },
    {
      title: "Thursday",
      dataIndex: "thursday",
      key: "thursday",
    },
    {
      title: "Friday",
      dataIndex: "friday",
      key: "friday",
    },
    {
      title: "Saturday",
      dataIndex: "saturday",
      key: "saturday",
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
        url: "http://localhost:8000/api/schedules",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((response) => {
        setSchedules([]);
        response.data.map((res) =>
          setSchedules((schedules) => [
            ...schedules,
            {
              id: res.id,
              name: res.sched_name,
              sunday: schedList(res.sched_sun),
              monday: schedList(res.sched_mon),
              tuesday: schedList(res.sched_tue),
              wednesday: schedList(res.sched_wed),
              thursday: schedList(res.sched_thu),
              friday: schedList(res.sched_fri),
              saturday: schedList(res.sched_sat),
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

  function schedList(sched) {
    return (
      <>
        <Card size="small" style={{ border: "none", background: "none" }}>
          <p className="small-font" style={{ textAlign: "center" }}>
            {moment
              .duration(
                moment(sched.split(" To ")[1], timeFormat).diff(
                  moment(sched.split(" To ")[0], timeFormat)
                )
              )
              .asHours() === 0
              ? "Dayoff"
              : sched.split(" To ")[0] + "\n" + sched.split(" To ")[1]}
          </p>
        </Card>
      </>
    );
  }

  return (
    <>
      <SearchListEvent
        loadAPILists={loadAPILists}
        tooltipIcon={<CalendarOutlined />}
        tooltipTitle={"Add New Schedule"}
        inputPlaceHolder={"Search Schedule"}
        compItemAdd={"AddUpdateSchedule"}
        compItemUpdate={"UpdateSchedule"}
        tableColumns={columns}
        tableDataSource={schedules}
        searchedText={searchedText}
      ></SearchListEvent>
    </>
  );
};

export default Schedule;
