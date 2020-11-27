import * as React from 'react';
import { Form } from 'antd';
import { FormListProps } from 'antd/es/form';
import ListFieldContext from '../ListFieldContext';

type TransformFn<T = any> = (value: T) => T | any;

export interface BizFormListProps extends FormListProps {
  transform?: TransformFn;
}

const BizFormList: React.FC<FormListProps> = ({ children, name, ...restProps }) => {
  const { parentListName = [] } = React.useContext(ListFieldContext); // FormList嵌套FormList的情况

  return (
    <ListFieldContext.Provider value={{ parentListName: [...parentListName, name] }}>
      <Form.List name={name} {...restProps}>
        {children}
      </Form.List>
    </ListFieldContext.Provider>
  );
};

export default BizFormList;
