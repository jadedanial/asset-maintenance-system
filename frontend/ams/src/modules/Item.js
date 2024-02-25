import React, { useState, useEffect, useCallback } from "react";
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

  const loadData = useCallback((url, setData) => {
    const token = sessionStorage.getItem("token");
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/${url}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const loadAPILists = useCallback(() => {
    loadData("items", setItem);
    loadData("warehouseitems", setWarehouseItem);
  }, [loadData, setItem, setWarehouseItem]);

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
  }, [item, warehouseItem, props.sectionCode]);

  useEffect(() => {
    loadAPILists();
  }, [loadAPILists]);

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
