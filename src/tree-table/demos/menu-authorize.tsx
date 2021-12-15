import * as React from 'react';
import { TreeTable } from 'antd-more';
import jsonData from './data2';

const Demo = () => {
  const [checks, setChecks] = React.useState([]);

  const onChange = (value) => {
    console.log(value);
    setChecks(value);
  };

  return (
    <TreeTable
      treeData={jsonData}
      columnTitles={['一级菜单', '二级菜单']}
      value={checks}
      onChange={onChange}
    />
  );
};

export default Demo;
