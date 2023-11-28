import { Button, Col, Row, Space, Typography } from 'antd';
import './Notfound.scss';
const NotFound = () => {
  return (
    <Row id="notfound-container">
      <Col md={12} className="notfound-children">
        <Space
          direction="vertical"
          align="center"
          className="notfound-content"
          size={'small'}
        >
          <Typography.Title level={1} className="title-oops">
            Oops!
          </Typography.Title>
          <Typography.Paragraph>404 - PAGE NOT FOUND</Typography.Paragraph>
          <Typography.Paragraph className="content-sorry">
            SORRY BUT THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST, HAVE BEEN
            REMOVED. NAME CHANGED OR IS TEMPORARILY UNAVAILABLE
          </Typography.Paragraph>
          <Button>Go Back Home</Button>
        </Space>
      </Col>
      <Col xs={0} md={12}>
        <video
          autoPlay
          loop
          muted
          src="https://cdn.dribbble.com/users/721278/screenshots/17116621/media/9c6a9e9e7c2e476e7eb14ebda887cbfa.mp4"
          className="video-frame"
        ></video>
      </Col>
    </Row>
  );
};

export default NotFound;
