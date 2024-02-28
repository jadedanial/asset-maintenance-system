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

const AddUpdateItem = (props) => {
  const [update, setUpdate] = useState(props.update);
  const [label, setLabel] = useState(update ? "Update Item" : "Add New Item");
  const [color, setColor] = useState("#318ce7");
  const [categories, setCategories] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [idCode, setIDCode] = useState(update ? props.code : "");
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

  function newItem() {
    setUpdate(false);
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
  }

  function changeLabel() {
    setLabel(update ? "Update Item" : "Add New Item");
    setColor("#318ce7");
  }

  function onNameChange(value) {
    setItemName(value);
    setNameReq(true);
    changeLabel();
  }

  function onCategoryChange(value) {
    setItemCategory(value);
    setCategoryReq(true);
    changeLabel();
  }

  function onMeasurementChange(value) {
    setItemMeasurement(value);
    setMeasurementReq(true);
    changeLabel();
  }

  function onLocationChange(value) {
    setItemLocation(value);
    setLocationReq(true);
    changeLabel();
  }

  function onReorderChange(value) {
    setItemReorder(value);
    setReorderReq(true);
    changeLabel();
  }

  function onCostChange(value) {
    setItemCost(value);
    setCostReq(true);
    changeLabel();
  }

  function onDescriptionChange(value) {
    setItemDescription(value);
    setDescriptionReq(true);
    changeLabel();
  }

  function checkMain() {
    var main = true;
    if (props.sectionCategory === "main") {
      main = false;
    }
    return main;
  }

  function onFinish() {
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
      method: update ? "PATCH" : "POST",
      url: `${process.env.REACT_APP_API_URL}/api/item`,
      data: itemData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        setIDCode("ITM" + response.data["id"]);
        var itemWarehouse = {
          item_code: "ITM" + response.data["id"],
          warehouse_code: props.sectionCode,
          item_location: itemLocation,
          item_onhand: itemOnHand,
        };
        const token = sessionStorage.getItem("token");
        axios({
          method: update ? "PATCH" : "POST",
          url: `${process.env.REACT_APP_API_URL}/api/warehouseitem`,
          data: itemWarehouse,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          withCredentials: true,
        }).then(() => {
          setSuccess(true);
        });
      })
      .catch((err) => {
        console.log(err.response.data[0]);
        setSuccess(false);
        setLabel(err.response.data[0]);
        setColor("#ff0000");
      });
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/options`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        setCategories(response.data);
        setMeasurements(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (submit) {
    if (success) {
      return (
        <>
          <ResultEvent
            icon={<CheckOutlined style={{ color: "#318ce7" }} />}
            status="success"
            title={
              update
                ? "Successfully updated Item."
                : "Successfully added new Item."
            }
            subTitle={"Item name " + itemName + " with code " + String(idCode)}
            extra={
              <Row className="space-between-row" style={{ width: "40%" }}>
                <Col span={12}>
                  <Button
                    size="large"
                    type="default"
                    onClick={props.onCloseDrawer}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
                <Col span={11}>
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
            theme={props.theme}
          />
        </>
      );
    }
  }

  return (
    <>
      <div className="justified-row">
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
                        required: update ? nameReq : true,
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
                        required: update ? categoryReq : true,
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
                      options={categories
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
                        required: update ? locationReq : true,
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
                      disabled={checkMain()}
                    />
                  </Form.Item>
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
                      options={measurements
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
                    required: update ? descriptionReq : true,
                    message: "Required!",
                  },
                ]}
              >
                <Input.TextArea
                  value={itemDescription}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  disabled={checkMain()}
                />
              </Form.Item>
              <div className="space-between-row" style={{ paddingTop: "30px" }}>
                <Button
                  size="large"
                  type="default"
                  style={{
                    marginRight: "10px",
                  }}
                  onClick={props.onCloseDrawer}
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
