import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import Button from '../../../components/atoms/Button/Button';
import { useTranslation } from 'react-i18next';
import Card from 'antd/es/card/Card';
import { axiosInstance } from '../../../config/axios';
import SpinLoading from '../../../components/atoms/SpinLoading/SpinLoading';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import './DetailEmployees.scss';
import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  Tabs,
  Progress,
  Divider,
  Tag,
} from 'antd';
const { Item } = Form;
const { Option } = Select;
const dateFormat = 'DD/MM/YYYY';

function DetailEmployees() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const [employees, setEmployees] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const employeeData = await axiosInstance
        .get(`employees/${id}`)
        .then((res) => res.data);
      setEmployees(employeeData);
    };
    fetchData();
  }, [id]);

  function capitalizeFLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }
  const onChange = (key) => {
    console.log(key);
  };
  const twoColors = {
    '0%': '#108ee9',
    '100%': '#87d068',
  };
  return (
    <>
      <div id="employee_details" style={{ height: '100px' }}>
        <Space className="w-100 justify-content-between">
          <Breadcrumb
            items={[
              { key: 'employees' },
              {
                key: 'employees_details',
                route: `/employees/details/${id}`,
              },
            ]}
          />
          <Button onClick={() => navigate(`/employees/update/${id}`)}>
            {t('BREADCRUMB.EMPLOYEES_UPDATE')}
          </Button>
        </Space>

        <Card
          title={t('EMPLOYEES.DETAILS').toUpperCase()}
          className="card-detail-employees"
          style={{
            borderRadius: '30px',
          }}
        >
          <Tabs
            defaultActiveKey="2"
            items={[
              {
                key: '1',
                label: t('PROJECTS.BASIC_INFORMATION'),
                children: (
                  <>
                    {employees ? (
                      <>
                        <Form
                          labelCol={{
                            sm: { span: 24 },
                            md: { span: 24 },
                            lg: { span: 5 },
                          }}
                          wrapperCol={{
                            sm: { span: 24 },
                            md: { span: 24 },
                            lg: { span: 19 },
                          }}
                          className="p-2"
                        >
                          {/* <Typography.Title level={5}>
                            {t('PROJECTS.BASIC_INFORMATION')}
                          </Typography.Title> */}
                          <Row className="w-100" gutter={16}>
                            {/* AVATAR EMPLOYEE */}
                            <Col span={12}>
                              {t('EMPLOYEES.AVATAR')}
                              <div className="styleAvatar">
                                <img
                                  src={employees?.avatar[0].url}
                                  alt="Preview"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                  }}
                                />
                              </div>
                            </Col>

                            <Col span={12}>
                              <Form.Item
                                label={t('EMPLOYEES.DESCRIPTION')}
                                name="description"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <TextArea
                                  size="large"
                                  defaultValue={employees?.description}
                                  disabled
                                  rows={8}
                                  style={{ resize: 'none' }}
                                  placeholder={t('EMPLOYEES.DESCRIPTION')}
                                />
                              </Form.Item>
                            </Col>
                            {/* CODE EMPLOYEE */}
                            <Col span={12}>
                              <Item
                                label={t('EMPLOYEES.CODE')}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input
                                  size="large"
                                  defaultValue={employees?.code}
                                  placeholder={t('EMPLOYEES.CODE')}
                                  readOnly
                                  disabled
                                />
                              </Item>
                            </Col>
                            {/* NAME EMPLOYEE */}
                            <Col span={12}>
                              <Item
                                label={t('EMPLOYEES.NAME')}
                                name="name"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input
                                  className="text"
                                  size="large"
                                  defaultValue={employees?.name}
                                  disabled
                                />
                              </Item>
                            </Col>
                            {/* PHONE EMPLOYEE */}
                            <Col span={12}>
                              <Item
                                label={t('EMPLOYEES.PHONE')}
                                name="phone"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input
                                  size="large"
                                  defaultValue={employees?.phone}
                                  disabled
                                  placeholder={t('EMPLOYEES.PHONE')}
                                />
                              </Item>
                            </Col>
                            {/* GENDER EMPLOYEE */}
                            <Col span={12}>
                              <Item
                                label={t('EMPLOYEES.GENDER')}
                                name="gender"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Select
                                  size="large"
                                  defaultValue={employees?.gender}
                                  disabled
                                  placeholder={t('EMPLOYEES.GENDER')}
                                  style={{
                                    width: '100%',
                                  }}
                                >
                                  <Option value="male">
                                    {t('EMPLOYEES.GENDER_MEN')}
                                  </Option>
                                  <Option value="female">
                                    {t('EMPLOYEES.GENDER_WOMEN')}
                                  </Option>
                                  <Option value="unknown">
                                    {t('EMPLOYEES.GENDER_UNKNOWN')}
                                  </Option>
                                </Select>
                              </Item>
                            </Col>
                            {/* BIRTHDAY EMPLOYEE */}
                            <Col span={12}>
                              <Item
                                label={t('EMPLOYEES.BIRTH')}
                                name="birth"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <DatePicker
                                  size="large"
                                  disabled
                                  defaultValue={dayjs(
                                    employees.birth,
                                    dateFormat,
                                  )}
                                  format={dateFormat}
                                  style={{ width: '100%' }}
                                />
                              </Item>
                            </Col>
                            {/* CITIZEN_CARD EMPLOYEE */}
                            <Col span={12}>
                              <Item
                                label={t('EMPLOYEES.CITIZEN_CARD')}
                                name="citizen_card"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input
                                  size="large"
                                  defaultValue={employees?.citizen_card}
                                  disabled
                                  placeholder={t('EMPLOYEES.CITIZEN_CARD')}
                                />
                              </Item>
                            </Col>
                            <Col span={12}>
                              <Item
                                label={t('EMPLOYEES.ADDRESS')}
                                name="address"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input
                                  size="large"
                                  defaultValue={employees?.address}
                                  disabled
                                  placeholder={t('EMPLOYEES.ADDRESS')}
                                />
                              </Item>
                            </Col>
                            <Col span={12}>
                              <Item
                                label={t('EMPLOYEES.EMAIL')}
                                name="address"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input
                                  size="large"
                                  defaultValue={employees?.email}
                                  disabled
                                  placeholder={t('EMPLOYEES.EMAIL')}
                                />
                              </Item>
                            </Col>
                          </Row>
                        </Form>
                        {/* {t('EMPLOYEES.DETAILS')} */}
                        <Form>
                          <Row className="w-100" gutter={16}>
                            {/* IS_MANAGER EMPLOYEE */}
                            <Col span={12}>
                              <Item
                                label={t('EMPLOYEES.IS_MANAGER')}
                                name="isManager"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                hasFeedback
                              >
                                <Select
                                  size="large"
                                  defaultValue={employees?.isManager}
                                  disabled
                                  placeholder={t('EMPLOYEES.IS_MANAGER')}
                                  style={{ width: '100%' }}
                                >
                                  <Option value={true}>
                                    {t('EMPLOYEES.MANAGER')}
                                  </Option>
                                  <Option value={false}>
                                    {t('EMPLOYEES.NOT_MANAGER')}
                                  </Option>
                                </Select>
                              </Item>
                            </Col>
                            {/* STATUS EMPLOYEE */}
                            <Col span={12}>
                              <Item
                                label={t('EMPLOYEES.STATUS')}
                                name="status"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Select
                                  size="large"
                                  defaultValue={employees?.status}
                                  disabled
                                  placeholder={t('EMPLOYEES.STATUS')}
                                  style={{ width: '100%' }}
                                >
                                  <Option value="active">
                                    {t('EMPLOYEES.ACTIVE')}
                                  </Option>
                                  <Option value="unactive">
                                    {t('EMPLOYEES.UNACTIVE')}
                                  </Option>
                                </Select>
                              </Item>
                            </Col>
                            {/* POSITION EMPLOYEE */}
                            <Col span={12}>
                              <Item
                                label={t('EMPLOYEES.POSITION')}
                                name="position"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input
                                  size="large"
                                  defaultValue={employees?.position}
                                  disabled
                                  placeholder={t('EMPLOYEES.POSITION')}
                                />
                              </Item>
                            </Col>
                            {/* LINE_MANAGER EMPLOYEE */}
                            <Col span={12}>
                              <Item
                                label={t('EMPLOYEES.LINE_MANAGER')}
                                name="lineManager"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Input
                                  size="large"
                                  defaultValue={employees?.lineManager}
                                  disabled
                                  placeholder={t('EMPLOYEES.LINE_MANAGER')}
                                />
                              </Item>
                            </Col>
                          </Row>

                          <Typography.Title level={5}>
                            {t('EMPLOYEES.SKILLS_LIST')}:
                          </Typography.Title>
                          {employees?.skills.map((skills, index) => (
                            <Row className="w-100" gutter={16} key={index}>
                              <Col span={12}>
                                <Item
                                  labelCol={{ span: 24 }}
                                  wrapperCol={{ span: 24 }}
                                  name={`skills[${index}].skills`}
                                  label={
                                    `${index + 1} - ` + t('EMPLOYEES.SKILLS')
                                  }
                                  initialValue={skills?.skillname}
                                >
                                  <Input size="large" disabled />
                                </Item>
                              </Col>
                              <Col span={12}>
                                <Item
                                  labelCol={{ span: 24 }}
                                  wrapperCol={{ span: 24 }}
                                  name={`skills[${index}].exp`}
                                  label={t('EMPLOYEES.EXP')}
                                  initialValue={
                                    skills?.exp + ' ' + skills?.addonAfter
                                  }
                                >
                                  <Input size="large" disabled />
                                </Item>
                              </Col>
                            </Row>
                          ))}
                        </Form>
                      </>
                    ) : (
                      <SpinLoading />
                    )}
                  </>
                ),
              },
              {
                key: '2',
                label: t('PROJECTS.PROJECT_INFORMATION'),
                children: (
                  <>
                    <Card className="card-project">
                      <Space
                        direction="horizontal"
                        className="w-100"
                        id="row-first"
                      >
                        <Typography>June 13, 2023</Typography>
                        <Typography
                          style={{ fontSize: '26px', fontWeight: 'bold' }}
                        >
                          :
                        </Typography>

                        {/* <PushpinFilled style={{ fontSize: '24px' }} /> */}
                      </Space>
                      <Space direction="vertical" id="row-second">
                        <Typography id="title-project">EMP Tracking</Typography>
                        <Typography>sdsdsd</Typography>
                      </Space>
                      <Space direction="vertical" id="row-third" size={1}>
                        <Typography>Progress</Typography>
                        <Progress
                          percent={50}
                          status="active"
                          strokeColor={{
                            from: '#108ee9',
                            to: '#87d068',
                          }}
                          showInfo={false}
                          style={{ width: '230px' }}
                        />
                        <Typography
                          className="w-100"
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          50%
                        </Typography>
                        <Divider
                          style={{
                            fontSize: '5px',
                            color: 'black',
                            width: '100%',
                            margin: 0,
                          }}
                        />
                        <Row
                          className="w-100"
                          style={{
                            marginTop: '15px',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <Tag
                            color="#87d068"
                            style={{
                              width: 'fit-content',
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            In Progress
                          </Tag>
                        </Row>
                      </Space>
                    </Card>
                  </>
                ),
              },
            ]}
            onChange={onChange}
          />
        </Card>
      </div>{' '}
    </>
  );
}

export default DetailEmployees;
