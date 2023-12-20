// Define public routes accessible to all users
import Login from '../pages/Login/Login';

const PublicRoute = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'service',
    children: [
      {
        path: 'log',
        element: <div>Blog</div>,
      },
    ],
  },
  {
    path: 'about-us',
    element: <div>About Us</div>,
  },
];

export default PublicRoute;
