import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/molecules/Breadcrumb/Breadcrumb';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';

import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Upload,
  Select,
} from 'antd';
import './Employees.scss';
import Card from 'antd/es/card/Card';
import { validationSchema } from './ValidationSchema';
import { useParams } from 'react-router-dom';
import moment from 'moment/moment';
const { Item } = Form;
const { Option } = Select;

const UpdateForm = () => {
  const { TextArea } = Input;
  const { t } = useTranslation();
  const {id} = useParams();

  const [employeesData, setEmployeesData] = useState();

useEffect(async () => {
 await axios.get(
        `http://localhost:5500/emptrack-firestore/employees.json/${id}`
      ).then((response) => {
      setEmployeesData(response.data);
      });
},[]);


const formik = useFormik({
  initialValues: {
    code:  '',
    name: '',
    phone: '',
    gender: '',
    birth: '',
    description: '',
    citizen_card: '',
    is_manager: '',
    status: '',
    position: '',
    line_manager: '',
    skills: [{ skillname: '', exp: '' }],
  },
  validationSchema: validationSchema,
  onSubmit: (values) => {
    console.log(values);
    formik.resetForm();
  },
});

  const breadcrumbItems = [
    { key: 'employees', route: '/employees' },
    { key: 'employees_update', route: '/employees/update/:id' },
  ];

  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: '',
    },
  ]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };


  const addSkill = () => {
    formik.setFieldValue('skills', [
      ...formik.values.skills,
      { skillname: '', exp: '' },
    ]);
  };

  const removeSkill = (index) => {
    const newSkills = [...formik.values.skills];
    newSkills.splice(index, 1);
    formik.setFieldValue('skills', newSkills);
  };

  const handleSubmit = () => {
 
    // console.log(skills);
    // const apiUrl = 'https://api-emptrack.onrender.com/employees';  
    // axios.post(apiUrl, { skills })
    //   .then(response => {
    //     console.log('Data updated successfully:', response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error updating data:', error);
    //   }); 
  };
console.log(employeesData)
 const initialValues = employeesData && { 
  code:employeesData ? employeesData.code : '',
  name: employeesData ? employeesData.name : '',
  phone: employeesData ? employeesData.phone : '',
  gender: employeesData ? employeesData.gender : '',
  birth: employeesData ? moment(employeesData.dob) : '',
  description: employeesData ? employeesData.description : '',
  citizen_card: employeesData ? employeesData.cccd : '',
  is_manager: employeesData ? employeesData.is_manager : '',
  status: employeesData ? employeesData.status : '',
  position: employeesData ? employeesData.position : '',
  line_manager: employeesData ? employeesData.lineManager : '',
  skills: employeesData ? employeesData.skills : '',
  }

console.log(initialValues, 'initialValues', 'employeesData', employeesData)
  
  return (
    <div id="employees">      
      {employeesData && (        
        <>
          <Space
        direction="horizontal"
        style={{ justifyContent: 'space-between', width: '100%' }}
      >
        <Breadcrumb items={breadcrumbItems} />
        <Button className="button__update" onClick={formik.handleSubmit}>
          {t('BUTTON_UPDATE')}
        </Button>
      </Space>
      <div
        style={{
          maxHeight: '650px',
          overflowY: 'auto',
        }}
      >
        <Card
          title={
            <span style={{ fontSize: '30px' }}>{t('EMPLOYEES.UPDATE')}</span>
          }
        >
          <Form initialValues={initialValues}>
            <Row gutter={[16, 16]}>
            <Col span={12}>
                <Form.Item
                  label={t('EMPLOYEES.CODE')}
                  name="code"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  hasFeedback
                  validateStatus={
                    formik.errors.code && formik.touched.code
                      ? 'error'
                      : formik.touched.code
                      ? 'success'
                      : ''
                  }
                  help={
                    formik.errors.code &&
                    formik.touched.code &&
                    formik.errors.code
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    size="large"
                    placeholder={t('EMPLOYEES.CODE')}
                    value={employeesData.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}              
                  />
                </Form.Item>
              </Col>

                   <Col span={12}>
                <Item
                  label={t('EMPLOYEES.NAME')}
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the name',
                    },
                  ]}
                  hasFeedback
                  validateStatus={
                    formik.errors.name && formik.touched.name
                      ? 'error'
                      : formik.touched.name
                      ? 'success'
                      : ''
                  }
                  help={
                    formik.errors.name &&
                    formik.touched.name &&
                    formik.errors.name
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    size="large"
                    placeholder={t('EMPLOYEES.NAME')}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Item>
              </Col>

              <Col span={12}>
                <Item
                  label={t('EMPLOYEES.PHONE')}
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the phone',
                    },
                  ]}
                  hasFeedback
                  validateStatus={
                    formik.errors.phone && formik.touched.phone
                      ? 'error'
                      : formik.touched.phone
                      ? 'success'
                      : ''
                  }
                  help={
                    formik.errors.phone &&
                    formik.touched.phone &&
                    formik.errors.phone
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    size="large"
                    placeholder={t('EMPLOYEES.PHONE')}
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Item>
              </Col>

              <Col span={12}>
                <Item
                  label={t('EMPLOYEES.GENDER')}
                  name="gender"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the gender',
                    },
                  ]}
                  hasFeedback
                  validateStatus={
                    formik.errors.gender && formik.touched.gender
                      ? 'error'
                      : formik.touched.gender
                      ? 'success'
                      : ''
                  }
                  help={
                    formik.errors.gender &&
                    formik.touched.gender &&
                    formik.errors.gender
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    size="large"
                    value={formik.values.gender}
                    onChange={(selectedOption) => {
                      formik.setFieldValue('gender', selectedOption);
                    }}
                    onBlur={formik.handleBlur}
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

              <Col span={12}>
                <Item
                  label={t('EMPLOYEES.BIRTH')}
                  name="birth"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please select the birth date',
                  //   },
                  // ]}
                  // hasFeedback
                  // validateStatus={
                  //   formik.errors.birth && formik.touched.birth
                  //     ? 'error'
                  //     : formik.touched.birth
                  //     ? 'success'
                  //     : ''
                  // }
                  // help={
                  //   formik.errors.birth &&
                  //   formik.touched.birth &&
                  //   formik.errors.birth
                  // }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <DatePicker
                    size="large"
                    // value={formik.values.birth}
                    onChange={(date) => formik.setFieldValue('birth', date)}
                    onBlur={formik.handleBlur}
                    placeholder={t('EMPLOYEES.BIRTH')}
                    style={{ width: '100%' }}
                    defaultValue={initialValues.birth}
                    format={'DD-MM-YYYY'}
                  />
                </Item>
              </Col>

              <Col span={12}>
                <Item
                  label={t('EMPLOYEES.CITIZEN_CARD')}
                  name="citizen_card"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the citizen_card',
                    },
                  ]}
                  hasFeedback
                  validateStatus={
                    formik.errors.citizen_card && formik.touched.citizen_card
                      ? 'error'
                      : formik.touched.citizen_card
                      ? 'success'
                      : ''
                  }
                  help={
                    formik.errors.citizen_card &&
                    formik.touched.citizen_card &&
                    formik.errors.citizen_card
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    size="large"
                    placeholder={t('EMPLOYEES.CITIZEN_CARD')}
                    value={formik.values.citizen_card}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Item>
              </Col>

               <Col span={12}>
                <Item
                  label={t('EMPLOYEES.DESCRIPTION')}
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the description',
                    },
                  ]}
                  hasFeedback
                  validateStatus={
                    formik.errors.description && formik.touched.description
                      ? 'error'
                      : formik.touched.description
                      ? 'success'
                      : ''
                  }
                  help={
                    formik.errors.description &&
                    formik.touched.description &&
                    formik.errors.description
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <TextArea
                    size="large"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={4}
                    style={{ resize: 'none' }}
                    placeholder={t('EMPLOYEES.DESCRIPTION')}
                  />
                </Item>
              </Col>

              <Col span={12}>
                {t('EMPLOYEES.AVATAR')}
                <ImgCrop rotationSlider>
                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                  >
                    {fileList.length < 5 && '+ Upload'}
                  </Upload>
                </ImgCrop>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          title={
            <span style={{ fontSize: '30px' }}>{t('EMPLOYEES.DETAILS')}</span>
          }
        >
          <Form  >
            <Row gutter={[16, 16]}>
             <Col span={12}>
                <Item
                  label={t('EMPLOYEES.IS_MANAGER')}
                  name="is_manager"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the manager status',
                    },
                  ]}
                  validateStatus={
                    formik.errors.is_manager && formik.touched.is_manager
                      ? 'error'
                      : formik.touched.is_manager
                      ? 'success'
                      : ''
                  }
                  help={
                    formik.errors.is_manager &&
                    formik.touched.is_manager &&
                    formik.errors.is_manager
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  hasFeedback
                >
                  <Select
                    size="large"
                    value={formik.values.is_manager}
                    onChange={(value) => {
                      formik.setFieldValue('is_manager', value);
                    }}
                    onBlur={formik.handleBlur}
                    placeholder={t('EMPLOYEES.IS_MANAGER')}
                    style={{ width: '100%' }}
                  >
                    <Option value={true}>{t('EMPLOYEES.MANAGER')}</Option>
                    <Option value={false}>{t('EMPLOYEES.NOT_MANAGER')}</Option>
                  </Select>
                </Item>
              </Col>

               <Col span={12}>
                <Item
                  label={t('EMPLOYEES.STATUS')}
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the status',
                    },
                  ]}
                  hasFeedback
                  validateStatus={
                    formik.errors.status && formik.touched.status
                      ? 'error'
                      : formik.touched.status
                      ? 'success'
                      : ''
                  }
                  help={
                    formik.errors.status &&
                    formik.touched.status &&
                    formik.errors.status
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    size="large"
                    value={formik.values.status}
                    onChange={(value) => {
                      formik.setFieldValue('status', value);
                    }}
                    onBlur={formik.handleBlur}
                    placeholder={t('EMPLOYEES.STATUS')}
                    style={{ width: '100%' }}
                  >
                    <Option value="active">{t('EMPLOYEES.ACTIVE')}</Option>
                    <Option value="inactive">{t('EMPLOYEES.INACTIVE')}</Option>
                  </Select>
                </Item>
              </Col>

               <Col span={12}>
                <Item
                  label={t('EMPLOYEES.POSITION')}
                  name="position"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the position',
                    },
                  ]}
                  hasFeedback
                  validateStatus={
                    formik.errors.position && formik.touched.position
                      ? 'error'
                      : formik.touched.position
                      ? 'success'
                      : ''
                  }
                  help={
                    formik.errors.position &&
                    formik.touched.position &&
                    formik.errors.position
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    size="large"
                    placeholder={t('EMPLOYEES.POSITION')}
                    value={formik.values.position}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Item>
              </Col>

               <Col span={12}>
                <Item
                  label={t('EMPLOYEES.LINE_MANAGER')}
                  name="line_manager"
                  required
                  hasFeedback
                  validateStatus={
                    formik.errors.line_manager && formik.touched.line_manager
                      ? 'error'
                      : formik.touched.line_manager
                      ? 'success'
                      : ''
                  }
                  help={
                    formik.errors.line_manager &&
                    formik.touched.line_manager &&
                    formik.errors.line_manager
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    size="large"
                    placeholder={t('EMPLOYEES.LINE_MANAGER')}
                    value={formik.values.line_manager}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Item>
              </Col>
              <Col span={24} style={{ paddingBottom: '12px' }}>
                <Form.Item
                  label={t('EMPLOYEES.SKILLS')}
                  required
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  {formik.values.skills.map((skill, index) => (
                    <div key={index}>
                      <Form.Item
                        validateStatus={
                          formik.errors.skills &&
                          formik.errors.skills[index] &&
                          formik.touched.skills &&
                          formik.touched.skills[index]
                            ? 'error'
                            : ''
                        }
                        help={
                          formik.errors.skills &&
                          formik.errors.skills[index] &&
                          formik.touched.skills &&
                          formik.touched.skills[index]
                            ? formik.errors.skills[index].skillname
                            : ''
                        }
                        hasFeedback
                      >
                        <Input
                          size="large"
                          placeholder="Tên kỹ năng"
                          name={`skills[${index}].skillname`}
                          value={formik.values.skills[index].skillname}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Form.Item>

                      <Form.Item
                        validateStatus={
                          formik.errors.skills &&
                          formik.errors.skills[index] &&
                          formik.touched.skills &&
                          formik.touched.skills[index]
                            ? 'error'
                            : ''
                        }
                        help={
                          formik.errors.skills &&
                          formik.errors.skills[index] &&
                          formik.touched.skills &&
                          formik.touched.skills[index]
                            ? formik.errors.skills[index].exp
                            : ''
                        }
                        hasFeedback
                      >
                        <Input
                          size="large"
                          placeholder="Kinh nghiệm"
                          name={`skills[${index}].exp`}
                          value={formik.values.skills[index].exp}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Form.Item>
                      <Button onClick={() => removeSkill(index)}>Xóa</Button>
                    </div>
                  ))}
                </Form.Item>
                <Button onClick={addSkill}>Thêm kỹ năng</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
        </>
      )}
    </div>
  );
};

export default UpdateForm;