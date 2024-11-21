import React, { useState } from "react";
import {
  Select,
  Collapse,
  Avatar,
  List,
  Form,
  Row,
  Col,
  Modal,
  Button,
  Tooltip,
  Typography,
  Alert,
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
  const [confirmationLabel, setConfirmationLabel] = useState(
    <span style={{ color: "#318ce7" }}>Resource</span>
  );
  const [disableButton, setDisableButton] = useState(false);
  const [success, setSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const genExtra = () => (
    <Row>
      <p
        className="small-font"
        style={{ color: "#318ce7", padding: "10px 16px" }}
      >
        Total Hours Taken: 8
      </p>
      <Tooltip
        title={resourceData.length > 1 ? "Update Resources" : "Update Resource"}
      >
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

  const checkResource = (value) => {
    const resourceExist = resourceData.some(
      (resource) => resource.resID === value
    );
    if (resourceExist) {
      setConfirmationLabel(
        <span style={{ color: "#ff0000" }}>Resource already used</span>
      );
      setDisableButton(true);
    }
  };

  const addResource = () => {
    const newResource = [...resourceData];
    newResource.push({
      resID: resourceID,
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
            <p className="small-font" style={{ color: "#00000081" }}>
              {resourceName}
            </p>
          </Col>
          <Col span={7}>
            <p className="small-font" style={{ color: "#00000081" }}>
              Taken Hours
            </p>
          </Col>
          <Col span={7}>
            <p className="small-font" style={{ color: "#00000081" }}>
              Invoiced Hours
            </p>
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

  const onReset = () => {
    form.resetFields();
    setResourceID("");
    setResourceName("");
    setResourcePosition("");
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const saveClose = () => {
    form.validateFields().then(() => {
      addResource();
      setModalOpen(false);
      onReset();
    });
  };

  const onFinish = () => {
    addResource();
    setSuccess(true);
    onReset();
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
              {resourceData.length > 1 ? "Resources" : "Resource"}
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
                  label={confirmationLabel}
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
                      setSuccess(false);
                      setResourceID(value);
                      setConfirmationLabel(
                        <span style={{ color: "#318ce7" }}>Resource</span>
                      );
                      setDisableButton(false);
                      searchResource(value);
                      checkResource(value);
                    }}
                  />
                </Form.Item>
                {success ? (
                  <Alert
                    message={<Text className="big-font">Success</Text>}
                    description={
                      <Paragraph className="small-card-title">
                        Resource {resourceID} succesfully added to resources.
                      </Paragraph>
                    }
                    type="info"
                    showIcon
                  />
                ) : (
                  <>
                    <Text className="big-font">{resourceName}</Text>
                    <Paragraph />
                    <Paragraph className="medium-card-title">
                      {resourcePosition}
                    </Paragraph>
                  </>
                )}
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

export default Resource;
