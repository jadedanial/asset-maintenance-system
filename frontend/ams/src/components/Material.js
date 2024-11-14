import React, { useState } from "react";
import { Collapse, Modal, Button } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import ItemList from "./ItemList";

const Material = ({ theme }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const data = [
    {
      id: "6",
      code: "ITM6",
      name: "Brake Pad By Set Kitens",
      cost: "300",
      measurement: "Set",
      quantity: "4",
      total: "1200.00",
      checked: "false",
      to_warehouse: "DAMWHOUSE",
    },
    {
      id: "7",
      code: "ITM7",
      name: "Fuel Injectors",
      cost: "50",
      measurement: "Piece",
      quantity: "3",
      total: "150.00",
      checked: "false",
      to_warehouse: "DAMWHOUSE",
    },
    {
      id: "8",
      code: "ITM8",
      name: "Engines",
      cost: "5000",
      measurement: "Piece",
      quantity: "4",
      total: "20000.00",
      checked: "false",
      to_warehouse: "DAMWHOUSE",
    },
    {
      id: "9",
      code: "ITM9",
      name: "Transmission",
      cost: "3000",
      measurement: "Piece",
      quantity: "5",
      total: "15000.00",
      checked: "false",
      to_warehouse: "DAMWHOUSE",
    },
    {
      id: "10",
      code: "ITM10",
      name: "Battery",
      cost: "200",
      measurement: "Piece",
      quantity: "3",
      total: "600.00",
      checked: "false",
      to_warehouse: "DAMWHOUSE",
    },
  ];

  const genExtra = () => (
    <Button
      type="text"
      onClick={() => {
        setModalOpen(true);
      }}
    >
      Update
    </Button>
  );

  return (
    <>
      <Collapse
        collapsible="icon"
        style={{ marginBottom: "24px" }}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            className="big-card-title"
            style={{ color: "#318ce7", paddingTop: "8px" }}
            rotate={isActive ? 90 : 0}
          />
        )}
      >
        <Collapse.Panel
          header={
            <p
              style={{
                fontSize: "14px",
                paddingLeft: "8px",
                paddingTop: "8px",
                color: "#318ce7",
              }}
            >
              {data.length > 1 ? "Items" : "Item"}
            </p>
          }
          extra={genExtra()}
        >
          {
            <ItemList
              view={true}
              segment={"Request"}
              itemList={data}
              theme={theme}
            />
          }
        </Collapse.Panel>
      </Collapse>
      <Modal
        className={theme}
        title={data.length > 1 ? "Update Items" : "Update Item"}
        centered
        open={modalOpen}
        closable={false}
        footer={false}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <div className="space-between-row" style={{ paddingTop: "24px" }}>
          <Button type="default" onClick={() => setModalOpen(false)} block>
            CANCEL
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginLeft: "8px",
            }}
            block
          >
            SAVE
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Material;
