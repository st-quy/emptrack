import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import Button from '../../../components/atoms/Button/Button';
import { useTranslation } from 'react-i18next';
import { Card, Space, Spin } from 'antd';
import axios from 'axios';

const ViewProject = () => {
  const { projectId } = useParams();

  console.log(projectId);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `https://api-emptrack.onrender.com/projects/${projectId}`,
        );
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const breadcrumbItems = [{ key: 'projects' }];

  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Breadcrumb items={breadcrumbItems} />
        <Link to={`/projects/update/${projectId}`}>
          <Button type="primary">{t('BUTTON.UPDATE')}</Button>
        </Link>
      </Space>
    </div>
  );
};

export default ViewProject;
