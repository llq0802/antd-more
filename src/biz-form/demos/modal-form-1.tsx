import * as React from 'react';
import { Button, message } from 'antd';
import {
  ModalForm,
  BizFormItemInput,
  BizFormItemSelect,
  BizFormItemNumber,
  BizFormItemUpload,
  BizFormItemTextArea
} from 'antd-more';
import { BillAccountOptions } from './constants';
import waitTime from '../../utils/waitTime';

const Demo = () => {
  return (
    <ModalForm
      title="创建付款单"
      trigger={<Button type="primary">创建付款单</Button>}
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values);
        message.success('提交成功');
      }}
      labelWidth={112}
    >
      <BizFormItemInput label="收款账号" name="ban" required />
      <BizFormItemSelect
        label="收款账号名称"
        name="accountName"
        options={BillAccountOptions}
        required
      />
      <BizFormItemNumber label="付款金额" name="money" required precision={2} contentAfter="¥" />
      <BizFormItemUpload
        label="材料文件"
        name="files"
        required
        title="上传文件"
        transform={(values) => values.map((val) => val.name)}
      />
      <BizFormItemTextArea
        label="备注（选填）"
        name="remark"
        disabledWhiteSpace
        inputProps={{ showCount: true, maxLength: 140 }}
      />
    </ModalForm>
  );
};

export default Demo;
