import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Col,
  Row,
  Card,
  Button,
  Typography,
  List,
  Table,
  notification,
} from "antd";
import { CloseOutlined, CheckCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import NotificationEvent from "./NotificationEvent";
import ResultEvent from "../components/ResultEvent";

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const Vacation = (props) => {
  const dateFormat = "YYYY-MM-DD";
  const [vacations, setVacations] = useState([]);
  const [vactypes, setVacationType] = useState([]);
  const [vacation, setVacation] = useState("");
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState("");
  const [showAttachment, setShowAttachment] = useState(false);
  const [success, setSuccess] = useState(false);
  const [add, setAdd] = useState(false);
  const [days, setDays] = useState(0);
  const [api, contextHolder] = notification.useNotification();
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: "Details",
      content: (
        <>
          <Form
            {...layout}
            layout="vertical"
            size="large"
            name="add-vacation"
            style={{ width: "100%" }}
          >
            <Col span={24}>
              <div className="space-between-row">
                <Col span={10}>
                  <Form.Item
                    name={["vacation"]}
                    label="Type"
                    initialValue={vacation}
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      className="small-font"
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
                      options={vactypes
                        .filter((res) => res.opt_category === "Vacation")
                        .map((vac) => {
                          return {
                            value: vac.opt_name,
                            label: vac.opt_name,
                          };
                        })}
                      onChange={onVacationChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name={["startdate"]}
                    label="Start Date"
                    initialValue={startdate === "" ? "" : moment(startdate)}
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder=""
                      onChange={(value) =>
                        setStartDate(moment(value).format(dateFormat))
                      }
                      inputReadOnly
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name={["enddate"]}
                    label="End Date"
                    initialValue={enddate === "" ? "" : moment(enddate)}
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder=""
                      onChange={(value) =>
                        setEndDate(moment(value).format(dateFormat))
                      }
                      inputReadOnly
                    />
                  </Form.Item>
                </Col>
              </div>
            </Col>
            <Col span={24}>
              <div className="space-between-row">
                <Col span={10}>
                  <Form.Item
                    name={["reason"]}
                    label="Reason"
                    initialValue={reason}
                  >
                    <Input onChange={(e) => onReasonChange(e.target.value)} />
                  </Form.Item>
                </Col>
                <Col span={13}>
                  {showAttachment ? (
                    <Form.Item
                      name={["attachment"]}
                      label="Attachment"
                      initialValue={attachment}
                    >
                      <Input
                        readOnly
                        suffix={
                          <Button
                            className="align-items-center "
                            icon={
                              <CloseOutlined
                                className="medium-card-title"
                                style={{ color: "#318ce7" }}
                              />
                            }
                            style={{
                              width: "16px",
                              height: "16px",
                            }}
                            onClick={removeAttachment}
                          />
                        }
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item name={["select_attachment"]} label="Attachment">
                      <Input
                        type="file"
                        onChange={(e) => onAttachmentChange(e.target.value)}
                      />
                    </Form.Item>
                  )}
                </Col>
              </div>
            </Col>
          </Form>
        </>
      ),
    },
    {
      title: "Confirm",
      content: (
        <List
          style={{ width: "90%" }}
          itemLayout="horizontal"
          dataSource={[
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  Vacation Type
                </p>
              ),
              description: <p className="small-font">{vacation}</p>,
            },
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  Date Duration
                </p>
              ),
              description: (
                <p className="small-font">
                  From {startdate} To {enddate} ({days})
                </p>
              ),
            },
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  Reason
                </p>
              ),
              description: <p className="small-font">{reason}</p>,
            },
            {
              title: (
                <p className="small-font" style={{ color: "#318ce7" }}>
                  Attachment
                </p>
              ),
              description: <p className="small-font">{attachment}</p>,
            },
          ]}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      ),
    },
  ];

  const columns = [
    {
      title: "Vacation Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Start Date",
      dataIndex: "start",
      key: "start",
    },
    {
      title: "End Date",
      dataIndex: "end",
      key: "end",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Attachment",
      dataIndex: "attach",
      key: "attach",
    },
    {
      title: addVactionButton,
      dataIndex: "total",
      key: "total",
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        await axios
          .get("http://localhost:8000/api/option", {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          })
          .then((response) => {
            setVacationType(response.data);
          });
      } catch (err) {
        console.log(err.response.data[0]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await loadVacations();
    })();
  }, []);

  async function loadVacations() {
    try {
      await axios
        .get("http://localhost:8000/api/vacations", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          setVacations([]);
          response.data.map((res) =>
            setVacations((vacations) => [
              ...vacations,
              {
                id: res.emp_id,
                type: res.vac_type,
                start: res.vac_start,
                end: res.vac_end,
                reason: res.vac_reason,
                attach: res.vac_attachment,
                total: res.vac_total,
              },
            ])
          );
        });
    } catch (err) {
      console.log(err.response.data[0]);
    }
  }

  function onVacationChange(value) {
    setVacation(value);
  }

  function onReasonChange(value) {
    setReason(value);
  }

  function onAttachmentChange(value) {
    setAttachment(value);
    setShowAttachment(true);
  }

  function removeAttachment() {
    setShowAttachment(false);
    setAttachment("");
  }

  function newVacation() {
    setSuccess(false);
    setCurrent(0);
    setVacation("");
    setStartDate("");
    setEndDate("");
    setReason("");
    setAttachment("");
    setShowAttachment(false);
    setAdd(true);
  }

  function viewVacation() {
    setAdd(false);
    setSuccess(false);
  }

  function addVactionButton() {
    return (
      <Button size="large" type="primary" onClick={newVacation}>
        ADD VACATION
      </Button>
    );
  }

  function checkVacation() {
    var onVacation = false;
    var vacs = vacations
      .filter((res) => res.id === props.empid)
      .map((vac) => {
        return {
          start: vac.start,
          end: vac.end,
        };
      });
    for (var i = 0; i < vacs.length; i++) {
      var startVac = vacs[i]["start"];
      var endVac = vacs[i]["end"];
      if (
        moment(startdate).isBetween(startVac, endVac, undefined, []) ||
        moment(enddate).isBetween(startVac, endVac, undefined, [])
      ) {
        onVacation = true;
        break;
      } else {
        onVacation = false;
      }
    }
    return onVacation;
  }

  function next() {
    var valid = true;
    if (vacation === "") {
      valid = false;
      api.info(NotificationEvent(false, "No Vacation Type selected!"));
    } else if (startdate === "") {
      valid = false;
      api.info(NotificationEvent(false, "No Start Date selected!"));
    } else if (enddate === "") {
      valid = false;
      api.info(NotificationEvent(false, "No End Date selected!"));
    } else if (startdate > enddate) {
      valid = false;
      api.info(
        NotificationEvent(false, "End Date must greater than Start Date!")
      );
    } else if (startdate < moment().format(dateFormat)) {
      valid = false;
      api.info(
        NotificationEvent(false, "Cannot apply vacation for previous date!")
      );
    } else if (checkVacation()) {
      valid = false;
      api.info(NotificationEvent(false, "Vacation exist for this date!"));
    }
    if (valid) {
      var d =
        moment
          .duration(
            moment(enddate, "YYYY-MM-DD").diff(moment(startdate, "YYYY-MM-DD"))
          )
          .asDays() + 1;
      setDays(d > 1 ? d + " days" : d + " day");
      setCurrent(current + 1);
    }
  }

  function prev() {
    setCurrent(current - 1);
  }

  async function apply() {
    var vacData = {
      emp_id: props.empid,
      vac_type: vacation,
      vac_start: startdate,
      vac_end: enddate,
      vac_reason: reason === "" ? "No reason specified" : reason,
      vac_attachment: attachment === "" ? "No document attached" : attachment,
      vac_total: days,
    };
    try {
      await axios({
        method: "POST",
        url: "http://localhost:8000/api/vacation/",
        data: vacData,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      loadVacations();
      setSuccess(true);
    } catch (err) {
      console.log(err.response.data[0]);
      setSuccess(false);
      api.info(NotificationEvent(false, "Employee vacation failed to apply!"));
    }
  }

  if (success) {
    return (
      <>
        <ResultEvent
          icon={<CheckCircleOutlined style={{ color: "#318ce7" }} />}
          status="success"
          title={"Successfully applied employee vacation."}
          subTitle={`From ${startdate} To ${enddate} (${days})`}
          extra={[
            <Button size="large" type="primary" onClick={newVacation}>
              ADD NEW VACATION
            </Button>,
            <Button size="large" type="primary" onClick={viewVacation}>
              VIEW VACATIONS
            </Button>,
          ]}
        />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <Row style={{ marginTop: "20px" }}>
        <Card size="small" style={{ width: "100%" }}>
          {add ? (
            <Row className="justified-row">
              <div className="card-custom-size">
                <Card
                  size="large"
                  extra={
                    <div>
                      <Button
                        size="large"
                        type="primary"
                        style={{
                          marginRight: "8px",
                          display: current > 0 ? "none" : "inline",
                        }}
                        onClick={viewVacation}
                      >
                        CANCEL
                      </Button>
                      {current < steps.length - 1 && (
                        <Button size="large" type="primary" onClick={next}>
                          NEXT
                        </Button>
                      )}
                      {current > 0 && (
                        <Button
                          size="large"
                          type="primary"
                          onClick={prev}
                          style={{ marginRight: "8px" }}
                        >
                          BACK
                        </Button>
                      )}
                      {current === steps.length - 1 && (
                        <Button size="large" type="primary" onClick={apply}>
                          APPLY
                        </Button>
                      )}
                    </div>
                  }
                  title={
                    <Title>
                      <p className="big-card-title">Vacation Application</p>
                    </Title>
                  }
                  hoverable
                >
                  <div className="justified-row">{steps[current].content}</div>
                </Card>
              </div>
            </Row>
          ) : (
            <Table
              className="light-color-header-table"
              rowClassName={() => "table-row"}
              columns={columns}
              dataSource={vacations
                .filter((res) => res.id === props.empid)
                .map((vac) => {
                  return {
                    type: vac.type,
                    start: vac.start,
                    end: vac.end,
                    reason: vac.reason,
                    attach: vac.attach,
                    total: vac.total,
                  };
                })}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "30"],
              }}
              size="small"
              scroll={{
                y: "50vh",
              }}
            />
          )}
        </Card>
      </Row>
    </>
  );
};

export default Vacation;
