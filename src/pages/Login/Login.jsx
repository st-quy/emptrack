import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';
import {
  Col,
  Divider,
  Row,
  Space,
  Typography,
  Checkbox,
  Form,
  Input,
  notification,
} from 'antd';
import './Login.scss';
import { useTranslation } from 'react-i18next';
import Button from '../../components/atoms/Button/Button';
import iconGoogle from '../../assets/img/google-icon.png';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { auth, provider } from '../../service/firebase';
import { signInWithPopup } from 'firebase/auth';
import { axiosInstance } from '../../config/axios';
import { useEffect } from 'react';
import { Toast } from '../../components/toast/Toast';

const Login = () => {
  const { setToken, token } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message) => {
    api[type]({
      message,
    });
  };
  if (token) {
    return <Navigate to="/" />;
  }
  useEffect(() => {
    document.title = 'EMP | Login';
  }, []);

  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      if (data.user.email === import.meta.env.VITE_APP_EMAIL) {
        setToken(data.user.accessToken);
      } else {
        return openNotificationWithIcon('error', `${t('LOGIN.ERROR')}`);
      }
    });
  };

  const onFinish = async (values) => {
    await axiosInstance.post('login', values).then((response) => {
      if (response) {
        navigate('/');
        Toast('success', t('TOAST.LOGIN_SUCCESS'));
        return setToken(response.data);
      } else {
        return openNotificationWithIcon('error', `${t('LOGIN.ERROR')}`);
      }
    });
  };
  return (
    <div id="main-container">
      {contextHolder}
      <Row className="auth-sidebar">
        <Col xs={0} sm={8} md={8} className="auth-sidebar-content">
          <video
            className="auth-sidebar-video"
            autoPlay
            loop
            muted
            src="https://cdn.dribbble.com/users/721278/screenshots/15322527/media/ed945c1890320c7ca9be231cd7397653.mp4"
          ></video>
        </Col>
        <Col xs={24} sm={16} md={16} className="form-login">
          <Space direction="vertical" className="form-content">
            <Typography className="title-login">{t('LOGIN.TEXT')}</Typography>
            <Button
              className="btn-login"
              type="secondary"
              block
              onClick={handleClick}
            >
              <div className="d-flex align-items-center justify-content-center">
                <img
                  src={iconGoogle}
                  style={{ width: '30px', marginRight: '10px' }}
                />
                {t('LOGIN.WITH_GOOGLE')}
              </div>
            </Button>
            <Divider>{t('LOGIN.WITH_EMAIL')}</Divider>
            <Form
              name="normal_login"
              className="login-form w-100"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Email!',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                  type="email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Password!',
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-login w-100"
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
