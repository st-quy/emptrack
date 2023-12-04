

// PrivateRoute.jsx
// import { lazy } from 'react';
import { Button } from 'antd';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import EmployeesList from '../pages/Employees/EmployeesList';

// Define routes accessible only to authenticated users
import ProjectList from "../pages/Project/ProjectList.jsx";
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
          <> <EmployeesList/>
          </>
        )
      },
      {
        path: 'projects',
        element: <ProjectList />
      },
    ],
  },
];

export default PrivateRoute;
