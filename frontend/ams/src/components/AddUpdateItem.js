import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Form,
  Input,
  InputNumber,
  Card,
  Select,
  Row,
  Col,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import ResultEvent from "../components/ResultEvent";

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const AddUpdateItem = (props) => {
  const [update, setUpdate] = useState(props.update);
  const [label, setLabel] = useState(update ? "Update Item" : "Add New Item");
  const [color, setColor] = useState("#318CE7");
  const [categories, setCategories] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [itemCode, setItemCode] = useState(update ? props.code : "");
  const [itemName, setItemName] = useState(update ? props.name : "");
  const [itemCategory, setItemCategory] = useState(
    update ? props.category : ""
  );
  const [itemLocation, setItemLocation] = useState(
    update ? props.location : ""
  );
  const [itemMeasurement, setItemMeasurement] = useState(
    update ? props.measurement : ""
  );
  const [itemReorder, setItemReorder] = useState(update ? props.reorder : "");
  const itemOnHand = update ? props.onhand : 0.0;
  const [itemCost, setItemCost] = useState(update ? props.cost : "");
  const [itemDescription, setItemDescription] = useState(
    update ? props.description : ""
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
  const [displayItemCode, setDisplayItemCode] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/category").then((response) => {
      setCategories(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/measurement").then((response) => {
      setMeasurements(response.data);
    });
  }, []);

  function getItemCode(name) {
    axios.get("http://localhost:8000/api/items").then((response) => {
      response.data.map((res) =>
        res.item_name === name ? setDisplayItemCode(res.item_code) : {}
      );
    });
  }

  function newItem() {
    setUpdate(false);
    setSubmit(false);
    setLabel("Add New Item");
    setColor("#318CE7");
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
  }

  function onNameChange(value) {
    setItemName(value);
    setNameReq(true);
  }

  function onCategoryChange(value) {
    setItemCategory(value);
    setCategoryReq(true);
  }

  function onMeasurementChange(value) {
    setItemMeasurement(value);
    setMeasurementReq(true);
  }

  function onLocationChange(value) {
    setItemLocation(value);
    setLocationReq(true);
  }

  function onReorderChange(value) {
    setItemReorder(value);
    setReorderReq(true);
  }

  function onCostChange(value) {
    setItemCost(value);
    setCostReq(true);
  }

  function onDescriptionChange(value) {
    setItemDescription(value);
    setDescriptionReq(true);
  }

  async function onFinish() {
    setSubmit(true);
    setLabel(update ? "Update Item" : "Add New Item");
    setColor("#318CE7");
    var itemData = {
      item_code: itemCode,
      item_name: itemName,
      item_category: itemCategory,
      item_location: itemLocation,
      item_measurement: itemMeasurement,
      item_reorder: itemReorder,
      item_onhand: itemOnHand,
      item_cost: itemCost,
      item_description: itemDescription,
    };
    try {
      await axios({
        method: update ? "PATCH" : "POST",
        url: "http://localhost:8000/api/item/",
        data: itemData,
      });
      setSuccess(true);
      getItemCode(itemName);
    } catch (err) {
      console.log(err.response.data[0]);
      setSuccess(false);
      setLabel(err.response.data[0]);
      setColor("#F50");
    }
  }

  if (submit) {
    if (success) {
      return (
        <>
          <ResultEvent
            icon={<CheckCircleOutlined style={{ color: "#318CE7" }} />}
            status="success"
            title={
              update
                ? "Successfully updated Item!"
                : "Successfully added new Item!"
            }
            subTitle={"Item name " + itemName + " with code " + displayItemCode}
            extra={
              <Button
                size="large"
                type="primary"
                icon=""
                onClick={() => newItem()}
              >
                ADD NEW ITEM
              </Button>
            }
          />
        </>
      );
    }
  }

  return (
    <>
      <div className="justified-row">
        <div className="card-custom-size">
          <Form
            {...layout}
            layout="vertical"
            size="large"
            name="add-new-item"
            onFinish={onFinish}
          >
            <Card
              size="large"
              extra={
                <Button size="middle" type="primary" htmlType="submit">
                  SAVE
                </Button>
              }
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
              hoverable
            >
              <Col span={24}>
                <div className="space-between-row">
                  <Col span={12}>
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          name={["name"]}
                          label="Item Name"
                          initialValue={itemName}
                          rules={[
                            {
                              required: update ? nameReq : true,
                              message: "Required!",
                            },
                          ]}
                        >
                          <Input
                            value={itemName}
                            onChange={(e) => onNameChange(e.target.value)}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={11}>
                    <div className="space-between-row">
                      <Col span={12}>
                        <Form.Item
                          name={["category"]}
                          label="Category"
                          initialValue={itemCategory}
                          rules={[
                            {
                              required: update ? categoryReq : true,
                              message: "Required!",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            className="small-font"
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "").includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
                            }
                            value={itemCategory}
                            options={categories.map((cat) => {
                              return {
                                value: cat.category,
                                label: cat.category,
                              };
                            })}
                            onChange={onCategoryChange}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          name={["cost"]}
                          label="Unit Cost"
                          initialValue={itemCost}
                          rules={[
                            {
                              required: update ? costReq : true,
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
                          />
                        </Form.Item>
                      </Col>
                    </div>
                  </Col>
                </div>
                <div className="space-between-row">
                  <Col span={12}>
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          name={["measurement"]}
                          label="Unit Of Measurement"
                          initialValue={itemMeasurement}
                          rules={[
                            {
                              required: update ? measurementReq : true,
                              message: "Required!",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            className="small-font"
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "").includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
                            }
                            value={itemMeasurement}
                            options={measurements.map((mes) => {
                              return {
                                value: mes.measurement,
                                label: mes.measurement,
                              };
                            })}
                            onChange={onMeasurementChange}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={11}>
                    <div className="space-between-row">
                      <Col span={12}>
                        <Form.Item
                          name={["location"]}
                          label="Physical Location"
                          initialValue={itemLocation}
                          rules={[
                            {
                              required: update ? locationReq : true,
                              message: "Required!",
                            },
                          ]}
                        >
                          <Input
                            value={itemLocation}
                            onChange={(e) => onLocationChange(e.target.value)}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          name={["reorder"]}
                          label="Reorder Quantity"
                          initialValue={itemReorder}
                          rules={[
                            {
                              required: update ? reorderReq : true,
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
                          />
                        </Form.Item>
                      </Col>
                    </div>
                  </Col>
                </div>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      name={["description"]}
                      label="Description"
                      initialValue={itemDescription}
                      rules={[
                        {
                          required: update ? descriptionReq : true,
                          message: "Required!",
                        },
                      ]}
                    >
                      <Input.TextArea
                        value={itemDescription}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Card>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddUpdateItem;
