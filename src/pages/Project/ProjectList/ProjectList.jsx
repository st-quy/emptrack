import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Input, Pagination, Space, Table, Tooltip } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../ProjectList/ProjectList.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import { axiosInstance } from '../../../config/axios';

const ProjectList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  // const [searchedText, setSearchedText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axiosInstance.get('projects').then((response) => {
          setData(response.data);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: t('TABLE.ACTIONS'),
      key: 'action',
      width: 60,
      fixed: 'left',
      render: (text, record) => (
        <span>
          <Tooltip title="Delete">
            <Button
              type="link"
              icon={<DeleteOutlined />}
              // onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
          <Tooltip title="View">
            <Button
              type="link"
              icon={<EyeOutlined />}
              // onClick={() => handleView(record.key)}
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
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
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
      width: 80,
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
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
        compare: (a, b) => a.chinese - b.chinese,
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
        compare: (a, b) => a.chinese - b.chinese,
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
      
      sorter: {
        compare: (a, b) => a.status.localeCompare(b.status),
        multiple: 3,
      },
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
          dataSource={data.filter(
            (item) =>
              // item.id.toString().includes(searchedText.toLowerCase()) ||
              (item.manager &&
                item.manager.some((manager) =>
                  manager.name
                    .toLowerCase()
                    .includes(searchedText.toLowerCase()),
                )) ||
              // (item.member &&
              //   item.member.some(
              //     (member) =>
              //       member.name.toLowerCase().includes(searchedText.toLowerCase()) ||
              //       member.role.toLowerCase().includes(searchedText.toLowerCase())
              //   )) ||
              // item.description.toLowerCase().includes(searchedText.toLowerCase()) ||
              item.startDate
                .toLowerCase()
                .includes(searchedText.toLowerCase()) ||
              item.endDate.toLowerCase().includes(searchedText.toLowerCase()) ||
              item.status.toLowerCase().includes(searchedText.toLowerCase()) ||
              item.name.toLowerCase().includes(searchedText.toLowerCase()),
          )}
          scroll={{ y: 'calc(100vh - 400px)' }}
          pagination={false}
        />
        <Pagination
          total={25}
          showSizeChanger
          showTotal={(total) => t('TABLE.TOTAL', { total })}
          style={{ marginTop: '20px', marginBottom: '10px' }}
        />
      </Card>
    </div>
  );
};

export default ProjectList;
