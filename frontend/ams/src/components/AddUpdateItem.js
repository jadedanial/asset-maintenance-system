import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Form, Input, InputNumber, Card, Select, Row, Col } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import ResultEvent from '../components/ResultEvent';

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const AddUpdateItem = (props) => {

  const [label, setLabel] = useState(props.update ? "Update Item":"Add New Item");
  const [color, setColor] = useState("#318CE7");
  const [categories, setCategories] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [itemCode, setItemCode] = useState(props.update ? props.code:"");
  const [itemName, setItemName] = useState(props.update ? props.name:"");
  const [itemCategory, setItemCategory] = useState(props.update ? props.category:"");
  const [itemLocation, setItemLocation] = useState(props.update ? props.location:"");
  const [itemMeasurement, setItemMeasurement] = useState(props.update ? props.measurement:"");
  const [itemReorder, setItemReorder] = useState(props.update ? props.reorder:"");
  const itemOnHand = props.update ? props.onhand:0;
  const [itemCost, setItemCost] = useState(props.update ? props.cost:"");
  const [itemDescription, setItemDescription] = useState(props.update ? props.description:"");
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nameReq, setNameReq] = useState(false);
  const [categoryReq, setCategoryReq] = useState(false);
  const [locationReq, setLocationReq] = useState(false);
  const [measurementReq, setMeasurementReq] = useState(false);
  const [reorderReq, setReorderReq] = useState(false);
  const [costReq, setCostReq] = useState(false);
  const [descriptionReq, setDescriptionReq] = useState(false);

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

  function onNameChange(value) {
    setItemName(value);
    setNameReq(true);
  };

  function onCategoryChange(value) {
    setItemCategory(value);
    setCategoryReq(true);
  };

  function onMeasurementChange(value) {
    setItemMeasurement(value);
    setMeasurementReq(true);
  };

  function onLocationChange(value) {
    setItemLocation(value);
    setLocationReq(true);
  };

  function onReorderChange(value) {
    setItemReorder(value);
    setReorderReq(true);
  };

  function onCostChange(value) {
    setItemCost(value);
    setCostReq(true);
  };

  function onDescriptionChange(value) {
    setItemDescription(value);
    setDescriptionReq(true);
  };

  async function onFinish() {
    setSubmit(true);
    setLabel(props.update ? "Update Item":"Add New Item");
    setColor("#318CE7");
    var itemData = {
      item_code: itemCode,
      item_name: itemName,
      item_category: itemCategory,
      item_location: itemLocation,
      item_measurement: itemMeasurement,
      item_reorder: itemReorder,
      item_onhand: itemOnHand,
      item_cost: itemCost,
      item_description: itemDescription,
    };
    try {
      await axios({
        method: props.update ? "PATCH":"POST",
        url: 'http://localhost:8000/api/item/',
        data: itemData,
      });
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
          <ResultEvent icon={<CheckCircleOutlined style={{color: "#318CE7"}} />} status="success"
          title={props.update ? "Successfully updated Item!":"Successfully added new Item!"}
          subTitle={"Item name " + itemName + " with code " + itemCode}
          extra={<Button size="large" type="primary" icon="" onClick={() => newItem()}>ADD NEW ITEM</Button>} />
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
                  <Form.Item name={['name',]} label="Item Name" initialValue={itemName} rules={[{required: props.update ? nameReq:true, message: 'Please input item name!',},]}>
                    <Input value={itemName} onChange={e => onNameChange(e.target.value)} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <div className="space-between-row" style={{width: "100%"}}>
                  <Col span={11}>
                    <Form.Item name={['category',]} label="Category" initialValue={itemCategory} rules={[{required: props.update ? categoryReq:true, message: 'Please select category!',},]}>
                      <Select size="large" showSearch className="small-font" style={{width: "100%"}} optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                      value={itemCategory} options={categories.map((cat) => {return {value: cat.category, label: cat.category};})} onChange={onCategoryChange} />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item name={['measurement',]} label="Unit Of Measurement" initialValue={itemMeasurement} rules={[{required: props.update ? measurementReq:true, message: 'Please select unit of measurement!',},]}>
                      <Select size="large" showSearch className="small-font" style={{width: "100%"}} optionFilterProp="children" filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                      value={itemMeasurement} options={measurements.map((mes) => {return {value: mes.measurement, label: mes.measurement};})} onChange={onMeasurementChange} />
                    </Form.Item>
                  </Col>
                </div>
              </Row>
              <Row>
                <div className="space-between-row" style={{width: "100%"}}>
                  <Col span={7}>
                    <Form.Item name={['location',]} label="Physical Location" initialValue={itemLocation} rules={[{required: props.update ? locationReq:true, message: 'Please input physical location!',},]}>
                      <Input value={itemLocation} onChange={e => onLocationChange(e.target.value)} />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item name={['reorder',]} label="Reorder Quantity" initialValue={itemReorder} rules={[{required: props.update ? reorderReq:true, message: 'Please input a valid reorder quantity!', type: 'number',},]}>
                      <InputNumber min={1} max={1000000} value={itemReorder} onChange={onReorderChange} />
                    </Form.Item>
                  </Col>
                  <Col span={7}>
                    <Form.Item name={['cost',]} label="Unit Cost" initialValue={itemCost} rules={[{required: props.update ? costReq:true, message: 'Please input a valid unit cost!', type: 'number',},]}>
                      <InputNumber min={1} max={1000000} value={itemCost} onChange={onCostChange} />
                    </Form.Item>
                  </Col>
                </div>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name={['description',]} label="Description" initialValue={itemDescription} rules={[{required: props.update ? descriptionReq:true, message: 'Please input description!',},]}>
                    <Input.TextArea value={itemDescription} onChange={e => onDescriptionChange(e.target.value)} />
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

export default AddUpdateItem;