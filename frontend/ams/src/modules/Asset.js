import React, { useState, useCallback } from "react";
import { CarOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";

const Asset = ({ assets, options, collapsed, theme }) => {
  const [searchedtext, setSearchedText] = useState("");

  const columns = [
    {
      title: "Asset Code",
      dataIndex: "code",
      key: "code",
      filteredValue: [searchedtext],
      onFilter: (value, record) => {
        return (
          String(record.code).toLowerCase().includes(value.toLowerCase()) ||
          String(record.serial).toLowerCase().includes(value.toLowerCase()) ||
          String(record.model).toLowerCase().includes(value.toLowerCase()) ||
          String(record.plate).toLowerCase().includes(value.toLowerCase()) ||
          String(record.area).toLowerCase().includes(value.toLowerCase()) ||
          String(record.sector).toLowerCase().includes(value.toLowerCase())
        );
      },
      sorter: (a, b) => a.code.localeCompare(b.code),
      defaultSortOrder: "ascend",
    },
    {
      title: "Serial",
      dataIndex: "serial",
      key: "serial",
      sorter: (a, b) => a.serial.localeCompare(b.serial),
      defaultSortOrder: "ascend",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      sorter: (a, b) => a.model.localeCompare(b.model),
      defaultSortOrder: "ascend",
    },
    {
      title: "Plate",
      dataIndex: "plate",
      key: "plate",
      sorter: (a, b) => a.plate.localeCompare(b.plate),
      defaultSortOrder: "ascend",
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      sorter: (a, b) => a.area.localeCompare(b.area),
      defaultSortOrder: "ascend",
    },
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
      width: "300px",
      sorter: (a, b) => a.sector.localeCompare(b.sector),
      defaultSortOrder: "ascend",
    },
  ];

  const loadAPILists = useCallback(() => {
    return assets.map((res) => ({
      code: res.asset_code,
      serial: res.asset_serial,
      model: res.asset_model,
      plate: res.asset_plate,
      area: res.asset_area,
      sector: res.asset_sector,
    }));
  }, [assets]);

  const searchedText = (text) => {
    setSearchedText(text);
  };

  return (
    <>
      <SearchTableEvent
        assets={assets}
        options={options}
        loadAPILists={loadAPILists}
        tooltipIcon={<CarOutlined className="large-card-title" />}
        tooltipTitle={"Add New Asset"}
        inputPlaceHolder={"Search Asset"}
        compItemUpdate={"AssetDetail"}
        compItemAdd={"AddUpdateAsset"}
        tableColumns={columns}
        tableDataSource={loadAPILists()}
        searchedText={searchedText}
        collapsed={collapsed}
        theme={theme}
      />
    </>
  );
};

export default Asset;
