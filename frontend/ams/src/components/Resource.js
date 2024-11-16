import React, { useState } from "react";
import {
  Form,
  Select,
  Collapse,
  Avatar,
  List,
  Row,
  Col,
  Modal,
  Button,
  Tooltip,
  Typography,
} from "antd";
import {
  CaretRightOutlined,
  UserOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Paragraph, Text } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const Resource = ({ theme, employees }) => {
  const [resourceData, setResourceData] = useState([]);
  const [resourceID, setResourceID] = useState("");
  const [resourceName, setResourceName] = useState("");
  const [resourcePosition, setResourcePosition] = useState("");
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
      <Tooltip title="Add Resource">
        <Button
          icon={
            <PlusOutlined
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

  const searchResource = (value) => {
    const emp = employees.find((emp) => emp.emp_id === value);
    setResourceName(emp.emp_name);
    setResourcePosition(emp.emp_position);
    return emp.emp_name;
  };

  const addResource = () => {
    const newResource = [...resourceData];
    newResource.push({
      title: (
        <Row>
          <Col span={10}>
            <p>{resourceID}</p>
          </Col>
          <Col span={7}>
            <p>2.00</p>
          </Col>
          <Col span={7}>
            <p>0.50</p>
          </Col>
        </Row>
      ),
      description: (
        <Row>
          <Col span={10}>
            <p style={{ color: "#00000081" }}>{resourceName}</p>
          </Col>
          <Col span={7}>
            <p style={{ color: "#00000081" }}>Taken Hours</p>
          </Col>
          <Col span={7}>
            <p style={{ color: "#00000081" }}>Invoiced Hours</p>
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
    });
    setResourceData(newResource);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const onFinish = () => {
    addResource();
    setModalOpen(true);
  };

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
              dataSource={resourceData}
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
        title="Add Resource"
        centered
        open={modalOpen}
        closable={true}
        onCancel={handleCancel}
        footer={false}
        width={"550px"}
      >
        <Form {...layout} layout="vertical" name="add-new" onFinish={onFinish}>
          <Row>
            <Col span={24}>
              <div className="card-with-background">
                <Form.Item
                  name={["resource"]}
                  label="Resource"
                  rules={[
                    {
                      required: true,
                      message: "Resource required",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    value={resourceID}
                    filterOption={(input, option) =>
                      String(option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA, optionB) =>
                      String(optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare(
                          String(optionB?.label ?? "").toLowerCase()
                        )
                    }
                    options={employees
                      .filter(
                        (res) => res.emp_position.toLowerCase() === "technician"
                      )
                      .map((emp) => {
                        return {
                          value: emp.emp_id,
                          label: emp.emp_id,
                        };
                      })}
                    onChange={(value) => {
                      setResourceID(value);
                      searchResource(value);
                    }}
                  />
                </Form.Item>
                <Text className="big-font">{resourceName}</Text>
                <Paragraph></Paragraph>
                <Paragraph className="small-card-title">
                  {resourcePosition}
                </Paragraph>
              </div>
            </Col>
          </Row>
          <div className="space-between-row" style={{ paddingTop: "24px" }}>
            <Button
              type="default"
              onClick={() => {
                setModalOpen(false);
                addResource();
              }}
              block
            >
              SAVE AND CLOSE
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginLeft: "8px",
              }}
              block
            >
              SAVE AND NEW
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default Resource;
