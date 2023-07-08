import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Row, Card, Button, Input, Tooltip, Table } from "antd";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import DrawerEvent from "../components/DrawerEvent";

const cardlayout = {
  bordered: true,
  hoverable: true,
  size: "large",
  style: { width: "100%", minHeight: "calc(100vh - 106px)" },
};

const Employee = (props) => {
  const [searchedtext, setSearchedText] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [compItem, setCompItem] = useState("");
  const [employees, setEmployees] = useState([]);
  const [empID, setEmpID] = useState(0);

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "id",
      key: "id",
      filteredValue: [searchedtext],
      onFilter: (value, record) => {
        return (
          String(record.id).toLowerCase().includes(value.toLowerCase()) ||
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.position).toLowerCase().includes(value.toLowerCase()) ||
          String(record.phone).toLowerCase().includes(value.toLowerCase()) ||
          String(record.email).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  useEffect(() => {
    axios.get("http://localhost:8000/api/employees").then((response) => {
      setEmployees([]);
      response.data.map((res) =>
        setEmployees((employees) => [
          ...employees,
          {
            id: res.emp_id,
            name: res.emp_name,
            position: res.emp_position,
            phone: res.emp_phone,
            email: res.emp_email,
          },
        ])
      );
    });
  }, []);

  function showDrawer() {
    setOpenDrawer(true);
  }

  function onCloseDrawer() {
    setOpenDrawer(false);
  }

  return (
    <>
      <Card {...cardlayout}>
        <Col span={24}>
          <Card size="small" style={{ background: "#318CE7", width: "100%" }}>
            <Row>
              <Col span={2}>
                <Tooltip title="Add New Employee">
                  <Button
                    type="primary"
                    shape="circle"
                    className="custom-hover"
                    style={{ margin: "0 20px" }}
                    onClick={() => {
                      showDrawer();
                      setCompItem("AddEmployee");
                    }}
                    icon={<UserAddOutlined />}
                  />
                </Tooltip>
              </Col>
              <Col span={22}>
                <Input
                  size="large"
                  placeholder="Search Employee"
                  suffix={
                    <SearchOutlined
                      style={{ fontSize: "26px", color: "#318CE7" }}
                    />
                  }
                  onChange={(e) => setSearchedText(e.target.value)}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Row style={{ marginTop: "20px" }}>
          <Col span={24}>
            <Table
              className="light-color-header-table"
              rowClassName={() => "table-row"}
              columns={columns}
              dataSource={employees}
              onRow={(rowIndex) => {
                return {
                  onClick: (event) => {
                    showDrawer();
                    setEmpID(rowIndex.id);
                    setCompItem("Profile");
                  },
                };
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "30"],
              }}
              size="small"
            />
          </Col>
        </Row>
      </Card>
      <DrawerEvent
        showDrawer={openDrawer}
        onCloseDrawer={onCloseDrawer}
        empid={empID}
        col={props.col}
        comp={compItem}
      ></DrawerEvent>
    </>
  );
};

export default Employee;
