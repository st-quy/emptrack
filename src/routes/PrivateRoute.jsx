import { lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import EmployeesList from '../pages/Employees/EmployeesList';
import ProjectList from "../pages/Project/ProjectList/ProjectList.jsx";


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
        element: (
          <> <EmployeesList />
          </>
        )
      },
      {
        path: 'projects',
        children: [
          {
            path: '',
            element: <ProjectList />,
          },
         
          
        ],
      },
    ]
  }
]

export default PrivateRoute;