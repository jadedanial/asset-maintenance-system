import React, { useState, useEffect } from "react";
import {
  Select,
  Avatar,
  List,
  Form,
  Row,
  Col,
  Button,
  Tooltip,
  Alert,
  Typography,
  Space,
} from "antd";
import { UserOutlined, CloseOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const Resource = ({
  employees,
  codeResourceData,
  setResourceData,
  addResourceToOperation,
  setModalOpen,
}) => {
  const [resData, setResData] = useState([]);
  const [resourceID, setResourceID] = useState("");
  const [resourceName, setResourceName] = useState("");
  const [confirmationLabel, setConfirmationLabel] = useState("");
  const [form] = Form.useForm();

  const searchResource = (value) => {
    const emp = employees.find((emp) => emp.emp_id === value);
    setResourceName(emp.emp_name);
    return emp.emp_name;
  };

  const addResource = () => {
    const resourceExist = resData.some(
      (resID) => resID.resourceID === resourceID
    );
    if (resourceExist) {
      setConfirmationLabel(
        <Alert
          message={<Text className="big-font">Failed</Text>}
          description={
            <Paragraph className="small-card-title">
              Resource {resourceID + "-" + resourceName} already added.
            </Paragraph>
          }
          type="error"
          showIcon
        />
      );
    } else {
      const newResource = [...resData];
      newResource.push({
        resourceID: resourceID,
        resourceName: resourceName,
      });
      setResData(newResource);
      setResourceData(newResource);
      setConfirmationLabel(
        <Alert
          message={<Text className="big-font">Success</Text>}
          description={
            <Paragraph className="small-card-title">
              Resource {resourceID + "-" + resourceName} successfully added.
            </Paragraph>
          }
          type="info"
          showIcon
        />
      );
    }
  };

  const removeResource = (item) => {
    const resourceExist = resData.some(
      (resID) => resID.resourceID === item.resourceID
    );
    if (resourceExist) {
      const currentResource = [...resData];
      const index = currentResource.findIndex(
        (resource) => resource.resourceID === item.resourceID
      );
      if (index !== -1) {
        currentResource.splice(index, 1);
      }
      setResData(currentResource);
      setResourceData(currentResource);
      setConfirmationLabel(
        <Alert
          message={<Text className="big-font">Success</Text>}
          description={
            <Paragraph className="small-card-title">
              Resource {item.resourceID + "-" + item.resourceName} successfully
              removed.
            </Paragraph>
          }
          type="success"
          showIcon
        />
      );
    }
  };

  const checkResource = () => {
    var updated = true;
    if (codeResourceData.length !== resData.length) {
      updated = false;
    }
    for (const key of codeResourceData) {
      if (codeResourceData[key] !== resData[key]) {
        updated = false;
      }
    }
    if (!updated) {
      setConfirmationLabel(
        <Alert
          message={<Text className="big-font">Warning</Text>}
          description={
            <Space>
              <Paragraph className="small-card-title">
                Close without saving?
              </Paragraph>
              <Button
                size="small"
                type="default"
                onClick={() => {
                  setModalOpen(false);
                  onReset();
                }}
              >
                Yes
              </Button>
            </Space>
          }
          type="warning"
          showIcon
        />
      );
    } else {
      setModalOpen(false);
      onReset();
    }
  };

  const genExtra = (item) => (
    <Tooltip title="Delete Reosurce">
      <Button
        icon={<CloseOutlined style={{ fontSize: "18px" }} />}
        className="btn-normal"
        onClick={() => {
          removeResource(item);
        }}
      />
    </Tooltip>
  );

  const onReset = () => {
    form.resetFields();
    setResourceID("");
    setResourceName("");
    setConfirmationLabel("");
  };

  const onFinish = () => {
    addResourceToOperation();
    setModalOpen(false);
    onReset();
  };

  useEffect(() => {
    setResData(codeResourceData);
  }, [codeResourceData]);

  return (
    <>
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
                name={["resource"]}
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <div className="space-between-row">
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    value={resourceID}
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
                        (res) => res.emp_position.toLowerCase() === "technician"
                      )
                      .map((emp) => {
                        return {
                          value: emp.emp_id,
                          label: `${emp.emp_id} - ${emp.emp_name}`,
                        };
                      })}
                    onChange={(value) => {
                      setResourceID(value);
                      searchResource(value);
                      setConfirmationLabel("");
                    }}
                  />
                  <Button
                    type="primary"
                    onClick={() => {
                      addResource();
                    }}
                    style={{
                      marginLeft: "8px",
                      width: "20%",
                    }}
                    block
                  >
                    ADD
                  </Button>
                </div>
              </Form.Item>
              {confirmationLabel}
              <List
                className="no-bordered"
                itemLayout="horizontal"
                dataSource={resData}
                style={{ height: "300px", overflowY: "auto" }}
                renderItem={(item, index) => (
                  <List.Item
                    style={{ padding: "12px 12px 0 12px" }}
                    extra={genExtra(item)}
                  >
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
                      title={
                        <Row>
                          <Col span={10}>
                            <p>{item.resourceID}</p>
                          </Col>
                          <Col span={7}>
                            <p>2.00</p>
                          </Col>
                          <Col span={7}>
                            <p>0.50</p>
                          </Col>
                        </Row>
                      }
                      description={
                        <Row>
                          <Col span={10}>
                            <p
                              className="small-font"
                              style={{ color: "#00000081" }}
                            >
                              {item.resourceName}
                            </p>
                          </Col>
                          <Col span={7}>
                            <p
                              className="small-font"
                              style={{ color: "#00000081" }}
                            >
                              Taken Hours
                            </p>
                          </Col>
                          <Col span={7}>
                            <p
                              className="small-font"
                              style={{ color: "#00000081" }}
                            >
                              Invoiced Hours
                            </p>
                          </Col>
                        </Row>
                      }
                    />
                  </List.Item>
                )}
              />
              <div className="space-between-row" style={{ paddingTop: "24px" }}>
                <Button
                  type="default"
                  onClick={() => {
                    checkResource();
                  }}
                  block
                >
                  CLOSE
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
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Resource;
