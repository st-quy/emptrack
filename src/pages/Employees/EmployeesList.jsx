import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Pagination, Table, Tooltip } from 'antd';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import Breadcrumb from '../../components/molecules/Breadcrumb/Breadcrumb';
const columns = [
  {
    title: 'Action',
    key: 'action',
    width: 150,
    render: (text, record) => (
      <span>
        <Tooltip title="Delete">
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          />
        </Tooltip>
        <Tooltip title="View">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.key)}
          />
        </Tooltip>
      </span>
    ),
  },
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    key: 'avatar',
    width: 150,

    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',

    render: (text) => <a>{text}</a>,
    width: 150,
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    render: (text) => <a>{text}</a>,
    width: 150,
  },

  {
    title: 'Phone Number',
    dataIndex: 'phone',
    key: 'phone',
    width: 150,
  },
  {
    title: 'Adress',
    dataIndex: 'address',
    key: 'address',
    width: 150,
  },
  {
    title: 'Date Of Birth',
    dataIndex: 'dob',
    key: 'dob',
    width: 150,
  },
  {
    title: 'Citizen Identity Card',
    dataIndex: 'cccd',
    key: 'cccd',
    width: 150,
  },
  {
    title: 'Is Manager',
    dataIndex: 'isManager',
    key: 'isManager',
    width: 150,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Line Manager',
    dataIndex: 'lineManager',
    key: 'lineManager',
    width: 150,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
    width: 150,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 150,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Skill',
    dataIndex: 'skills',
    key: 'skills',
    width: 150,

    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
    width: 150,

    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 150,
    ellipsis: {
      showTitle: false,
    },
  },
];
const data = [
  {
    name: 'tu',
    skills: 'múa lửa',
    gender: ' nam',
  },
  {
    name: 'tu',
    skills: 'múa lửa',
    gender: ' nam',
  },
  {
    name: 'tu',
    skills: 'múa lửa',
    gender: ' nam',
  },
];
const handleDelete = (key) => {
  // Implement delete logic here
  console.log(`Deleting record with key ${key}`);
};
const handleView = (key) => {
  // Implement view logic here
  console.log(`Viewing record with key ${key}`);
};
const EmployeesList = () => {
  const breadcrumbItems = [{ key: 'employees' }];
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <Card title="Danh sách nhân viên">
        <Table
          columns={columns}
          dataSource={data}
          scroll={{
            x: 1500,
            y: 300,
          }}
          pagination={false}
          style={{ marginTop: '20px' }}
        />
        <Pagination
          total={25}
          showSizeChanger
          showTotal={(total) => `Total ${total} items`}
          style={{ marginTop: '20px' }}
        />
      </Card>
    </>
  );
};
export default EmployeesList;
