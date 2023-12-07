// import { lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import EmployeesList from '../pages/Employees/EmployeesList/EmployeesList';
import CreateProject from '../pages/Project/CreateProject/CreateProject';

// Define routes accessible only to authenticated users
import ProjectList from '../pages/Project/ProjectList/ProjectList.jsx';
import ProjectUpdate from '../pages/Project/Project Update/ProjectUpdate.jsx';
import ViewProject from '../pages/Project/ViewProject/ViewProject.jsx';
const PrivateRoute = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'employees',
        children: [
          {
            path: '',
            element: <EmployeesList />,
          },
          {
            path: 'create',
            element: <EmployeesList />,
          },
        ],
      },
      {
        path: 'projects',
        children: [
          {
            path: '',
            element: <ProjectList />,
          },
          {
            path: 'create',
            element: <CreateProject />,
          },
          {
            path: 'update/:projectId', // Thêm parameter projectId vào URL
            element: <ProjectUpdate />,
          },
          {
            path: 'view/:projectId', // Thêm parameter projectId vào URL
            element: <ViewProject />,
          },
        ],
      },
    ],
  },
];

export default PrivateRoute;
