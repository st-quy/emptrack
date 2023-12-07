/* eslint-disable no-unused-vars */
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Card,
  Image,
  Input,
  Pagination,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import Button from '../../../components/atoms/Button/Button';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import { axiosInstance } from '../../../config/axios';

const EmployeesList = () => {
  const [currentPage, setCrurentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axiosInstance.get('employees').then((response) => {
          setData(response.data);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  const handleDelete = (id) => {
    // Implement delete logic here
    console.log(`Deleting record with id ${id}`);
  };
  const handleView = (id) => {
    // Implement view logic here
    console.log(`Viewing record with id ${id}`);
  };
  const columns = [
    {
      title: 'Action',
      key: 'action',
      fixed: 'left',
      width: 100,
      render: (text, record) => (
        <span>
          <Tooltip title="Delete">
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
          <Tooltip title="View">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleView(record.id)}
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
      render: (avatar) => (
        <span>
          {avatar.map((avatar, index) => (
            <Image key={index} src={avatar.url} alt={`Avatar ${index + 1}`} />
          ))}
        </span>
      ),

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
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
      onFilter: (value, record) => record.gender === value,
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
      render: (isManager) => (
        <Tag color={isManager ? 'green' : 'red'}>
          {isManager ? 'Yes' : 'No'}
        </Tag>
      ),
      ellipsis: {
        showTitle: false,
      },
      // filters: [
      //   { text: 'Yes', value: 'yes' },
      //   { text: 'No', value: 'no' },
      // ],
      // onFilter: (value, record) => record.isManager === value,
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
      render: (status) => (
        <Tooltip placement="topLeft" title={status}>
          <span
            style={{
              backgroundColor: status === 'active' ? 'green' : 'red',
              color: 'white',
              padding: '3px 8px',
              borderRadius: '4px',
              display: 'inline-block',
            }}
          >
            {status}
          </span>
        </Tooltip>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Skill',
      dataIndex: 'skills',
      key: 'skills',
      width: 150,
      render: (skills) => (
        <ul>
          {skills.map((skill, index) => (
            <li key={index}>
              <strong>{skill.skillname}</strong>: {skill.exp}
            </li>
          ))}
        </ul>
      ),
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

  const [searchedText, setSearchedText] = useState('');

  return (
    <div className="project_create">
      <Space className="w-100 justify-content-between">
        <Breadcrumb items={[{ key: 'employees' }]} />
        <Button>Tạo ứng dụng</Button>
      </Space>
      <Card title="Danh sách người dùng">
        <Input.Search
          placeholder="Tìm kiếm..."
          style={{ marginBottom: 8, width: 200 }}
          onChange={(e) => setSearchedText(e.target.value)}
        />
        <Table
          columns={columns}
          dataSource={data
            .filter(
              (item) =>
                (item.name &&
                  item.name
                    .toLowerCase()
                    .includes(searchedText.toLowerCase())) ||
                (item.address &&
                  item.address
                    .toLowerCase()
                    .includes(searchedText.toLowerCase())),
            )
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          scroll={{
            x: 1500,
            y: 'calc(100vh - 400px)',
          }}
          pagination={false}
        />
        <Pagination
          total={data.length}
          current={currentPage}
          pageSize={pageSize}
          showSizeChanger
          showTotal={(total) => `Total ${total} items`}
          style={{ marginTop: '25px' }}
          onChange={(page, pageSize) => {
            setCrurentPage(page);
            setPageSize(pageSize);
          }}
        />
      </Card>
    </div>
  );
};
export default EmployeesList;