import { UserOutlined, LogoutOutlined,SettingOutlined } from '@ant-design/icons';
import { Dropdown, Row, Space, Switch, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './DropProfile.scss';
import i18n from 'i18next';

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
    // {
    //   key: 'profile',
    //   label: (
    //     <Typography style={{ color: '#121212', fontWeight: 600 }}>
    //       {t('DROPDOWN_PROFILE.PROFILE')}
    //     </Typography>
    //   ),
    //   icon: <UserOutlined />,
    // },
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
    <Space direction="horizontal" size={'large'}>
      <Switch
        checkedChildren="EN"
        unCheckedChildren="VI"
        defaultChecked={localStorage.getItem('lang') === 'en' ? true : false}
        onChange={(e) => {
          localStorage.setItem('lang', e ? 'en' : 'vi');
          i18n.changeLanguage(e ? 'en' : 'vi');
        }}
      />
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
        <SettingOutlined />
        </Typography.Text>
      </Dropdown>
    </Space>
  );
};
export default DropProfile;
