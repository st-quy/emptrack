/* eslint-disable no-unused-vars */
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {Card, Image,Input,Pagination,Space,Table,Tag,Tooltip,Modal} from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';
import SpinLoading from '../../../components/atoms/SpinLoading/SpinLoading';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import { axiosInstance } from '../../../config/axios';
import { Toast } from '../../../components/toast/Toast';
const EmployeesList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [deletedEmployeesId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployeesId, setSelectedEmployeesId] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance
        .get('employees')
        .then((response) => response.data);
      const filterDeleted = result.filter((item) => !item.deletedAt);
      setData(filterDeleted);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();  
  }, [deletedEmployeesId]);
  const handleDelete = (projectId) => {
    setSelectedEmployeesId(projectId);
    // setCurrentPage(1); // Đặt lại trang hiện tại về 1 khi xóa dự án
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`employees/${selectedEmployeesId}`).then(() => {
        //  message.success('Dự án đã được xóa thành công!');
        Toast(
          'success',
          t('TOAST.DELETED_SUCCESS', {
            field: t('BREADCRUMB.EMPLOYEES').toLowerCase(),
          }),
          2,
        );
        // Loại bỏ dự án đã bị xóa khỏi mảng data
        setData(data.filter((item) => item.id !== selectedEmployeesId));

        setSelectedEmployeesId(null);
        setShowDeleteModal(false);
      });
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleCancelDelete = () => {
    setSelectedEmployeesId(null);
    setShowDeleteModal(false);
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
      filters: [
        { text: 'Manager', value: true },
        { text: 'Non-Manager', value: false },
      ],
      onFilter: (value, record) => record.isManager === value,
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
      {data.length > 0 ? (
        <>
          <Space className="w-100 justify-content-between">
            <Breadcrumb items={[{ key: 'employees' }]} />
            <Button onClick={() => navigate('/employees/create')}>
              {t('BREADCRUMB.EMPLOYEES_CREATE')}
            </Button>
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
              total={data.filter((item) => !item.deletedAt).length}
              current={currentPage}
              pageSize={pageSize}
              showSizeChanger
              showTotal={(total) => t('TABLE.TOTAL_EMPLOYEES', { total })}
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
export default EmployeesList;
