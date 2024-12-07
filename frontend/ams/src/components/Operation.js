import React, { useState } from "react";
import {
  List,
  Tooltip,
  Button,
  Form,
  Row,
  Modal,
  Col,
  Typography,
  Select,
  Alert,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
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
  const [updateCode, setUpdateCode] = useState("");
  const [codeResourceData, setCodeResourceData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [confirmationLabel, setConfirmationLabel] = useState("");
  const [modal, setModal] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const genExtra = () => (
    <Tooltip title="Delete Operation">
      <Button
        icon={<CloseOutlined style={{ fontSize: "18px" }} />}
        className="btn-normal"
      />
    </Tooltip>
  );

  const searchOperation = (value) => {
    const op = operations.find((ops) => ops.op_code === String(value));
    setCode(op.op_code);
    setDescription(op.op_description);
    setHour(
      op.op_hours > 1
        ? "Standard Hours: " + op.op_hours
        : "Standard Hour: " + op.op_hours
    );
    setRequired(op.op_item ? "Item Required: Yes" : "Item Required: No");
    setConfirmationLabel(
      <>
        <Alert
          message={<Text className="big-font">{op.op_description}</Text>}
          description={
            <>
              <Paragraph className="small-card-title">
                {op.op_hours > 1
                  ? "Standard Hours: " + op.op_hours
                  : "Standard Hour: " + op.op_hours}
              </Paragraph>
              <Paragraph className="small-card-title">
                {op.op_item ? "Item Required: Yes" : "Item Required: No"}
              </Paragraph>
              <Paragraph className="small-card-title">
                {op.op_restriction
                  ? "Restriction: " + op.op_restriction
                  : "Restriction: No"}
              </Paragraph>
            </>
          }
          type="info"
        />
      </>
    );
    return op.op_description;
  };

  const addOperation = () => {
    const codeExist = operationData.some(
      (operation) => operation.code === code
    );
    if (codeExist) {
      setConfirmationLabel(
        <Alert
          message={<Text className="big-font">Failed</Text>}
          description={
            <Paragraph className="small-card-title">
              Operation code {code} already used in operation.
            </Paragraph>
          }
          type="error"
          showIcon
        />
      );
    } else {
      const newOperation = [
        ...operationData,
        {
          code: code,
          description: description,
          hour: hour,
          required: required,
          resource: [],
          scheduler: `Updated by: ${scheduler}`,
        },
      ];
      setOperationData(newOperation);
      setOperationCount(newOperation.length);
      setConfirmationLabel(
        <Alert
          message={<Text className="big-font">Success</Text>}
          description={
            <Paragraph className="small-card-title">
              Operation code {code} successfully added to operation.
            </Paragraph>
          }
          type="info"
          showIcon
        />
      );
    }
  };

  const addResourceToOperation = () => {
    const updatedOperationData = operationData.map((operation) =>
      operation.code === updateCode
        ? { ...operation, resource: resourceData }
        : operation
    );
    setOperationData(updatedOperationData);
  };

  const copyResourceFromOperation = (code) => {
    const operation = operationData.find((item) => item.code === code);
    return operation && operation.resource ? [...operation.resource] : [];
  };

  const resourceLength = (code) => {
    const operation = operationData.find((item) => item.code === code);
    return operation && operation.resource ? operation.resource.length : 0;
  };

  const onReset = () => {
    form.resetFields();
    setCode("");
    setDescription("");
    setHour("");
    setRequired("");
  };

  const onFinish = () => {
    addOperation();
  };

  return (
    <>
      {operationCount < 1 ? (
        <>
          <Button
            type="default"
            onClick={() => {
              setModal("operation");
              setModalOpen(true);
            }}
          >
            Add Operation
          </Button>
        </>
      ) : (
        <List
          style={{
            background: theme === "light" ? "#f8f9fa" : "#161d40",
          }}
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 10,
          }}
          dataSource={operationData}
          renderItem={(item) => (
            <div
              className="card-with-background"
              style={{
                marginBottom: "24px",
              }}
            >
              <List.Item extra={genExtra()}>
                <List.Item.Meta
                  title={
                    <p className="large-card-title">
                      {item.code + " - " + item.description}
                    </p>
                  }
                  description={
                    <>
                      <Paragraph
                        className="small-font"
                        style={{ paddingTop: "8px" }}
                      >
                        {item.hour}
                      </Paragraph>
                      <Paragraph className="small-font">
                        {item.required}
                      </Paragraph>
                      <Button
                        type="link"
                        onClick={() => {
                          setModal("resource");
                          setUpdateCode(item.code);
                          setCodeResourceData(
                            copyResourceFromOperation(item.code)
                          );
                          setModalOpen(true);
                        }}
                      >
                        {resourceLength(item.code) > 1
                          ? "Resources (" + resourceLength(item.code) + ")"
                          : "Resource (" + resourceLength(item.code) + ")"}
                      </Button>
                      <Paragraph></Paragraph>
                      <Paragraph className="small-card-title">
                        {item.scheduler}
                      </Paragraph>
                    </>
                  }
                />
              </List.Item>
            </div>
          )}
        />
      )}
      <Modal
        className={theme}
        title={
          modal === "operation"
            ? "Add Operation"
            : modal === "resource"
            ? "Add Resource"
            : modal === "material"
            ? "Add Material"
            : ""
        }
        centered
        open={modalOpen}
        closable={false}
        footer={false}
        width={
          modal === "operation"
            ? "550px"
            : modal === "resource"
            ? "750px"
            : modal === "material"
            ? "750px"
            : ""
        }
      >
        {modal === "operation" ? (
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
                    label="Operation Code"
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
                        searchOperation(value);
                      }}
                    />
                  </Form.Item>
                  {confirmationLabel}
                </div>
              </Col>
            </Row>
            <div className="space-between-row" style={{ paddingTop: "24px" }}>
              <Button
                type="default"
                onClick={() => {
                  setModalOpen(false);
                  onReset();
                }}
                block
              >
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
                ADD
              </Button>
            </div>
          </Form>
        ) : modal === "resource" ? (
          <Resource
            employees={employees}
            codeResourceData={codeResourceData}
            setResourceData={setResourceData}
            addResourceToOperation={addResourceToOperation}
            setModalOpen={setModalOpen}
          />
        ) : modal === "material" ? (
          <Material theme={theme} />
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
};

export default Operation;
