import {
  DeleteOutlined,
  EyeOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import {
  Card,
  Input,
  Pagination,
  Space,
  Table,
  Tooltip,
  Modal,
  message,
  DatePicker,
  Select,
} from 'antd';
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
import DrawerTracking from '../../../components/molecules/Drawer/DrawerTracking';
import TextSearch from '../../../components/atoms/TextSearch/TextSearch';
import moment from 'moment';

const ProjectList = () => {
  const [dataFirst, setDataList] = useState([]);
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  // const [searchedText, setSearchedText] = useState('');
  const [deletedProjectId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [dataProject, setDataProject] = useState();
  const { RangePicker } = DatePicker;
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
    document.title = 'EMP | PROJECTS';
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
        setData(filterDeleted);
        setDataList(filterDeleted);
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
      width: 30,
      ellipsis: {
        showTitle: false,
      },
      render: (id, record, index) => {
        ++index;
        return index;
      },
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
        
        { text: t('PROJECTS.STATUS_ACTIVE'), value: 'active' },
        { text: t('PROJECTS.STATUS_INACTIVE'), value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      
    },
  ];

  const [searchedText, setSearchedText] = useState('');
  const [searchParam, setSearchParam] = useState({
    manager: '',
    project_name: '',
    startDate: '',
    endDate: '',
    status: '',
  });

  const handleSearch = () => {
    let filteredData = [...data];

    if (searchParam.manager) {
      filteredData = filteredData.filter((val) =>
        val.manager.some((manager) =>
          manager.name.includes(searchParam.manager),
        ),
      );
    }

    if (searchParam.project_name) {
      filteredData = filteredData.filter((val) =>
        val.name.includes(searchParam.project_name),
      );
    }

    if (searchParam.startDate && searchParam.endDate) {
      const start = moment(searchParam.startDate, 'DD/MM/YYYY');
      const end = moment(searchParam.endDate, 'DD/MM/YYYY');
      filteredData = filteredData.filter((item) => {
        const itemStartDate = moment(item.startDate, 'DD/MM/YYYY');
        const itemEndDate = moment(item.endDate, 'DD/MM/YYYY');
        return (
          itemStartDate.isSameOrBefore(start) && itemEndDate.isSameOrBefore(end)
        );
      });
    }

    if (searchParam.status) {
      filteredData = filteredData.filter((val) =>
        val.status.toUpperCase().includes(searchParam.status.toUpperCase()),
      );
    }
    setData(filteredData);
  };
  const debouncedSearch = debounce((value) => setSearchedText(value), 300);

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
                if (!e.target.value) {
                  setData(dataFirst);
                }
                setSearchParam({ ...searchParam, manager: e.target.value });
              }}
            />
            <TextSearch
              label={t('TEXT_SEARCH.PROJECT_NAME')}
              func={(e) => {
                if (!e.target.value) {
                  setData(dataFirst);
                }
                setSearchParam({
                  ...searchParam,
                  project_name: e.target.value,
                });
              }}
            />
            <RangePicker
             placeholder={[
              t('PROJECTS.TIME_START'),
              t('PROJECTS.TIME_END'),
            ]}
              onChange={(e) => {
                if (e === null) {
                  setData(dataFirst);
                } else {
                  setSearchParam({
                    ...searchParam,
                    startDate: moment(e[0]['$d']).format('DD/MM/YYYY'),
                    endDate: moment(e[1]['$d']).format('DD/MM/YYYY'),
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
                  value: 'Active',
                  label: 'Active',
                },
                {
                  value: 'Inactive',
                  label: 'Inactive',
                },
              ]}
              placeholder={t('TEXT_SEARCH.SELECT', {
                label: t('TEXT_SEARCH.STATUS'),
              })}
              onChange={(e) => {
                if (!e) {
                  setData(dataFirst);
                }
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
              data.length > 0
                ? data
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
                              member.role
                                .toLowerCase()
                                .includes(searchedText.toLowerCase()),
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
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                : []
            }
            scroll={{ y: 'calc(100vh - 400px)' }}
            pagination={false}
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
