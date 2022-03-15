import * as React from 'react';
import { isBankCard, isEmail, isIdCard, isMobile } from 'util-helpers';
import {
  normalizeWhiteSpace,
  normalizeBankCard,
  normalizeIdCard,
  normalizeMobile
} from '../_util/normalize';
import { transformBankCard } from '../_util/transform';
import type { BizFormItemProps } from './Item';
import BizFormItem from './Item';
import InputWrapper from './form/InputWrapper';
import getLabel from '../_util/getLabel';
import type { InputProps } from './antd.interface';

type InputType = 'bankCard' | 'email' | 'idCard' | 'mobile' | 'userName';

const validateUserName = (value, { label }) => {
  const ret = {
    validated: true,
    message: ''
  };
  if (isMobile(value)) {
    ret.message = `${label}不能为手机号码`;
  } else if (value.indexOf('@') > -1) {
    ret.message = `${label}不能包含@符号`;
  }
  if (ret.message) {
    ret.validated = false;
  }
  return ret;
};

const validateMethod = {
  bankCard: (val) => isBankCard(val, { loose: true }),
  email: isEmail,
  idCard: (val) => isIdCard(val, { loose: true }),
  mobile: isMobile
};

const maxLengthConfig = {
  idCard: 18,
  mobile: 11
};

export interface BizFormItemInputProps extends BizFormItemProps {
  security?: boolean; // 脱敏。 为 true 时，必须传入 initialValue
  symbol?: string; // 脱敏符号
  type?: InputType;
  disabledWhiteSpace?: boolean;
  inputProps?: InputProps;
}

const BizFormItemInput: React.FC<BizFormItemInputProps> = ({
  type,
  security = false,
  symbol = '*',
  disabledWhiteSpace = false,
  inputProps = {},
  required = false,
  transform,
  normalize,
  ...restProps
}) => {
  const handleNormalize = React.useCallback(
    (value) => {
      if (type === 'bankCard') {
        return normalizeBankCard(value, { symbol: security ? symbol : '' });
      }
      if (type === 'idCard') {
        return normalizeIdCard(value, { symbol: security ? symbol : '' });
      }
      if (type === 'mobile') {
        return normalizeMobile(value, { symbol: security ? symbol : '' });
      }
      if (disabledWhiteSpace || type === 'email' || type === 'userName') {
        return normalizeWhiteSpace(value);
      }
      return value;
    },
    [type, disabledWhiteSpace, security, symbol]
  );
  const handleTransform = React.useCallback(
    (val) => {
      if (transform) {
        return transform(val);
      }
      if (type === 'bankCard') {
        return transformBankCard(val);
      }
      return val;
    },
    [transform, type]
  );

  const defaultInputProps = React.useMemo(() => {
    if (maxLengthConfig[type]) {
      return {
        maxLength: maxLengthConfig[type]
      };
    }
    return {};
  }, [type]);

  const messageLabel = getLabel(restProps);

  return (
    <BizFormItem
      required={required}
      normalize={normalize}
      rules={[
        {
          validator(rule, value) {
            let errMsg = '';
            if (!value) {
              errMsg = required ? `请输入${messageLabel}` : '';
            } else if (security && restProps?.initialValue === value) {
              // 脱敏校验
              errMsg = '';
            } else if (type === 'userName') {
              errMsg = validateUserName(value, { label: messageLabel }).message;
            } else if (validateMethod[type] && !validateMethod[type](value)) {
              errMsg = `请输入正确的${messageLabel}`;
            }
            if (errMsg) {
              return Promise.reject(errMsg);
            }
            return Promise.resolve();
          },
          transform: handleTransform
        }
      ]}
      transform={handleTransform}
      validateTrigger={type ? 'onBlur' : 'onChange'}
      {...restProps}
    >
      <InputWrapper
        placeholder="请输入"
        allowClear
        autoComplete="off"
        normalize={!normalize || type ? handleNormalize : undefined}
        adjustCursorPosition={!normalize && type === 'bankCard'}
        {...defaultInputProps}
        {...inputProps}
      />
    </BizFormItem>
  );
};

export default BizFormItemInput;
