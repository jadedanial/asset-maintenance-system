import React, { useState, useCallback } from "react";
import { FileAddOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";

const Workorder = ({
  userId,
  employees,
  assets,
  items,
  options,
  workorders,
  operations,
  operationtypes,
  workorderoperations,
  operationtechnicians,
  operationitems,
  sectionCode,
  collapsed,
  theme,
}) => {
  const [searchedtext, setSearchedText] = useState("");

  const columns = [
    {
      title: "Workorder Code",
      dataIndex: "code",
      key: "code",
      filteredValue: [searchedtext],
      onFilter: (value, record) => {
        return (
          String(record.code).toLowerCase().includes(value.toLowerCase()) ||
          String(record.asset).toLowerCase().includes(value.toLowerCase()) ||
          String(record.date).toLowerCase().includes(value.toLowerCase()) ||
          String(record.type).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase()) ||
          String(record.workshop).toLowerCase().includes(value.toLowerCase())
        );
      },
      width: "200px",
      sorter: (a, b) => a.code.localeCompare(b.code),
      defaultSortOrder: "ascend",
    },
    {
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
      width: "100px",
      sorter: (a, b) => a.asset.localeCompare(b.asset),
      defaultSortOrder: "ascend",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "100px",
      sorter: (a, b) => a.date.localeCompare(b.date),
      defaultSortOrder: "ascend",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "100px",
      sorter: (a, b) => a.type.localeCompare(b.type),
      defaultSortOrder: "ascend",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "100px",
      sorter: (a, b) => a.status.localeCompare(b.status),
      defaultSortOrder: "ascend",
    },
    {
      title: "Workshop",
      dataIndex: "workshop",
      key: "workshop",
      width: "100px",
      sorter: (a, b) => a.workshop.localeCompare(b.workshop),
      defaultSortOrder: "ascend",
    },
  ];

  const loadAPILists = useCallback(() => {
    return workorders.map((res) => ({
      id: res.id,
      code: res.work_code,
      asset: res.asset_code,
      date: res.work_date,
      type: res.work_type,
      status: res.work_status,
      workshop: res.workshop_code,
    }));
  }, [workorders]);

  const searchedText = (text) => {
    setSearchedText(text);
  };

  return (
    <>
      <SearchTableEvent
        userId={userId}
        employees={employees}
        items={items}
        assets={assets}
        options={options}
        workorders={workorders}
        operations={operations}
        operationtypes={operationtypes}
        workorderoperations={workorderoperations}
        operationtechnicians={operationtechnicians}
        operationitems={operationitems}
        loadAPILists={loadAPILists}
        tooltipIcon={<FileAddOutlined className="large-card-title" />}
        tooltipTitle={"Add New Workorder"}
        inputPlaceHolder={"Search Workorder"}
        compItemUpdate={"WorkorderDetail"}
        compItemAdd={"AddUpdateWorkorder"}
        tableColumns={columns}
        tableDataSource={loadAPILists()}
        searchedText={searchedText}
        sectionCode={sectionCode}
        collapsed={collapsed}
        theme={theme}
      />
    </>
  );
};

export default Workorder;
