import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingOutlined } from "@ant-design/icons";
import SearchListEvent from "../components/SearchListEvent";

const Item = () => {
  const [searchedtext, setSearchedText] = useState("");
  const [items, setItems] = useState([]);

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

  useEffect(() => {
    (async () => {
      await loadAPILists();
    })();
  }, []);

  async function loadAPILists() {
    try {
      await axios({
        method: "GET",
        url: "http://localhost:8000/api/items",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((response) => {
        setItems([]);
        response.data.map((res) =>
          setItems((items) => [
            ...items,
            {
              code: res.item_code,
              name: res.item_name,
              onhand: res.item_onhand,
              cost: res.item_cost,
              value: (res.item_cost * res.item_onhand).toFixed(2),
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

  return (
    <>
      <SearchListEvent
        loadAPILists={loadAPILists}
        tooltipIcon={<ShoppingOutlined />}
        tooltipTitle={"Add New Item"}
        inputPlaceHolder={"Search Item"}
        compItemAdd={"AddUpdateItem"}
        compItemUpdate={"ItemDetail"}
        tableColumns={columns}
        tableDataSource={items}
        searchedText={searchedText}
      ></SearchListEvent>
    </>
  );
};

export default Item;
