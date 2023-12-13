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
  Modal,
} from 'antd';
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


const paginationOptions = {
  total: data.filter((item) => !item.deletedAt).length,
  current: currentPage,
  pageSize: pageSize,
  showSizeChanger: true,
  showTotal: (total) => t('TABLE.TOTAL_EMPLOYEES', { total }),
  className: 'my-3',
  onChange: (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  },
  locale: {
    items_per_page: `/ ${t('TABLE.PAGE')}`,
  },
};
  useEffect(() => {
    document.title = 'EMP | EMPLOYEES';
  }, []);

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
      await axiosInstance
        .delete(`employees/${selectedEmployeesId}`)
        .then(() => {
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
  const abc = (id) => {
    console.log(
      "fdfsf"
    )
    navigate(`/employees/details/${id}`);
  };
  const columns = [
    {
      title: t('TABLE.ACTIONS'),
      key: 'action',
      width: 50,
      render: (text, record) => (
        <span>
        <Tooltip title={t('TABLE.DELETE')}>
          <Button
            type="link"
            icon={<DeleteOutlined style={{ color: 'red' }} />}
            onClick={() => handleDelete(record.id)}
          />
        </Tooltip>
        <Tooltip title={t('TABLE.VIEW')}>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => abc(record.id)}
          />
        </Tooltip>
      </span>
      ),
    },
    {
      title: t('EMPLOYEES.ID'),
      dataIndex: 'id',
      key: 'id',
      width: 30,
      ellipsis: {
        showTitle: false,
      },
      render: (id, record, index) => { ++index; return index; },
    },
    {
      title: t('EMPLOYEES.AVATAR'),
      dataIndex: 'avatar',
      key: 'avatar',
      width: 60,
      render: (avatar) => (
        <span>
          {avatar.map((avatar, index) => (
            <Image
              key={index}
              src={avatar.url}
              alt={`Avatar ${index + 1}`}
              style={{
                width: '60px', 
                height: '60px', 
                borderRadius: '50%',
              }}
            />
          ))}
        </span>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
    
    {
      title: t('EMPLOYEES.NAME'),
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      width: 70,
    },
    
    {
      title: t('EMPLOYEES.CITIZEN_CARD'),
      dataIndex: 'citizen_card',
      key: 'citizen_card',
      width: 90,
    },
    {
      title: t('TABLE.MANAGER'),
      dataIndex: 'isManager',
      key: 'isManager',
      width: 80,
      render: (isManager) => (
        <Tag color={isManager ? 'green' : 'red'}>{isManager ? '✔' : '✘'} </Tag>
      ),
      ellipsis: {
        showTitle: false,
      },
      filters: [
        { text: t('TABLE.MANAGER'), value: true },
        { text: t('TABLE.NOT_MANAGER'), value: false },
      ],
      onFilter: (value, record) => record.isManager === value,
    },
    {
      title: t('STATUS.STATUS'),
      dataIndex: 'status',
      key: 'status',
      width: 80,
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
      title: t('EMPLOYEES.POSITION'),
      dataIndex: 'position',
      key: 'position',
      width: 80,
      ellipsis: {
        showTitle: false,
      },
    },
  ];

  const [searchedText, setSearchedText] = useState('');

  return (
    <div className="project_create">
      
        <>
          <Space className="w-100 justify-content-between">
            <Breadcrumb items={[{ key: 'employees' }]} />
            <Button onClick={() => navigate('/employees/create')}>
              {t('BREADCRUMB.EMPLOYEES_CREATE')}
            </Button>
          </Space>
          <Card
            title={t('TABLE.LIST_EMPLOYEES').toUpperCase()}
            style={{
              width: '100%',
              margin: 'auto',
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
              scroll={{ y: 'calc(100vh - 370px)' }}
              pagination={false}
              size="small"
            />
            <Pagination {...paginationOptions} />
            {/* <Pagination
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
            /> */}
          </Card>
          <Modal
            title={t('TABLE.COMFIRM_DELETE')}
            visible={showDeleteModal}
            onOk={handleConfirmDelete}
            okText={t('BUTTON.OK')}
            onCancel={handleCancelDelete}
            cancelText={t('ACTION.CANCEL') }
          >
            <p>{t('EMPLOYEES.COMFIRM_DELETE_EMPLOYEES')}</p>
          </Modal>
        </>

    </div>
  );
};
export default EmployeesList;
