import * as React from 'react';
import type { ColorSketchPickerProps } from '../../color';
import { ColorSketchPicker } from '../../color';
import type { BizFormItemProps } from './Item';
import BizFormItem from './Item';
import getLabel from '../_util/getLabel';

export interface BizFormItemColorProps extends BizFormItemProps, Pick<ColorSketchPickerProps, 'showText' | 'colorMode' | 'placement' | 'size'> {
  colorProps?: ColorSketchPickerProps;
}

const BizFormItemColor: React.FC<BizFormItemColorProps> = ({
  required = false,
  size,
  showText,
  colorMode,
  placement,
  colorProps,
  ...restProps
}) => {
  return (
    <BizFormItem
      required={required}
      rules={[
        {
          validator(rules, value) {
            let errMsg = '';
            if (!value) {
              errMsg = required ? `请选择${getLabel(restProps)}` : '';
            }
            if (errMsg) {
              return Promise.reject(errMsg);
            }
            return Promise.resolve();
          }
        }
      ]}
      {...restProps}
    >
      <ColorSketchPicker
        showText={showText}
        colorMode={colorMode}
        placement={placement}
        size={size}
        {...colorProps}
      />
    </BizFormItem>
  );
};

export default BizFormItemColor;
