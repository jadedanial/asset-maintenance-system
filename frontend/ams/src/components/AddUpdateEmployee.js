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
  const queryClient = useCustomQueryClient();
  const dateFormat = "YYYY-MM-DD";
  const displayDateFormat = "MMMM DD, YYYY";
  const datePickerFormat = (value) => `${value.format("MMMM DD, YYYY")}`;
  const [updateData, setUpdateData] = useState(update);
  const [step, setStep] = useState(updateData ? 10 : 0);
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
  const [loading, setLoading] = useState(true);
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
    setStep(1);
    changeLabel();
  };

  const onSalaryChange = (value) => {
    setEmployeeSalary(value);
    setSalaryReq(true);
    setStep(2);
    changeLabel();
  };

  const onDateHiredChange = (value) => {
    setEmployeeDateHired(value);
    setDateHiredReq(true);
    setStep(3);
    changeLabel();
  };

  const onPositionChange = (value) => {
    setEmployeePosition(value);
    setPositionReq(true);
    setStep(4);
    changeLabel();
  };

  const onNationalityChange = (value) => {
    setEmployeeNationality(value);
    setNationalityReq(true);
    setStep(5);
    changeLabel();
  };

  const onAddressChange = (value) => {
    setEmployeeAddress(value);
    setAddressReq(true);
    setStep(6);
    changeLabel();
  };

  const onBirthdateChange = (value) => {
    setEmployeeBirthdate(value);
    setBirthdateReq(true);
    setStep(7);
    changeLabel();
  };

  const onEmailChange = (value) => {
    setEmployeeEmail(value);
    setEmailReq(true);
    setStep(8);
    changeLabel();
  };

  const onPhoneChange = (value) => {
    setEmployeePhone(value);
    setPhoneReq(true);
    setStep(9);
    changeLabel();
  };

  const onSectionChange = (value) => {
    setEmployeeSection(value);
    setSectionReq(true);
    setStep(10);
    changeLabel();
  };

  const createEmployee = async () => {
    setSubmit(true);
    setLoading(true);
    changeLabel();
    const employeeData = {
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
        queryClient.invalidateQueries("employees");
        if (updateData) {
          getSection();
        }
        setLoading(false);
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err.response.data[0]);
        setSubmit(false);
        setSuccess(false);
      });
  };

  const { mutate } = useMutation(createEmployee);

  const onFinish = () => {
    mutate();
  };

  return (
    <>
      {submit ? (
        loading ? (
          <Spinner height={"100%"} theme={theme} />
        ) : (
          <ResultEvent
            icon={success ? <CheckOutlined /> : <CloseOutlined />}
            status="success"
            title={
              updateData
                ? "Successfully updated employee."
                : "Successfully added new employee."
            }
            subTitle={
              "Employee name " + employeeName + " with ID " + employeeID
            }
            extra={
              <Row className="space-between-row">
                <Col span={12} style={{ paddingRight: "10px" }}>
                  <Button
                    size="large"
                    type="default"
                    onClick={() => {
                      onCloseDrawer();
                    }}
                    block
                  >
                    CLOSE
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => {
                      newEmployee();
                    }}
                    block
                  >
                    NEW EMPLOYEE
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
                <Row>
                  <Col span={16} style={{ paddingRight: "24px" }}>
                    <div
                      className=" card-with-background"
                      style={{ padding: "24px" }}
                    >
                      <Form.Item
                        name={["name"]}
                        label="Employee Name"
                        initialValue={employeeName}
                        rules={[
                          {
                            required: updateData ? nameReq : true,
                            message: "Employee name required",
                          },
                        ]}
                      >
                        <Input
                          value={employeeName}
                          maxLength={50}
                          onChange={(e) => onNameChange(e.target.value)}
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
                            name={["salary"]}
                            label="Monthly Salary"
                            initialValue={employeeSalary}
                            rules={[
                              {
                                required: updateData ? salaryReq : true,
                                message: "Employee salary required",
                              },
                            ]}
                          >
                            <Select
                              size="large"
                              showSearch
                              style={{ width: "100%" }}
                              value={employeeSalary}
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
                                message: "Employee position required",
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
                              value={employeePosition}
                              options={options
                                .filter(
                                  (res) => res.opt_category === "Position"
                                )
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
                                message: "Employee address required",
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
                                message: "Invalid email",
                              },
                              {
                                required: updateData ? emailReq : true,
                                message: "Employee email required",
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
                        <Col span={10}>
                          <Form.Item
                            name={["datehired"]}
                            label="Date Hired"
                            initialValue={
                              employeeDateHired === ""
                                ? ""
                                : moment(employeeDateHired)
                            }
                            rules={[
                              {
                                required: updateData ? datehiredReq : true,
                                message: "Date hired required",
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
                                message: "Employee nationality required",
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
                              value={employeeNationality}
                              options={options
                                .filter(
                                  (res) => res.opt_category === "Nationality"
                                )
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
                              employeeBirthdate === ""
                                ? ""
                                : moment(employeeBirthdate)
                            }
                            rules={[
                              {
                                required: updateData ? birthdateReq : true,
                                message: "Employee birthdate required",
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
                                message: "Phone number required",
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
                      </Row>
                      <Form.Item
                        name={["section"]}
                        label="Section"
                        initialValue={employeeSection}
                        rules={[
                          {
                            required: updateData ? sectionReq : true,
                            message: "Employee section required",
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
                              .localeCompare(
                                (optionB?.label ?? "").toLowerCase()
                              )
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
                      <div
                        className="space-between-row"
                        style={{ paddingTop: "24px" }}
                      >
                        <Button
                          size="large"
                          type="default"
                          onClick={() => {
                            onCloseDrawer();
                          }}
                          block
                        >
                          CANCEL
                        </Button>
                        <Button
                          size="large"
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
                            title: "Employee Name",
                            description:
                              employeeName === "" ? " " : employeeName,
                            status: employeeName === "" ? "error" : "finish",
                          },
                          {
                            title: "Monthly Salary",
                            description:
                              employeeSalary === "" ? " " : employeeSalary,
                            status: employeeSalary === "" ? "error" : "finish",
                          },
                          {
                            title: "Date Hired",
                            description:
                              employeeDateHired === ""
                                ? " "
                                : moment(employeeDateHired).format(
                                    displayDateFormat
                                  ),
                            status:
                              employeeDateHired === "" ? "error" : "finish",
                          },
                          {
                            title: "Position",
                            description:
                              employeePosition === "" ? " " : employeePosition,
                            status:
                              employeePosition === "" ? "error" : "finish",
                          },
                          {
                            title: "Nationality",
                            description:
                              employeeNationality === ""
                                ? " "
                                : employeeNationality,
                            status:
                              employeeNationality === "" ? "error" : "finish",
                          },
                          {
                            title: "Address",
                            description:
                              employeeAddress === "" ? " " : employeeAddress,
                            status: employeeAddress === "" ? "error" : "finish",
                          },
                          {
                            title: "Birthdate",
                            description:
                              employeeBirthdate === ""
                                ? " "
                                : moment(employeeBirthdate).format(
                                    displayDateFormat
                                  ),
                            status:
                              employeeBirthdate === "" ? "error" : "finish",
                          },
                          {
                            title: "Email",
                            description:
                              employeeEmail === "" ? " " : employeeEmail,
                            status: employeeEmail === "" ? "error" : "finish",
                          },
                          {
                            title: "Phone",
                            description:
                              employeePhone === "" ? " " : employeePhone,
                            status: employeePhone === "" ? "error" : "finish",
                          },
                          {
                            title: "Section",
                            description:
                              employeeSection === "" ? " " : employeeSection,
                            status: employeeSection === "" ? "error" : "finish",
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

export default AddUpdateEmployee;
