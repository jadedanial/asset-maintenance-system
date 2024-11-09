import React, { useState } from "react";
import {
  Avatar,
  List,
  Space,
  Badge,
  Tooltip,
  Button,
  Form,
  Row,
  Modal,
  Col,
  Typography,
  Select,
  Popover,
} from "antd";
import { EditOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import Technician from "./Technician";
import Material from "./Material";

const { Paragraph, Text } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const Operation = ({ theme, operations, employees, userId }) => {
  const scheduler = employees.find((emp) => emp.emp_id === userId)
    ? `${employees.find((emp) => emp.emp_id === userId).emp_id} - ${
        employees.find((emp) => emp.emp_id === userId).emp_name
      }`
    : "";
  const [operationData, setOperationData] = useState([]);
  const [operationCount, setOperationCount] = useState(0);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [hour, setHours] = useState("");
  const [required, setRequired] = useState("");
  const [restriction, setRestriction] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const IconText = ({ icon, id, name }) => (
    <Popover content={<p>{`${id.split(":")[1]} - ${name}`}</p>}>
      <Space>
        {React.createElement(icon)}
        {id}
      </Space>
    </Popover>
  );

  const searchOperation = (value) => {
    const op = operations.find((ops) => ops.op_code === value);
    setDescription(op.op_description);
    setHours(
      op.op_hours > 1
        ? "Standard Hours: " + op.op_hours
        : "Standard Hour: " + op.op_hours
    );
    setRequired(op.op_item ? "Item Required: Yes" : "Item Required: No");
    setRestriction(
      op.op_restriction
        ? "Restriction: " + op.op_restriction
        : "Restriction: No"
    );
    return op.op_description;
  };

  const addOperation = () => {
    const newOperation = [...operationData];
    newOperation.push({
      avatar: code,
      description: description,
      scheduler: `Scheduler: ${scheduler}`,
    });
    setOperationData(newOperation);
    setOperationCount(newOperation.length);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const onFinish = () => {
    addOperation();
    setModalOpen(true);
  };

  return (
    <>
      {operationCount < 1 ? (
        <>
          <Button
            type="default"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            Add Operation
          </Button>
        </>
      ) : (
        <List
          style={{ background: theme === "light" ? "#f8f9fa" : "#161d40" }}
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 3,
          }}
          dataSource={operationData}
          renderItem={(item) => (
            <Badge.Ribbon
              className="large-font"
              placement="start"
              text={item.avatar}
            >
              <List.Item
                style={{
                  marginBottom: "24px",
                  background: theme === "light" ? "#fff" : "#182348",
                }}
                key={item.title}
                actions={[
                  <IconText
                    icon={UserOutlined}
                    id={item.scheduler.split(" - ")[0]}
                    name={item.scheduler.split(" - ")[1]}
                  />,
                ]}
              >
                <List.Item.Meta
                  description={
                    <p
                      className="medium-card-title"
                      style={{
                        color: "#000",
                      }}
                    >
                      {item.description}
                    </p>
                  }
                  title={
                    <Row className="space-between-row">
                      <div></div>
                      <div>
                        <Tooltip title="Update Operation">
                          <Button
                            icon={<EditOutlined style={{ fontSize: "18px" }} />}
                            className="btn-normal"
                          />
                        </Tooltip>
                        <Tooltip title="Delete Operation">
                          <Button
                            icon={
                              <CloseOutlined style={{ fontSize: "18px" }} />
                            }
                            className="btn-normal"
                          />
                        </Tooltip>
                      </div>
                    </Row>
                  }
                />
                <>
                  <Technician /> <Material theme={theme} />
                </>
              </List.Item>
            </Badge.Ribbon>
          )}
        />
      )}
      <Modal
        className={theme}
        title="Add Operation"
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
                  name={["code"]}
                  label="Code"
                  rules={[
                    {
                      required: true,
                      message: "Code required",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    value={code}
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={operations.map((ops) => {
                      return {
                        value: ops.op_code,
                        label: ops.op_code,
                      };
                    })}
                    onChange={(value) => {
                      setCode(value);
                      searchOperation(value);
                    }}
                  />
                </Form.Item>
                <Text className="big-font">{description}</Text>
                <Paragraph></Paragraph>
                <Paragraph className="small-card-title">{hour}</Paragraph>
                <Paragraph className="small-card-title">{required}</Paragraph>
                <Paragraph className="small-card-title">
                  {restriction}
                </Paragraph>
              </div>
            </Col>
          </Row>
          <div className="space-between-row" style={{ paddingTop: "24px" }}>
            <Button
              type="default"
              onClick={() => {
                setModalOpen(false);
                addOperation();
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

export default Operation;
