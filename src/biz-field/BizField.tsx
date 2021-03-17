import React from 'react';
import { formatMoney } from 'util-helpers';
import { BizFieldProps } from './interface';
import FieldProgress from './components/Progress';
import FieldIndex from './components/Index';
import FieldImage from './components/Image';
import Dictionary from '../dictionary';
import Color from '../color';
import Percent from './components/Percent';
import { getDateStr } from './_util/dateUtil';
import parseValueType from './_util/parseValueType';

const DateType = [
  'date',
  'dateWeek',
  'dateMonth',
  'dateQuarter',
  'dateYear',
  'dateRange',
  'dateTime',
  'dateTimeRange',
  'time',
  'timeRange',
  'fromNow',
];
const IndexType = ['index', 'indexBorder'];
const EnumType = ['enum', 'enumTag', 'enumBadge'];

const BizField: React.FC<BizFieldProps> = ({
  value,
  valueType,
  valueEnum = [],
  formatValue,
  ...restProps
}) => {
  const { type, formatValue: otherFormatValue, ...restParams } = parseValueType(valueType, value);
  const props = {
    ...restProps,
    ...restParams,
  };

  const formatFn = otherFormatValue || formatValue;

  const realValue = typeof formatFn === 'function' ? formatFn(value) : value;

  if (type === 'text' || type === 'money') {
    // 文本 或 金额
    const { color, size, prefix, suffix, style, ...restTextProps } = props || {};
    const styles: Record<string, any> = { ...style };

    const retValue = type === 'text' ? realValue : formatMoney(realValue);

    if (props?.color && retValue) {
      styles.color = props.color;
    }
    if (props?.size && retValue) {
      styles.fontSize = props.size;
    }

    return (
      <span {...restTextProps} style={styles}>
        {retValue ? (
          <>
            {prefix}
            {retValue}
            {suffix}
          </>
        ) : (
          '-'
        )}
      </span>
    );
  } else if (type === 'image') {
    // 图片
    return <FieldImage value={realValue} {...props} />;
  } else if (DateType.includes(type)) {
    // 日期类型
    const { format, ...rest } = props;
    return <span {...rest}>{getDateStr(realValue, type, format)}</span>;
  } else if (IndexType.includes(type)) {
    // 序号
    return <FieldIndex value={realValue + 1} type={type} {...props} />;
  } else if (type === 'progress') {
    // 进度条
    return <FieldProgress value={realValue} {...props} />;
  } else if (type === 'percent') {
    // 百分比
    return <Percent value={realValue} {...props} />;
  } else if (EnumType.includes(type)) {
    // 枚举值
    const typeObj = {
      enum: 'text',
      enumBadge: 'badge',
      enumTag: 'tag',
    };
    const enumProps = {
      value: realValue,
      type: typeObj[type],
      data: valueEnum,
    };
    return Array.isArray(realValue) ? (
      <Dictionary.List {...enumProps} {...props} />
    ) : (
      <Dictionary {...enumProps} {...props} />
    );
  } else if (type === 'color') {
    // 颜色
    return <Color value={realValue} {...props} />;
  }

  return realValue;
};

export default BizField;
