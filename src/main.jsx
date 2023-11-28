import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Suspense } from 'react';
import AuthProvider from './provider/authProvider';
import SpinLoading from './components/atoms/SpinLoading/SpinLoading.jsx';
import Routes from './router.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Suspense fallback={<SpinLoading />}>
      <Routes />
    </Suspense>
  </AuthProvider>,
);
