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
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ResultEvent from "./ResultEvent";
import Spinner from "../components/Spinner";

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
  const [loading, setLoading] = useState(false);
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
    setSuccess(false);
    setLabel("Add New Item");
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

  const checkMain = () => {
    var main = true;
    if (sectionCategory === "main") {
      main = false;
    }
    return main;
  };

  const updateField = (value, req, step) => {
    const fieldMap = {
      1: [setItemName, setNameReq, setStep],
      2: [setItemCost, setCostReq, setStep],
      3: [setItemCategory, setCategoryReq, setStep],
      4: [setItemMeasurement, setMeasurementReq, setStep],
      5: [setItemLocation, setLocationReq, setStep],
      6: [setItemReorder, setReorderReq, setStep],
      7: [setItemDescription, setDescriptionReq, setStep],
    };
    const [updateState, setReqState, setStepState] = fieldMap[step];
    updateState(value);
    setReqState(req);
    setStepState(step);
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
        setLoading(false);
        setSuccess(true);
      })
      .catch(() => {
        setLoading(false);
        setSuccess(false);
      });
  };

  const createItem = () => {
    setSubmit(true);
    setLoading(true);
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
        setItemCode("ITM" + response.data["id"]);
        createWarehouseItem(
          "ITM" + response.data["id"],
          sectionCode,
          itemLocation,
          itemOnHand
        );
      })
      .catch(() => {
        setLoading(false);
        setSuccess(false);
      });
  };

  const { mutate } = useMutation(createItem);

  const onFinish = () => {
    mutate();
  };

  return (
    <>
      {submit ? (
        loading ? (
          <Spinner height={"60%"} theme={theme} />
        ) : (
          <ResultEvent
            icon={success ? <CheckOutlined /> : <CloseOutlined />}
            status={success ? "success" : "error"}
            title={
              success
                ? updateData
                  ? "Successfully updated item."
                  : "Successfully added new item."
                : updateData
                ? "Failed to update item."
                : "Failed to add new item."
            }
            subTitle={
              success
                ? "Item name " + itemName + " with code " + itemCode
                : "System error."
            }
            extra={
              <Row className="space-between-row">
                <Col span={12}>
                  <Button
                    type="default"
                    onClick={() => {
                      onCloseDrawer();
                      queryClient.invalidateQueries("items");
                      queryClient.invalidateQueries("warehouseitems");
                    }}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
                <Col span={12} style={{ paddingLeft: "10px" }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      newItem();
                    }}
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
        )
      ) : (
        <div className="justified-row" style={{ paddingTop: "12px" }}>
          <div className="card-custom-size-full">
            <Form
              {...layout}
              layout="vertical"
              name="add-new-item"
              onFinish={onFinish}
            >
              <Card
                title={
                  <Title>
                    <p className="big-card-title">{label}</p>
                  </Title>
                }
              >
                <Row>
                  <Col span={16} style={{ paddingRight: "24px" }}>
                    <div
                      className=" card-with-background"
                      style={{ padding: "24px" }}
                    >
                      <Row>
                        <Col
                          span={14}
                          style={{
                            paddingRight: "24px",
                          }}
                        >
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
                              onChange={(e) =>
                                updateField(e.target.value, true, 1)
                              }
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
                                .filter(
                                  (res) => res.opt_category === "Item Category"
                                )
                                .map((cat) => {
                                  return {
                                    value: cat.opt_name,
                                    label: cat.opt_name,
                                  };
                                })}
                              onChange={(value) => updateField(value, true, 3)}
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
                              onChange={(e) =>
                                updateField(e.target.value, true, 5)
                              }
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
                              onChange={(value) => updateField(value, true, 2)}
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
                              onChange={(value) => updateField(value, true, 4)}
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
                              onChange={(value) => updateField(value, true, 6)}
                              disabled={checkMain()}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
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
                          onChange={(e) => updateField(e.target.value, true, 7)}
                          disabled={checkMain()}
                        />
                      </Form.Item>
                      <div
                        className="space-between-row"
                        style={{ paddingTop: "24px" }}
                      >
                        <Button
                          type="default"
                          onClick={() => {
                            onCloseDrawer();
                            queryClient.invalidateQueries("items");
                            queryClient.invalidateQueries("warehouseitems");
                          }}
                          block
                        >
                          CANCEL
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{
                            marginLeft: "10px",
                          }}
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
                            description: itemName === "" ? "Empty" : itemName,
                            status: itemName === "" ? "error" : "finish",
                          },
                          {
                            title: "Unit Cost",
                            description: itemCost < 1 ? "Empty" : itemCost,
                            status: itemCost < 1 ? "error" : "finish",
                          },
                          {
                            title: "Category",
                            description:
                              itemCategory === "" ? "Empty" : itemCategory,
                            status: itemCategory === "" ? "error" : "finish",
                          },
                          {
                            title: "Unit Of Measurement",
                            description:
                              itemMeasurement === ""
                                ? "Empty"
                                : itemMeasurement,
                            status: itemMeasurement === "" ? "error" : "finish",
                          },
                          {
                            title: "Location",
                            description:
                              itemLocation === "" ? "Empty" : itemLocation,
                            status: itemLocation === "" ? "error" : "finish",
                          },
                          {
                            title: "Reorder Quantity",
                            description:
                              itemReorder < 1 ? "Empty" : itemReorder,
                            status: itemReorder < 1 ? "error" : "finish",
                          },
                          {
                            title: "Description",
                            description:
                              itemDescription === ""
                                ? "Empty"
                                : itemDescription,
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
      )}
    </>
  );
};

export default AddUpdateItem;
