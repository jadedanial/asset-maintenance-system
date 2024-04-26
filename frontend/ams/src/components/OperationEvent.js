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
  EditOutlined,
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

const OperationEvent = ({ employees, userId }) => {
  const [description, setDescription] = useState("");
  const [technician, setTechnician] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [desc, setDesc] = useState("");
  const [tech, setTech] = useState("");
  const [supv, setSupv] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const data = Array.from({
    length: 1,
  }).map((_, i) => ({
    technician: technician,
    description: "Technician",
    content: description,
    supervisor: supervisor,
    scheduler: userId,
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
          <Tooltip title="Update Diagnosis">
            <Button
              icon={<EditOutlined style={{ fontSize: "26px" }} />}
              className="btn-normal"
              onClick={() => setModalOpen(true)}
            />
          </Tooltip>
        </Row>
      ),
      children: (
        <>
          <List
            itemLayout="vertical"
            size="large"
            pagination={false}
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

  const onFinish = () => {
    setDescription(desc);
    setTechnician(tech);
    setSupervisor(supv);
    setModalOpen(false);
  };

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
        title="Update Diagnosis"
        centered
        open={modalOpen}
        closable={false}
        footer={false}
        width={"600px"}
      >
        <Form {...layout} layout="vertical" name="add-new" onFinish={onFinish}>
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
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
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
                        value={tech}
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
                        onChange={(value) => setTech(value)}
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
                        value={supv}
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
                        onChange={(value) => setSupv(value)}
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
