import React, { useState, useEffect } from "react";
import axios from "axios";
import { CarOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";

const Vehicle = () => {
  const [searchedtext, setSearchedText] = useState("");
  const [vehicles, setVehicles] = useState([]);

  const columns = [
    {
      title: "Vehicle Code",
      dataIndex: "code",
      key: "code",
      filteredValue: [searchedtext],
      onFilter: (value, record) => {
        return (
          String(record.code).toLowerCase().includes(value.toLowerCase()) ||
          String(record.type).toLowerCase().includes(value.toLowerCase()) ||
          String(record.model).toLowerCase().includes(value.toLowerCase()) ||
          String(record.serial).toLowerCase().includes(value.toLowerCase()) ||
          String(record.plate).toLowerCase().includes(value.toLowerCase()) ||
          String(record.area).toLowerCase().includes(value.toLowerCase()) ||
          String(record.sector).toLowerCase().includes(value.toLowerCase()) ||
          String(record.status).toLowerCase().includes(value.toLowerCase())
        );
      },
      width: "100px",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "100px",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: "80px",
    },
    {
      title: "Serial Number",
      dataIndex: "serial",
      key: "serial",
      width: "150px",
    },
    {
      title: "Plate Number",
      dataIndex: "plate",
      key: "plate",
      width: "100px",
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      width: "80px",
    },
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
      width: "100px",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "80px",
    },
  ];

  function loadAPILists() {
    const token = sessionStorage.getItem("token");
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/vehicles`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        setVehicles([]);
        response.data.map((res) =>
          setVehicles((vehicles) => [
            ...vehicles,
            {
              id: res.id,
              code: res.vehicle_code,
              type: res.vehicle_type,
              model: res.vehicle_model,
              serial: res.vehicle_serial,
              plate: res.vehicle_plate,
              area: res.vehicle_area,
              sector: res.vehicle_sector,
              status: res.vehicle_status,
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
        tooltipIcon={<CarOutlined />}
        tooltipTitle={"Add New Vehicle"}
        inputPlaceHolder={"Search Vehicle"}
        compItemAdd={"AddUpdateVehicle"}
        compItemUpdate={"UpdateVehicle"}
        tableColumns={columns}
        tableDataSource={vehicles}
        searchedText={searchedText}
      />
    </>
  );
};

export default Vehicle;
