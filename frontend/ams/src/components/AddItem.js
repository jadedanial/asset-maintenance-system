import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Form, Input, InputNumber, Card, Select, Row, Col } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ResultPage from '../components/Result';

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  types: {
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
/* eslint-enable no-template-curly-in-string */

const AddItem = (props) => {

  const [categories, setCategories] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemLocation, setItemLocation] = useState("");
  const [itemMeasurement, setItemMeasurement] = useState("");
  const [itemReorder, setItemReorder] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/category')
    .then(response => {
      setCategories(response.data);
    });
  },[]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/measurement')
    .then(response => {
      setMeasurements(response.data);
    });
  },[]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/items')
    .then(response => {
      props.setItems([]);
      response.data.map(res => (
        props.setItems(items => [...items,
          {
            item: res.item_code,
            name: res.item_name,
            category: res.item_category,
            location: res.item_location,
            measurement: res.item_measurement,
            reorder: res.item_reorder,
            onhand: res.item_onhand,
            cost: res.item_cost,
            value: res.item_cost * res.item_onhand,
          }
        ])
      ))
    });
  },);

  function newItem(e) {
    setSubmit(false);
    setItemName("");
    setItemCategory("");
    setItemLocation("");
    setItemMeasurement("");
    setItemReorder("");
    setItemCost("");
    setItemDescription("");
  };

  function onCategoryChange(value) {
    setItemCategory(value);
  };

  function onMeasurementChange(value) {
    setItemMeasurement(value);
  };

  function onReorderChange(value) {
    setItemReorder(value);
  };

  function onCostChange(value) {
    setItemCost(value);
  };

  async function onFinish() {
    setSubmit(true);
    try {
      await axios.post('http://localhost:8000/api/item/', {
        item_name: itemName,
        item_category: itemCategory,
        item_location: itemLocation,
        item_measurement: itemMeasurement,
        item_reorder: itemReorder,
        item_onhand: "0",
        item_cost: itemCost,
        item_description: itemDescription,
      },);
      setSuccess(true);
    } catch (err) {
      console.log(err.response.data[0]);
      setSuccess(false);
    }
  };

  if (submit) {
    if (success) {
      return (
        <>
          <ResultPage icon={<CheckCircleOutlined style={{color: "#318CE7"}} />} status="success" title="Successfully added new Item!" subTitle={"Item Name: " + itemName}
          extra={<Button size="large" type="primary" icon="" onClick={e => newItem()}>ADD NEW ITEM</Button>} />
        </>
      );
    } else {
      return (
        <>
          <ResultPage icon={<CloseCircleOutlined style={{color: "#318CE7"}} />} status="error" title="Item already exist!" subTitle={"Item Name: " + itemName}
          extra={<Button size="large" type="primary" icon="" onClick={e => newItem()}>BACK</Button>} />
        </>
      );
    }
  }

  return (
    <>
      <div className="justified-row">
        <div style={{margin: "40px", marginTop: "2%", width: "50%"}}>
          <Card size="large" title={<Title><p className="big-card-title">Add New Item</p></Title>} hoverable>
            <Form {...layout} layout="vertical" size="large" name="add-new-item" onFinish={onFinish} validateMessages={validateMessages}>
              <Row>
                <Col span={24}>
                  <Form.Item name={['name',]} label="Name" rules={[{required: true,},]}>
                    <Input value={itemName} onChange={e => setItemName(e.target.value)} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <div className="space-between-row" style={{width: "100%"}}>
                  <Col span={11}>
                    <Form.Item name={['category',]} label="Category" rules={[{required: true,},]}>
                      <Select size="large" showSearch className="small-font" placeholder="" style={{width: "100%"}} optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                      value={itemCategory} options={categories.map((cat) => {return {value: cat.category, label: cat.category};})} onChange={onCategoryChange} />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item name={['measurement',]} label="Unit Of Measurement" rules={[{required: true,},]}>
                      <Select size="large" showSearch className="small-font" placeholder="" style={{width: "100%"}} optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                      value={itemMeasurement} options={measurements.map((mes) => {return {value: mes.measurement, label: mes.measurement};})} onChange={onMeasurementChange} />
                    </Form.Item>
                  </Col>
                </div>
              </Row>
              <Row>
                <div className="space-between-row" style={{width: "100%"}}>
                  <Col span={7}>
                    <Form.Item name={['location',]} label="Physical Location" rules={[{required: true,},]}>
                      <Input value={itemLocation} onChange={e => setItemLocation(e.target.value)} />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item style={{width: "100%"}} name={['reorder',]} label="Reorder Quantity" rules={[{required: true, type: 'number', min: 0, max: 1000000,},]}>
                      <InputNumber value={itemReorder} onChange={onReorderChange} />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item name={['cost',]} label="Unit Cost" rules={[{required: true, type: 'number', min: 0, max: 1000000,},]}>
                      <InputNumber value={itemCost} onChange={onCostChange} />
                    </Form.Item>
                  </Col>
                </div>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name={['description',]} label="Description" rules={[{required: true,},]}>
                    <Input.TextArea value={itemDescription} onChange={e => setItemDescription(e.target.value)} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item wrapperCol={{...layout.wrapperCol,}}>
                <Button size="large" type="primary" htmlType="submit" style={{marginTop: "24px"}} block>SAVE</Button>
              </Form.Item>
            </Form>
          </Card> 
        </div>
      </div>
    </>
  );

};

export default AddItem;