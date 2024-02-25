import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FieldTimeOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";
import moment from "moment";

const Shift = (props) => {
  const timeFormat = "HH:mm:ss";
  const [searchedtext, setSearchedText] = useState("");
  const [shifts, setShifts] = useState([]);

  const columns = [
    {
      title: "Shift Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchedtext],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.from).toLowerCase().includes(value.toLowerCase()) ||
          String(record.to).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
    },
    {
      title: "Total Hours",
      dataIndex: "total",
      key: "total",
    },
  ];

  const loadAPILists = useCallback(() => {
    const token = sessionStorage.getItem("token");
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/shifts`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        setShifts([]);
        response.data.map((res) =>
          setShifts((shifts) => [
            ...shifts,
            {
              id: res.id,
              name: res.shift_name,
              from: res.shift_from,
              to: res.shift_to,
              total: shiftDuration(res.shift_from, res.shift_to),
            },
          ])
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function searchedText(text) {
    setSearchedText(text);
  }

  function shiftDuration(from, to) {
    var end = to;
    if (moment(from, 'HH:mm"ss') > moment(to, "HH:mm:ss")) {
      end = moment(to, "HH:mm:ss").add(24, "hours");
    }
    return moment
      .duration(moment(end, timeFormat).diff(moment(from, timeFormat)))
      .asHours()
      .toFixed(2);
  }

  useEffect(() => {
    loadAPILists();
  }, [loadAPILists]);

  return (
    <>
      <SearchTableEvent
        loadAPILists={loadAPILists}
        tooltipIcon={<FieldTimeOutlined />}
        tooltipTitle={"Add New Shift"}
        inputPlaceHolder={"Search Shift"}
        compItemAdd={"AddUpdateShift"}
        compItemUpdate={"UpdateShift"}
        tableColumns={columns}
        tableDataSource={shifts}
        searchedText={searchedText}
        collapsed={props.collapsed}
        theme={props.theme}
      />
    </>
  );
};

export default Shift;
