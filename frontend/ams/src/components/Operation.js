import React, { useState } from "react";
import {
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
import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import Resource from "./Resource";
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
  const [hour, setHour] = useState("");
  const [required, setRequired] = useState("");
  const [restriction, setRestriction] = useState("");
  const [confirmationLabel, setConfirmationLabel] = useState(
    <span style={{ color: "#318ce7" }}>Code</span>
  );
  const [disableButton, setDisableButton] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

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
    setHour(
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

  const checkOperation = (value) => {
    const codeExist = operationData.some(
      (operation) => operation.avatar === value
    );
    if (codeExist) {
      setConfirmationLabel(
        <span style={{ color: "#ff0000" }}>Code already used</span>
      );
      setDisableButton(true);
    }
  };

  const addOperation = () => {
    const newOperation = [...operationData];
    newOperation.push({
      avatar: code,
      description: description,
      scheduler: `Updated by Scheduler: ${scheduler}`,
    });
    setOperationData(newOperation);
    setOperationCount(newOperation.length);
  };

  const onReset = () => {
    form.resetFields();
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const saveClose = () => {
    form.validateFields().then(() => {
      addOperation();
      setModalOpen(false);
    });
  };

  const onFinish = () => {
    addOperation();
    onReset();
    setDescription("Code " + code + " succesfully added to operation.");
    setCode("");
    setHour("");
    setRequired("");
    setRestriction("");
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
                  title={
                    <Row className="space-between-row">
                      <div></div>
                      <div>
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
                  description={item.description}
                />
                <>
                  <Resource theme={theme} employees={employees} />
                  <Material theme={theme} />
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
        <Form
          {...layout}
          form={form}
          layout="vertical"
          name="add-new"
          onFinish={onFinish}
        >
          <Row>
            <Col span={24}>
              <div className="card-with-background">
                <Form.Item
                  name={["code"]}
                  label={confirmationLabel}
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
                      setConfirmationLabel(
                        <span style={{ color: "#318ce7" }}>Code</span>
                      );
                      setDisableButton(false);
                      searchOperation(value);
                      checkOperation(value);
                    }}
                  />
                </Form.Item>
                <Text className="big-font">{description}</Text>
                <Paragraph></Paragraph>
                <Paragraph className="medium-card-title">{hour}</Paragraph>
                <Paragraph className="medium-card-title">{required}</Paragraph>
                <Paragraph className="medium-card-title">
                  {restriction}
                </Paragraph>
              </div>
            </Col>
          </Row>
          <div className="space-between-row" style={{ paddingTop: "24px" }}>
            <Button
              type="default"
              onClick={() => {
                saveClose();
              }}
              disabled={disableButton}
              block
            >
              SAVE AND CLOSE
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={disableButton}
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
