import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";

const Item = (props) => {
  const [searchedtext, setSearchedText] = useState("");
  const [item, setItem] = useState([]);
  const [warehouseItem, setWarehouseItem] = useState([]);
  const [listData, setListData] = useState([]);

  const columns = [
    {
      title: "Item Code",
      dataIndex: "code",
      key: "code",
      filteredValue: [searchedtext],
      onFilter: (value, record) => {
        return (
          String(record.code).toLowerCase().includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "40%",
    },
    {
      title: "On Hand",
      dataIndex: "onhand",
      key: "onhand",
    },
    {
      title: "Unit Cost",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Inventory Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  function loadData(url, setData) {
    axios({
      method: "GET",
      url: `http://localhost:8000/api/${url}`,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function loadAPILists() {
    loadData("items", setItem);
    loadData("warehouseitems", setWarehouseItem);
  }

  function searchedText(text) {
    setSearchedText(text);
  }

  useEffect(() => {
    if (item.length && warehouseItem.length) {
      var d = [];
      warehouseItem.forEach((wi) => {
        if (wi.warehouse_code === props.sectionCode) {
          item.forEach((i) => {
            if (i.item_code === wi.item_code) {
              d.push({
                code: wi.item_code,
                name: i.item_name,
                onhand: wi.item_onhand,
                cost: i.item_cost,
                value: (i.item_cost * wi.item_onhand).toFixed(2),
              });
            }
          });
        }
      });
      setListData(d);
    }
  }, [item, warehouseItem]);

  useEffect(() => {
    loadAPILists();
  }, []);

  return (
    <>
      <SearchTableEvent
        loadAPILists={loadAPILists}
        tooltipIcon={<ShoppingOutlined />}
        tooltipTitle={"Add New Item"}
        inputPlaceHolder={"Search Item"}
        compItemUpdate={"ItemDetail"}
        compItemAdd={"AddUpdateItem"}
        tableColumns={columns}
        tableDataSource={listData}
        searchedText={searchedText}
        sectionCode={props.sectionCode}
        sectionCategory={props.sectionCategory}
        theme={props.theme}
        collapsed={props.collapsed}
      />
    </>
  );
};

export default Item;
