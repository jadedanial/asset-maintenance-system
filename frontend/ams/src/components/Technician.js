import React from "react";
import { Collapse, Avatar, List, Row, Col } from "antd";
import { CaretRightOutlined, UserOutlined } from "@ant-design/icons";

const data = [
  {
    title: (
      <Row>
        <Col span={10}>
          <p>17983</p>
        </Col>
        <Col span={7}>
          <p>Taken Hours</p>
        </Col>
        <Col span={7}>
          <p>Invoiced Hours</p>
        </Col>
      </Row>
    ),
    description: (
      <Row>
        <Col span={10}>
          <p>Bashir Mohammad Bashir</p>
        </Col>
        <Col span={7}>
          <p>2.00</p>
        </Col>
        <Col span={7}>
          <p>0.50</p>
        </Col>
      </Row>
    ),
    duration: (
      <Row>
        <Col span={10}>
          <p>
            Start: February 23, 2024 10:00:40 | Finish: February 23, 2024
            12:00:40
          </p>
        </Col>
      </Row>
    ),
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
                <List.Item style={{ padding: "12px 12px 0 12px" }}>
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
