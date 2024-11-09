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
  InputNumber,
} from "antd";
import {
  FormOutlined,
  FileDoneOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import Diagnosis from "./Diagnosis";
import Operation from "./Operation";
import moment from "moment";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const AddUpdateWorkorder = ({
  userId,
  employees,
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
  sectionCode,
  onCloseDrawer,
  theme,
}) => {
  const displayDateFormat = "MMMM DD, YYYY HH:mm:ss";
  const [updateData, setUpdateData] = useState(update);
  const [assetCode, setAssetCode] = useState(updateData ? code : "");
  const [assetKilometer, setAssetKilometer] = useState(
    updateData ? kilometer : ""
  );
  const [assetCheckindate, setAssetCheckinDate] = useState(
    updateData
      ? moment(checkindate).format(displayDateFormat)
      : moment().format(displayDateFormat)
  );
  const [workorderType, setWorkorderType] = useState(updateData ? type : "");
  const [workorderStatus, setWorkorderStatus] = useState(
    updateData ? status : "Checked-in"
  );
  const workshopCode = sectionCode;
  const [technician, setTechnician] = useState("");
  const [scheduler, setScheduler] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [label, setLabel] = useState(
    updateData ? "Update Workorder" : "Add New Workorder"
  );
  const [codeReq, setCodeReq] = useState(false);
  const [kilometerReq, setKilometerReq] = useState(false);
  const [typeReq, setTypeReq] = useState(false);
  const [current, setCurrent] = useState(0);
  const [empty, setEmpty] = useState(false);

  const onChangeStep = (value) => {
    setCurrent(value);
  };

  const updateField = (value, req, step) => {
    const fieldMap = {
      1: [setAssetCode, setCodeReq],
      2: [setAssetKilometer, setKilometerReq],
      3: [setWorkorderType, setTypeReq],
    };
    const [updateState, setReqState] = fieldMap[step];
    updateState(value);
    setReqState(req);
  };

  const onFinish = () => {
    if (diagnosis !== "") {
      console.log(technician, scheduler, supervisor, diagnosis);
      onChangeStep(1);
    } else {
      setEmpty(true);
      console.log("empty");
    }
  };

  const steps = [
    {
      title: (
        <Button
          className="btn-step"
          type="primary"
          icon={<FormOutlined style={{ fontSize: "22px" }} />}
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
            <div style={{ padding: "24px", paddingTop: "24px" }}>
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
                  onChange={(value) => updateField(value, true, 1)}
                />
              </Form.Item>
              <Row style={{ paddingBottom: "8px" }}>
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
                      onChange={(value) => updateField(value, true, 3)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Diagnosis
                employees={employees}
                userId={userId}
                technician={technician}
                scheduler={scheduler}
                supervisor={supervisor}
                diagnosis={diagnosis}
                setTechnician={setTechnician}
                setScheduler={setScheduler}
                setSupervisor={setSupervisor}
                setDiagnosis={setDiagnosis}
                empty={empty}
                setEmpty={setEmpty}
                theme={theme}
              />
              <div className="space-between-row" style={{ paddingTop: "42px" }}>
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
          icon={<ToolOutlined style={{ fontSize: "22px" }} />}
        >
          Operation
        </Button>
      ),
      content: (
        <>
          <div style={{ paddingTop: "4px" }}>
            <Operation
              theme={theme}
              employees={employees}
              userId={userId}
              operations={operations}
            />
          </div>
        </>
      ),
      icon: <></>,
    },
    {
      title: (
        <Button
          className="btn-step"
          type="primary"
          icon={<FileDoneOutlined style={{ fontSize: "22px" }} />}
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
      title: "Workshop Code",
      description: workshopCode,
    },
    {
      title: "Check-in Date",
      description: assetCheckindate,
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
      <div className="justified-row" style={{ paddingTop: "10px" }}>
        <div className="card-custom-size-full">
          <Card
            className="custom-card-head-title"
            style={{ minHeight: "100vh" }}
            title={
              <Steps
                type="navigation"
                current={current}
                items={items}
                style={{ width: "60%" }}
                onChange={onChangeStep}
              />
            }
          >
            <Row>
              <Col span={16}>
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
                    {workorderStatus}
                  </Tag>
                  <List
                    style={{ paddingTop: "14px" }}
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
                    style={{ paddingTop: "14px" }}
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
                  <p className="medium-font" style={{ paddingTop: "8px" }}>
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
