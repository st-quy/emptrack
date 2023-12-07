import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import Button from '../../../components/atoms/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';



function DetailEmployees() {
  const {id} = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  
  return (
    <>
    <div className="employees_update" style={{ height: 100 }}>
    <Space className="w-100 justify-content-between">
        <Breadcrumb items={[{ key: 'employees' }]} />
        <Button onClick={() => navigate('/employees/update')}>
          {t('BREADCRUMB.USERS_UPDATE')}
        </Button>
      </Space>
    
    <div>{id}</div>
    </div>
    </>
    
  );
}

export default DetailEmployees;
