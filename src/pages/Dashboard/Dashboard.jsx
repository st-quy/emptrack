import { Card, Col, Row, Space } from 'antd';
import Breadcrumb from '../../components/molecules/Breadcrumb/Breadcrumb';
import './Dashboard.scss';
import LineChart from '../../components/charts/LineChart/LineChart';
import WorkingPieChart from '../../components/charts/PieChart/WorkingPieChart';
import BoolPieChart from '../../components/charts/PieChart/BoolPieChart';

const Dashboard = () => {
  const breadcrumbItems = [{ key: 'dashboard' }];
  return (
    <div id="dashboard">
      <Breadcrumb items={breadcrumbItems} />
      <Row className="w-100 dashboard-container" gutter={[16, 16]}>
        <Col xs={24} sm={24} md={14}>
          <Space direction="vertical" size={16} className="w-100">
            <Row className="w-100">
              <Card
                className="card-dashboard w-100"
                title="Income of ST United Company"
              >
                <LineChart idChart="line-chart" />
              </Card>
            </Row>
            <Row className="w-100">
              <Col
                xs={24}
                sm={24}
                md={12}
                style={{ paddingRight: '8px', paddingBottom: '16px' }}
              >
                <Card
                  className="card-pie w-100"
                  title="Thống kê theo công việc"
                >
                  <BoolPieChart />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} style={{ paddingLeft: '8px' }}>
                <Card className="card-pie w-100" title="Thống kê theo vị trí">
                  <WorkingPieChart />
                </Card>
              </Col>
            </Row>
          </Space>
        </Col>
        <Col xs={24} sm={24} md={10}>
          <Card
            className="card-timeline w-100"
            title="Biến động công ty"
          ></Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
