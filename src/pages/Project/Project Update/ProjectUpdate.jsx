import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProjectUpdate = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api-emptrack.onrender.com/projects/${projectId}`)
      .then(response => response.json())
      .then(data => {
        setProject(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  // Render the project update form or information

  return (
    <div>
      <h2>Update Project: {project.name}</h2>
      {/* Render the project update form or information */}
    </div>
  );
};

export default ProjectUpdate;