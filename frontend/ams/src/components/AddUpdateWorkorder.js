import React, { useState } from "react";
import {
  Typography,
  Button,
  Form,
  Card,
  Col,
  Row,
  Select,
  Steps,
  Tag,
  List,
  Divider,
  DatePicker,
  Input,
  InputNumber,
} from "antd";
import {
  FormOutlined,
  FileDoneOutlined,
  ToolOutlined,
} from "@ant-design/icons";
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

const AddUpdateWorkorder = ({
  assets,
  options,
  workorders,
  operations,
  operationtypes,
  workorderoperations,
  operationtechnicians,
  operationitems,
  code,
  kilometer,
  checkindate,
  type,
  status,
  update,
  onCloseDrawer,
  theme,
}) => {
  const displayDateFormat = "MMMM DD, YYYY";
  const datePickerFormat = (value) =>
    `${value.format(displayDateFormat + " HH:mm:ss")}`;
  const [updateData, setUpdateData] = useState(update);
  const [assetCode, setAssetCode] = useState(updateData ? code : "");
  const [assetKilometer, setAssetKilometer] = useState(
    updateData ? kilometer : ""
  );
  const [assetCheckindate, setAssetCheckinDate] = useState(
    updateData ? moment(checkindate).format(displayDateFormat) : moment()
  );
  const [workorderType, setWorkorderType] = useState(updateData ? type : "");
  const [workorderStatus, setWorkorderStatus] = useState(
    updateData ? status : ""
  );
  const [label, setLabel] = useState(
    updateData ? "Update Workorder" : "Add New Workorder"
  );
  const [codeReq, setCodeReq] = useState(false);
  const [kilometerReq, setKilometerReq] = useState(false);
  const [checkindateReq, setCheckindateReq] = useState(false);
  const [typeReq, setTypeReq] = useState(false);
  const [statusReq, setStatusReq] = useState(false);
  const [current, setCurrent] = useState(0);

  const onChange = (value) => {
    setCurrent(value);
  };

  const updateField = (value, req, step) => {
    const fieldMap = {
      1: [setAssetCode, setCodeReq],
      2: [setAssetKilometer, setKilometerReq],
      3: [setAssetCheckinDate, setCheckindateReq],
      4: [setWorkorderType, setTypeReq],
      5: [setWorkorderStatus, setStatusReq],
    };
    const [updateState, setReqState] = fieldMap[step];
    updateState(value);
    setReqState(req);
  };

  const onFinish = () => {
    console.log("hello");
  };

  const steps = [
    {
      title: (
        <Button
          className="btn-step"
          type="primary"
          icon={<FormOutlined style={{ fontSize: "30px" }} />}
        >
          Reception
        </Button>
      ),
      content: (
        <>
          <Form
            {...layout}
            layout="vertical"
            name="reception-data"
            onFinish={onFinish}
          >
            <div
              className=" card-with-background"
              style={{ padding: "24px", paddingTop: "48px" }}
            >
              <Form.Item
                name={["assetcode"]}
                label="Asset Code"
                initialValue={assetCode}
                rules={[
                  {
                    required: updateData ? codeReq : true,
                    message: "Asset code required",
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  value={assetCode}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={assets.map((ass) => {
                    return {
                      value: ass.asset_code,
                      label: ass.asset_code,
                    };
                  })}
                  onChange={(value) => updateField(value, 1)}
                />
              </Form.Item>
              <Row>
                <Col
                  span={12}
                  style={{
                    paddingRight: "8px",
                  }}
                >
                  <Form.Item
                    name={["kilometer"]}
                    label="Kilometer"
                    initialValue={assetKilometer}
                    rules={[
                      {
                        required: updateData ? kilometerReq : true,
                        message: "Numeric value required",
                        type: "number",
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={1000000}
                      value={assetKilometer}
                      onChange={(value) => updateField(value, true, 2)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["checkindate"]}
                    label="Check-in Date"
                    initialValue={assetCheckindate}
                    rules={[
                      {
                        required: updateData ? checkindateReq : true,
                        message: "Check-in date required",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder=""
                      format={datePickerFormat}
                      value={assetCheckindate}
                      onChange={(value) => updateField(value, true, 3)}
                      inputReadOnly
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col
                  span={12}
                  style={{
                    paddingRight: "8px",
                  }}
                >
                  <Form.Item
                    name={["workorderType"]}
                    label="Workorder Type"
                    initialValue={workorderType}
                    rules={[
                      {
                        required: updateData ? typeReq : true,
                        message: "Workorder type required",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      value={assetCode}
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={options
                        .filter((res) => res.opt_category === "Workorder Type")
                        .map((typ) => {
                          return {
                            value: typ.opt_name,
                            label: typ.opt_name,
                          };
                        })}
                      onChange={(value) => updateField(value, 4)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["status"]}
                    label="Status"
                    initialValue={workorderStatus}
                    rules={[
                      {
                        required: updateData ? statusReq : true,
                        message: "Workorder status required",
                      },
                    ]}
                  >
                    <Input
                      value={workorderStatus}
                      maxLength={50}
                      onChange={(e) => updateField(e.target.value, true, 5)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div className="space-between-row" style={{ paddingTop: "24px" }}>
                <Button
                  type="default"
                  onClick={() => {
                    onCloseDrawer();
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
                  SAVE
                </Button>
              </div>
            </div>
          </Form>
        </>
      ),
      icon: <></>,
    },
    {
      title: (
        <Button
          className="btn-step"
          type="primary"
          icon={<ToolOutlined style={{ fontSize: "30px" }} />}
        >
          Workshop
        </Button>
      ),
      content: "Workshop",
      icon: <></>,
    },
    {
      title: (
        <Button
          className="btn-step"
          type="primary"
          icon={<FileDoneOutlined style={{ fontSize: "30px" }} />}
        >
          Invoiced
        </Button>
      ),
      content: "Invoiced",
      icon: <></>,
    },
  ];

  const data = [
    {
      title: "Asset Code",
      description: "9857",
    },
    {
      title: "Kilometer",
      description: "587568",
    },
    {
      title: "Workorder Type",
      description: "Maintenance",
    },
    {
      title: "Workshop Code",
      description: "DAMWORKSHOP",
    },
  ];

  const costs = [
    {
      title: "Labor Cost",
      description: "9,857.00",
    },
    {
      title: "Material Cost",
      description: "58,7568.00",
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
    status: item.status,
    icon: item.icon,
  }));

  const contentStyle = {
    lineHeight: "260px",
    textAlign: "center",
    backgroundColor: theme === "light" ? "#fff" : "#182348",
  };

  return (
    <>
      <div className="justified-row" style={{ paddingTop: "12px" }}>
        <div className="card-custom-size-full">
          <Card
            title={
              <Title>
                <p className="big-card-title">{label}</p>
              </Title>
            }
          >
            <Row>
              <Col span={16}>
                <Steps
                  className="card-with-background"
                  type="navigation"
                  current={current}
                  items={items}
                  onChange={onChange}
                />
                <div style={contentStyle}>{steps[current].content}</div>
              </Col>
              <Col span={8} style={{ paddingLeft: "24px" }}>
                <div
                  className="card-with-background"
                  style={{ padding: "24px" }}
                >
                  <p
                    className="medium-card-title"
                    style={{ paddingBottom: "8px" }}
                  >
                    WRK1585
                  </p>
                  <Tag className="small-font" color="blue">
                    Under repair
                  </Tag>
                  <List
                    style={{ paddingTop: "8px" }}
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.title}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                  <Divider />
                  <p className="small-font" style={{ paddingTop: "8px" }}>
                    Total Operations 8
                  </p>
                  <List
                    style={{ paddingTop: "8px" }}
                    itemLayout="horizontal"
                    dataSource={costs}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.title}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                  <Divider />
                  <p
                    className="small-font"
                    style={{ paddingTop: "8px", fontWeight: "600" }}
                  >
                    Total Cost 68,705.50
                  </p>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AddUpdateWorkorder;
