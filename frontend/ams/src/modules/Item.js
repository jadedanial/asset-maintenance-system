import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";

const Item = (props) => {
  const [searchedtext, setSearchedText] = useState("");
  const [branch, setBranch] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
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
    loadData("branches", setBranch);
    loadData("warehouses", setWarehouse);
    loadData("items", setItem);
    loadData("warehouseitems", setWarehouseItem);
  }

  function searchedText(text) {
    setSearchedText(text);
  }

  function branchType() {
    const branchItem = branch.find(
      (b) => b.branch_name === props.employeeBranch
    );
    return branchItem ? branchItem.branch_type === "main" : false;
  }

  useEffect(() => {
    if (warehouse.length && item.length && warehouseItem.length) {
      var d = [];
      warehouseItem.forEach((wi) => {
        warehouse.forEach((w) => {
          if (
            w.warehouse_code === wi.warehouse_code &&
            w.warehouse_branch === props.employeeBranch
          ) {
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
      });
      setListData(d);
    }
  }, [warehouse, item, warehouseItem]);

  useEffect(() => {
    loadAPILists();
  }, []);

  return (
    <>
      <SearchTableEvent
        mainBranch={branchType()}
        employeeBranch={props.employeeBranch}
        loadAPILists={loadAPILists}
        tooltipIcon={<ShoppingOutlined />}
        tooltipTitle={"Add New Item"}
        inputPlaceHolder={"Search Item"}
        compItemAdd={"AddUpdateItem"}
        compItemUpdate={"ItemDetail"}
        tableColumns={columns}
        tableDataSource={listData}
        searchedText={searchedText}
      ></SearchTableEvent>
    </>
  );
};

export default Item;
