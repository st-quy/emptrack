import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';
import { Col, Row } from 'antd';
import './Login.scss';
const Login = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    setToken('this is a test token');
    navigate('/', { replace: true });
  };

  // setTimeout(() => {
  //   handleLogin();
  // }, 3 * 1000);

  return (
    <div id="main-container">
      <Row className="auth-sidebar">
        <Col xs={0} md={5} className="auth-sidebar-content">
          <video
            className="auth-sidebar-video"
            autoPlay
            loop
            muted
            src="https://cdn.dribbble.com/users/721278/screenshots/16025317/media/b413473d8b074359831e829ac2508879.mp4"
          ></video>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
