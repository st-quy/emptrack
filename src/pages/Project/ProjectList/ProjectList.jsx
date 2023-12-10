import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Input, Modal, Pagination, Space, Table, Tooltip } from 'antd';
import { debounce } from 'lodash';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';
import SpinLoading from '../../../components/atoms/SpinLoading/SpinLoading';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import { Toast } from '../../../components/toast/Toast';
import { axiosInstance } from '../../../config/axios';
import '../ProjectList/ProjectList.scss';

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
        const result = await axiosInstance
          .get('projects')
          .then((response) => response.data);
        const filterDeleted = result.filter((item) => !item.deletedAt);
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
        //  message.success('Dự án đã được xóa thành công!');
        Toast(
          'success',
          t('TOAST.DELETED_SUCCESS', {
            field: t('BREADCRUMB.PROJECTS').toLowerCase(),
          }),
          2,
        );
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

  const handleView = (id) => {
    navigate(`details/${id}`);
  };

  const columns = [
    {
      title: t('TABLE.ACTIONS'),
      key: 'action',
      width: 60,
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
      {data.length > 0 ? (
        <>
          <Space className="w-100 justify-content-between">
            <Breadcrumb items={[{ key: 'projects' }]} />
            <Button onClick={() => navigate('/projects/create')}>
              {t('BREADCRUMB.PROJECTS_CREATE')}
            </Button>
          </Space>
          <Card
            title={t('PROJECTS.LIST').toUpperCase()}
            style={{ borderRadius: '30px' }}
          >
            <Input.Search
              placeholder={t('TABLE.SEARCH') + '...'}
              style={{ marginBottom: 8, width: 300, marginTop: 8 }}
              onChange={(e) => setSearchedText(e.target.value)}
            />
            <Table
              columns={columns}
              dataSource={data
                .filter(
                  (item) =>
                    (item.manager &&
                      item.manager.some((manager) =>
                        manager.name
                          .toLowerCase()
                          .includes(searchedText.toLowerCase()),
                      )) ||
                    (item.member &&
                      item.member.some(
                        (member) =>
                          member.name
                            .toLowerCase()
                            .includes(searchedText.toLowerCase()) ||
                          member.role.some((m) =>
                            m
                              .toLowerCase()
                              .includes(searchedText.toLowerCase()),
                          ),
                      )) ||
                    item.technical
                      .toLowerCase()
                      .includes(searchedText.toLowerCase()) ||
                    item.description
                      .toLowerCase()
                      .includes(searchedText.toLowerCase()) ||
                    item.startDate
                      .toLowerCase()
                      .includes(searchedText.toLowerCase()) ||
                    item.endDate
                      .toLowerCase()
                      .includes(searchedText.toLowerCase()) ||
                    item.status
                      .toLowerCase()
                      .includes(searchedText.toLowerCase()) ||
                    item.name
                      .toLowerCase()
                      .includes(searchedText.toLowerCase()),
                )
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)}
              scroll={{ y: 'calc(100vh - 400px)' }}
              pagination={false}
            />
            <Pagination
              total={data.filter((item) => !item.deletedAt).length}
              current={currentPage}
              pageSize={pageSize}
              showSizeChanger
              showTotal={(total) => t('TABLE.TOTAL', { total })}
              className="my-3"
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
        </>
      ) : (
        <SpinLoading />
      )}
    </div>
  );
};

export default ProjectList;
