// Define public routes accessible to all users
const PublicRoute = [
  {
    path: 'service',
    children: [
      {
        path: '',
        element: <div>Service</div>,
      },
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
