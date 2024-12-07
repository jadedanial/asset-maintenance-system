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

const Item = ({
  items,
  codeItemData,
  setItemData,
  addItemToOperation,
  setModalOpen,
}) => {
  const [localItemData, setLocalItemData] = useState([]);
  const [itemID, setItemID] = useState("");
  const [itemName, setItemName] = useState("");
  const [confirmationLabel, setConfirmationLabel] = useState("");
  const [form] = Form.useForm();

  const searchItem = (value) => {
    const itm = items.find((itm) => itm.item_code === value);
    setItemName(itm.item_name);
    return itm.item_name;
  };

  const addItem = () => {
    const itemExist = localItemData.some((itmID) => itmID.itemID === itemID);
    if (itemExist) {
      setConfirmationLabel(
        <Alert
          message={<Text className="big-font">Failed</Text>}
          description={
            <Paragraph className="small-card-title">
              Item {itemID + " - " + itemName} already added.
            </Paragraph>
          }
          type="error"
          showIcon
        />
      );
    } else {
      const newItem = [...localItemData];
      newItem.push({
        itemID: itemID,
        itemName: itemName,
      });
      setLocalItemData(newItem);
      setItemData(newItem);
      setConfirmationLabel(
        <Alert
          message={<Text className="big-font">Success</Text>}
          description={
            <Paragraph className="small-card-title">
              Item {itemID + " - " + itemName} successfully added.
            </Paragraph>
          }
          type="info"
          showIcon
        />
      );
    }
  };

  const removeItem = (item) => {
    const itemExist = localItemData.some(
      (itmID) => itmID.itemID === item.itemID
    );
    if (itemExist) {
      const currentItem = [...localItemData];
      const index = currentItem.findIndex(
        (itmID) => itmID.itemID === item.itemID
      );
      if (index !== -1) {
        currentItem.splice(index, 1);
      }
      setLocalItemData(currentItem);
      setItemData(currentItem);
      setConfirmationLabel(
        <Alert
          message={<Text className="big-font">Success</Text>}
          description={
            <Paragraph className="small-card-title">
              Resource {itemID + " - " + itemName} successfully removed.
            </Paragraph>
          }
          type="info"
          showIcon
        />
      );
    }
  };

  const checkItem = () => {
    var updated = true;
    if (codeItemData.length !== localItemData.length) {
      updated = false;
    }
    for (const key of codeItemData) {
      if (codeItemData[key] !== localItemData[key]) {
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
          type="info"
          showIcon
        />
      );
    } else {
      setModalOpen(false);
      onReset();
    }
  };

  const genExtra = (item) => (
    <Tooltip title="Delete Item">
      <Button
        icon={<CloseOutlined style={{ fontSize: "18px" }} />}
        className="btn-normal"
        onClick={() => {
          removeItem(item);
        }}
      />
    </Tooltip>
  );

  const onReset = () => {
    form.resetFields();
    setItemID("");
    setItemName("");
    setConfirmationLabel("");
  };

  const onFinish = () => {
    addItemToOperation();
    setModalOpen(false);
    onReset();
  };

  useEffect(() => {
    console.log(items);
    setLocalItemData(codeItemData);
  }, [codeItemData, items]);

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
                name={["item"]}
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
                    value={itemID}
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={items.map((itm) => {
                      return {
                        value: itm.item_code,
                        label: `${itm.item_code} - ${itm.item_name}`,
                      };
                    })}
                    onChange={(value) => {
                      setItemID(value);
                      searchItem(value);
                      setConfirmationLabel("");
                    }}
                  />
                  <Button
                    type="primary"
                    onClick={() => {
                      addItem();
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
                dataSource={localItemData}
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
                            <p>{item.itemID}</p>
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
                              {item.itemName}
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
                    checkItem();
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

export default Item;
