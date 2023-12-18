import React, { useEffect, useState } from 'react';
import { Table, Progress, Pagination, Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { axiosInstance } from '../../../config/axios';
const twoColors = {
  '0%': '#108ee9',
  '100%': '#87d068',
};

const conicColors = {
  progress: '#87d068',
  pending: '#ffe58f',
  complete: '#ffccc7',
};

// const data = [
//   {
//     key: '1',
//     manager: 'John Brown',
//     progress: 10,
//     endDate: moment(new Date()).format('DD/MM/YYYY'),
//     status: 'On Progress',
//   },
//   {
//     key: '2',
//     manager: 'John Brown',
//     progress: 23,
//     endDate: moment(new Date()).format('DD/MM/YYYY'),
//     status: 'On Progress',
//   },
//   {
//     key: '3',
//     manager: 'John Brown',
//     progress: 44,
//     endDate: moment(new Date()).format('DD/MM/YYYY'),
//     status: 'Pending',
//   },
//   {
//     key: '4',
//     manager: 'John Brown',
//     progress: 22,
//     endDate: moment(new Date()).format('DD/MM/YYYY'),
//     status: 'Complete',
//   },
//   {
//     key: '5',
//     manager: 'John Brown',
//     progress: 44,
//     endDate: moment(new Date()).format('DD/MM/YYYY'),
//     status: 'Complete',
//   },
//   {
//     key: '6',
//     manager: 'John Brown',
//     progress: 77,
//     endDate: moment(new Date()).format('DD/MM/YYYY'),
//     status: 'Complete',
//   },
//   {
//     key: '7',
//     manager: 'John Brown',
//     progress: 99,
//     endDate: moment(new Date()).format('DD/MM/YYYY'),
//     status: 'On Progress',
//   },
//   {
//     key: '8',
//     manager: 'John Brown',
//     progress: 0,
//     endDate: moment(new Date()).format('DD/MM/YYYY'),
//     status: 'Pending',
//   },
// ];

const TableProgress = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);

  const { t } = useTranslation();
  const columns = [
    {
      title: t('TABLE.TEAM_MANAGER'),
      dataIndex: 'manager',
    },
    {
      title: t('TABLE.PROGRESS'),
      dataIndex: 'progress',
      width: 200,
      render: (record) => <Progress percent={record} strokeColor={twoColors} />,
    },
    {
      title: t('TABLE.END_DATE'),
      dataIndex: 'endDate',
    },
    {
      title: t('TABLE.STATUS'),
      dataIndex: 'status',
      render: (record) => {
        return (
          <Badge
            key={`${record}-sdsds`}
            color={conicColors[record]}
            text={
              record === 'pending'
                ? t('PROJECTS.STATUS_PENDING')
                : record === 'complete'
                ? t('PROJECTS.STATUS_COMPLETED')
                : t('PROJECTS.STATUS_IN_PROGRESS')
            }
          />
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance
          .get('projects')
          .then((response) => response.data);
        const filterDeleted = result.filter((item) => !item.deletedAt);
        setFilteredData(filterDeleted);
        if (filterDeleted && filterDeleted.length > 0) {
          const dataTable = filterDeleted.map((item, index) => {
            const startDate = moment(item.startDate, 'DD/MM/YYYY');
            const endDate = moment(item.endDate, 'DD/MM/YYYY');
            const today = moment();
            // Tính số ngày từ startDate đến endDate
            const totalDays = endDate.diff(startDate, 'days');

            // Tính số ngày đã qua kể từ startDate đến ngày hiện tại
            const daysPassed = today.diff(startDate, 'days');

            // Tính phần trăm ngày đã qua
            const percentage = Math.round((daysPassed / totalDays) * 100);
            return {
              key: index + 1,
              manager: item.manager[0].name,
              progress: percentage,
              endDate: item.endDate,
              status: item.status,
            };
          });
          setData(dataTable);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Table
        columns={columns}
        dataSource={
          data.length > 0
            ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
            : []
        }
        size="small"
        pagination={false}
      />
      <Pagination
        locale={{
          items_per_page: `/ ${t('TABLE.PAGE')}`,
        }}
        total={data.length}
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
    </>
  );
};
export default TableProgress;
