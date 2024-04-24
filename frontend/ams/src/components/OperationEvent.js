import React, { useState } from "react";
import {
  Collapse,
  Button,
  Tooltip,
  Modal,
  Avatar,
  List,
  Space,
  Form,
  Input,
  Row,
  Col,
  Select,
} from "antd";
import {
  CaretRightOutlined,
  SubnodeOutlined,
  UserOutlined,
} from "@ant-design/icons";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const OperationEvent = ({ employees }) => {
  const [description, setDescription] = useState("");
  const [technician, setTechnician] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const data = Array.from({
    length: 4,
  }).map((_, i) => ({
    technician: "17983 - Bashir",
    description: "April 21, 2024 16:49:06",
    content:
      "We supply a series of design principles, practical patterns and high quality of the design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
    supervisor: "Supervisor 1393 - Micahel",
    scheduler: "Scheduler 18106 - Jade",
  }));

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  const getItems = () => [
    {
      key: "1",
      label: (
        <Row className="space-between-row">
          <p
            className="medium-card-title"
            style={{
              paddingLeft: "8px",
              paddingTop: "8px",
              color: "#318ce7",
            }}
          >
            Diagnosis
          </p>
          <Tooltip title="Add Diagnosis">
            <Button
              icon={<SubnodeOutlined style={{ fontSize: "32px" }} />}
              className="btn-normal"
              onClick={() => setModalOpen(true)}
            />
          </Tooltip>
        </Row>
      ),
      children: (
        <>
          <List
            className="border-bottom"
            itemLayout="vertical"
            size="large"
            pagination={{
              pageSize: 3,
            }}
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                style={{ width: "100%" }}
                key={item.technician}
                actions={[
                  <IconText
                    icon={UserOutlined}
                    text={item.supervisor}
                    key="list-vertical-star-o"
                  />,
                  <IconText
                    icon={UserOutlined}
                    text={item.scheduler}
                    key="list-vertical-like-o"
                  />,
                ]}
              >
                <List.Item.Meta
                  title={item.technician}
                  description={item.description}
                />
                {item.content}
              </List.Item>
            )}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Collapse
        defaultActiveKey={["1"]}
        collapsible="icon"
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            className="big-card-title"
            style={{ color: "#318ce7", paddingTop: "8px" }}
            rotate={isActive ? 90 : 0}
          />
        )}
      >
        {getItems().map((item) => (
          <Collapse.Panel key={item.key} header={item.label}>
            {item.children}
          </Collapse.Panel>
        ))}
      </Collapse>
      <Modal
        title="Add Diagnosis"
        centered
        open={modalOpen}
        closable={false}
        footer={false}
        width={"600px"}
      >
        <Form {...layout} layout="vertical" name="add-new">
          <Row>
            <Col span={24}>
              <div className=" card-with-background">
                <Form.Item
                  name={["description"]}
                  label="Description"
                  initialValue={description}
                  rules={[
                    {
                      required: true,
                      message: "Description required",
                    },
                  ]}
                >
                  <Input.TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
                <Row>
                  <Col
                    span={12}
                    style={{
                      paddingRight: "8px",
                    }}
                  >
                    <Form.Item
                      name={["technician"]}
                      label="Technician"
                      initialValue={technician}
                      rules={[
                        {
                          required: true,
                          message: "Technician required",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        style={{ width: "100%" }}
                        value={technician}
                        filterOption={(input, option) =>
                          (option?.label ?? "").toLowerCase().includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={employees
                          .filter(
                            (res) =>
                              res.emp_position.toLowerCase() === "technician"
                          )
                          .map((emp) => {
                            return {
                              value: emp.emp_name,
                              label: emp.emp_name,
                            };
                          })}
                        onChange={(e) => setTechnician(e)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["supervisor"]}
                      label="Supervisor"
                      initialValue={supervisor}
                      rules={[
                        {
                          required: true,
                          message: "Supervisor required",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        style={{ width: "100%" }}
                        value={supervisor}
                        filterOption={(input, option) =>
                          (option?.label ?? "").toLowerCase().includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={employees
                          .filter(
                            (res) =>
                              res.emp_position.toLowerCase() === "supervisor"
                          )
                          .map((emp) => {
                            return {
                              value: emp.emp_name,
                              label: emp.emp_name,
                            };
                          })}
                        onChange={(e) => setSupervisor(e)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
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
        </Form>
      </Modal>
    </>
  );
};

export default OperationEvent;
