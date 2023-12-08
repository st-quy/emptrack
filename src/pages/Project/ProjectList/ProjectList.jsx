import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Input, Pagination, Space, Table, Tooltip, Modal,message  } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../ProjectList/ProjectList.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import { axiosInstance } from '../../../config/axios';

const ProjectList = () => {
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  // const [searchedText, setSearchedText] = useState('');
  const [deletedProjectId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance.get('projects').then((response) =>  response.data);
        const filterDeleted = result.filter(item => !item.deletedAt)
        setData(filterDeleted);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [deletedProjectId]);

  const handleDelete = (projectId) => {
    setSelectedProjectId(projectId);
    // setCurrentPage(1); // Đặt lại trang hiện tại về 1 khi xóa dự án
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`projects/${selectedProjectId}`).then(() => {

        message.success('Dự án đã được xóa thành công!');
        // Loại bỏ dự án đã bị xóa khỏi mảng data
        setData(data.filter((item) => item.id !== selectedProjectId));

        setSelectedProjectId(null);
        setShowDeleteModal(false);
      });
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleCancelDelete = () => {
    setSelectedProjectId(null);
    setShowDeleteModal(false);
  };


  const columns = [
    {
      title: t('TABLE.ACTIONS'),
      key: 'action',
      width: 60,
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
      title: t('TABLE.MANAGER'),
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
      title: t('BREADCRUMB.PROJECTS'),
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      width: 80,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    // {
    //   title: t('TABLE.MEMBERS'),
    //   dataIndex: 'member',
    //   key: 'member',
    //   width: 150,
    //   sorter: {
    //     compare: (a, b) => a.chinese - b.chinese,
    //     multiple: 3,
    //   },
    //   render: (members) => (
    //     <span>
    //       {members.map((member, index) => (
    //         <div key={index}>
    //           {member.name} - {member.role}
    //         </div>
    //       ))}
    //     </span>
    //   ),
    // },

    // {
    //   title: t('TABLE.TECHNICAL'),
    //   dataIndex: 'technical',
    //   key: 'technical',
    //   width: 150,
    //   sorter: {
    //     compare: (a, b) => a.chinese - b.chinese,
    //     multiple: 3,
    //   },
    // },
    // {
    //   title: t('TABLE.DESCRIPTION'),
    //   dataIndex: 'description',
    //   key: 'description',
    //   width: 40,
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   render: (address) => (
    //     <Tooltip placement="topLeft" title={address}>
    //       <div style={{ whiteSpace: 'pre-line' }}>{address}</div>
    //     </Tooltip>
    //   ),
    // },

    {
      title: t('TABLE.START DATE'),
      dataIndex: 'startDate',
      key: 'startDate',
      width: 80,
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
      title: t('TABLE.END DATE'),
      dataIndex: 'endDate',
      key: 'endDate',
      width: 80,
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
      title: t('STATUS.STATUS'),
      dataIndex: 'status',
      key: 'status',
      width: 60,
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

  const [searchedText, setSearchedText] = useState('');
  const debouncedSearch = debounce((value) => setSearchedText(value), 300);

  return (
    <div className="project_create" style={{ height: 100 }}>
      <Space className="w-100 justify-content-between">
        <Breadcrumb items={[{ key: 'projects' }]} />
        <Button onClick={() => navigate('/projects/create')}>
          {t('BREADCRUMB.PROJECTS_CREATE')}
        </Button>
      </Space>
      <Card
        title={'Danh sách dự án'.toUpperCase()}
        style={{ borderRadius: '30px' }}
      >
        <Input.Search
          placeholder="Tìm kiếm..."
          style={{ marginBottom: 8, width: 300, marginTop: 8 }}
          onChange={(e) => setSearchedText(e.target.value)}
        />
         <Table
          columns={columns}
          dataSource={data
            .filter(
              (item) =>
                // !item.deletedAt &&
                // Chỉ hiển thị các dự án chưa bị xóa
                (item.manager &&
                  item.manager.some(
                    (manager) => manager.name.toLowerCase().includes(searchedText.toLowerCase())
                  )) ||
                (item.member &&
                  item.member.some(
                    (member) =>
                      member.name.toLowerCase().includes(searchedText.toLowerCase()) ||
                      member.role.toLowerCase().includes(searchedText.toLowerCase())
                  )) ||
                item.technical.toLowerCase().includes(searchedText.toLowerCase()) ||
                item.description.toLowerCase().includes(searchedText.toLowerCase()) ||
                item.startDate.toLowerCase().includes(searchedText.toLowerCase()) ||
                item.endDate.toLowerCase().includes(searchedText.toLowerCase()) ||
                item.status.toLowerCase().includes(searchedText.toLowerCase()) ||
                item.name.toLowerCase().includes(searchedText.toLowerCase())
            )
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          scroll={{
            y: 'calc(100vh - 400px)'
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
