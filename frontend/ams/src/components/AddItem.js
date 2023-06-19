import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Form, Input, InputNumber, Card, Select, Row, Col } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
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

const AddItem = (props) => {

  const [label, setLabel] = useState("Add New Item");
  const [color, setColor] = useState("#318CE7");
  const [categories, setCategories] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [itemCode, setItemCode] = useState("");
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

  function getItemCode(name) {
    axios.get('http://localhost:8000/api/items')
    .then(response => {
      response.data.map(res => (res.item_name === name ?
        setItemCode(res.item_code):{}
      ))
    });
  };

  function newItem() {
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
    setLabel("Add New Item");
    setColor("#318CE7");
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
      setLabel(err.response.data[0]);
      setColor("#F50");
    }
  };

  if (success) {
    getItemCode(itemName);
  }

  if (submit) {
    if (success) {
      return (
        <>
          <ResultPage icon={<CheckCircleOutlined style={{color: "#318CE7"}} />} status="success" title="Successfully added new Item!" subTitle={"Item " + itemName + " with code " + itemCode}
          extra={<Button size="large" type="primary" icon="" onClick={e => newItem(e)}>ADD NEW ITEM</Button>} />
        </>
      );
    }
  }

  return (
    <>
      <div className="justified-row">
        <div style={{margin: "40px", marginTop: "2%", width: "55%"}}>
          <Card size="large" title={<Title><p className="big-card-title" style={{color: color}}>{label}</p></Title>} hoverable>
            <Form {...layout} layout="vertical" size="large" name="add-new-item" onFinish={onFinish}>
              <Row>
                <Col span={24}>
                  <Form.Item name={['name',]} rules={[{required: true, message: 'Please input item name!',},]}>
                    <Input value={itemName} placeholder="Item Name" onChange={e => setItemName(e.target.value)} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <div className="space-between-row" style={{width: "100%"}}>
                  <Col span={11}>
                    <Form.Item name={['category',]} rules={[{required: true, message: 'Please select category!',},]}>
                      <Select size="large" showSearch className="small-font" placeholder="Category" style={{width: "100%"}} optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                      value={itemCategory} options={categories.map((cat) => {return {value: cat.category, label: cat.category};})} onChange={onCategoryChange} />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item name={['measurement',]} rules={[{required: true, message: 'Please select unit of measurement!',},]}>
                      <Select size="large" showSearch className="small-font" placeholder="Unit Of Measurement" style={{width: "100%"}} optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                      value={itemMeasurement} options={measurements.map((mes) => {return {value: mes.measurement, label: mes.measurement};})} onChange={onMeasurementChange} />
                    </Form.Item>
                  </Col>
                </div>
              </Row>
              <Row>
                <div className="space-between-row" style={{width: "100%"}}>
                  <Col span={7}>
                    <Form.Item name={['location',]} rules={[{required: true, message: 'Please input physical location!',},]}>
                      <Input value={itemLocation} placeholder="Physical Location" onChange={e => setItemLocation(e.target.value)} />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item name={['reorder',]} rules={[{required: true, message: 'Please input a valid reorder quantity!', type: 'number', min: 1, max: 1000000,},]}>
                      <InputNumber value={itemReorder} placeholder="Reorder Quantity" onChange={onReorderChange} />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item name={['cost',]} rules={[{required: true, message: 'Please input a valid unit cost!', type: 'number', min: 1, max: 1000000,},]}>
                      <InputNumber value={itemCost} placeholder="Unit Cost" onChange={onCostChange} />
                    </Form.Item>
                  </Col>
                </div>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name={['description',]} rules={[{required: true, message: 'Please input description!',},]}>
                    <Input.TextArea value={itemDescription} placeholder="Description" onChange={e => setItemDescription(e.target.value)} />
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