import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Row, Card, Button, Input, Tooltip, Table } from "antd";
import { FieldTimeOutlined } from "@ant-design/icons";
import DrawerEvent from "../components/DrawerEvent";
import moment from "moment";

const Shift = (props) => {
  const timeFormat = "HH:mm:ss";
  const [searchedtext, setSearchedText] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [compItem, setCompItem] = useState("");
  const [shifts, setShifts] = useState([]);
  const [shiftName, setShiftName] = useState("");

  const columns = [
    {
      title: "Shift Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchedtext],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.from).toLowerCase().includes(value.toLowerCase()) ||
          String(record.to).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
    },
    {
      title: "Total Hours",
      dataIndex: "total",
      key: "total",
    },
  ];

  useEffect(() => {
    (async () => {
      await loadShifts();
    })();
  }, []);

  async function loadShifts() {
    try {
      await axios({
        method: "GET",
        url: "http://localhost:8000/api/shifts",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((response) => {
        setShifts([]);
        response.data.map((res) =>
          setShifts((shifts) => [
            ...shifts,
            {
              name: res.shift_name,
              from: res.shift_from,
              to: res.shift_to,
              total: moment
                .duration(
                  moment(res.shift_to, timeFormat).diff(
                    moment(res.shift_from, timeFormat)
                  )
                )
                .asHours(),
            },
          ])
        );
      });
    } catch (err) {
      console.log(err);
    }
  }

  function showDrawer() {
    setOpenDrawer(true);
  }

  function onCloseDrawer() {
    setOpenDrawer(false);
    loadShifts();
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
                <Tooltip title="Add New Shift">
                  <Button
                    className="custom-hover"
                    style={{ margin: "0 20px" }}
                    shape="circle"
                    size="large"
                    type="primary"
                    onClick={() => {
                      showDrawer();
                      setCompItem("AddUpdateShift");
                    }}
                    icon={<FieldTimeOutlined />}
                  />
                </Tooltip>
              </Col>
              <Col span={22}>
                <Input
                  size="large"
                  placeholder="Search Shift"
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
          dataSource={shifts}
          onRow={(rowIndex) => {
            return {
              onClick: (event) => {
                showDrawer();
                setShiftName(rowIndex.id);
                setCompItem("Shift");
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
        shiftname={shiftName}
        showDrawer={openDrawer}
        onCloseDrawer={onCloseDrawer}
        col={props.col}
        comp={compItem}
      ></DrawerEvent>
    </>
  );
};

export default Shift;
