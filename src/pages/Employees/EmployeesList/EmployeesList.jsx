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
        await axiosInstance
          .get('http://127.0.0.1:5501/employees.json')
          .then((response) => {
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
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      width: 120,
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 120,
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
      title: 'Citizen Indentity Card',
      dataIndex: 'citizen_card',
      key: 'citizen_card',
      width: 120,
    },
    {
      title: 'Manager',
      dataIndex: 'isManager',
      key: 'isManager',
      width: 100,
      render: (isManager) => (
        <Tag color={isManager ? 'green' : 'red'}>{isManager ? '✔' : '✘'} </Tag>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
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
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      width: 110,
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
        <Button>Thêm Nhân Viên</Button>
      </Space>
      <Card
        title={'Danh sách nhân viên'.toUpperCase()}
        style={{
          width: '100%',
          margin: 'auto',
          border: '1px solid #d9d9d9',
          borderRadius: '30px',
        }}
      >
        <Input.Search
          placeholder="Tìm kiếm..."
          style={{ marginTop: 8, marginBottom: 8, width: 300 }}
          onChange={(e) => setSearchedText(e.target.value)}
        />
        <Table
          columns={columns}
          dataSource={data
            .filter((item) => {
              return Object.values(item)
                .filter(
                  (value) =>
                    typeof value === 'string' || typeof value === 'number',
                )
                .some((value) =>
                  value
                    .toString()
                    .toLowerCase()
                    .includes(searchedText.toLowerCase()),
                );
            })
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          scroll={{
            x: true,
            y: 'calc(100vh - 330px)',
          }}
          pagination={false}
          size="small"
        />
        <Pagination
          total={data.length}
          current={currentPage}
          pageSize={pageSize}
          showSizeChanger
          showTotal={(total) => `Total ${total} items`}
          style={{ marginTop: '10px', marginBottom: '10px' }}
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
