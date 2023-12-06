

// PrivateRoute.jsx
// import { lazy } from 'react';
import { Button } from 'antd';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import EmployeesList from './../pages/Employees/EmployeesList';

// Define routes accessible only to authenticated users
import ProjectList from "../pages/Project/ProjectList.jsx";
import UpdateForm from '../pages/Employees/UpdateForm.jsx';
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
            path: 'update/:id',
            element: <UpdateForm/>,
          }
        ],

        
      },
      {
        path: 'projects',
        element: <ProjectList />
      },
    ],
  },
];

export default PrivateRoute;
