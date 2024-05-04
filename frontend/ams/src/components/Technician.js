import React from "react";
import { Collapse, Avatar, List } from "antd";
import { CaretRightOutlined, UserOutlined } from "@ant-design/icons";

const data = [
  {
    title: "17983",
    description: "Bashir Mohammad Bashir",
  },
  {
    title: "930",
    description: "hassan Salmin Krama",
  },
  {
    title: "26111",
    description: "Ammarudin Hassan",
  },
];

const Technician = () => {
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
              Technician
            </p>
          }
        >
          {
            <List
              className="no-bordered"
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item, index) => (
                <List.Item style={{ padding: "16px 16px 0 16px" }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        className="bigger-font"
                        size={40}
                        style={{
                          background: "none",
                          color: "#318ce7",
                        }}
                      >
                        <UserOutlined />
                      </Avatar>
                    }
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          }
        </Collapse.Panel>
      </Collapse>
    </>
  );
};

export default Technician;
