import { Card, Col, Row } from 'antd';
import Breadcrumb from '../../components/molecules/Breadcrumb/Breadcrumb';
import './Dashboard.scss';
const Dashboard = () => {
  const breadcrumbItems = [{ key: 'dashboard' }];
  return (
    <div id="dashboard">
      <Breadcrumb items={breadcrumbItems} />
      {/* <Card className="card-dashboard">
        <Row className="w-100">
          <Col xs={24} sm={12} md={12}></Col>
          <Col xs={24} sm={12} md={12}></Col>
        </Row>
      </Card> */}
    </div>
  );
};

export default Dashboard;
