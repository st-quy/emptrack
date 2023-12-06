// PrivateRoute.jsx
// import { lazy } from 'react';
import { Button } from 'antd';
// PrivateRoute.jsx
// import { lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import EmployeesList from '../pages/Employees/EmployeesList/EmployeesList';

// Define routes accessible only to authenticated users
import ProjectList from '../pages/Project/ProjectList/ProjectList.jsx';
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
        element: (
          <>
            {' '}
            <EmployeesList />
          </>
        ),
      },
      {
        path: 'projects',
        element: <ProjectList />,
      },
    ],
  },
];

export default PrivateRoute;
