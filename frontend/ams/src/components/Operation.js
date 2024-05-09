import React from "react";
import { Avatar, List, Space, Badge, Tooltip, Button, Row } from "antd";
import { EditOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import Technician from "./Technician";
import Material from "./Material";

const data = Array.from({
  length: 3,
}).map((_, i) => ({
  href: "https://ant.design",
  title: `Replace engine oil filter and clean engine`,
  avatar: `Q586`,
  description: "Standard Hour: 2 | Operation Type: Accident",
}));

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const Operation = ({ theme }) => (
  <List
    style={{ background: theme === "light" ? "#f8f9fa" : "#161d40" }}
    itemLayout="vertical"
    size="large"
    pagination={{
      onChange: (page) => {
        console.log(page);
      },
      pageSize: 3,
    }}
    dataSource={data}
    renderItem={(item) => (
      <Badge.Ribbon className="large-font" placement="start" text="#1">
        <List.Item
          style={{
            marginBottom: "24px",
            background: theme === "light" ? "#fff" : "#182348",
          }}
          key={item.title}
          actions={[
            <IconText
              icon={UserOutlined}
              text="Scheduler: 18106 - Jade Danial"
            />,
            <IconText
              icon={UserOutlined}
              text="Supervisor: 1393 - Michael Angelo"
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
              <Row className="space-between-row">
                <p
                  className="large-font"
                  style={{
                    color: theme === "light" ? "#000" : "#fff",
                    paddingTop: "12px",
                  }}
                >
                  {item.title}
                </p>
                <div>
                  <Tooltip title="Update Operation">
                    <Button
                      icon={<EditOutlined style={{ fontSize: "20px" }} />}
                      className="btn-normal"
                    />
                  </Tooltip>
                  <Tooltip title="Delete Operation">
                    <Button
                      icon={<CloseOutlined style={{ fontSize: "20px" }} />}
                      className="btn-normal"
                    />
                  </Tooltip>
                </div>
              </Row>
            }
            description={item.description}
          />
          <>
            <Technician />
            <Material theme={theme} />
          </>
        </List.Item>
      </Badge.Ribbon>
    )}
  />
);

export default Operation;
