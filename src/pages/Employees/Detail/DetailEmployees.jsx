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
  Modal,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import FormItem from 'antd/es/form/FormItem';
const { Item } = Form;
// const { RangePicker } = DatePicker;DetailEmployees
// const { Text } = Typography;
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

  return (
    <>
    <div id="employee_details" style={{ height: '100px' }}>
      {employees ? (
        <>
          <Space className="w-100 justify-content-between">
            <Breadcrumb
              items={[
                { key: 'employees' },
                { key: 'employees_details', rout: `/employees/details/${id}` },
              ]}
            />
            <Button onClick={() => navigate('/employees/update')}>
              {t('BREADCRUMB.EMPLOYEES_UPDATE')}
              
            </Button>
          </Space>
          <div className="details-scroll-container"
          style={{
            borderRadius: '30px'
            }}
>
            <Card

              title={t('EMPLOYEES.DETAILS')}
              className="details-card" 
            >
            <Form>
            <Row gutter={[16, 16]}>
                 {/* AVATAR EMPLOYEE */}
                 <Col span={12}>
                    {t('EMPLOYEES.AVATAR')}
                        <div className='styleAvatar'>
                          <img
                            src={employees?.avatar[0].url}
                            alt="Preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',  
                              // marginTop: '40px', 
                               objectFit: 'cover'
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
                    <Input className='text'
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
                      <Option value="male">{t('EMPLOYEES.GENDER_MEN')}</Option>
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
      // defaultValue={dayjs(employees?.dob)}
      disabled
      // placeholder={t('EMPLOYEES.dob')}
      defaultValue={dayjs(employees?.dob, dateFormat)}
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
                      defaultValue={employees?.cccd}
                      disabled
                      placeholder={t('EMPLOYEES.CITIZEN_CARD')}
                    
                    />
                  </Item>
                </Col>
                {/* <Col span={12} style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <Col span={24}>
                    <Form.Item
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
                    </Form.Item>
                  </Col>
                </Col> */}
                
              </Row>
            </Form>
            {/* {t('EMPLOYEES.DETAILS')} */}
            <Form>
              <Row gutter={[16, 0]}>
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
                      <Option value={true}>{t('EMPLOYEES.MANAGER')}</Option>
                      <Option value={false}>{t('EMPLOYEES.NOT_MANAGER')}</Option>
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
                      <Option value="active">{t('EMPLOYEES.ACTIVE')}</Option>
                      <Option value="unactive">{t('EMPLOYEES.UNACTIVE')}</Option>
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
            </Form>
          </Card>
         </div> </>
          
       ): <SpinLoading />}
      </div>
    </>
  );
}

export default DetailEmployees;
