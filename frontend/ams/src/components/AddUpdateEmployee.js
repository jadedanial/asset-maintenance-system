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
  const [employeeID, setEmployeeID] = useState(updateData ? id : "");
  const [employeeName, setEmployeeName] = useState(updateData ? name : "");
  const [employeeBirthdate, setEmployeeBirthdate] = useState(
    updateData ? moment(birthdate).format(displayDateFormat) : ""
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
    updateData ? moment(datehired).format(displayDateFormat) : ""
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

  const updateField = (value, req, step) => {
    const fieldMap = {
      1: [setEmployeeName, setNameReq, setStep],
      2: [setEmployeeSalary, setSalaryReq, setStep],
      3: [setEmployeeDateHired, setDateHiredReq, setStep],
      4: [setEmployeePosition, setPositionReq, setStep],
      5: [setEmployeeNationality, setNationalityReq, setStep],
      6: [setEmployeeAddress, setAddressReq, setStep],
      7: [setEmployeeBirthdate, setBirthdateReq, setStep],
      8: [setEmployeeEmail, setEmailReq, setStep],
      9: [setEmployeePhone, setPhoneReq, setStep],
      10: [setEmployeeSection, setSectionReq, setStep],
    };
    const [updateState, setReqState, setStepState] = fieldMap[step];
    updateState(value);
    setReqState(req);
    setStepState(step);
  };

  const createEmployee = () => {
    setSubmit(true);
    setLoading(true);
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
        if (updateData) {
          getSection();
        }
        setLoading(false);
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err.response.data[0]);
        setLoading(false);
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
          <Spinner height={"60%"} theme={theme} />
        ) : (
          <ResultEvent
            icon={success ? <CheckOutlined /> : <CloseOutlined />}
            status={success ? "success" : "error"}
            title={
              success
                ? updateData
                  ? "Successfully updated employee."
                  : "Successfully added new employee."
                : updateData
                ? "Failed to update employee."
                : "Failed to add new employee."
            }
            subTitle={
              success
                ? "Employee name " + employeeName + " with ID " + employeeID
                : ""
            }
            extra={
              <Row className="space-between-row">
                <Col span={12} style={{ paddingRight: "10px" }}>
                  <Button
                    size="large"
                    type="default"
                    onClick={() => {
                      onCloseDrawer();
                      queryClient.invalidateQueries("employees");
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
                              onChange={(value) => updateField(value, true, 2)}
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
                              onChange={(value) => updateField(value, true, 4)}
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
                              onChange={(e) =>
                                updateField(e.target.value, true, 6)
                              }
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
                              onChange={(e) =>
                                updateField(e.target.value, true, 8)
                              }
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
                              onChange={(value) => updateField(value, true, 3)}
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
                              onChange={(value) => updateField(value, true, 5)}
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
                              onChange={(value) => updateField(value, true, 7)}
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
                              onChange={(e) =>
                                updateField(e.target.value, true, 9)
                              }
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
                          onChange={(value) => updateField(value, true, 10)}
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
                            queryClient.invalidateQueries("employees");
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
                              employeeName === "" ? "Empty" : employeeName,
                            status: employeeName === "" ? "error" : "finish",
                          },
                          {
                            title: "Monthly Salary",
                            description:
                              employeeSalary === "" ? "Empty" : employeeSalary,
                            status: employeeSalary === "" ? "error" : "finish",
                          },
                          {
                            title: "Date Hired",
                            description: moment(
                              employeeDateHired,
                              displayDateFormat,
                              true
                            ).isValid()
                              ? moment(employeeDateHired).format(
                                  displayDateFormat
                                )
                              : "Invalid date",
                            status: moment(
                              employeeDateHired,
                              displayDateFormat,
                              true
                            ).isValid()
                              ? "finish"
                              : "error",
                          },
                          {
                            title: "Position",
                            description:
                              employeePosition === ""
                                ? "Empty"
                                : employeePosition,
                            status:
                              employeePosition === "" ? "error" : "finish",
                          },
                          {
                            title: "Nationality",
                            description:
                              employeeNationality === ""
                                ? "Empty"
                                : employeeNationality,
                            status:
                              employeeNationality === "" ? "error" : "finish",
                          },
                          {
                            title: "Address",
                            description:
                              employeeAddress === ""
                                ? "Empty"
                                : employeeAddress,
                            status: employeeAddress === "" ? "error" : "finish",
                          },
                          {
                            title: "Birthdate",
                            description: moment(
                              employeeBirthdate,
                              displayDateFormat,
                              true
                            ).isValid()
                              ? moment(employeeBirthdate).format(
                                  displayDateFormat
                                )
                              : "Invalid date",
                            status: moment(
                              employeeBirthdate,
                              displayDateFormat,
                              true
                            ).isValid()
                              ? "finish"
                              : "error",
                          },
                          {
                            title: "Email",
                            description:
                              employeeEmail === "" ? "Empty" : employeeEmail,
                            status: employeeEmail === "" ? "error" : "finish",
                          },
                          {
                            title: "Phone",
                            description:
                              employeePhone === "" ? "Empty" : employeePhone,
                            status: employeePhone === "" ? "error" : "finish",
                          },
                          {
                            title: "Section",
                            description:
                              employeeSection === ""
                                ? "Empty"
                                : employeeSection,
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
