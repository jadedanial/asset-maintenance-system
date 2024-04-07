import React, { useState, useCallback } from "react";
import { FieldTimeOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";
import moment from "moment";

const Shift = ({ shifts, collapsed, theme }) => {
  const timeFormat = "HH:mm:ss";
  const [searchedtext, setSearchedText] = useState("");

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
    return shifts.map((res) => ({
      id: res.id,
      name: res.shift_name,
      from: res.shift_from,
      to: res.shift_to,
      total: shiftDuration(res.shift_from, res.shift_to),
    }));
  }, [shifts]);

  const shiftDuration = (from, to) => {
    var end = to;
    if (moment(from, "HH:mm:ss") > moment(to, "HH:mm:ss")) {
      end = moment(to, "HH:mm:ss").add(24, "hours");
    }
    return moment
      .duration(moment(end, timeFormat).diff(moment(from, timeFormat)))
      .asHours()
      .toFixed(2);
  };

  const searchedText = (text) => {
    setSearchedText(text);
  };

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
        tableDataSource={loadAPILists()}
        searchedText={searchedText}
        collapsed={collapsed}
        theme={theme}
      />
    </>
  );
};

export default Shift;
