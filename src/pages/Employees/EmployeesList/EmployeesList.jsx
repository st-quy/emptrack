/* eslint-disable no-unused-vars */
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Card,
  Image,
  Input,
  Modal,
  Pagination,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';
import SpinLoading from '../../../components/atoms/SpinLoading/SpinLoading';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import { Toast } from '../../../components/toast/Toast';
import { axiosInstance } from '../../../config/axios';
const EmployeesList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [deletedEmployeesId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [selectedEmployeesId, setSelectedEmployeesId] = useState(null);
  const [allProjects, setAllProjects] = useState([]);

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

        await axiosInstance.get('/projects').then((res) => {
          const filterDeletedProjects = res.data.filter(
            (item) => !item.deletedAt,
          );

          setAllProjects(filterDeletedProjects);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [deletedEmployeesId]);
  const handleDelete = async (employeeId) => {
    try {
      let isDelete = true;
      allProjects.map((project) => {
        for (let index = 0; index < project.member.length; index++) {
          if (project.member[index].id === employeeId) {
            isDelete = false;
            break;
          }
        }

        if (project.manager[0].id === selectedEmployeesId) isDelete = false;
      });

      if (isDelete) {
        setSelectedEmployeesId(employeeId);
        setShowDeleteModal(true);
      } else {
        setShowWarningModal(true);
      }
    } catch (error) {
      console.error('Error get all projects:', error);
    }
  };
  const handleConfirmDelete = async () => {
    try {
      await axiosInstance
        .delete(`employees/${selectedEmployeesId}`)
        .then(() => {
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
  const handleCancelWarning = () => {
    setShowWarningModal(false);
  };
  const handleView = (id) => {
    navigate(`/employees/details/${id}`);
  };
  const columns = [
    {
      title: t('TABLE.ACTIONS'),
      key: 'action',
      width: 100,
      render: (text, record) => (
        <span>
          <Tooltip title="Delete">
            <Button
              type="link"
              icon={<DeleteOutlined style={{ color: 'red' }} />}
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
      title: t('EMPLOYEES.CODE'),
      dataIndex: 'code',
      key: 'code',
      width: 100,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: t('EMPLOYEES.NAME'),
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      width: 120,
    },
    {
      title: t('EMPLOYEES.AVATAR'),
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
      title: t('EMPLOYEES.CITIZEN_CARD'),
      dataIndex: 'citizen_card',
      key: 'citizen_card',
      width: 120,
    },
    {
      title: t('TABLE.MANAGER'),
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
      title: t('STATUS.STATUS'),
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
      title: t('EMPLOYEES.POSITION'),
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
            title={t('TABLE.COMFIRM_DELETE')}
            visible={showDeleteModal}
            onOk={handleConfirmDelete}
            onCancel={handleCancelDelete}
          >
            <p>{t('EMPLOYEES.COMFIRM_DELETE_EMPLOYEES')}</p>
          </Modal>
          <Modal
            title={t('TABLE.COMFIRM_DELETE')}
            visible={showWarningModal}
            onCancel={handleCancelWarning}
            footer={[
              <Button
                key="back"
                onClick={handleCancelWarning}
                className="button ant-btn-primary"
              >
                {t('BUTTON.CANCEL')}
              </Button>,
            ]}
          >
            <p>{t('MODAL.WARNING_DELETE')}</p>
          </Modal>
        </>
      ) : (
        <SpinLoading />
      )}
    </div>
  );
};
export default EmployeesList;
