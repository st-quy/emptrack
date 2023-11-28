import { lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute.jsx';
const Logout = lazy(() => import('../pages/Logout.jsx'));

// Define routes accessible only to authenticated users
const PrivateRoute = [
  {
    path: '/',
    element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
    children: [
      {
        path: '',
        element: <div>User Home Page</div>,
      },
      {
        path: '/dashboard',
        element: <div>User dashboard</div>,
      },
      {
        path: '/employees',
        element: <div>User employees</div>,
      },
      {
        path: '/projects',
        element: <div>User projects</div>,
      },
    ],
  },
];

export default PrivateRoute;
