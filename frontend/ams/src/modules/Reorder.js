import { Button, Steps, Row, Card, Typography, Input, List, Table } from 'antd';
import { useState } from 'react';

const { Title } = Typography;

const cardlayout = {
  bordered: true,
  hoverable: true,
  size: "large",
  style:{width: "100%"},
};

const Reorder = () => {

  const [current, setCurrent] = useState(0);
  const next = () => {setCurrent(current + 1);};
  const prev = () => {setCurrent(current - 1);};

  const data = [
    {
      cost: <p className="large-card-title">123.99</p>,
      name: <p className="big-font">Samsung 5V fast Charger</p>,
      code: <p className="small-font">ITM00256</p>,
    },
  ];

  const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      width: '90%',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '10%',
    },
  ];

  const items = [
    {
      item:
        <List itemLayout="horizontal" dataSource={data} renderItem={(item, index) => (
          <List.Item><List.Item.Meta avatar={item.cost} title={item.name} description={item.code} /></List.Item>)}
        />,
      quantity: "8",
    },
  ];

  const steps = [
    {
      title: 'Add Item',
      content:
        <Row>
          <div style={{flexDirection: "column", width: "100%"}}>
            <Card>
              <Input.Search size="large" placeholder="Search Item" enterButton={<Button type="primary" className="custom-hover">SEARCH</Button>} />
            </Card>
            <Card style={{marginTop: "10px", minHeight: "100px"}}>
              <Table className="light-color-header-table" id="thead-text-align-left" rowClassName={() => "table-row-no-color text-align-left"} columns={columns} dataSource={items} size="small" pagination={false} />
            </Card>
          </div>
        </Row>,
    },
    {
      title: 'Confirm Item',
      content: '',
    },
    {
      title: 'Submit',
      content: '',
    },
  ];

  const pages = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  
  const contentStyle = {
    lineHeight: "260px",
    color: "#FFF",
    backgroundColor: "#FFF",
    marginTop: 16,
  };
  
  return (
    <>
      <Row>
        <Card {...cardlayout}>
          <Row>
            <div className="justified-row">
              <div style={{margin: "40px", marginTop: "2%", width: "60%"}}>
                <Card size="large" extra={<Steps current={current} items={pages} />} title={
                  <Title>
                    <Row><p className="big-card-title">Reorder Stock</p></Row>
                  </Title>} hoverable>
                  <div style={contentStyle}>{steps[current].content}</div>
                  <div style={{marginTop: 24}}>
                    {current < steps.length - 1 && (<Button size="large" type="primary" style={{margin: "10px 10px 0 0"}} onClick={() => next()}>NEXT</Button>)}
                    {current === steps.length - 1 && (<Button size="large" type="primary" style={{margin: "10px 10px 0 0"}}>DONE</Button>)}
                    {current > 0 && (<Button size="large" type="primary" style={{margin: "10px 0 0 10px"}} onClick={() => prev()}>PREVIOUS</Button>)}
                  </div>
                </Card>
              </div>
            </div>
          </Row>
        </Card>
      </Row>
    </>
  );

};

export default Reorder;