import React from "react";
import { Drawer } from "antd";
import Profile from "./Profile";
import AddUpdateEmployee from "./AddUpdateEmployee";
import AddUpdateShift from "./AddUpdateShift";
import AddUpdateSchedule from "./AddUpdateSchedule";
import ItemDetail from "./ItemDetail";
import AddUpdateItem from "./AddUpdateItem";
import Cart from "./Cart";

const DrawerEvent = ({
  items,
  warehouseitems,
  employees,
  attendances,
  schedules,
  shifts,
  vacations,
  excuses,
  sections,
  options,
  userId,
  getSection,
  sectionCode,
  sectionCategory,
  segment,
  setQueryItem,
  setSearchValue,
  addItem,
  removeItem,
  itemCount,
  itemList,
  setFilteredItem,
  filteredItem,
  handleCheckChange,
  reorderOrder,
  receiveOrder,
  success,
  transactionCode,
  warehouseCode,
  warehouseCategory,
  clearOrder,
  rowIndex,
  comp,
  overflow,
  collapsed,
  showDrawer,
  onCloseDrawer,
  theme,
}) => {
  function drawerSwitch(key) {
    switch (key) {
      case "User":
        return (
          <>
            <Profile
              employees={employees}
              attendances={attendances}
              schedules={schedules}
              vacations={vacations}
              excuses={excuses}
              sections={sections}
              options={options}
              empid={userId}
              getSection={getSection}
              onCloseDrawer={onCloseDrawer}
              theme={theme}
            ></Profile>
          </>
        );
      case "Profile":
        return (
          <>
            <Profile
              employees={employees}
              attendances={attendances}
              schedules={schedules}
              vacations={vacations}
              excuses={excuses}
              sections={sections}
              options={options}
              empid={rowIndex["id"]}
              getSection={getSection}
              onCloseDrawer={onCloseDrawer}
              theme={theme}
            ></Profile>
          </>
        );
      case "AddUpdateEmployee":
        return (
          <>
            <AddUpdateEmployee
              sections={sections}
              options={options}
              update={false}
              getSection={getSection}
              onCloseDrawer={onCloseDrawer}
              theme={theme}
            />
          </>
        );
      case "AddUpdateShift":
        return (
          <>
            <AddUpdateShift
              update={false}
              onCloseDrawer={onCloseDrawer}
              theme={theme}
            />
          </>
        );
      case "UpdateShift":
        return (
          <>
            <AddUpdateShift
              update={true}
              id={rowIndex["id"]}
              name={rowIndex["name"]}
              from={rowIndex["from"]}
              to={rowIndex["to"]}
              onCloseDrawer={onCloseDrawer}
              theme={theme}
            />
          </>
        );
      case "AddUpdateSchedule":
        return (
          <>
            <AddUpdateSchedule
              shifts={shifts}
              update={false}
              onCloseDrawer={onCloseDrawer}
              theme={theme}
            />
          </>
        );
      case "UpdateSchedule":
        return (
          <>
            <AddUpdateSchedule
              shifts={shifts}
              update={true}
              id={rowIndex["id"]}
              name={rowIndex["name"]}
              sun={rowIndex["sun"]}
              mon={rowIndex["mon"]}
              tue={rowIndex["tue"]}
              wed={rowIndex["wed"]}
              thu={rowIndex["thu"]}
              fri={rowIndex["fri"]}
              sat={rowIndex["sat"]}
              onCloseDrawer={onCloseDrawer}
              theme={theme}
            />
          </>
        );
      case "ItemDetail":
        return (
          <>
            <ItemDetail
              items={items}
              warehouseitems={warehouseitems}
              options={options}
              itemcode={rowIndex["code"]}
              view={false}
              sectionCode={sectionCode}
              sectionCategory={sectionCategory}
              onCloseDrawer={onCloseDrawer}
              theme={theme}
            />
          </>
        );
      case "AddUpdateItem":
        return (
          <>
            <AddUpdateItem
              options={options}
              update={false}
              sectionCode={sectionCode}
              sectionCategory={sectionCategory}
              onCloseDrawer={onCloseDrawer}
              theme={theme}
            />
          </>
        );
      case "Cart":
        return (
          <>
            <Cart
              segment={segment}
              setQueryItem={setQueryItem}
              setSearchValue={setSearchValue}
              addItem={addItem}
              removeItem={removeItem}
              itemCount={itemCount}
              itemList={itemList}
              setFilteredItem={setFilteredItem}
              filteredItem={filteredItem}
              handleCheckChange={handleCheckChange}
              reorderOrder={reorderOrder}
              receiveOrder={receiveOrder}
              success={success}
              transactionCode={transactionCode}
              warehouseCode={warehouseCode}
              warehouseCategory={warehouseCategory}
              sectionCode={sectionCode}
              clearOrder={clearOrder}
              onCloseDrawer={onCloseDrawer}
              theme={theme}
            ></Cart>
          </>
        );
      default:
        break;
    }
  }

  return (
    <>
      <Drawer
        width="100%"
        height="fit-content"
        placement="right"
        className={`${overflow ? "overflow" : "no-overflow"} ${theme}`}
        style={{
          marginTop: "85px",
          marginLeft: collapsed ? "100px" : "220px",
          marginRight: "10px",
          transition: "0.2s ease-in-out",
        }}
        open={showDrawer}
        destroyOnClose={true}
      >
        {drawerSwitch(comp)}
      </Drawer>
    </>
  );
};

export default DrawerEvent;
