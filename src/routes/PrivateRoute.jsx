// PrivateRoute.jsx
// import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import EmployeesList from '../pages/Employees/EmployeesList';
import CreateProject from '../pages/Project/CreateProject/CreateProject.jsx';
import ProjectList from '../pages/Project/ProjectList/ProjectList';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute.jsx';

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
        element: (
          <>
            {' '}
            <EmployeesList />
          </>
        ),
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
