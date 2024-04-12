import React, { useState } from "react";
import { useCustomQueryClient } from "../useQueryClient";
import { useMutation } from "react-query";
import axios from "axios";
import {
  Typography,
  Button,
  Form,
  Input,
  DatePicker,
  Card,
  Select,
  Col,
  Row,
  Steps,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ResultEvent from "./ResultEvent";
import Spinner from "../components/Spinner";
import moment from "moment";

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const AddUpdateAsset = ({
  options,
  update,
  code,
  category,
  type,
  model,
  serial,
  plate,
  area,
  sector,
  stat,
  datepurchased,
  onCloseDrawer,
  theme,
}) => {
  const queryClient = useCustomQueryClient();
  const dateFormat = "YYYY-MM-DD";
  const displayDateFormat = "MMMM DD, YYYY";
  const datePickerFormat = (value) => `${value.format("MMMM DD, YYYY")}`;
  const [updateData, setUpdateData] = useState(update);
  const [step, setStep] = useState(updateData ? 10 : 0);
  const [label, setLabel] = useState(
    updateData ? "Update Asset" : "Add New Asset"
  );
  const [assetCode, setAssetCode] = useState(code);
  const [assetCategory, setAssetCategory] = useState(
    updateData ? category : ""
  );
  const [assetType, setAssetType] = useState(updateData ? type : "");
  const [assetModel, setAssetModel] = useState(updateData ? model : "");
  const [assetSerial, setAssetSerial] = useState(updateData ? serial : "");
  const [assetPlate, setAssetPlate] = useState(updateData ? plate : "");
  const [assetArea, setAssetArea] = useState(updateData ? area : "");
  const [assetSector, setAssetSetor] = useState(updateData ? sector : "");
  const [assetStatus, setAssetStatus] = useState(updateData ? stat : "");
  const [assetDatePurchased, setAssetDatePurchased] = useState(
    updateData ? moment(datepurchased).format(displayDateFormat) : ""
  );
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [codeReq, setCodeReq] = useState(false);
  const [categoryReq, setCategoryReq] = useState(false);
  const [typeReq, setTypeReq] = useState(false);
  const [modelReq, setModelReq] = useState(false);
  const [serialReq, setSerialReq] = useState(false);
  const [plateReq, setPlateReq] = useState(false);
  const [areaReq, setAreaReq] = useState(false);
  const [sectorReq, setSectorReq] = useState(false);
  const [statusReq, setStatusReq] = useState(false);
  const [datepurchasedReq, setDatepurchasedReq] = useState(false);

  const newAsset = () => {
    setUpdateData(false);
    setSubmit(false);
    setSuccess(false);
    setLabel("Add New Asset");
    setAssetCode("");
    setAssetCategory("");
    setAssetType("");
    setAssetModel("");
    setAssetSerial("");
    setAssetPlate("");
    setAssetArea("");
    setAssetSetor("");
    setAssetStatus("");
    setAssetDatePurchased("");
    setCodeReq(true);
    setCategoryReq(true);
    setTypeReq(true);
    setModelReq(true);
    setSerialReq(true);
    setPlateReq(true);
    setAreaReq(true);
    setSectorReq(true);
    setStatusReq(true);
    setDatepurchasedReq(true);
  };

  const updateField = (value, req, step) => {
    const fieldMap = {
      1: [setAssetCode, setCodeReq, setStep],
      2: [setAssetCategory, setCategoryReq, setStep],
      3: [setAssetType, setTypeReq, setStep],
      4: [setAssetModel, setModelReq, setStep],
      5: [setAssetSerial, setSerialReq, setStep],
      6: [setAssetPlate, setPlateReq, setStep],
      7: [setAssetArea, setAreaReq, setStep],
      8: [setAssetSetor, setSectorReq, setStep],
      9: [setAssetStatus, setStatusReq, setStep],
      10: [setAssetDatePurchased, setDatepurchasedReq, setStep],
    };
    const [updateState, setReqState, setStepState] = fieldMap[step];
    updateState(value);
    setReqState(req);
    setStepState(step);
  };

  const createAsset = () => {
    setSubmit(true);
    setLoading(true);
    const assetData = {
      asset_code: assetCode,
      asset_category: assetCategory,
      asset_type: assetType,
      asset_model: assetModel,
      asset_serial: assetSerial,
      asset_plate: assetPlate,
      asset_area: assetArea,
      asset_sector: assetSector,
      asset_status: assetStatus,
      asset_purchased: moment(assetDatePurchased).format(dateFormat),
    };
    const token = sessionStorage.getItem("token");
    axios({
      method: updateData ? "PATCH" : "POST",
      url: `${process.env.REACT_APP_API_URL}/api/asset`,
      data: assetData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        setAssetCode("AST" + response.data["id"]);
        setLoading(false);
        setSuccess(true);
      })
      .catch(() => {
        setLoading(false);
        setSuccess(false);
      });
  };

  const { mutate } = useMutation(createAsset);

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
                  ? "Successfully updated asset."
                  : "Successfully added new asset."
                : updateData
                ? "Failed to update asset."
                : "Failed to add new asset."
            }
            subTitle={success ? "Asset code " + assetCode : "System error."}
            extra={
              <Row className="space-between-row">
                <Col span={12}>
                  <Button
                    type="default"
                    onClick={() => {
                      onCloseDrawer();
                      queryClient.invalidateQueries("assets");
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
                      newAsset();
                    }}
                    block
                  >
                    NEW ASSET
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
              name="add-new-asset"
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
                      <Form.Item
                        name={["code"]}
                        label="Asset Code"
                        initialValue={assetCode}
                        rules={[
                          {
                            required: updateData ? codeReq : true,
                            message: "Asset code required",
                          },
                        ]}
                      >
                        <Input
                          value={assetCode}
                          readOnly
                          maxLength={50}
                          onChange={(e) => updateField(e.target.value, true, 1)}
                        />
                      </Form.Item>
                      <Row>
                        <Col
                          span={14}
                          style={{
                            paddingRight: "24px",
                          }}
                        >
                          <Form.Item
                            name={["category"]}
                            label="Category"
                            initialValue={assetCategory}
                            rules={[
                              {
                                required: updateData ? categoryReq : true,
                                message: "Asset category required",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              style={{ width: "100%" }}
                              value={assetCategory}
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
                              options={options
                                .filter(
                                  (res) => res.opt_category === "Asset Category"
                                )
                                .map((sal) => {
                                  return {
                                    value: sal.opt_name,
                                    label: sal.opt_name,
                                  };
                                })}
                              onChange={(value) => updateField(value, true, 2)}
                            />
                          </Form.Item>
                          <Form.Item
                            name={["model"]}
                            label="Model"
                            initialValue={assetModel}
                            rules={[
                              {
                                required: updateData ? modelReq : true,
                                message: "Asset model required",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              style={{ width: "100%" }}
                              value={assetModel}
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
                              options={options
                                .filter(
                                  (res) => res.opt_category === "Asset Model"
                                )
                                .map((sal) => {
                                  return {
                                    value: sal.opt_name,
                                    label: sal.opt_name,
                                  };
                                })}
                              onChange={(value) => updateField(value, true, 4)}
                            />
                          </Form.Item>
                          <Form.Item
                            name={["plate"]}
                            label="Plate Number"
                            initialValue={assetPlate}
                            rules={[
                              {
                                required: updateData ? plateReq : true,
                                message: "Asset plate number required",
                              },
                            ]}
                          >
                            <Input
                              value={assetPlate}
                              maxLength={100}
                              onChange={(e) =>
                                updateField(e.target.value, true, 6)
                              }
                            />
                          </Form.Item>
                          <Form.Item
                            name={["sector"]}
                            label="Sector"
                            initialValue={assetSector}
                            rules={[
                              {
                                required: updateData ? sectorReq : true,
                                message: "Asset sector required",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              style={{ width: "100%" }}
                              value={assetSector}
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
                              options={options
                                .filter(
                                  (res) => res.opt_category === "Asset Sector"
                                )
                                .map((sal) => {
                                  return {
                                    value: sal.opt_name,
                                    label: sal.opt_name,
                                  };
                                })}
                              onChange={(value) => updateField(value, true, 8)}
                            />
                          </Form.Item>
                          <Form.Item
                            name={["datepurchased"]}
                            label="Date Purchased"
                            initialValue={
                              assetDatePurchased === ""
                                ? ""
                                : moment(assetDatePurchased)
                            }
                            rules={[
                              {
                                required: updateData ? datepurchasedReq : true,
                                message: "Date purchased required",
                              },
                            ]}
                          >
                            <DatePicker
                              placeholder=""
                              format={datePickerFormat}
                              value={
                                assetDatePurchased === ""
                                  ? ""
                                  : moment(assetDatePurchased)
                              }
                              onChange={(value) => updateField(value, true, 10)}
                              inputReadOnly
                            />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            name={["type"]}
                            label="Type"
                            initialValue={assetType}
                            rules={[
                              {
                                required: updateData ? typeReq : true,
                                message: "Asset type required",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              style={{ width: "100%" }}
                              value={assetType}
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
                              options={options
                                .filter(
                                  (res) => res.opt_category === "Asset Type"
                                )
                                .map((sal) => {
                                  return {
                                    value: sal.opt_name,
                                    label: sal.opt_name,
                                  };
                                })}
                              onChange={(value) => updateField(value, true, 3)}
                            />
                          </Form.Item>
                          <Form.Item
                            name={["serial"]}
                            label="Serial"
                            initialValue={assetSerial}
                            rules={[
                              {
                                required: updateData ? serialReq : true,
                                message: "Asset serial required",
                              },
                            ]}
                          >
                            <Input
                              value={assetSerial}
                              maxLength={100}
                              onChange={(e) =>
                                updateField(e.target.value, true, 5)
                              }
                            />
                          </Form.Item>
                          <Form.Item
                            name={["area"]}
                            label="Area"
                            initialValue={assetArea}
                            rules={[
                              {
                                required: updateData ? areaReq : true,
                                message: "Asset area required",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              style={{ width: "100%" }}
                              value={assetArea}
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
                              options={options
                                .filter(
                                  (res) => res.opt_category === "Asset Area"
                                )
                                .map((sal) => {
                                  return {
                                    value: sal.opt_name,
                                    label: sal.opt_name,
                                  };
                                })}
                              onChange={(value) => updateField(value, true, 7)}
                            />
                          </Form.Item>
                          <Form.Item
                            name={["status"]}
                            label="Status"
                            initialValue={assetStatus}
                            rules={[
                              {
                                required: updateData ? statusReq : true,
                                message: "Asset status required",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              style={{ width: "100%" }}
                              value={assetStatus}
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
                              options={options
                                .filter(
                                  (res) => res.opt_category === "Asset Status"
                                )
                                .map((sal) => {
                                  return {
                                    value: sal.opt_name,
                                    label: sal.opt_name,
                                  };
                                })}
                              onChange={(value) => updateField(value, true, 9)}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <div
                        className="space-between-row"
                        style={{ paddingTop: "24px" }}
                      >
                        <Button
                          type="default"
                          onClick={() => {
                            onCloseDrawer();
                            queryClient.invalidateQueries("assets");
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
                            title: "Asset Code",
                            description: assetCode === "" ? "Empty" : assetCode,
                            status: assetCode === "" ? "error" : "finish",
                          },
                          {
                            title: "Category",
                            description:
                              assetCategory === "" ? "Empty" : assetCategory,
                            status: assetCategory === "" ? "error" : "finish",
                          },
                          {
                            title: "Type",
                            description: assetType === "" ? "Empty" : assetType,
                            status: assetType === "" ? "error" : "finish",
                          },
                          {
                            title: "Model",
                            description:
                              assetModel === "" ? "Empty" : assetModel,
                            status: assetModel === "" ? "error" : "finish",
                          },
                          {
                            title: "Serial",
                            description:
                              assetSerial === "" ? "Empty" : assetSerial,
                            status: assetSerial === "" ? "error" : "finish",
                          },

                          {
                            title: "Plate",
                            description:
                              assetPlate === "" ? "Empty" : assetPlate,
                            status: assetPlate === "" ? "error" : "finish",
                          },
                          {
                            title: "Area",
                            description: assetArea === "" ? "Empty" : assetArea,
                            status: assetArea === "" ? "error" : "finish",
                          },
                          {
                            title: "Sector",
                            description:
                              assetSector === "" ? "Empty" : assetSector,
                            status: assetSector === "" ? "error" : "finish",
                          },
                          {
                            title: "Status",
                            description:
                              assetStatus === "" ? "Empty" : assetStatus,
                            status: assetStatus === "" ? "error" : "finish",
                          },
                          {
                            title: "Date Purchased",
                            description: moment(
                              assetDatePurchased,
                              displayDateFormat,
                              true
                            ).isValid()
                              ? moment(assetDatePurchased).format(
                                  displayDateFormat
                                )
                              : "Invalid date",
                            status: moment(
                              assetDatePurchased,
                              displayDateFormat,
                              true
                            ).isValid()
                              ? "finish"
                              : "error",
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

export default AddUpdateAsset;
