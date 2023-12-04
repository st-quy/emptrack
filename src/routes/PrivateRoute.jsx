import { lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';

import UpdateEmployees from './../pages/Employees/UpdateEmployees';
import EmployeesList from './../pages/Employees/EmployeesList';

// Define routes accessible only to authenticated users
const PrivateRoute = [
  {
    path: '/',
    element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
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
            path: 'update',
            element: <UpdateEmployees/>,
          }
        ],

        
      },
      {
        path: 'projects',
        element: <div>User projects</div>,
      },
    ],
  },
];

export default PrivateRoute;
