import * as React from 'react';
import { BizForm } from 'antd-more';

const { ItemCheckbox } = BizForm;

// 周期
const cycle = [
  {
    name: "按日",
    value: "0"
  },
  {
    name: "按月",
    value: "1"
  },
  {
    name: '按季度',
    value: '2'
  },
];

const Demo: React.FC<{}> = () => {
  return (
    <BizForm
      name='form-item-checkbox-1'
      onFinish={values => {
        console.log(values);
      }}
      labelCol={{
        flex: '0 0 96px'
      }}
    >
      <ItemCheckbox label="多选框1" name="checkbox1" options={cycle} />
      <ItemCheckbox label="多选框2" name="checkbox2" options={cycle} all allName="全全全部" required />
    </BizForm>
  );
}

export default Demo;