import React, { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Card, Drawer, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import TimelineHistory from '../TimelineHistory/TimelineHistory';
import './DrawerTracking.scss';
import { axiosInstance } from '../../../config/axios';

const DrawerTracking = ({ open, onClose, data }) => {
  const { t } = useTranslation();
  const [dataProjectHistory, setDataProjecHistory] = useState();
  useEffect(() => {
    if (data) {
      const fetchData = async () => {
        try {
          await axiosInstance.get(`tracking`).then((response) => {
            setDataProjecHistory(
              response.data.find(
                (item) => item.project.name === (data && data.name),
              ),
            );
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [data]);
  return (
    <>
      <Drawer
        title={`${t('DRAWER.TITLE')} - ${data ? data.name : ''}`}
        placement="right"
        onClose={onClose}
        open={open}
        size={'large'}
      >
        <Card className="card-drawer">
          {data && dataProjectHistory ? (
            <TimelineHistory data={dataProjectHistory} />
          ) : (
            <Space direction="horizontal">
              <LoadingOutlined style={{ color: 'blue' }} />
              <Typography>Recording...</Typography>
            </Space>
          )}
        </Card>
      </Drawer>
    </>
  );
};

export default DrawerTracking;
