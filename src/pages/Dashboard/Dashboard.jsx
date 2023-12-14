import { Card, Col, Row, Space, Statistic, Typography } from 'antd';
import Breadcrumb from '../../components/molecules/Breadcrumb/Breadcrumb';
import './Dashboard.scss';
import LineChart from '../../components/charts/LineChart/LineChart';
import WorkingPieChart from '../../components/charts/PieChart/WorkingPieChart';
import BoolPieChart from '../../components/charts/PieChart/BoolPieChart';
import { useEffect } from 'react';
import TableProgress from '../../components/molecules/TableProgress/TableProgress';
import { useTranslation } from 'react-i18next';
import CountUp from 'react-countup';

const Dashboard = () => {
  const { t } = useTranslation();
  const breadcrumbItems = [{ key: 'dashboard' }];
  useEffect(() => {
    document.title = 'EMP | Dashboard';
  }, []);
  const formatter = (value) => <CountUp end={value} separator="," />;

  return (
    <div id="dashboard">
      <Breadcrumb items={breadcrumbItems} />
      <Row className="w-100 dashboard-container" gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={12}>
          <Card
            className="card-timeline w-100"
            title={t('CARD.PROJECT_SUMMARY')}
          >
            <TableProgress />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12}>
          <Space direction="vertical" className="w-100">
            <Row className="w-100">
              <Col xs={24} sm={24} md={12} style={{ bottom: '16px' }}>
                <Space direction="vertical" className="w-100">
                  <Card className="card-statistic w-100">
                    <Space
                      direction="vertical"
                      align="center"
                      className="w-100"
                    >
                      <Typography
                        style={{ fontSize: '20px', paddingTop: '10px' }}
                      >
                        Total Employees
                      </Typography>
                      <Statistic
                        style={{ fontSize: '30px' }}
                        // title="Active Users"
                        value={112893}
                        formatter={formatter}
                      />
                    </Space>
                  </Card>
                  <Card className="card-dob w-100" title="Birthday Buddies">
                    <Space
                      direction="horizontal"
                      align="start"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '10px',
                      }}
                    >
                      <Typography>Pham Van Quy</Typography>
                      <Typography>13/06/2000</Typography>
                    </Space>
                  </Card>
                </Space>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                style={{
                  paddingLeft: '8px',
                  paddingBottom: '16px',
                  // paddingTop: '16px',
                }}
              >
                <Card
                  className="card-pie w-100"
                  title={t('TITLE.STATISTIC_WORK')}
                >
                  <BoolPieChart />
                </Card>
              </Col>
            </Row>
            <Row className="w-100">
              <Card
                className="card-dashboard w-100"
                title="Income of ST United Company"
              >
                <LineChart idChart="line-chart" />
              </Card>
            </Row>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
