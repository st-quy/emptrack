import {
  AppstoreAddOutlined,
  DeploymentUnitOutlined,
  HomeOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Layout, Space, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import DropProfile from '../../components/molecules/DropProfile/DropProfile';
import { useAuth } from '../../provider/authProvider';
import './ProtectedRoute.scss';

const { Header, Content } = Layout;

export const ProtectedRoute = () => {
  const pathname = window.location.pathname.split('/')[1];

  const [activeItem, setActiveItem] = useState(
    pathname ? pathname : 'dashboard',
  );

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  console.log(activeItem);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const IMenu = [
    {
      key: '',
      icon: <HomeOutlined />,
      label: t('BREADCRUMB.DASHBOARD'),
    },
    {
      key: 'employees',
      icon: <TeamOutlined />,
      label: t('BREADCRUMB.EMPLOYEES'),
    },
    {
      key: 'projects',
      icon: <AppstoreAddOutlined />,
      label: t('BREADCRUMB.PROJECTS'),
    },
  ];
  return (
    <Layout id="layout-container">
      <Header className="layout-header">
        <Typography className="logo-header">{t('SYSTEM.LOGO_NAME')}</Typography>
        <Space className="menu-list" direction="horizontal" size={36}>
          {IMenu.map((item, index) => {
            return (
              <Tooltip title={item.label} key={index} trigger="hover">
                <Space
                  key={index}
                  className={`w-100 item-menu ${
                    activeItem === item.key ? 'menu-item-active' : ''
                  }`}
                  direction="horizontal"
                  onClick={() => {
                    navigate(item.key), setActiveItem(item.key);
                  }}
                >
                  {item.icon}
                  {activeItem === item.key && (
                    <Typography className="title-menu">{item.label}</Typography>
                  )}
                </Space>
              </Tooltip>
            );
          })}
        </Space>
        <DropProfile />
      </Header>
      <Content className="layout-content">
        <Card className="ant-card-layout">
          <Outlet />
        </Card>
      </Content>
    </Layout>
  );
};
