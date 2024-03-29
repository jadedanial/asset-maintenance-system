import React, { useState } from "react";
import { useCustomQueryClient } from "../useQueryClient";
import { useMutation } from "react-query";
import axios from "axios";
import {
  Typography,
  Button,
  Form,
  Input,
  InputNumber,
  Card,
  Select,
  Col,
  Row,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";
import ResultEvent from "./ResultEvent";

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const AddUpdateItem = ({
  options,
  update,
  code,
  name,
  category,
  measurement,
  location,
  reorder,
  onhand,
  cost,
  description,
  sectionCode,
  sectionCategory,
  onCloseDrawer,
  theme,
}) => {
  const queryClient = useCustomQueryClient();
  const [updateData, setUpdateData] = useState(update);
  const [label, setLabel] = useState(
    updateData ? "Update Item" : "Add New Item"
  );
  const [color, setColor] = useState("#318ce7");
  const [idCode, setIDCode] = useState(updateData ? code : "");
  const [itemCode, setItemCode] = useState(updateData ? code : "");
  const [itemName, setItemName] = useState(updateData ? name : "");
  const [itemCategory, setItemCategory] = useState(updateData ? category : "");
  const [itemLocation, setItemLocation] = useState(updateData ? location : "");
  const [itemMeasurement, setItemMeasurement] = useState(
    updateData ? measurement : ""
  );
  const [itemReorder, setItemReorder] = useState(updateData ? reorder : "");
  const itemOnHand = updateData ? onhand : 0.0;
  const [itemCost, setItemCost] = useState(updateData ? cost : "");
  const [itemDescription, setItemDescription] = useState(
    updateData ? description : ""
  );
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nameReq, setNameReq] = useState(false);
  const [categoryReq, setCategoryReq] = useState(false);
  const [locationReq, setLocationReq] = useState(false);
  const [measurementReq, setMeasurementReq] = useState(false);
  const [reorderReq, setReorderReq] = useState(false);
  const [costReq, setCostReq] = useState(false);
  const [descriptionReq, setDescriptionReq] = useState(false);

  const newItem = () => {
    setUpdateData(false);
    setSubmit(false);
    setLabel("Add New Item");
    setColor("#318ce7");
    setItemCode("");
    setItemName("");
    setItemCategory("");
    setItemLocation("");
    setItemMeasurement("");
    setItemReorder("");
    setItemCost("");
    setItemDescription("");
    setNameReq(true);
    setCategoryReq(true);
    setLocationReq(true);
    setMeasurementReq(true);
    setReorderReq(true);
    setCostReq(true);
    setDescriptionReq(true);
  };

  const changeLabel = () => {
    setLabel(updateData ? "Update Item" : "Add New Item");
    setColor("#318ce7");
  };

  const onNameChange = (value) => {
    setItemName(value);
    setNameReq(true);
    changeLabel();
  };

  const onCategoryChange = (value) => {
    setItemCategory(value);
    setCategoryReq(true);
    changeLabel();
  };

  const onMeasurementChange = (value) => {
    setItemMeasurement(value);
    setMeasurementReq(true);
    changeLabel();
  };

  const onLocationChange = (value) => {
    setItemLocation(value);
    setLocationReq(true);
    changeLabel();
  };

  const onReorderChange = (value) => {
    setItemReorder(value);
    setReorderReq(true);
    changeLabel();
  };

  const onCostChange = (value) => {
    setItemCost(value);
    setCostReq(true);
    changeLabel();
  };

  const onDescriptionChange = (value) => {
    setItemDescription(value);
    setDescriptionReq(true);
    changeLabel();
  };

  const checkMain = () => {
    var main = true;
    if (sectionCategory === "main") {
      main = false;
    }
    return main;
  };

  const createItem = () => {
    setSubmit(true);
    changeLabel();
    var itemData = {
      item_code: itemCode,
      item_name: itemName,
      item_category: itemCategory,
      item_measurement: itemMeasurement,
      item_reorder: itemReorder,
      item_cost: itemCost,
      item_description: itemDescription,
    };
    const token = sessionStorage.getItem("token");
    axios({
      method: updateData ? "PATCH" : "POST",
      url: `${process.env.REACT_APP_API_URL}/api/item`,
      data: itemData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        queryClient.invalidateQueries("items");
        setIDCode("ITM" + response.data["id"]);
        var itemWarehouse = {
          item_code: "ITM" + response.data["id"],
          warehouse_code: sectionCode,
          item_location: itemLocation,
          item_onhand: itemOnHand,
        };
        const token = sessionStorage.getItem("token");
        axios({
          method: updateData ? "PATCH" : "POST",
          url: `${process.env.REACT_APP_API_URL}/api/warehouseitem`,
          data: itemWarehouse,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          withCredentials: true,
        }).then(() => {
          queryClient.invalidateQueries("warehouseitems");
          setSuccess(true);
        });
      })
      .catch((err) => {
        console.log(err.response.data[0]);
        setSuccess(false);
        setLabel(err.response.data[0]);
        setColor("#ff0000");
      });
  };

  const { mutate } = useMutation(createItem);

  const onFinish = () => {
    mutate();
  };

  if (submit) {
    if (success) {
      return (
        <>
          <ResultEvent
            icon={<CheckOutlined />}
            status="success"
            title={
              updateData
                ? "Successfully updated item."
                : "Successfully added new item."
            }
            subTitle={"Item name " + itemName + " with code " + String(idCode)}
            extra={
              <Row className="space-between-row">
                <Col span={12} style={{ paddingRight: "10px" }}>
                  <Button
                    size="large"
                    type="default"
                    onClick={onCloseDrawer}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => newItem()}
                    block
                  >
                    NEW ITEM
                  </Button>
                </Col>
              </Row>
            }
            height="70%"
            theme={theme}
          />
        </>
      );
    }
  }

  return (
    <>
      <div className="justified-row" style={{ paddingTop: "12px" }}>
        <div className="card-custom-size-60">
          <Form
            {...layout}
            layout="vertical"
            size="large"
            name="add-new-item"
            onFinish={onFinish}
          >
            <Card
              size="large"
              title={
                <Title>
                  <p
                    className="big-card-title"
                    style={{ textWrap: "wrap", color: color }}
                  >
                    {label}
                  </p>
                </Title>
              }
            >
              <div className="space-between-row">
                <Col span={14}>
                  <Form.Item
                    name={["name"]}
                    label="Item Name"
                    initialValue={itemName}
                    rules={[
                      {
                        required: updateData ? nameReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Input
                      value={itemName}
                      maxLength={55}
                      onChange={(e) => onNameChange(e.target.value)}
                      disabled={checkMain()}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["category"]}
                    label="Category"
                    initialValue={itemCategory}
                    rules={[
                      {
                        required: updateData ? categoryReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      value={itemCategory}
                      options={options
                        .filter((res) => res.opt_category === "Category")
                        .map((cat) => {
                          return {
                            value: cat.opt_name,
                            label: cat.opt_name,
                          };
                        })}
                      onChange={onCategoryChange}
                      disabled={checkMain()}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["location"]}
                    label="Location"
                    initialValue={itemLocation}
                    rules={[
                      {
                        required: updateData ? locationReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Input
                      value={itemLocation}
                      maxLength={300}
                      onChange={(e) => onLocationChange(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name={["cost"]}
                    label="Unit Cost"
                    initialValue={itemCost}
                    rules={[
                      {
                        required: updateData ? costReq : true,
                        message: "Required numeric!",
                        type: "number",
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={1000000}
                      value={itemCost}
                      onChange={onCostChange}
                      disabled={checkMain()}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["measurement"]}
                    label="Unit Of Measurement"
                    initialValue={itemMeasurement}
                    rules={[
                      {
                        required: updateData ? measurementReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      style={{ width: "100%" }}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      value={itemMeasurement}
                      options={options
                        .filter((res) => res.opt_category === "Measurement")
                        .map((mes) => {
                          return {
                            value: mes.opt_name,
                            label: mes.opt_name,
                          };
                        })}
                      onChange={onMeasurementChange}
                      disabled={checkMain()}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["reorder"]}
                    label="Reorder Quantity"
                    initialValue={itemReorder}
                    rules={[
                      {
                        required: updateData ? reorderReq : true,
                        message: "Required numeric!",
                        type: "number",
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={1000000}
                      value={itemReorder}
                      onChange={onReorderChange}
                      disabled={checkMain()}
                    />
                  </Form.Item>
                </Col>
              </div>
              <Form.Item
                name={["description"]}
                label="Description"
                initialValue={itemDescription}
                rules={[
                  {
                    required: updateData ? descriptionReq : true,
                    message: "Required!",
                  },
                  {
                    max: 120,
                    message: "Description must be 120 characters or less.",
                  },
                ]}
              >
                <Input.TextArea
                  value={itemDescription}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  disabled={checkMain()}
                />
              </Form.Item>
              <div className="space-between-row" style={{ paddingTop: "24px" }}>
                <Button
                  size="large"
                  type="default"
                  style={{
                    marginRight: "10px",
                  }}
                  onClick={onCloseDrawer}
                  block
                >
                  CANCEL
                </Button>
                <Button size="large" type="primary" htmlType="submit" block>
                  SAVE
                </Button>
              </div>
            </Card>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddUpdateItem;
