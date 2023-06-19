import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Card, Button, Select, Tooltip, Table } from 'antd';
import { UserAddOutlined, } from '@ant-design/icons';
import DrawerEvent from '../components/DrawerEvent';

const cardlayout = {
  bordered: true,
  hoverable: true,
  size: "large",
  style:{width: "100%"},
};

const Employee = (props) => {

  const [openDrawer, setOpenDrawer] = useState(false);
  const [compItem, setCompItem] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [empID, setEmpID] = useState(0);

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employee',
      key: 'employee',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  useEffect(() => {
    axios.get('http://localhost:8000/api/employees')
    .then(response => {
      setEmployees([]);
      response.data.map(res => (
        setEmployees(employees => [...employees,
          {
            employee: res.emp_id,
            name: res.emp_name,
            position: res.emp_position,
            phone: res.emp_phone,
            email: res.emp_email,
          }
        ])
      ))
    });
  },[]);

  function showDrawer() {
    setOpenDrawer(true);
  };

  function onCloseDrawer() {
    setOpenDrawer(false);
  };

  return (
    <>
      <Row>
        <Card {...cardlayout}>
          <Row>
            <Col span={24}>
              <Card size="small" style={{background: "#318CE7", width: "100%"}}>
                <Row>
                  <Col span={2}>
                    <Tooltip title="Add New Employee"><Button type="primary" shape="circle" className="custom-hover" style={{margin: "0 20px"}} onClick={() => {showDrawer(); setCompItem("AddEmployee")}} icon={<UserAddOutlined />} /></Tooltip>
                  </Col>
                  <Col span={19}>
                    <Select className="small-font" showSearch style={{width: "100%"}} optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />  
                  </Col>
                  <Col span={2}>
                    <Button size="middle" type="primary" className="custom-hover" style={{margin: "0 20px"}} block>SEARCH</Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row style={{marginTop: "50px"}}>
            <Col span={24}>
              <Table className="light-color-header-table" rowClassName={() => "table-row"} columns={columns} dataSource={employees}
              onRow={(rowIndex) => {return {onClick: (event) => {showDrawer(); setEmpID(rowIndex.employee); setCompItem("Profile")},};}} pagination={{pageSize: 10, showSizeChanger: true,
              pageSizeOptions: ['10', '20', '30']}} size="small" />
            </Col>
          </Row>
        </Card>
      </Row>
      <DrawerEvent showDrawer={openDrawer} onCloseDrawer={onCloseDrawer} empid={empID} col={props.col} comp={compItem}></DrawerEvent>
    </>
  );

};

export default Employee;