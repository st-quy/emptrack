import { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import Button from './../../../components/atoms/Button/Button';
import { EyeOutlined } from '@ant-design/icons';

const Projects = () => {
  const breadcrumbItems = [{ key: 'projects' }];
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api-emptrack.onrender.com/projects')
      .then(response => response.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleViewProject = projectId => {
    // Redirect to ProjectUpdate and pass the projectId in URL param
    window.location.href = `/projects/update/${projectId}`;
  };

  const columns = [
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewProject(record.id)}
        />
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
      render: managers => (
        <span>
          {managers.map(manager => (
            <div key={manager.id}>{manager.name}</div>
          ))}
        </span>
      ),
    },
    {
      title: 'Member',
      dataIndex: 'member',
      key: 'member',
      render: members => (
        <span>
          {members.map(member => (
            <div key={member.id}>{member.name}</div>
          ))}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Technical',
      dataIndex: 'technical',
      key: 'technical',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    // Add more columns as needed
  ];

  return (
    <div id="projects">
      <Breadcrumb items={breadcrumbItems} />
      <Table
        dataSource={projects}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default Projects;