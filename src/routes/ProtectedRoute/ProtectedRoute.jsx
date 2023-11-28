import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';
import React, { useState } from 'react';
import {
  AppstoreAddOutlined,
  TeamOutlined,
  HomeOutlined,
  DeploymentUnitOutlined,
  PaperClipOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Layout,
  Menu,
  Button,
  Typography,
  Row,
  Space,
  Card,
  Tooltip,
} from 'antd';
import './ProtectedRoute.scss';

const { Header, Sider, Content } = Layout;

export const ProtectedRoute = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }
  const IMenu = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'employees',
      icon: <TeamOutlined />,
      label: 'Employees',
    },
    {
      key: 'projects',
      icon: <AppstoreAddOutlined />,
      label: 'Projects',
    },
    {
      key: 'devices',
      icon: <DeploymentUnitOutlined />,
      label: 'Devices',
    },
  ];
  return (
    <Layout id="layout-container">
      <Header className="layout-header">
        <Typography className="logo-header">EmpTrack</Typography>
        <Space className="menu-list" direction="horizontal" size={48}>
          {IMenu.map((item, index) => {
            return (
              <Tooltip title={item.label} key={index} trigger="hover">
                <Space
                  className={`w-100 item-menu ${
                    window.location.pathname.includes(item.key)
                      ? 'menu-item-active'
                      : ''
                  }`}
                  direction="horizontal"
                  onClick={() => {
                    navigate(item.key);
                  }}
                >
                  {item.icon}
                  {window.location.pathname.includes(item.key) && (
                    <Typography className="title-menu">{item.label}</Typography>
                  )}
                </Space>
              </Tooltip>
            );
          })}
        </Space>
        <Typography className="logo-header">123</Typography>
      </Header>
      <Content className="layout-content">
        <Card>
          <Outlet />
        </Card>
      </Content>
    </Layout>
  );
};
