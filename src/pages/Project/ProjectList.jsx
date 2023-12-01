import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/molecules/Breadcrumb/Breadcrumb';
import { Table, Tooltip, Card, Space, Input, Pagination } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import Button from '../../components/atoms/Button/Button';


const handleView = (key) => {
  // Implement view logic here
  console.log(`Viewing record with key ${key}`);
};

const handleUpdate = (key) => {
  // Implement update logic here
  console.log(`Updating record with key ${key}`);
};

const columns = [
  {
    title: 'Action',
    key: 'action',
    width: 100,
    
    render: (text, record) => (
      <span>
        <Tooltip title="Delete">
          <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} />
        </Tooltip>
        <Tooltip title="View">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record.key)} />
        </Tooltip>
      </span>
    ),
  },
  
  
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (text) => <a>{text}</a>,
    width: 50 ,
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
  },
  {
    title: 'Manager',
    dataIndex: 'manager',
    key: 'manager',
    width: 80,
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
    render: (managers) => (
      <span>
        {managers.map((manager, index) => (
          <div key={index}>{manager.name}</div>
        ))}
      </span>
    ),
  },
  {
    title: 'Members',
    dataIndex: 'member',
    key: 'member',
    width: 150,
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
    render: (members) => (
      <span>
        {members.map((member, index) => (
          <div key={index}>
            {member.name} - {member.role}
          </div>
        ))}
      </span>
    ),
  },
  {
    title: 'Project name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
    width: 150,
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
  },
  {
    title: 'Technical',
    dataIndex: 'technical',
    key: 'technical',
    width: 150, 
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 200,
    ellipsis: {
      showTitle: false,
    },
    render: (address) => (
      <Tooltip placement="topLeft" title={address}>
        <div style={{ whiteSpace: 'pre-line' }}>{address}</div>
      </Tooltip>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 150, 
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
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
    title: 'Start date',
    dataIndex: 'startDate',
    key: 'startDate',
    width: 150, 
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },

    ellipsis: {
      showTitle: false,
    },
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
    render: (address) => (
      <Tooltip placement="topLeft" title={address}>
        {address}
      </Tooltip>
    ),
  },
  {
    title: 'End date',
    dataIndex: 'endDate',
    key: 'endDate',
    width: 150,
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
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


const ProjectList = () => {
  const [data, setData] = useState([]);
  // const [searchedText, setSearchedText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api-emptrack.onrender.com/projects');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
 
  // const breadcrumbItems = [{ key: 'projects' }];
  const [searchedText, setSearchedText] = useState("")

  return (
    <div className="project_create">
      <Space className="w-100 justify-content-between">
        <Breadcrumb items={[{ key: 'projects' }]} />
        <Button>Tạo ứng dụng</Button>
      </Space>
      <Card title="Danh sách sản phẩm">
        <Input.Search
          placeholder="Tìm kiếm..."
          style={{ marginBottom: 8, width: 200 }}
          onChange={(e) => setSearchedText(e.target.value)}
        />

        <Table
          columns={columns}
          dataSource={data.filter(
            (item) =>
              item.name.toLowerCase().includes(searchedText.toLowerCase()) ||
              item.address.toLowerCase().includes(searchedText.toLowerCase())
          )}
          scroll={{
            x: 1500,
            y: 300,
          }}
          pagination ={false}
        />
         <Pagination
          total={25}
          showSizeChanger
          showTotal={(total) => `Total ${total} items`}
          style={{ marginTop: '25px' }}
        />
      </Card>
    </div>
  );
};

export default ProjectList;