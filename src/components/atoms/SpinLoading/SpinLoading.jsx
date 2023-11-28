import { Spin } from 'antd';
import React from 'react';

import './SpinLoading.scss';

const SpinLoading = () => {
  const accessToken = localStorage.getItem("token");

  if (!accessToken) {
    window.location.href = `${location.origin}/login`;
  }
  return (
    <div className="spin">
      <Spin size="large" />
    </div>
  );
};
export default SpinLoading
