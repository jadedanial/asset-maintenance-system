import React, { useState } from "react";
import {
  Collapse,
  Button,
  Tooltip,
  Modal,
  List,
  Space,
  Form,
  Input,
  Row,
  Col,
  Select,
  Popover,
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

const Diagnosis = ({
  employees,
  userId,
  technician,
  scheduler,
  supervisor,
  diagnosis,
  setTechnician,
  setScheduler,
  setSupervisor,
  setDiagnosis,
  empty,
  setEmpty,
  theme,
}) => {
  const [tech, setTech] = useState("");
  const sched = employees.find((emp) => emp.emp_id === userId)
    ? `${employees.find((emp) => emp.emp_id === userId).emp_id} - ${
        employees.find((emp) => emp.emp_id === userId).emp_name
      }`
    : "";
  const [supv, setSupv] = useState("");
  const [diag, setDiag] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const data = Array.from({
    length: 1,
  }).map((_, i) => ({
    diagnosis: diagnosis,
    technician: `Diagnosed by Technician: ${technician}`,
    scheduler: `Scheduler: ${scheduler}`,
    supervisor: `Supervisor: ${supervisor}`,
  }));

  const IconText = ({ icon, id, name }) => (
    <Popover content={<p>{`${id.split(":")[1]} - ${name}`}</p>}>
      <Space>
        {React.createElement(icon)}
        {id}
      </Space>
    </Popover>
  );

  const getItems = () => [
    {
      key: "1",
      label: (
        <Row className="space-between-row">
          <p
            style={{
              fontSize: "14px",
              paddingLeft: "8px",
              paddingTop: "8px",
              color: empty ? "#ff0000" : "#318ce7",
            }}
          >
            {empty ? "Diagnosis required" : "Diagnosis"}
          </p>
          <Tooltip title="Update Diagnosis">
            <Button
              icon={<EditOutlined style={{ fontSize: "20px" }} />}
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
            dataSource={technician !== "" ? data : ""}
            renderItem={(item) => (
              <List.Item
                key={item.technician}
                actions={[
                  <IconText
                    icon={UserOutlined}
                    id={item.technician.split(" - ")[0]}
                    name={item.technician.split(" - ")[1]}
                  />,
                  <IconText
                    icon={UserOutlined}
                    id={item.scheduler.split(" - ")[0]}
                    name={item.scheduler.split(" - ")[1]}
                  />,
                  <IconText
                    icon={UserOutlined}
                    id={item.supervisor.split(" - ")[0]}
                    name={item.supervisor.split(" - ")[1]}
                  />,
                ]}
              >
                {item.diagnosis}
              </List.Item>
            )}
          />
        </>
      ),
    },
  ];

  const onFinish = () => {
    setTechnician(tech);
    setScheduler(sched);
    setSupervisor(supv);
    setDiagnosis(diag);
    setEmpty(false);
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
        className={theme}
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
              <div className="card-with-background">
                <Form.Item
                  name={["diagnosis"]}
                  label="Diagnosis"
                  initialValue={diagnosis}
                  rules={[
                    {
                      required: true,
                      message: "Diagnosis required",
                    },
                  ]}
                >
                  <Input.TextArea
                    value={diag}
                    onChange={(e) => setDiag(e.target.value)}
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
                              value: `${emp.emp_id} - ${emp.emp_name}`,
                              label: `${emp.emp_id} - ${emp.emp_name}`,
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
                              value: `${emp.emp_id} - ${emp.emp_name}`,
                              label: `${emp.emp_id} - ${emp.emp_name}`,
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

export default Diagnosis;
