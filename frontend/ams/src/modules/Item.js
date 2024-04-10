import React, { useState, useCallback } from "react";
import { ShoppingOutlined } from "@ant-design/icons";
import SearchTableEvent from "../components/SearchTableEvent";

const Item = ({
  items,
  warehouseitems,
  options,
  sectionCode,
  sectionCategory,
  collapsed,
  theme,
}) => {
  const [searchedtext, setSearchedText] = useState("");

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
      sorter: (a, b) => a.code.localeCompare(b.code),
      defaultSortOrder: "ascend",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "40%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: "ascend",
    },
    {
      title: "On Hand",
      dataIndex: "onhand",
      key: "onhand",
      sorter: (a, b) => a.onhand - b.onhand,
      defaultSortOrder: "ascend",
    },
    {
      title: "Unit Cost",
      dataIndex: "cost",
      key: "cost",
      sorter: (a, b) => a.cost - b.cost,
      defaultSortOrder: "ascend",
    },
    {
      title: "Inventory Value",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => a.value - b.value,
      defaultSortOrder: "ascend",
    },
  ];

  const loadAPILists = useCallback(() => {
    var d = [];
    if (items && warehouseitems) {
      warehouseitems.forEach((wi) => {
        if (wi.warehouse_code === sectionCode) {
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
    }
    return d;
  }, [items, warehouseitems, sectionCode]);

  const searchedText = (text) => {
    setSearchedText(text);
  };

  return (
    <>
      <SearchTableEvent
        items={items}
        warehouseitems={warehouseitems}
        options={options}
        tooltipIcon={<ShoppingOutlined />}
        tooltipTitle={"Add New Item"}
        inputPlaceHolder={"Search Item"}
        compItemUpdate={"ItemDetail"}
        compItemAdd={"AddUpdateItem"}
        tableColumns={columns}
        tableDataSource={loadAPILists()}
        searchedText={searchedText}
        sectionCode={sectionCode}
        sectionCategory={sectionCategory}
        theme={theme}
        collapsed={collapsed}
      />
    </>
  );
};

export default Item;
