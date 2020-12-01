import * as React from 'react';
import { Input } from 'antd';
import { isPassword } from 'util-helpers';
import { PasswordProps } from 'antd/es/input';
import BizFormItem, { BizFormItemProps } from './Item';

export interface FormItemPasswordProps extends BizFormItemProps {
  level?: 1 | 2 | 3;
  min?: number;
  max?: number;
  ignoreCase?: boolean;
  special?: string;
  inputProps?: PasswordProps;
}

// 过滤特殊字符
function filterNumberAndLetter(val: string): string {
  const regNumberAndLetter = /[\da-z]/gi;
  return val.replace(regNumberAndLetter, '');
}

// 是否为十六进制
function hasHex(val) {
  return val.indexOf('\\x') > -1 || val.indexOf('\\u') > -1;
}

// 是否包含禁用特殊字符
function hasDisabledChar(val: string | undefined, chars: string = ''): boolean {
  if (typeof val === 'string' && chars) {
    const specialChars = filterNumberAndLetter(val);
    const regDisabledChars = hasHex(chars) ? new RegExp(`[^${chars}]`) : null;

    if (regDisabledChars) {
      return regDisabledChars.test(specialChars);
    }

    let ret = false;
    specialChars.split('').some((charItem) => {
      if (chars.indexOf(charItem) === -1) {
        ret = true;
      }
      return ret;
    });

    return ret;
  }

  return false;
}

// 数字
const numMap = ['零', '一', '两', '三'];

const FormItemPassword: React.FC<FormItemPasswordProps> = ({
  level = 2,
  min = 8,
  max = 16,
  ignoreCase = false,
  special = '\\x21-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7B-\\x7E',

  inputProps = {},
  label,
  required = false,
  ...restProps
}) => {
  return (
    <BizFormItem
      label={label}
      validateTrigger="onBlur"
      required={required}
      rules={[
        {
          validator(rule, value) {
            let errMsg = '';
            if (!value) {
              errMsg = required ? `请输入${label}` : '';
            } else if (value.length < min || value.length > max) {
              errMsg = `${label}为${min}～${max}位`;
            } else if (hasDisabledChar(value, special)) {
              errMsg = `${label}包含无法识别的字符`;
            } else if (!isPassword(value, { ignoreCase, level, special })) {
              errMsg = `${label}为大小写字母、数字或符号任意${numMap[level]}者组成`;
            }
            if (errMsg) {
              return Promise.reject(errMsg);
            }
            return Promise.resolve();
          },
        },
      ]}
      {...restProps}
    >
      <Input.Password placeholder="请输入" autoComplete="off" allowClear {...inputProps} />
    </BizFormItem>
  );
};

export default FormItemPassword;