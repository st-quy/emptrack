// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import { Table, Tooltip, Card, Space, Input, Pagination, Modal, message, } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import Button from '../../../components/atoms/Button/Button';

const ProjectList = () => {
  const [data, setData] = useState([]);
  // const [searchedText, setSearchedText] = useState('');
  const [deletedProjectId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);


  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


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
  }, [deletedProjectId]);

  const handleDelete = (projectId) => {
    setSelectedProjectId(projectId);
    setCurrentPage(1); // Đặt lại trang hiện tại về 1 khi xóa dự án
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await fetch(`https://api-emptrack.onrender.com/projects/${selectedProjectId}`, {
        method: 'DELETE',
      });
      message.success('Dự án đã được xóa thành công!');

      // Loại bỏ dự án đã bị xóa khỏi mảng data
      setData(data.filter((item) => item.id !== selectedProjectId));

      setSelectedProjectId(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleCancelDelete = () => {
    setSelectedProjectId(null);
    setShowDeleteModal(false);
  };
  const handleView = (projectId) => {
    window.location.href = `/projects/view/${projectId}`;
  };

  const columns = [
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (text, record) => (
        <span>
          <Tooltip title="Delete">
            <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
          </Tooltip>
          <Tooltip title="View">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record.id)} />
          </Tooltip>
        </span>
      ),
    },

    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
      ellipsis: {
        showTitle: false,
      },
      defaultSortOrder: 'ascend', // Sắp xếp mặc định từ thấp đến cao
    },

    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
      width: 80,
      sorter: (a, b) => a.manager[0].name.localeCompare(b.manager[0].name),
      ellipsis: {
        showTitle: false,
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
      title: 'Project name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Members',
      dataIndex: 'member',
      key: 'member',
      width: 150,

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
      title: 'Technical',
      dataIndex: 'technical',
      key: 'technical',
      width: 150,

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
      title: 'Start date',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 90,
      sorter: {
        compare: (a, b) => new Date(a.startDate) - new Date(b.startDate),
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
      title: 'End date',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 90,
      sorter: {
        compare: (a, b) => new Date(a.endDate) - new Date(b.endDate),
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 90,
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

  ];




  const [searchedText, setSearchedText] = useState("")

  return (
    <div className="project_create">
      <Space className="w-100 justify-content-between">
        <Breadcrumb items={[{ key: 'projects' }]} />
        <Button>Tạo ứng dụng</Button>
      </Space>
      <Card title="Danh sách dự án">
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
                !item.deletedAt && // Chỉ hiển thị các dự án chưa bị xóa
                (item.name.toLowerCase().includes(searchedText.toLowerCase()) ||
                  item.address.toLowerCase().includes(searchedText.toLowerCase()))
            )
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          scroll={{
            x: 1500,
            y: 300,
          }}
          pagination={false}
        />
        <Pagination
          total={data.filter((item) => !item.deletedAt).length}
          current={currentPage}
          pageSize={pageSize}
          showSizeChanger
          showTotal={(total) => `Total ${total} items`}
          style={{ marginTop: '25px' }}
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          }}
        />
      </Card>
      <Modal
        title="Confirm Delete"
        visible={showDeleteModal}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this project?</p>
      </Modal>
    </div>
  );
};

export default ProjectList;