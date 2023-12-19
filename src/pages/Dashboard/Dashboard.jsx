import { Card, Col, Image, Row, Space, Statistic, Typography } from 'antd';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import LineChart from '../../components/charts/LineChart/LineChart';
import BoolPieChart from '../../components/charts/PieChart/BoolPieChart';
import Breadcrumb from '../../components/molecules/Breadcrumb/Breadcrumb';
import TableProgress from '../../components/molecules/TableProgress/TableProgress';
import './Dashboard.scss';
import { axiosInstance } from '../../config/axios';
import moment from 'moment';
import SpinLoading from '../../components/atoms/SpinLoading/SpinLoading';

const Dashboard = () => {
  const { t } = useTranslation();
  const breadcrumbItems = [{ key: 'dashboard' }];
  const [filteredData, setFilteredData] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState();
  const [allEmployees, setAllEmployees] = useState([]);

  useEffect(() => {
    document.title = 'EMP | Dashboard';
  }, []);
  const formatter = (value) => <CountUp end={value} separator="," />;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance
          .get('employees')
          .then((response) => response.data);
        setTotalEmployees(result.length);
        const filterDeleted = result.filter((item) => !item.deletedAt);
        setAllEmployees(filterDeleted);

        if (filterDeleted && filterDeleted.length > 0) {
          const commingBirth = [];
          filterDeleted.forEach((person) => {
            const birthDate = person.birth.split('-')[0];
            const currentDate = moment().format('DD');
            const furtureDate = moment().add(2, 'day').format('DD');
            if (
              birthDate === currentDate ||
              (birthDate > currentDate && birthDate <= furtureDate)
            ) {
              commingBirth.push(person);
            }
          });
          setFilteredData(commingBirth);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
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
                        {t('TITLE.TOTAL_EMPLOYEES')}
                      </Typography>
                      <Statistic
                        style={{ fontSize: '30px' }}
                        value={totalEmployees}
                        formatter={formatter}
                      />
                    </Space>
                  </Card>
                  <Card
                    className="card-dob w-100"
                    title={t('TABLE.BIRTHDATE_BUDDIES')}
                  >
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <Space
                          direction="horizontal"
                          align="start"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingTop: '10px',
                          }}
                        >
                          <Image
                            src={item.avatar[0].url}
                            alt={`avatar`}
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                            preview={false}
                          />
                          <Typography>{item.name}</Typography>
                          <Typography>{item.birth}</Typography>
                        </Space>
                      ))
                    ) : (
                      <SpinLoading />
                    )}
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
                  <BoolPieChart data={allEmployees} />
                </Card>
              </Col>
            </Row>
            <Row className="w-100">
              <Card className="card-dashboard w-100" title={t('TITLE.INCOME')}>
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
