import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Form, Input, InputNumber, Card, Select, Row, Col } from 'antd';

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

const AddItem = () => {

  const [categories, setCategories] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemLocation, setItemLocation] = useState("");
  const [itemMeasurement, setItemMeasurement] = useState("");
  const [itemReorder, setItemReorder] = useState(0);
  const [itemCost, setItemCost] = useState(0);
  const [itemDescription, setItemDescription] = useState("");

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

  function onFinish(placement) {
    var itemData = {
      item_name: itemName,
      item_category: itemCategory,
      item_location: itemLocation,
      item_measurement: itemMeasurement,
      item_reorder: itemReorder,
      item_cost: itemCost,
      item_description: itemDescription,
    };
    try {
      axios({
        method: "POST",
        url: 'http://localhost:8000/api/item/',
        data: itemData,
      });
    } catch (err) {
      console.log(err.response.data[0]);
    }
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

  return (
    <>
      <div className="justified-row">
        <div style={{margin: "40px", marginTop: "2%", width: "50%"}}>
          <Card size="large" title={<Title><p className="big-card-title">Add New Item</p></Title>} hoverable>
            <Form {...layout} layout="vertical" size="large" name="add-new-item" onFinish={onFinish} validateMessages={validateMessages}>
              <Row>
                <Col span={24}>
                  <Form.Item name={['name',]} label="Name" rules={[{required: true,},]}>
                    <Input onChange={e => setItemName(e.target.value)} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <div className="space-between-row" style={{width: "100%"}}>
                  <Col span={11}>
                    <Form.Item name={['category',]} label="Category" rules={[{required: true,},]}>
                      <Select size="large" showSearch className="small-font" placeholder="" style={{width: "100%"}} optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                      options={categories.map((cat) => {return {value: cat.category, label: cat.category};})} onChange={onCategoryChange} />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item name={['measurement',]} label="Unit Of Measurement" rules={[{required: true,},]}>
                      <Select size="large" showSearch className="small-font" placeholder="" style={{width: "100%"}} optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                      options={measurements.map((mes) => {return {value: mes.measurement, label: mes.measurement};})} onChange={onMeasurementChange} />
                    </Form.Item>
                  </Col>
                </div>
              </Row>
              <Row>
                <div className="space-between-row" style={{width: "100%"}}>
                  <Col span={7}>
                    <Form.Item name={['location',]} label="Physical Location" rules={[{required: true,},]}>
                      <Input onChange={e => setItemLocation(e.target.value)} />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item style={{width: "100%"}} name={['reorder',]} label="Reorder Quantity" rules={[{required: true, type: 'number', min: 0, max: 1000000,},]}>
                      <InputNumber onChange={onReorderChange} />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item name={['cost',]} label="Unit Cost" rules={[{required: true, type: 'number', min: 0, max: 1000000,},]}>
                      <InputNumber onChange={onCostChange} />
                    </Form.Item>
                  </Col>
                </div>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name={['description',]} label="Description" rules={[{required: true,},]}>
                    <Input.TextArea onChange={e => setItemDescription(e.target.value)} />
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