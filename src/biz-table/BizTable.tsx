import * as React from 'react';
import { Table, Card, Space } from 'antd';
import { TableProps, ColumnType, ColumnGroupType } from 'antd/es/table';
import { SpaceProps } from 'antd/es/space';
import { SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
import { CardProps } from 'antd/es/card';
import { FormInstance } from 'antd/es/form';
import { ValueType } from '../biz-field/interface';
import { EnumData } from '../dictionary';
import SearchForm, { SearchFormProps } from './SearchForm';
import { QueryFormProps } from '../biz-form/components/QueryForm';
import usePagination from './usePagination';
import BizField from '../biz-field';

export type ActionType = {
  reload?: () => void;
  reset?: () => void;
};

type RecordType = {
  [x: string]: any;
};

export type Request = (
  params: {
    pageSize?: number;
    current?: number;
    [key: string]: any;
  },
  filters: Record<string, (string | number)[] | null>,
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
  extra: TableCurrentDataSource<RecordType>,
) => Promise<{ data: object[]; total?: number; [x: string]: any }>;

export declare type BizColumns = ((ColumnGroupType<any> | ColumnType<any>) & {
  valueType?: ValueType;
  valueEnum?: EnumData;
})[];

export declare interface BizTableInnerProps
  extends TableProps<RecordType>,
    Pick<SearchFormProps, 'formItems'> {
  formRef?:
    | React.MutableRefObject<FormInstance | undefined>
    | ((instance: FormInstance<any>) => void);
  ref?: React.MutableRefObject<ActionType | undefined> | ((actionRef: ActionType) => void);
  columns?: BizColumns;
  runOnMount?: boolean;
  autoRequest?: boolean;
  request?: Request;
  form?: QueryFormProps;
  spaceProps?: SpaceProps;
  formCardProps?: CardProps;
  tableCardProps?: CardProps;
  toolbar?: React.ReactNode;
  extra?: React.ReactNode;
}

const BizTableInner: React.FC<BizTableInnerProps> = React.forwardRef(
  (
    {
      formItems,
      formRef,
      form,

      spaceProps,
      formCardProps,
      tableCardProps,

      toolbar,
      extra,

      request,
      autoRequest = true,

      columns,
      pagination,
      onChange,
      ...restProps
    },
    ref,
  ) => {
    const innerFormRef =
      (formRef as React.MutableRefObject<FormInstance | undefined>) ||
      React.useRef<FormInstance | undefined>();

    const { data, loading, run, onTableChange, pagination: paginationRet } = usePagination(
      request,
      {
        autoRun: false,
        defaultPageSize: (pagination && pagination?.pageSize) || 10,
      },
    );

    const handleChange = React.useCallback((page, filters, sorter, extra) => {
      onTableChange(page, filters, sorter, extra);
      typeof onChange === 'function' && onChange(page, filters, sorter, extra);
    }, []);

    const handleReset = React.useCallback(() => {
      if (formItems) {
        innerFormRef.current?.resetFields();
        innerFormRef.current?.submit();
      } else {
        run({}); // 触发修改分页
      }
    }, []);

    const currentColumns = React.useMemo(
      () =>
        columns.map(({ valueType, valueEnum, ...restItem }) => {
          const newItem = {
            ...restItem,
          };
          if (valueType && !newItem.render) {
            if (valueType === 'index' || valueType === 'indexBorder') {
              newItem.render = (text, record, index) => (
                <BizField value={index} valueType={valueType} valueEnum={valueEnum} />
              );
            } else {
              newItem.render = (text) => (
                <BizField value={text} valueType={valueType} valueEnum={valueEnum} />
              );
            }
          }
          return newItem;
        }),
      [columns],
    );

    React.useImperativeHandle(
      ref,
      () => ({
        reload: run,
        reset: handleReset,
      }),
      [],
    );

    React.useEffect(() => {
      if (autoRequest) {
        if (formItems) {
          innerFormRef.current?.submit();
        } else {
          run();
        }
      }
    }, []);

    const tableCardStyle = React.useMemo(
      () => ({ padding: !formItems && !toolbar ? 0 : '16px 24px 0' }),
      [formItems, toolbar],
    );

    return (
      <Space
        direction="vertical"
        size={16}
        {...spaceProps}
        style={{ display: 'flex', width: '100%', ...spaceProps?.style }}
      >
        <SearchForm
          formItems={formItems}
          ref={innerFormRef}
          loading={loading}
          onFinish={run}
          onReset={handleReset}
          cardProps={formCardProps}
          {...form}
        />
        {extra}
        <Card
          bordered={false}
          {...tableCardProps}
          bodyStyle={{ ...tableCardStyle, ...tableCardProps?.bodyStyle }}
        >
          {toolbar && <div style={{ padding: '0 0 16px' }}>{toolbar}</div>}
          <Table
            loading={loading}
            columns={currentColumns}
            dataSource={data}
            pagination={
              typeof pagination !== 'boolean' || pagination
                ? { ...paginationRet, ...pagination }
                : false
            }
            onChange={handleChange}
            {...restProps}
          />
        </Card>
      </Space>
    );
  },
);

export interface BizTableProps extends Omit<BizTableInnerProps, 'ref'> {
  actionRef?: React.MutableRefObject<ActionType | undefined> | ((actionRef: ActionType) => void);
}

const BizTable: React.FC<BizTableProps> = ({ actionRef, ...restProps }) => {
  const innerActionRef =
    (actionRef as React.MutableRefObject<ActionType | undefined>) ||
    React.useRef<ActionType | undefined>();

  return <BizTableInner {...restProps} ref={innerActionRef} />;
};

export default BizTable;