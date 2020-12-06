import * as React from 'react';
import { Row, Col } from 'antd';
import { BizForm } from 'antd-more';
import lcnFormPC from 'lcn/lcn-form-pc';

const { ItemInput, ItemAddress, ItemRadio, ItemBankCard } = BizForm;

const oneColSpan = {
  span: 24
};
const twoColSpan = {
  span: 24,
  lg: 12
};

// 结算方式
export const enumSettlementCycle = [
  {
    value: "T1",
    name: "T+1"
  },
  {
    value: "D1",
    name: "D+1"
  }
];

// 结算类型
export const enumBankCardType = [
  {
    value: "0",
    name: "对公账户"
  },
  {
    value: "1",
    name: "对私账户"
  }
];

const SettlementInfo: React.FC<{}> = () => {
  const [loading, setLoading] = React.useState(false);
  const onFinish = React.useCallback((values) => {
    console.log(values);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <BizForm
      name="form-settlement-info"
      onFinish={onFinish}
      loading={loading}
      submitter={{
        submitText: "提交",
        submitButtonProps: {
          size: "large",
          style: {
            padding: "0 40px"
          }
        },
        // 提交按钮居中
        render: (_, dom) => <div style={{ display: "flex", justifyContent: "center" }}>{dom.shift()}</div>,
      }}
      labelCol={{
        flex: "0 0 120px"
      }}
    >
      <Row>
        <Col {...oneColSpan}>
          <ItemRadio label="结算方式" name="settlementCycle" required options={enumSettlementCycle} extra="T为工作日，D为自然日" />
        </Col>
        <Col {...oneColSpan}>
          <ItemRadio label="结算类型" name="settlementType" required options={enumBankCardType} />
        </Col>
        <Col {...oneColSpan}>
          <ItemInput label="账户名称" name="bankCertName" required />
        </Col>
        <Col {...twoColSpan}>
          <ItemBankCard label="银行卡号" name="bankCardNo" required formatting />
        </Col>
        <Col {...twoColSpan}>
          <ItemInput label="开户银行名称" name="bankName" required />
        </Col>
        <Col {...oneColSpan}>
          <ItemAddress label="开户支行" names={["branchLocation", "branchName"]} labels={["省/市", "支行名称"]} required options={lcnFormPC} />
        </Col>
      </Row>
    </BizForm >
  );
}

export default SettlementInfo;