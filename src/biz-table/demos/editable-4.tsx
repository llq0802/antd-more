import * as React from 'react';
import { Row, Col, Space, Button } from 'antd';
import { BizForm, BizTable } from 'antd-more';
import { EditableActionType } from 'antd-more/es/biz-table';
import Mock from 'mockjs';
import { Bank } from './constants';

Mock.Random.extend({
  bank() {
    return this.pick(Bank.map(item => item.value))
  }
});

const defaultData = Mock.mock({
  'list|2-5': [{
    'id|+1': 1,
    'shopsName|5-10': '@cword',
    'bank': ['@bank'],
    'money|0-10000.2': 1,
    'startDate': '@date',
    'endDate': '@date',
  }]
}).list;

const { EditableBizTable } = BizTable;
const { Item, ItemInput, ItemDate, ItemNumber } = BizForm;

const colspanConfig = {
  xxl: 6,
  lg: 8,
  md: 12,
  xs: 24
}

const Demo: React.FC = () => {
  const [form] = BizForm.useForm();
  const [editableKeys, setEditableKeys] = React.useState(() => defaultData.map(item => item.id));
  const editableActionRef = React.useRef<EditableActionType>();

  const columns = [
    {
      dataIndex: "shopsName",
      title: "商品名称",
    },
    {
      dataIndex: "bank",
      title: "银行",
      valueType: "enum",
      valueEnum: Bank,
      width: 300,
      // editable: {
      //   itemType: "checkbox"
      // }
      editable: {
        selectProps: {
          showSearch: true,
          mode: "multiple"
        }
      }
    },
    {
      dataIndex: "money",
      title: "金额",
      editable: {
        itemType: "number"
      }
    },
    {
      title: "交易时间",
      children: [
        {
          dataIndex: "startDate",
          title: "开始时间",
          valueType: "date"
        },
        {
          dataIndex: "endDate",
          title: "结束时间",
          valueType: "date"
        },
      ]
    },
    {
      title: "操作",
      fixed: "right" as "right",
      width: 80,
      render: (_, record, index) => (
        <Space>
          {/* {
            form.getFieldValue("list").length - 1 === index && (
              <a onClick={() => editableActionRef.current.add({ id: Date.now() }, index + 1)} >新增</a>
            )
          } */}
          <a onClick={() => editableActionRef.current.delete(record.id)}>删除</a>
        </Space>
      )
    }
  ];

  return (
    <BizForm
      name="editable-4"
      onFinish={values => {
        console.log("onFinish ", values);
      }}
      onReset={() => {
        editableActionRef.current.clearNewRecords(); // 删除新增项
        editableActionRef.current.reset(); // 重置表单
      }}
      form={form}
      submitter={{
        render: (_, dom) => dom
      }}
    >
      <Row gutter={16}>
        <Col {...colspanConfig}>
          <ItemInput label="商品编号" name="goodsNo" />
        </Col>
        <Col {...colspanConfig}>
          <ItemDate label="交易日期" name="tradeDate" />
        </Col>
        <Col {...colspanConfig}>
          <ItemNumber label="终端编号" name="terminalNo" />
        </Col>
      </Row>
      <Item
        label="数据列表"
        name="list"
        initialValue={defaultData}
        trigger="onValuesChange"
        hideLabel
        style={{ marginBottom: 10 }}
      >
        <EditableBizTable
          rowKey="id"
          columns={columns}
          editable={{
            editableKeys,
            onChange: setEditableKeys,
            editableActionRef
          }}
          bordered
          scroll={{
            x: 1200
          }}
        />
      </Item>
      <Button type="dashed" block onClick={() => editableActionRef.current.add({ id: Date.now() })} style={{ margin: "0 0 24px" }}>添加一行数据</Button>
    </BizForm>
  );
}

export default Demo;