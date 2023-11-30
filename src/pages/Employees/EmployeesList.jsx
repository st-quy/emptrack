// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Table, Tooltip, Button } from 'antd';
import Breadcrumb from '../../components/molecules/Breadcrumb/Breadcrumb';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';



const columns = [
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <Tooltip title="Delete">
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          />
        </Tooltip>
        <Tooltip title="Update">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record.key)}
          />
        </Tooltip>
      </span>
    ),
  },
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    key: 'avatar',
    ellipsis: {
      showTitle: false,
    },
    render: (address) => (
      <Tooltip placement="topLeft" title={address}>
        {address}
      </Tooltip>
    ),
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
    dataIndex: 'phone_number',
    key: 'phone_number',
    width: 150,
  },
  {
    title: 'Date Of Birth',
    dataIndex: 'date_of_birth',
    key: 'date_of_birth',
    width: 150,
  },
  {
    title: 'Citizen Identity Card',
    dataIndex: 'citizen_identity_card',
    key: 'citizen_identity_card',
    width: 150,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    with: 150,
    ellipsis: {
      showTitle: false,
    },
    render: (address) => (
      <Tooltip placement="topLeft" title={address}>
        {address}
      </Tooltip>
    ),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    ellipsis: {
      showTitle: false,
    },
    render: (address) => (
      <Tooltip placement="topLeft" title={address}>
        {address}
      </Tooltip>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    ellipsis: {
      showTitle: false,
    },
    render: (address) => (
      <Tooltip placement="topLeft" title={address}>
        {address}
      </Tooltip>
    ),
  },
  {
    title: 'Skill',
    dataIndex: 'skill',
    key: 'skill',
    ellipsis: {
      showTitle: false,
    },
    render: (address) => (
      <Tooltip placement="topLeft" title={address}>
        {address}
      </Tooltip>
    ),
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
    ellipsis: {
      showTitle: false,
    },
    render: (address) => (
      <Tooltip placement="topLeft" title={address}>
        {address}
      </Tooltip>
    ),
  },
];
const data = [
  {
    avatar: '1',
    name: 'John Brown',
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    date_of_birth: '07-12-1290',
  },
  {
    avatar: '2',
    name: 'John Brown',
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    date_of_birth: '07-12-1290',
  },
  {
    avatar: '10',
    name: 'John1 Brown',
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    date_of_birth: '07-12-1290',
  },
  {
    avatar: '1',
    name: 'John Brown',
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    date_of_birth: '07-12-1290',
  },
];
const handleDelete = (key) => {
  // Implement delete logic here
  console.log(`Deleting record with key ${key}`);
};

const handleUpdate = (key) => {
  // Implement update logic here
  console.log(`Updating record with key ${key}`);
};
const EmployeesList = () => {
  const breadcrumbItems = [{ key: 'employees' } ];
  return (
    <>
       <Breadcrumb items={breadcrumbItems} />
      <Table
        columns={columns}
        dataSource={data}
        scroll={{
          x: 1500,
          y: 300,
        }}
      />
      
    </>
  ); 
};
export default EmployeesList;
