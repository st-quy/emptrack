/* eslint-disable no-unused-vars */
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Card,
  Image,
  Input,
  Popover,
  Modal,
  Pagination,
  Select,
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
import { filter } from 'lodash';
import { areAllSearchParamsEmpty } from '../../../helpers';
import TextSearch from '../../../components/atoms/TextSearch/TextSearch';

const EmployeesList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [deletedEmployeesId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployeesId, setSelectedEmployeesId] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [searchParam, setSearchParam] = useState({
    name: '',
    email: '',
    // isManager: '',
    position: '',
    status: '',
  });
  const [filteredData, setFilteredData] = useState([]);
  const handleAvatarClick = () => {
    setModalVisible(true);
  };
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
    document.title = 'EMP | Employees';
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance
          .get('employees')
          .then((response) => response.data);
        const filterDeleted = result.filter((item) => !item.deletedAt);
        filterDeleted.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
        setData(filterDeleted);
        setFilteredData(filterDeleted);
  
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

  const searchData = (data, searchParams) => {
    const { name, email, isManager, position, status } = searchParams;

    const filteredData = filter(data, (item) => {
      const isNameMatched = !name || item.name.includes(name);
      const isEmailMatched = !email || item.email.includes(email);
      // const isManagerMatched = !isManager || item.isManager === isManager;
      const isPositionMatched = !position || item.position.includes(position);
      const isStatusMatched = !status || item.status === status;

      return (
        isNameMatched && isEmailMatched && isPositionMatched && isStatusMatched
      );
    });

    return filteredData;
  };

  useEffect(() => {
    const isAllEmpty = areAllSearchParamsEmpty(searchParam);
    if (isAllEmpty) {
      handleSearch();
    }
  }, [searchParam]);

  const handleSearch = () => {
    setCurrentPage(1);
    const filteredData = searchData(data, searchParam);
    setFilteredData(filteredData);
  };

  const handleDelete = async (employeeId) => {
    try {
      let isDelete = true;
      allProjects.map((project) => {
        for (let index = 0; index < project.member.length; index++) {
          if (project.member[index].id === employeeId) {
            isDelete = false;
            break;
          }
          if (project.manager[0].id === employeeId) isDelete = false;
        }
      });

      if (isDelete) {
        setSelectedEmployeesId(employeeId);
        setShowDeleteModal(true);
      } else {
        warningDelete();
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
          setData(data.filter((item) => item.id !== selectedEmployeesId));
          setFilteredData(
            data.filter((item) => item.id !== selectedEmployeesId),
          );
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
    navigate(`/employees/details/${id}`);
  };

  const warningDelete = () => {
    Modal.warning({
      title: t('MODAL.WARNING_DELETE_TITLE'),
      content: t('MODAL.WARNING_DELETE'),
      okText: t('BUTTON.OK'),
    });
  };

  const columns = [
    {
      title: t('TABLE.ACTIONS'),
      key: 'action',
      width: 20,
      align: 'center',
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
              onClick={() => handleView(record.id)}
            />
          </Tooltip>
        </span>
      ),
    },
    {
      title: t('EMPLOYEES.ID'),
      dataIndex: 'id',
      key: 'id',
      width: 10,
      align: 'center',

      ellipsis: {
        showTitle: false,
      },
      render: (id, record, index) => {
        ++index;
        return (currentPage - 1) * pageSize + index;
      },
    },
    {
      title: t('EMPLOYEES.AVATAR'),
      dataIndex: 'avatar',
      key: 'avatar',
      width: 20,
      align: 'center',

      render: (item) => (
        <span>
          {item.map((_, index) => (
            <Image
              key={index}
              src={_.url}
              alt={`Avatar ${index + 1}`}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
              preview={{
                mask: <EyeOutlined />,
                src: _.url,
              }}
            />
          ))}
        </span>
      ),
    },

    {
      title: t('EMPLOYEES.NAME'),
      dataIndex: 'name',
      key: 'name',
      align: 'center',

      render: (text) => <a>{text}</a>,
      width: 40,
    },

    {
      title: t('EMPLOYEES.EMAIL'),
      dataIndex: 'email',
      key: 'email',
      align: 'center',

      width: 40,
    },
    {
      title: t('TABLE.MANAGER'),
      dataIndex: 'isManager',
      key: 'isManager',
      align: 'center',

      width: 20,
      render: (isManager) => (
        <Tag color={isManager ? 'green' : 'red'}>{isManager ? '✔' : '✘'} </Tag>
      ),
      ellipsis: {
        showTitle: false,
      },
      onFilter: (value, record) => record.isManager === value,
      sorter: (a, b) => {
        if (a.isManager === b.isManager) {
          return 0;
        } else if (a.isManager) {
          return -1;
        } else {
          return 1;
        }
      },
    },
    {
      title: t('STATUS.STATUS'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',

      width: 20,
      render: (status) => (
        <Tooltip placement="topLeft" title={status}>
          <span
            style={{
              backgroundColor:
                status === 'off'
                  ? 'gray'
                  : status === 'unassigned'
                  ? 'orange'
                  : 'green',
              color: 'white',
              padding: '3px 8px',
              borderRadius: '4px',
              display: 'inline-block',
            }}
          >
            {status === 'off'
              ? t('EMPLOYEES.STATUS_OFF')
              : status === 'unassigned'
              ? t('EMPLOYEES.STATUS_UNASSIGNED')
              : t('EMPLOYEES.STATUS_ASSIGNED')}
          </span>
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
      onFilter: (value, record) => record.status === value,
    },
  ];

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
          <Space size={[8, 16]} wrap className="w-100 py-3">
            <TextSearch
              label={t('EMPLOYEES.NAME')}
              func={(e) => {
                setSearchParam({ ...searchParam,name: e.target.value });
              }}
            />
            <TextSearch
              label={t('EMPLOYEES.EMAIL')}
              func={(e) => {
                setSearchParam({
                  ...searchParam,
                  email: e.target.value,
                });
              }}
            />
            <Select
              style={{
                width: 200,
              }}
              options={[
                {
                  value: 'assigned',
                  label: t('EMPLOYEES.STATUS_ASSIGNED'),
                },
                {
                  value: 'unassigned',
                  label: t('EMPLOYEES.STATUS_UNASSIGNED'),
                },
                {
                  value: 'off',
                  label: t('EMPLOYEES.STATUS_OFF'),
                },
              ]}
              placeholder={t('TEXT_SEARCH.SELECT', {
                label: t('TEXT_SEARCH.STATUS'),
              })}
              onChange={(e) => {
                setSearchParam({
                  ...searchParam,
                  status: e,
                });
              }}
              allowClear
            />
            <Button type="primary" onClick={() => handleSearch()}>
              {t('BUTTON.SEARCH')}
            </Button>
          </Space>
          <Table
            locale={{
              triggerDesc: t('BUTTON.SORT_DESC'),
              triggerAsc: t('BUTTON.SORT_ASC'),
              cancelSort: t('BUTTON.SORT_CANCEL'),
            }}
            columns={columns}
            dataSource={
              filteredData
                ? filteredData.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize,
                  )
                : []
            }
            scroll={{ y: 'calc(100vh - 370px)', x: 'calc(100vh - 200px)' }}
            pagination={false}
            size="small"
          />
          <Pagination {...paginationOptions} />
        </Card>
        <Modal
          title={t('TABLE.COMFIRM_DELETE')}
          visible={showDeleteModal}
          onOk={handleConfirmDelete}
          okText={t('BUTTON.OK')}
          onCancel={handleCancelDelete}
          cancelText={t('ACTION.CANCEL')}
        >
          <p>{t('EMPLOYEES.COMFIRM_DELETE_EMPLOYEES')}</p>
        </Modal>
      </>
    </div>
  );
};
export default EmployeesList;
