import React, { useEffect } from 'react';
import { notification } from 'antd';

const Toast = ({ type, message }) => {
  useEffect(() => {
    openNotificationWithIcon();
  }, []);

  const openNotificationWithIcon = () => {
    notification[type]({
      message: message,
    });
  };

  return null;
};

export default Toast;
