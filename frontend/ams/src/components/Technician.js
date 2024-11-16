import React, { useState } from "react";
import { Collapse, Avatar, List, Row, Col, Modal, Button, Tooltip } from "antd";
import {
  CaretRightOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";

const Technician = ({ theme }) => {
  const [modalOpen, setModalOpen] = useState(false);

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
  ];

  const genExtra = () => (
    <Row>
      <p
        className="small-font"
        style={{ color: "#318ce7", padding: "10px 16px" }}
      >
        Total Hours Taken: 8
      </p>
      <p
        className="small-font"
        style={{ color: "#318ce7", padding: "10px 16px" }}
      >
        Standard Hours: 8
      </p>
      <Tooltip title={data.length > 1 ? "Update Resources" : "Update Resource"}>
        <Button
          icon={
            <EditOutlined
              style={{ fontSize: "20px" }}
              onClick={() => {
                setModalOpen(true);
              }}
            />
          }
          className="btn-normal"
        />
      </Tooltip>
    </Row>
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
              {data.length > 1 ? "Resources" : "Resource"}
            </p>
          }
          extra={genExtra()}
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
      <Modal
        className={theme}
        title={data.length > 1 ? "Update Resources" : "Update Resource"}
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

export default Technician;
