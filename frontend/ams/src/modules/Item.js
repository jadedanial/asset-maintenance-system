import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { ShoppingOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";

const Item = (props) => {
  const [searchedtext, setSearchedText] = useState("");
  const [listData, setListData] = useState([]);
  const token = sessionStorage.getItem("token");

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

  const fetchItems = () => {
    return axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/items`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(error);
      });
  };

  const fetchWarehouseItems = () => {
    return axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/warehouseitems`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(error);
      });
  };

  const { data: items } = useQuery("items", fetchItems);
  const { data: warehouseItems } = useQuery(
    "warehouseItems",
    fetchWarehouseItems
  );

  function searchedText(text) {
    setSearchedText(text);
  }

  useEffect(() => {
    if (items && warehouseItems) {
      var d = [];
      warehouseItems.forEach((wi) => {
        if (wi.warehouse_code === props.sectionCode) {
          items.forEach((i) => {
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
  }, [items, warehouseItems, props.sectionCode]);

  return (
    <>
      <SearchTableEvent
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
