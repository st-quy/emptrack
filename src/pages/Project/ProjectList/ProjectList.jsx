import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';

const ProjectList = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button type="primary" onClick={() => navigate('/projects/create')}>
        Create Project
      </Button>
    </div>
  );
};

export default ProjectList;
