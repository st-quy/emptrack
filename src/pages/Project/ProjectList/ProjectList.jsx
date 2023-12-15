import {
  DeleteOutlined,
  EyeOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import {
  Card,
  DatePicker,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
  Tooltip,
} from 'antd';
import { filter } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';
import TextSearch from '../../../components/atoms/TextSearch/TextSearch';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import DrawerTracking from '../../../components/molecules/Drawer/DrawerTracking';
import { Toast } from '../../../components/toast/Toast';
import { axiosInstance } from '../../../config/axios';
import { areAllSearchParamsEmpty } from '../../../helpers';
import '../ProjectList/ProjectList.scss';

const { RangePicker } = DatePicker;

const ProjectList = () => {
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const [deletedProjectId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [dataProject, setDataProject] = useState();
  const [searchParam, setSearchParam] = useState({
    manager: '',
    project_name: '',
    startDate: '',
    endDate: '',
    status: '',
  });

  const [filteredData, setFilteredData] = useState([]);

  const searchData = (data, searchParams) => {
    const { manager, project_name, startDate, endDate, status } = searchParams;
    const start = moment(startDate, 'DD/MM/YYYY');
    const end = moment(endDate, 'DD/MM/YYYY');

    const filteredData = filter(data, (item) => {
      const isManagerMatched =
        !manager ||
        item.manager.some((managerItem) => managerItem.name.includes(manager));
      const isProjectNameMatched =
        !project_name || item.name.includes(project_name);
      const isStartDateMatched =
        !startDate || moment(item.startDate, 'DD/MM/YYYY').isSameOrAfter(start);
      const isEndDateMatched =
        !endDate || moment(item.endDate, 'DD/MM/YYYY').isSameOrBefore(end);
      const isStatusMatched = !status || item.status === status;

      return (
        isManagerMatched &&
        isProjectNameMatched &&
        isStartDateMatched &&
        isEndDateMatched &&
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
  const paginationOptions = {
    total: data.filter((item) => !item.deletedAt).length,
    current: currentPage,
    pageSize: pageSize,
    showSizeChanger: true,
    showTotal: (total) => t('TABLE.TOTAL', { total }),
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
    document.title = 'EMP | Projects';
  }, []);

  const showDrawer = (record) => {
    setDataProject(record);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance
          .get('projects')
          .then((response) => response.data);
        const filterDeleted = result.filter((item) => !item.deletedAt);
        setFilteredData(filterDeleted);
        setData(filterDeleted);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [deletedProjectId]);

  const handleDelete = (projectId) => {
    setSelectedProjectId(projectId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`projects/${selectedProjectId}`).then(() => {
        Toast(
          'success',
          t('TOAST.DELETED_SUCCESS', {
            field: t('BREADCRUMB.PROJECTS').toLowerCase(),
          }),
          2,
        );

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

  const handleSearch = () => {
    setCurrentPage(1);
    const filteredData = searchData(data, searchParam);
    setFilteredData(filteredData);
  };

  const columns = [
    {
      title: t('TABLE.ACTIONS'),
      key: 'action',
      width: 60,
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
          <Tooltip title={t('TABLE.HISTORY')}>
            <Button
              type="text"
              icon={<FieldTimeOutlined />}
              onClick={() => showDrawer(record)}
            />
          </Tooltip>
        </span>
      ),
    },
    {
      title: t('EMPLOYEES.ID'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',

      width: 30,
      ellipsis: {
        showTitle: false,
      },
      render: (id, record, index) => {
        ++index;
        return (currentPage - 1) * pageSize + index;
      },
    },
    {
      title: t('TABLE.MANAGER'),
      dataIndex: 'manager',
      align: 'center',

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
      align: 'center',

      key: 'name',
      render: (text) => <a>{text}</a>,
      width: 80,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('TABLE.START DATE'),
      dataIndex: 'startDate',
      align: 'center',

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
      align: 'center',

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
      align: 'center',

      key: 'status',
      width: 60,
      ellipsis: {
        showTitle: false,
      },
      render: (status) => (
        <Tooltip placement="topLeft" title={status}>
          <span
            style={{
              backgroundColor:
                status === 'completed'
                  ? 'green'
                  : status === 'progress'
                  ? 'orange'
                  : 'gray',
              color: 'white',
              padding: '3px 8px',
              borderRadius: '4px',
              display: 'inline-block',
            }}
          >
            {status === 'pending'
              ? t('PROJECTS.STATUS_PENDING')
              : status === 'progress'
              ? t('PROJECTS.STATUS_IN_PROGRESS')
              : t('PROJECTS.STATUS_COMPLETED')}
          </span>
        </Tooltip>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
      onFilter: (value, record) => record.status === value,
    },
  ];

  return (
    <div className="project_create" style={{ height: 100 }}>
      <>
        <DrawerTracking open={open} onClose={onClose} data={dataProject} />
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
          <Space size={[8, 16]} wrap className="w-100 py-3">
            <TextSearch
              label={t('TEXT_SEARCH.MANAGER')}
              func={(e) => {
                setSearchParam({ ...searchParam, manager: e.target.value });
              }}
            />
            <TextSearch
              label={t('TEXT_SEARCH.PROJECT_NAME')}
              func={(e) => {
                setSearchParam({
                  ...searchParam,
                  project_name: e.target.value,
                });
              }}
            />
            <RangePicker
              placeholder={[t('PROJECTS.TIME_START'), t('PROJECTS.TIME_END')]}
              onChange={(e) => {
                if (e !== null && e.length > 0) {
                  setSearchParam({
                    ...searchParam,
                    startDate: moment(e[0]['$d']).format('DD/MM/YYYY'),
                    endDate: moment(e[1]['$d']).format('DD/MM/YYYY'),
                  });
                } else {
                  setSearchParam({
                    ...searchParam,
                    startDate: '',
                    endDate: '',
                  });
                }
              }}
              format={'DD/MM/YYYY'}
            />
            <Select
              style={{
                width: 200,
              }}
              options={[
                {
                  value: 'pending',
                  label: t('PROJECTS.STATUS_PENDING'),
                },
                {
                  value: 'progress',
                  label: t('PROJECTS.STATUS_IN_PROGRESS'),
                },
                {
                  value: 'completed',
                  label: t('PROJECTS.STATUS_COMPLETED'),
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
              filteredData.length > 0
                ? filteredData.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize,
                  )
                : []
            }
            scroll={{ y: 'calc(100vh - 400px)' }}
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
          <p>{t('PROJECTS.COMFIRM_DELETE_PROJECT')}</p>
        </Modal>
      </>
    </div>
  );
};

export default ProjectList;
