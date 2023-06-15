import { Typography, Button, Form, Input, InputNumber, Card, Select, } from 'antd';

const { Title } = Typography;
const { Option } = Select;

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

const onFinish = (values) => {
  console.log(values);
};

const AddItem = () => {

  return (
    <>
      <div className="justified-row">
        <div style={{margin: "40px", marginTop: "2%", width: "50%"}}>
          <Card size="large" title={<Title><p className="big-card-title">Add New Item</p></Title>} hoverable>
            <Form {...layout} layout="vertical" size="large" name="add-new-item" onFinish={onFinish} validateMessages={validateMessages}>
              <Form.Item name={['name',]} label="Name" rules={[{required: true,},]}>
                <Input />
              </Form.Item>
              <Form.Item name={['category',]} label="Category" rules={[{required: true,},]}>
                <Select placeholder="Select Category">
                  <Option value="Electronic">Zhejiang</Option>
                  <Option value="Gadget">Jiangsu</Option>
                </Select>
              </Form.Item>
              <Form.Item name={['location',]} label="Physical Location" rules={[{required: true,},]}>
                <Input />
              </Form.Item>
              <Form.Item name={['measurement',]} label="Unit Of Measurement" rules={[{required: true,},]}>
                <Select placeholder="Select Measurement">
                  <Option value="Each">Zhejiang</Option>
                  <Option value="Meter">Jiangsu</Option>
                </Select>
              </Form.Item>
              <Form.Item name={['reorder',]} label="Reorder Quantity" rules={[{required: true, type: 'number', min: 0, max: 1000000,},]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name={['cost',]} label="Unit Cost" rules={[{required: true, type: 'number', min: 0, max: 1000000,},]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name={['description',]} label="Description" rules={[{required: true,},]}>
                <Input.TextArea />
              </Form.Item>
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