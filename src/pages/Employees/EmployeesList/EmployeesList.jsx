/* eslint-disable no-unused-vars */
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Card,
  Image,
  Input,
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
        isNameMatched &&
        isEmailMatched &&
        // isManagerMatched &&
        isPositionMatched &&
        isStatusMatched
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
        }

        if (project.manager[0].id === selectedEmployeesId) isDelete = false;
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
    navigate(`/employees/details/${id}`);
  };

  const warningDelete = () => {
    Modal.warning({
      title: t('MODAL.WARNING_DELETE_TITLE'),
      content: t('MODAL.WARNING_DELETE'),
    });
  };

  const columns = [
    {
      title: t('TABLE.ACTIONS'),
      key: 'action',
      width: 20 ,
      align: 'center',
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
        return index;
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
                objectFit: 'cover'
              }}
              preview={{
                mask: <EyeOutlined />,
                src: _.url
              }}
            />
          ))}
        </span>
      )
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
      align: 'center',

      width: 20,
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
            <Space size={[8, 16]} wrap className="w-100 py-3">
              <TextSearch
                label={t('EMPLOYEES.NAME')}
                func={(e) => {
                  setSearchParam({ ...searchParam, name: e.target.value });
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
                // defaultValue=""
                style={{
                  width: 200,
                }}
                options={[
                  {
                    value: 'active',
                    label: 'Active',
                  },
                  {
                    value: 'inactive',
                    label: 'Inactive',
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
              columns={columns}
              dataSource={
                filteredData
                  ? filteredData.slice(
                      (currentPage - 1) * pageSize,
                      currentPage * pageSize,
                    )
                  : []
              }
              scroll={{ y: 'calc(100vh - 370px)' }}
              
              pagination={false}
              size="small"
            />
            <Pagination
              total={filteredData.filter((item) => !item.deletedAt).length}
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
        </>
      ) : (
        <SpinLoading />
      )}
    </div>
  );
};
export default EmployeesList;
