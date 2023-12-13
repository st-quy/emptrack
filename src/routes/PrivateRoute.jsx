// import { lazy } from 'react';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import CreateEmployees from '../pages/Employees/CreateEmployee/CreateEmployees.jsx';
import EmployeesList from '../pages/Employees/EmployeesList/EmployeesList';
import CreateProject from '../pages/Project/CreateProject/CreateProject';
import ProjectList from '../pages/Project/ProjectList/ProjectList.jsx';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute.jsx';

// Define routes accessible only to authenticated users
import DetailsProject from '../pages/Project/Details/DetailsProject';
import ProjectUpdate from '../pages/Project/Project Update/ProjectUpdate.jsx';
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
          {
            path: 'details/:id',
            element: <DetailsProject />,
          },
          {
            path: 'update/:id', // Thêm parameter projectId vào URL
            element: <ProjectUpdate />,
          },
        ],
      },
    ],
  },
];

export default PrivateRoute;
