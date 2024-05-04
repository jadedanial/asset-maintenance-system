import React from "react";
import { Avatar, List, Space, Badge } from "antd";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import Material from "./Material";

const data = Array.from({
  length: 23,
}).map((_, i) => ({
  href: "https://ant.design",
  title: `Replace engine oil filter`,
  avatar: `Q586`,
  description: "Standard Hour: 2 | Operation Type: Accident",
  content: (
    <>
      <Material />
    </>
  ),
}));

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const Operation = ({ theme }) => (
  <List
    className="bordered"
    itemLayout="vertical"
    size="large"
    pagination={{
      onChange: (page) => {
        console.log(page);
      },
      pageSize: 3,
    }}
    dataSource={data}
    style={{ padding: "24px" }}
    renderItem={(item) => (
      <Badge.Ribbon className="big-font" placement="start" text="#1">
        <List.Item
          style={{ marginBottom: "24px" }}
          key={item.title}
          actions={[
            <IconText
              icon={StarOutlined}
              text="156"
              key="list-vertical-star-o"
            />,
            <IconText
              icon={LikeOutlined}
              text="156"
              key="list-vertical-like-o"
            />,
            <IconText
              icon={MessageOutlined}
              text="2"
              key="list-vertical-message"
            />,
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar
                className="bigger-font"
                size={80}
                style={{
                  background: "none",
                  color: "#318ce7",
                }}
              >
                {item.avatar}
              </Avatar>
            }
            title={
              <p
                className="big-font"
                style={{
                  color: theme === "light" ? "#000" : "#fff",
                  paddingTop: "18px",
                }}
              >
                {item.title}
              </p>
            }
            description={item.description}
          />
          {item.content}
        </List.Item>
      </Badge.Ribbon>
    )}
  />
);

export default Operation;
