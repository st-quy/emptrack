import React, { useState } from 'react';
import { Table, Progress, Pagination, Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
const twoColors = {
  '0%': '#108ee9',
  '100%': '#87d068',
};

const conicColors = {
  'On Progress': '#87d068',
  Pending: '#ffe58f',
  Complete: '#ffccc7',
};
const columns = [
  {
    title: 'Team Manager',
    dataIndex: 'manager',
  },
  {
    title: 'Progress',
    dataIndex: 'progress',
    width: 200,
    render: (record) => <Progress percent={record} strokeColor={twoColors} />,
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (record) => {
      return (
        <Badge
          key={`${record}-sdsds`}
          color={conicColors[record]}
          text={record}
        />
      );
    },
  },
];
const data = [
  {
    key: '1',
    manager: 'John Brown',
    progress: 10,
    endDate: moment(new Date()).format('DD/MM/YYYY'),
    status: 'On Progress',
  },
  {
    key: '2',
    manager: 'John Brown',
    progress: 23,
    endDate: moment(new Date()).format('DD/MM/YYYY'),
    status: 'On Progress',
  },
  {
    key: '3',
    manager: 'John Brown',
    progress: 44,
    endDate: moment(new Date()).format('DD/MM/YYYY'),
    status: 'Pending',
  },
  {
    key: '4',
    manager: 'John Brown',
    progress: 22,
    endDate: moment(new Date()).format('DD/MM/YYYY'),
    status: 'Complete',
  },
  {
    key: '5',
    manager: 'John Brown',
    progress: 44,
    endDate: moment(new Date()).format('DD/MM/YYYY'),
    status: 'Complete',
  },
  {
    key: '6',
    manager: 'John Brown',
    progress: 77,
    endDate: moment(new Date()).format('DD/MM/YYYY'),
    status: 'Complete',
  },
  {
    key: '7',
    manager: 'John Brown',
    progress: 99,
    endDate: moment(new Date()).format('DD/MM/YYYY'),
    status: 'On Progress',
  },
  {
    key: '8',
    manager: 'John Brown',
    progress: 0,
    endDate: moment(new Date()).format('DD/MM/YYYY'),
    status: 'Pending',
  },
];

const TableProgress = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
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
