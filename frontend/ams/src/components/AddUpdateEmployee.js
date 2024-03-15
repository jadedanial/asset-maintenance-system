import React, { useState } from "react";
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
} from "antd";
import { CheckOutlined } from "@ant-design/icons";
import ResultEvent from "./ResultEvent";
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

const AddUpdateEmployee = ({
  sections,
  options,
  update,
  id,
  name,
  birthdate,
  nationality,
  address,
  email,
  phone,
  datehired,
  position,
  salary,
  section,
  getSection,
  onCloseDrawer,
  theme,
}) => {
  const dateFormat = "YYYY-MM-DD";
  const datePickerFormat = (value) => `${value.format("MMMM DD, YYYY")}`;
  const [updateData, setUpdateData] = useState(update);
  const [label, setLabel] = useState(
    updateData ? "Update Employee" : "Add New Employee"
  );
  const [color, setColor] = useState("#318ce7");
  const [employeeID, setEmployeeID] = useState(updateData ? id : "");
  const [employeeName, setEmployeeName] = useState(updateData ? name : "");
  const [employeeBirthdate, setEmployeeBirthdate] = useState(
    updateData ? birthdate : ""
  );
  const [employeeNationality, setEmployeeNationality] = useState(
    updateData ? nationality : ""
  );
  const [employeeAddress, setEmployeeAddress] = useState(
    updateData ? address : ""
  );
  const [employeeEmail, setEmployeeEmail] = useState(updateData ? email : "");
  const [employeePhone, setEmployeePhone] = useState(updateData ? phone : "");
  const [employeeDateHired, setEmployeeDateHired] = useState(
    updateData ? datehired : ""
  );
  const [employeePosition, setEmployeePosition] = useState(
    updateData ? position : ""
  );
  const [employeeSalary, setEmployeeSalary] = useState(
    updateData ? salary : ""
  );
  const [employeeSection, setEmployeeSection] = useState(
    updateData ? section : ""
  );
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nameReq, setNameReq] = useState(false);
  const [birthdateReq, setBirthdateReq] = useState(false);
  const [nationalityReq, setNationalityReq] = useState(false);
  const [addressReq, setAddressReq] = useState(false);
  const [emailReq, setEmailReq] = useState(false);
  const [phoneReq, setPhoneReq] = useState(false);
  const [datehiredReq, setDateHiredReq] = useState(false);
  const [positionReq, setPositionReq] = useState(false);
  const [salaryReq, setSalaryReq] = useState(false);
  const [sectionReq, setSectionReq] = useState(false);

  const newEmployee = () => {
    setUpdateData(false);
    setSubmit(false);
    setLabel("Add New Employee");
    setColor("#318ce7");
    setEmployeeID("");
    setEmployeeName("");
    setEmployeeBirthdate("");
    setEmployeeNationality("");
    setEmployeeAddress("");
    setEmployeeEmail("");
    setEmployeePhone("");
    setEmployeeDateHired("");
    setEmployeePosition("");
    setEmployeeSalary("");
    setEmployeeSection("");
    setNameReq(true);
    setBirthdateReq(true);
    setNationalityReq(true);
    setAddressReq(true);
    setEmailReq(true);
    setPhoneReq(true);
    setDateHiredReq(true);
    setPositionReq(true);
    setSalaryReq(true);
    setSectionReq(true);
  };

  const changeLabel = () => {
    setLabel(updateData ? "Update Employee" : "Add New Employee");
    setColor("#318ce7");
  };

  const onNameChange = (value) => {
    setEmployeeName(value);
    setNameReq(true);
    changeLabel();
  };

  const onBirthdateChange = (value) => {
    setEmployeeBirthdate(value);
    setBirthdateReq(true);
    changeLabel();
  };

  const onNationalityChange = (value) => {
    setEmployeeNationality(value);
    setNationalityReq(true);
    changeLabel();
  };

  const onAddressChange = (value) => {
    setEmployeeAddress(value);
    setAddressReq(true);
    changeLabel();
  };

  const onEmailChange = (value) => {
    setEmployeeEmail(value);
    setEmailReq(true);
    changeLabel();
  };

  const onPhoneChange = (value) => {
    setEmployeePhone(value);
    setPhoneReq(true);
    changeLabel();
  };

  const onDateHiredChange = (value) => {
    setEmployeeDateHired(value);
    setDateHiredReq(true);
    changeLabel();
  };

  const onPositionChange = (value) => {
    setEmployeePosition(value);
    setPositionReq(true);
    changeLabel();
  };

  const onSalaryChange = (value) => {
    setEmployeeSalary(value);
    setSalaryReq(true);
    changeLabel();
  };

  const onSectionChange = (value) => {
    setEmployeeSection(value);
    setSectionReq(true);
    changeLabel();
  };

  const onFinish = () => {
    setSubmit(true);
    changeLabel();
    var employeeData = {
      emp_id: employeeID,
      emp_name: employeeName,
      emp_bdate: moment(employeeBirthdate).format(dateFormat),
      emp_nation: employeeNationality,
      emp_address: employeeAddress,
      emp_email: employeeEmail,
      emp_phone: employeePhone,
      emp_hired: moment(employeeDateHired).format(dateFormat),
      emp_position: employeePosition,
      emp_salary: employeeSalary,
      emp_section: employeeSection,
    };
    const token = sessionStorage.getItem("token");
    axios({
      method: updateData ? "PATCH" : "POST",
      url: `${process.env.REACT_APP_API_URL}/api/employee`,
      data: employeeData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        setEmployeeID(response.data["emp_id"]);
        if (updateData) {
          getSection();
        }
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err.response.data[0]);
        setSuccess(false);
        setLabel(err.response.data[0]);
        setColor("#ff0000");
      });
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
                ? "Successfully updated Employee."
                : "Successfully added new Employee."
            }
            subTitle={
              "Employee name " + employeeName + " with ID " + employeeID
            }
            extra={
              <Row className="space-between-row" style={{ width: "40%" }}>
                <Col span={12}>
                  <Button
                    size="large"
                    type="default"
                    onClick={onCloseDrawer}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
                <Col span={11}>
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => newEmployee()}
                    block
                  >
                    NEW EMPLOYEE
                  </Button>
                </Col>
              </Row>
            }
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
            name="add-new-employee"
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
              <Form.Item
                name={["name"]}
                label="Employee Name"
                initialValue={employeeName}
                rules={[
                  {
                    required: updateData ? nameReq : true,
                    message: "Required!",
                  },
                ]}
              >
                <Input
                  value={employeeName}
                  maxLength={50}
                  onChange={(e) => onNameChange(e.target.value)}
                />
              </Form.Item>
              <div className="space-between-row">
                <Col span={14}>
                  <Form.Item
                    name={["salary"]}
                    label="Monthly Salary"
                    initialValue={employeeSalary}
                    rules={[
                      {
                        required: updateData ? salaryReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      style={{ width: "100%" }}
                      value={employeeSalary}
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      options={options
                        .filter((res) => res.opt_category === "Salary")
                        .map((sal) => {
                          return {
                            value: sal.opt_name,
                            label: sal.opt_name,
                          };
                        })}
                      onChange={onSalaryChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["position"]}
                    label="Position"
                    initialValue={employeePosition}
                    rules={[
                      {
                        required: updateData ? positionReq : true,
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
                      value={employeePosition}
                      options={options
                        .filter((res) => res.opt_category === "Position")
                        .map((pos) => {
                          return {
                            value: pos.opt_name,
                            label: pos.opt_name,
                          };
                        })}
                      onChange={onPositionChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["address"]}
                    label="Address"
                    initialValue={employeeAddress}
                    rules={[
                      {
                        required: updateData ? addressReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Input
                      value={employeeAddress}
                      maxLength={100}
                      onChange={(e) => onAddressChange(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["email"]}
                    label="Email"
                    initialValue={employeeEmail}
                    rules={[
                      {
                        type: "email",
                        message: "Invalid!",
                      },
                      {
                        required: updateData ? emailReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Input
                      value={employeeEmail}
                      maxLength={100}
                      onChange={(e) => onEmailChange(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name={["datehired"]}
                    label="Date Hired"
                    initialValue={
                      employeeDateHired === "" ? "" : moment(employeeDateHired)
                    }
                    rules={[
                      {
                        required: updateData ? datehiredReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder=""
                      format={datePickerFormat}
                      value={
                        employeeDateHired === ""
                          ? ""
                          : moment(employeeDateHired)
                      }
                      onChange={onDateHiredChange}
                      inputReadOnly
                    />
                  </Form.Item>
                  <Form.Item
                    name={["nationality"]}
                    label="Nationality"
                    initialValue={employeeNationality}
                    rules={[
                      {
                        required: updateData ? nationalityReq : true,
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
                      value={employeeNationality}
                      options={options
                        .filter((res) => res.opt_category === "Nationality")
                        .map((nat) => {
                          return {
                            value: nat.opt_name,
                            label: nat.opt_name,
                          };
                        })}
                      onChange={onNationalityChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name={["birthdate"]}
                    label="Birthdate"
                    initialValue={
                      employeeBirthdate === "" ? "" : moment(employeeBirthdate)
                    }
                    rules={[
                      {
                        required: updateData ? birthdateReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder=""
                      format={datePickerFormat}
                      value={
                        employeeBirthdate === ""
                          ? ""
                          : moment(employeeBirthdate)
                      }
                      onChange={onBirthdateChange}
                      inputReadOnly
                    />
                  </Form.Item>
                  <Form.Item
                    name={["phone"]}
                    label="Phone"
                    initialValue={employeePhone}
                    rules={[
                      {
                        required: updateData ? phoneReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Input
                      value={employeePhone}
                      maxLength={100}
                      onChange={(e) => onPhoneChange(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </div>
              <Form.Item
                name={["section"]}
                label="Section"
                initialValue={employeeSection}
                rules={[
                  {
                    required: updateData ? sectionReq : true,
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
                  value={employeeSection}
                  options={sections.map((sec) => {
                    return {
                      value: sec.section_code,
                      label: sec.section_code,
                    };
                  })}
                  onChange={onSectionChange}
                />
              </Form.Item>
              <div className="space-between-row" style={{ paddingTop: "30px" }}>
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

export default AddUpdateEmployee;
