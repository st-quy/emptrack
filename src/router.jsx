import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import NotFound from './pages/Notfound/Notfound';

const Routes = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Outlet />,
      errorElement: <NotFound />,
      children: [...PublicRoute, ...PrivateRoute],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
