// PrivateRoute.jsx
// import { lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import CreateEmployees from '../pages/Employees/CreateEmployee/CreateEmployees.jsx';
import ProjectList from '../pages/Project/ProjectList/ProjectList.jsx';
import EmployeesList from '../pages/Employees/EmployeesList/EmployeesList';
import CreateProject from '../pages/Project/CreateProject/CreateProject.jsx';

// Define routes accessible only to authenticated users
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
            element: <CreateEmployees />,
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
        ],
      },
    ],
  },
];

export default PrivateRoute;
