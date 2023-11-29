import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Row, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './DropProfile.scss';

const DropProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleUser = async (key) => {
    if (key == 'profile') {
      navigate('/profile');
    }
    if (key == 'logout') {
      localStorage.clear();
      window.location.reload();
    }
  };

  const items = [
    {
      key: 'profile',
      label: (
        <Typography style={{ color: '#121212', fontWeight: 600 }}>
          {t('DROPDOWN_PROFILE.PROFILE')}
        </Typography>
      ),
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      label: (
        <Typography style={{ color: '#FB303E', fontWeight: 600 }}>
          {t('DROPDOWN_PROFILE.SIGN_OUT')}
        </Typography>
      ),
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
        onClick: (item) => {
          handleUser(item.key);
        },
      }}
      trigger={['hover']}
      className="profile-dropdown"
      overlayClassName="profile-menu"
      placement="bottom"
      // onOpenChange={() => setActiveItem(!activeItem)}
    >
      <Typography.Text className="drop-name font-bold text-[#5646ff]">
        Profile
      </Typography.Text>
    </Dropdown>
  );
};
export default DropProfile;
