import React, { useState, useCallback } from 'react';
import type { PhotoshopPickerProps } from 'react-color';
import { PhotoshopPicker } from 'react-color';
import type { PickerCommonProps } from './PickerWrapper';
import PickerWrapper from './PickerWrapper';
import { transformColor } from './utils';

export type ColorPhotoshopPickerProps = Omit<
  PhotoshopPickerProps,
  'onChange' | 'onChangeComplete'
> &
  Omit<PickerCommonProps, 'changeMethod'> & {
    changeMethod?: 'onChangeComplete' | 'onAccept';
  };

const ColorPhotoshopPicker: React.FC<ColorPhotoshopPickerProps> = ({
  className,
  value,
  trigger,
  showText,
  onChange,
  colorMode,
  placement,
  size,
  changeMethod = 'onAccept',
  ...restProps
}) => {
  const [visible, setVisible] = useState(false);
  const wrapperProps = {
    className,
    value,
    trigger,
    showText,
    colorMode,
    placement,
    size,
    visible,
    onVisibleChange: setVisible
  };
  const [innerColor, setInnerColor] = useState(value);

  const handleChange = useCallback(
    (color) => {
      setInnerColor(transformColor(color, colorMode));
    },
    [colorMode]
  );

  const handleAccept = useCallback(() => {
    onChange?.(innerColor as string);
    setVisible(false);
  }, [onChange, innerColor]);

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const changeMethodProps = {
    [changeMethod]: handleAccept
  };

  return (
    <PickerWrapper {...wrapperProps} defined>
      <PhotoshopPicker
        color={innerColor}
        onChange={handleChange}
        onCancel={handleCancel}
        {...changeMethodProps}
        {...restProps}
      />
    </PickerWrapper>
  );
};

export default ColorPhotoshopPicker;
