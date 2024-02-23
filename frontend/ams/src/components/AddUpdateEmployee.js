import React, { useState, useEffect } from "react";
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
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
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

const AddUpdateEmployee = (props) => {
  const dateFormat = "YYYY-MM-DD";
  const [update, setUpdate] = useState(props.update);
  const [label, setLabel] = useState(
    update ? "Update Employee" : "Add New Employee"
  );
  const [color, setColor] = useState("#318ce7");
  const [nationalities, setNationalities] = useState([]);
  const [positions, setPositions] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [sections, setSections] = useState([]);
  const [employeeID, setEmployeeID] = useState(update ? props.id : "");
  const [employeeName, setEmployeeName] = useState(update ? props.name : "");
  const [employeeBirthdate, setEmployeeBirthdate] = useState(
    update ? props.birthdate : ""
  );
  const [employeeNationality, setEmployeeNationality] = useState(
    update ? props.nationality : ""
  );
  const [employeeAddress, setEmployeeAddress] = useState(
    update ? props.address : ""
  );
  const [employeeEmail, setEmployeeEmail] = useState(update ? props.email : "");
  const [employeePhone, setEmployeePhone] = useState(update ? props.phone : "");
  const [employeeDateHired, setEmployeeDateHired] = useState(
    update ? props.datehired : ""
  );
  const [employeePosition, setEmployeePosition] = useState(
    update ? props.position : ""
  );
  const [employeeSalary, setEmployeeSalary] = useState(
    update ? props.salary : ""
  );
  const [employeeSection, setEmployeeSection] = useState(
    update ? props.section : ""
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

  function newEmployee() {
    setUpdate(false);
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
  }

  function changeLabel() {
    setLabel(update ? "Update Employee" : "Add New Employee");
    setColor("#318ce7");
  }

  function onNameChange(value) {
    setEmployeeName(value);
    setNameReq(true);
    changeLabel();
  }

  function onBirthdateChange(value) {
    setEmployeeBirthdate(value);
    setBirthdateReq(true);
    changeLabel();
  }

  function onNationalityChange(value) {
    setEmployeeNationality(value);
    setNationalityReq(true);
    changeLabel();
  }

  function onAddressChange(value) {
    setEmployeeAddress(value);
    setAddressReq(true);
    changeLabel();
  }

  function onEmailChange(value) {
    setEmployeeEmail(value);
    setEmailReq(true);
    changeLabel();
  }

  function onPhoneChange(value) {
    setEmployeePhone(value);
    setPhoneReq(true);
    changeLabel();
  }

  function onDateHiredChange(value) {
    setEmployeeDateHired(value);
    setDateHiredReq(true);
    changeLabel();
  }

  function onPositionChange(value) {
    setEmployeePosition(value);
    setPositionReq(true);
    changeLabel();
  }

  function onSalaryChange(value) {
    setEmployeeSalary(value);
    setSalaryReq(true);
    changeLabel();
  }

  function onSectionChange(value) {
    setEmployeeSection(value);
    setSectionReq(true);
    changeLabel();
  }

  function onFinish() {
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
    axios({
      method: update ? "PATCH" : "POST",
      url: `${process.env.REACT_APP_API_URL}/api/employee`,
      data: employeeData,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        setEmployeeID(response.data["emp_id"]);
        if (update) {
          props.updateEmployeeSection();
        }
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err.response.data[0]);
        setSuccess(false);
        setLabel(err.response.data[0]);
        setColor("#ff0000");
      });
  }

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/options`,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        setNationalities(response.data);
        setPositions(response.data);
        setSalaries(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/sections`,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((response) => {
        setSections(response.data);
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
            icon={<CheckCircleOutlined style={{ color: "#318ce7" }} />}
            status="success"
            title={
              update
                ? "Successfully updated Employee."
                : "Successfully added new Employee."
            }
            subTitle={
              "Employee name " + employeeName + " with ID " + employeeID
            }
            extra={
              <Button size="large" type="primary" onClick={() => newEmployee()}>
                ADD NEW EMPLOYEE
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
              hoverable
            >
              <Form.Item
                name={["name"]}
                label="Employee Name"
                initialValue={employeeName}
                rules={[
                  {
                    required: update ? nameReq : true,
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
                        required: update ? salaryReq : true,
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
                      options={salaries
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
                        required: update ? positionReq : true,
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
                      options={positions
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
                        required: update ? addressReq : true,
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
                        required: update ? emailReq : true,
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
                        required: update ? datehiredReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder=""
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
                        required: update ? nationalityReq : true,
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
                      options={nationalities
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
                        required: update ? birthdateReq : true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder=""
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
                        required: update ? phoneReq : true,
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
                    required: update ? sectionReq : true,
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

export default AddUpdateEmployee;
