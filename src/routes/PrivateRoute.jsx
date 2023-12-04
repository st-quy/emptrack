import { lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import Employees from '../pages/Employees/Employees.jsx';

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
        element: <div>User employees</div>,
      },
      {
        path: 'projects',
        element: <div>User projects</div>,
      },
      {
        path: 'employees/create',
        element: <Employees />,
      },
    ],
  },
];

export default PrivateRoute;
