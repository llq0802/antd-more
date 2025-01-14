import * as React from 'react';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';

const UploadImageButton: React.FC<{
  loading?: boolean;
  uploading?: boolean;
  icon?: React.ReactNode;
  title?: React.ReactNode;
}> = ({ loading = false, uploading = false, icon = <PlusOutlined />, title = '点击上传' }) => {
  const text = React.useMemo(() => {
    return loading ? '加载中' : uploading ? '上传中' : title; // eslint-disable-line
  }, [loading, title, uploading]);
  return (
    <div>
      {loading || uploading ? <LoadingOutlined /> : icon}
      <div style={{ marginTop: 8, lineHeight: 1.5 }}>{text}</div>
    </div>
  );
};

export default UploadImageButton;
