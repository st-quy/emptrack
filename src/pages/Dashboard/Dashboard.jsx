import { Card, Col, Row, Space } from 'antd';
import Breadcrumb from '../../components/molecules/Breadcrumb/Breadcrumb';
import './Dashboard.scss';
import LineChart from '../../components/charts/LineChart/LineChart';
import WorkingPieChart from '../../components/charts/PieChart/WorkingPieChart';
import BoolPieChart from '../../components/charts/PieChart/BoolPieChart';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const breadcrumbItems = [{ key: 'dashboard' }];
  useEffect(() => {
    document.title = 'EMP | DASHBOARD';
  }, []);
  return (
    <div id="dashboard">
      <Breadcrumb items={breadcrumbItems} />
      <Row className="w-100 dashboard-container" gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={14}>
          <Space direction="vertical" size={16} className="w-100">
            <Row className="w-100">
              <Card
                className="card-dashboard w-100"
                title={t('TITLE.INCOME')}
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
                  title={t('TITLE.STATISTIC_WORK')}
                >
                  <BoolPieChart />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} style={{ paddingLeft: '8px' }}>
                <Card className="card-pie w-100" title={t('TITLE.STATISTIC_POSITION')}>
                  <WorkingPieChart />
                </Card>
              </Col>
            </Row>
          </Space>
        </Col>
        <Col xs={24} sm={24} md={24} lg={10}>
          <Card
            className="card-timeline w-100"
            title={t('TITLE.STATISTIC_COMPANY')}
          ></Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
