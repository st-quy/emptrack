import { lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import ProjectUpdate from '../pages/Project/Project Update/ProjectUpdate.jsx';
import Projects from '../pages/Project/Project List/ProjectList.jsx';
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
        children: [
          {
            path: '',
            element: <Projects />,
          },
          {
            path: 'update/:projectId', // Thêm parameter projectId vào URL
            element: <ProjectUpdate />,
          },
        ],
      },
    ],
  },
];

export default PrivateRoute;
