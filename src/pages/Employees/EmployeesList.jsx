import React from 'react';
import { Table, Tooltip, Button, Card } from 'antd';
import Breadcrumb from '../../components/molecules/Breadcrumb/Breadcrumb';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';


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
        <Tooltip title="Edit">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleEdit(data)}
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
    gender: ' nam'
  },
  {
    name: 'tu',
    skills: 'múa lửa',
    gender: ' nam'
  },
  {
    name: 'tu',
    skills: 'múa lửa',
    gender: ' nam'
  },
];
const handleDelete = (key) => {
  // Implement delete logic here
  console.log(`Deleting record with key ${key}`);
};

  const handleEdit = () => {
      location.assign("http://localhost:5173/employees/update");

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
        />
      </Card>
    </>
  );
};
export default EmployeesList;
