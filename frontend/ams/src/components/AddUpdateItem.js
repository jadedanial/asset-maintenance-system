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
  Steps,
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
  const [step, setStep] = useState(updateData ? 7 : 0);
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
    setStep(1);
    changeLabel();
  };

  const onCostChange = (value) => {
    setItemCost(value);
    setCostReq(true);
    setStep(2);
    changeLabel();
  };

  const onCategoryChange = (value) => {
    setItemCategory(value);
    setCategoryReq(true);
    setStep(3);
    changeLabel();
  };

  const onMeasurementChange = (value) => {
    setItemMeasurement(value);
    setMeasurementReq(true);
    setStep(4);
    changeLabel();
  };

  const onLocationChange = (value) => {
    setItemLocation(value);
    setLocationReq(true);
    setStep(5);
    changeLabel();
  };

  const onReorderChange = (value) => {
    setItemReorder(value);
    setReorderReq(true);
    setStep(6);
    changeLabel();
  };

  const onDescriptionChange = (value) => {
    setItemDescription(value);
    setDescriptionReq(true);
    setStep(7);
    changeLabel();
  };

  const checkMain = () => {
    var main = true;
    if (sectionCategory === "main") {
      main = false;
    }
    return main;
  };

  const createWarehouseItem = (
    itemcode,
    warehousecode,
    itemlocation,
    itemonhand
  ) => {
    var itemWarehouse = {
      item_code: itemcode,
      warehouse_code: warehousecode,
      item_location: itemlocation,
      item_onhand: itemonhand,
    };
    const token = sessionStorage.getItem("token");
    return axios({
      method: updateData ? "PATCH" : "POST",
      url: `${process.env.REACT_APP_API_URL}/api/warehouseitem`,
      data: itemWarehouse,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then(() => {
        queryClient.invalidateQueries("warehouseitems");
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setSuccess(false);
      });
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
        createWarehouseItem(
          "ITM" + response.data["id"],
          sectionCode,
          itemLocation,
          itemOnHand
        );
      })
      .catch((err) => {
        console.log(err.response.data[0]);
        setSubmit(false);
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
        <div className="card-custom-size-full">
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
              <Row>
                <Col span={16} style={{ paddingRight: "24px" }}>
                  <div
                    className=" card-with-background"
                    style={{ padding: "24px" }}
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
                              message: "Item name required",
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
                              message: "Item category required",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
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
                              message: "Item location required",
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
                              message: "Numeric value required",
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
                              message: "Unit of measurement required",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            showSearch
                            style={{ width: "100%" }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "")
                                .toLowerCase()
                                .includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
                            }
                            value={itemMeasurement}
                            options={options
                              .filter(
                                (res) => res.opt_category === "Measurement"
                              )
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
                              message: "Numeric value required",
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
                          message: "Item description required",
                        },
                        {
                          max: 120,
                          message:
                            "Description must be 120 characters or less.",
                        },
                      ]}
                    >
                      <Input.TextArea
                        value={itemDescription}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        disabled={checkMain()}
                      />
                    </Form.Item>
                    <div
                      className="space-between-row"
                      style={{ paddingTop: "24px" }}
                    >
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
                      <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        block
                      >
                        SAVE
                      </Button>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div
                    className="card-with-background"
                    style={{ padding: "24px" }}
                  >
                    <Steps
                      current={step}
                      direction="vertical"
                      items={[
                        {
                          title: "Item Name",
                          description: itemName === "" ? " " : itemName,
                          status: itemName === "" ? "error" : "finish",
                        },
                        {
                          title: "Unit Cost",
                          description: itemCost < 1 ? " " : itemCost,
                          status: itemCost < 1 ? "error" : "finish",
                        },
                        {
                          title: "Category",
                          description: itemCategory === "" ? " " : itemCategory,
                          status: itemCategory === "" ? "error" : "finish",
                        },
                        {
                          title: "Unit Of Measurement",
                          description:
                            itemMeasurement === "" ? " " : itemMeasurement,
                          status: itemMeasurement === "" ? "error" : "finish",
                        },
                        {
                          title: "Location",
                          description: itemLocation === "" ? " " : itemLocation,
                          status: itemLocation === "" ? "error" : "finish",
                        },
                        {
                          title: "Reorder Quantity",
                          description: itemReorder < 1 ? " " : itemReorder,
                          status: itemReorder < 1 ? "error" : "finish",
                        },
                        {
                          title: "Description",
                          description:
                            itemDescription === "" ? " " : itemDescription,
                          status: itemDescription === "" ? "error" : "finish",
                        },
                      ]}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddUpdateItem;
