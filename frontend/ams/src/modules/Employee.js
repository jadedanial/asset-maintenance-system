import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Row, Card, Button, Input, Tooltip, Table } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import DrawerEvent from "../components/DrawerEvent";

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
    (async () => {
      await loadEmployees();
    })();
  }, []);

  async function loadEmployees() {
    try {
      await axios
        .get("http://localhost:8000/api/employees", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
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
    } catch (err) {
      console.log(err.response.data[0]);
    }
  }

  function showDrawer() {
    setOpenDrawer(true);
  }

  function onCloseDrawer() {
    setOpenDrawer(false);
    loadEmployees();
  }

  return (
    <>
      <Card
        size="large"
        className="card-no-top-padding card-main-layout"
        bordered
        hoverable
      >
        <div span={24} style={{ position: "sticky", top: "87px", zIndex: "1" }}>
          <div style={{ height: "24px", backgroundColor: "#fff" }}></div>
          <div
            style={{
              background: "#318ce7",
              width: "100%",
              height: "65px",
              padding: "12px",
            }}
          >
            <Row>
              <Col span={2}>
                <Tooltip title="Add New Employee">
                  <Button
                    className="custom-hover"
                    style={{ margin: "0 20px" }}
                    shape="circle"
                    size="large"
                    type="primary"
                    onClick={() => {
                      showDrawer();
                      setCompItem("AddUpdateEmployee");
                    }}
                    icon={<UserAddOutlined />}
                  />
                </Tooltip>
              </Col>
              <Col span={22}>
                <Input
                  size="large"
                  placeholder="Search Employee"
                  onChange={(e) => setSearchedText(e.target.value)}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div
          style={{
            height: "20px",
            backgroundColor: "#fff",
            position: "sticky",
            top: "176px",
            zIndex: "1",
          }}
        ></div>
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
            showSizeChanger: false,
          }}
          size="small"
          scroll={{
            y: "50vh",
          }}
        />
      </Card>
      <DrawerEvent
        empid={empID}
        showDrawer={openDrawer}
        onCloseDrawer={onCloseDrawer}
        col={props.col}
        comp={compItem}
      ></DrawerEvent>
    </>
  );
};

export default Employee;
