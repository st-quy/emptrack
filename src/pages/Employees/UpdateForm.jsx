import React, { useState } from 'react';
import Breadcrumb from '../../components/molecules/Breadcrumb/Breadcrumb';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ImgCrop from 'antd-img-crop';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Upload,
  Select,
} from 'antd';
import './Employees.scss';
import Card from 'antd/es/card/Card';

const UpdateForm = () => {
  const { TextArea } = Input;
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      code: '',
      nameEmployee: '',
      phone: '',
      gender: '',
      birth: '',
      description: '',
      citizen_card: '',
      is_manager: '',
      status: '',
      position: '',
      line_manager: '',
    },
    validationSchema: Yup.object({
      code: Yup.string()
        .matches(/^[A-Za-z]{2}\d{3}$/, 'Mã sinh viên không hợp lệ')
        .required('Vui lòng nhập mã sinh viên'),
      nameEmployee: Yup.string()
        .required('Vui lòng nhập tên')
        .matches(/^[a-zA-Z ]*$/, 'Tên không được chứa số và kí tự đặc biệt'),
      phone: Yup.string()
        .matches(/^0\d{9}$/, 'Số điện thoại không hợp lệ')
        .required('Vui lòng nhập số điện thoại'),
      gender: Yup.string().required('Vui lòng chọn giới tính'),
      status: Yup.string().required('Vui lòng chọn trạng thái'),
      is_manager: Yup.string().required('Bạn có phải người quản lí không?'),
      position: Yup.string().required('Vui lòng chọn vị trí'),
      line_manager: Yup.string().required('Vui lòng nhập tên người quản lí'),
      birth: Yup.date()
        .max(new Date(), 'Ngày sinh không được lớn hơn ngày hiện tại')
        .required('Vui lòng chọn năm sinh'),
      description: Yup.string().required('Vui lòng điền mô tả'),
      citizen_card: Yup.string()
        .matches(/^[0-9]{10}$/, 'Số căn cước không hợp lệ')
        .required('Vui lòng nhập số căn cước'),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const breadcrumbItems = [
    { key: 'employees', route: '/employees' },
    { key: 'employees_update', route: '/employees/update' },
  ];

  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
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

  //Add skills
  const [skills, setSkills] = useState([]);

  const addSkill = () => {
    setSkills([...skills, { skillname: '', exp: '' }]);
  };

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const handleSkillChange = (index, key, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index][key] = value;
    setSkills(updatedSkills);
  };

  const handleSubmit = () => {
 
    console.log(skills);
    const apiUrl = 'https://api-emptrack.onrender.com/employees';  
    axios.post(apiUrl, { skills })
      .then(response => {
        console.log('Data updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
      
     
  };

  return (
    <div id="employees">
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
          <Form>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="input-wrapper">
                  <span className="label-text">{t('EMPLOYEES.CODE')}</span>
                  <span className="required-indicator">*</span>
                </div>
                <Input
                  size="large"
                  name="code"
                  placeholder={t('EMPLOYEES.CODE')}
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.code && formik.touched.code
                      ? 'error-input'
                      : ''
                  }
                />
                {formik.errors.code && formik.touched.code && (
                  <p className="error-message">{formik.errors.code}</p>
                )}
              </Col>
              <Col span={12}>
                <div className="input-wrapper">
                  <span className="label-text">{t('EMPLOYEES.NAME')}</span>
                  <span className="required-indicator">*</span>
                </div>
                <Input
                  size="large"
                  name="nameEmployee"
                  placeholder={t('EMPLOYEES.NAME')}
                  value={formik.values.nameEmployee}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.nameEmployee && formik.touched.nameEmployee
                      ? 'error-input'
                      : ''
                  }
                />
                {formik.errors.nameEmployee && formik.touched.nameEmployee && (
                  <p className="error-message">{formik.errors.nameEmployee}</p>
                )}
              </Col>
              <Col span={12}>
                <div className="input-wrapper">
                  <span className="label-text">{t('EMPLOYEES.PHONE')}</span>
                  <span className="required-indicator">*</span>
                </div>
                <Input
                  size="large"
                  name="phone"
                  style={{ width: '100%' }}
                  placeholder={t('EMPLOYEES.PHONE')}
                  controls={false}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.phone && formik.touched.phone
                      ? 'error-input'
                      : ''
                  }
                />
                {formik.errors.phone && formik.touched.phone && (
                  <p className="error-message">{formik.errors.phone}</p>
                )}
              </Col>
              <Col span={12}>
                <div className="input-wrapper">
                  <span className="label-text">{t('EMPLOYEES.GENDER')}</span>
                  <span className="required-indicator">*</span>
                </div>
                <Select
                  size="large"
                  name="gender"
                  value={formik.values.gender}
                  onChange={(selectedOption) => {
                    formik.setFieldValue('gender', selectedOption);
                  }}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.gender && formik.touched.gender
                      ? 'error-input'
                      : ''
                  }
                  style={{
                    width: '100%',
                  }}
                  options={[
                    {
                      value: t('EMPLOYEES.GENDER_MEN'),
                      label: t('EMPLOYEES.GENDER_MEN'),
                    },
                    {
                      value: t('EMPLOYEES.GENDER_WOMEN'),
                      label: t('EMPLOYEES.GENDER_WOMEN'),
                    },
                    {
                      value: t('EMPLOYEES.GENDER_UNKNOWN'),
                      label: t('EMPLOYEES.GENDER_UNKNOWN'),
                    },
                ]}
                />
                {formik.errors.gender && formik.touched.gender && (
                  <p className="error-message">{formik.errors.gender}</p>
                )}
              </Col>

              <Col span={12}>
                <div className="input-wrapper">
                  <span className="label-text">{t('EMPLOYEES.BIRTH')}</span>
                  <span className="required-indicator">*</span>
                </div>
                <DatePicker
                  className={
                    formik.errors.birth && formik.touched.birth
                      ? 'error-input'
                      : ''
                  }
                  name="birth"
                  selected={formik.values.date}
                  onChange={(date) => formik.setFieldValue('birth', date)}
                  onBlur={formik.handleBlur}
                  size="large"
                  style={{ width: '100%' }}
                />
                {formik.errors.birth && formik.touched.birth && (
                  <p className="error-message">{formik.errors.birth}</p>
                )}
              </Col>

              <Col span={12}>
                <div className="input-wrapper">
                  <span className="label-text">
                    {t('EMPLOYEES.CITIZEN_CARD')}
                  </span>
                  <span className="required-indicator">*</span>
                </div>
                <InputNumber
                  className={
                    formik.errors.citizen_card && formik.touched.citizen_card
                      ? 'error-input'
                      : ''
                  }
                  size="large"
                  style={{ width: '100%' }}
                  placeholder={t('EMPLOYEES.CITIZEN_CARD')}
                  controls={false}
                />
                {formik.errors.citizen_card && formik.touched.citizen_card && (
                  <p className="error-message">{formik.errors.citizen_card}</p>
                )}
              </Col>
              <Col span={12}>
                <div className="input-wrapper">
                  <span className="label-text">
                    {t('EMPLOYEES.DESCRIPTION')}
                  </span>
                  <span className="required-indicator">*</span>
                </div>
                <TextArea
                  className={
                    formik.errors.description && formik.touched.description
                      ? 'error-input'
                      : ''
                  }
                  size="large"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  rows={4}
                  style={{ resize: 'none' }}
                  placeholder={t('EMPLOYEES.DESCRIPTION')}
                />
                {formik.errors.description && formik.touched.description && (
                  <p className="error-message">{formik.errors.description}</p>
                )}
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
          <Form>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="input-wrapper">
                  <span className="label-text">
                    {t('EMPLOYEES.IS_MANAGER')}
                  </span>
                  <span className="required-indicator">*</span>
                </div>
                <Select
                  className={
                    formik.errors.is_manager && formik.touched.is_manager
                      ? 'error-input'
                      : ''
                  }
                  onChange={(selectedOption) => {
                    formik.setFieldValue('is_manager', selectedOption);
                  }}
                  onBlur={formik.handleBlur}
                  name="is_manager"
                  size="large"
                  style={{
                    width: '100%',
                  }}
                  options={[
                    {
                      value: t('EMPLOYEES.MANAGER'),
                      label: t('EMPLOYEES.MANAGER'),
                    },
                    {
                      value: t('EMPLOYEES.NOT_MANAGER'),
                      label: t('EMPLOYEES.NOT_MANAGER'),
                    },
                  ]}
                />
                {formik.errors.is_manager && formik.touched.is_manager && (
                  <p className="error-message">{formik.errors.is_manager}</p>
                )}
              </Col>
              <Col span={12}>
                <div className="input-wrapper">
                  <span className="label-text">{t('EMPLOYEES.STATUS')}</span>
                  <span className="required-indicator">*</span>
                </div>
                <Select
                  className={
                    formik.errors.status && formik.touched.status
                      ? 'error-input'
                      : ''
                  }
                  size="large"
                  onChange={(selectedOption) => {
                    formik.setFieldValue('status', selectedOption);
                  }}
                  onBlur={formik.handleBlur}
                  style={{
                    width: '100%',
                  }}
                  options={[
                    {
                      value: t('EMPLOYEES.ACTIVE'),
                      label: t('EMPLOYEES.ACTIVE'),
                    },
                    {
                      value: t('EMPLOYEES.INACTIVE'),
                      label: t('EMPLOYEES.INACTIVE'),
                    },
                  ]}
                />
                {formik.errors.status && formik.touched.status && (
                  <p className="error-message">{formik.errors.status}</p>
                )}
              </Col>
              <Col span={12}>
                <div className="input-wrapper">
                  <span className="label-text">{t('EMPLOYEES.POSITION')}</span>
                  <span className="required-indicator">*</span>
                </div>
                <Input
                  className={
                    formik.errors.position && formik.touched.position
                      ? 'error-input'
                      : ''
                  }
                  size="large"
                  value={formik.values.position}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t('EMPLOYEES.POSITION')}
                />
                {formik.errors.position && formik.touched.position && (
                  <p className="error-message">{formik.errors.position}</p>
                )}
              </Col>
              <Col span={12}>
                <div className="input-wrapper">
                  <span className="label-text">
                    {t('EMPLOYEES.LINE_MANAGER')}
                  </span>
                  <span className="required-indicator">*</span>
                </div>
                <Input
                  className={
                    formik.errors.line_manager && formik.touched.line_manager
                      ? 'error-input'
                      : ''
                  }
                  size="large"
                  placeholder={t('EMPLOYEES.LINE_MANAGER')}
                />
                {formik.errors.line_manager && formik.touched.line_manager && (
                  <p className="error-message">{formik.errors.line_manager}</p>
                )}
              </Col>
              <Col span={24}>
                <Col span={24}>
                  <div className="input-wrapper">
                    <span className="label-text">{t('EMPLOYEES.SKILLS')}</span>
                    <span className="required-indicator">*</span>
                  </div>
                </Col>
                {skills.map((skill, index) => (
                  <div key={index}>
                    <Form.Item>
                      <Input
                        size="large"
                        placeholder="Tên kỹ năng"
                        value={skill.skillname}
                        onChange={(e) =>
                          handleSkillChange(index, 'skillname', e.target.value)
                        }
                      />
                    </Form.Item>
                    <Form.Item>
                      <Input
                        size="large"
                        placeholder="Kinh nghiệm"
                        value={skill.exp}
                        onChange={(e) =>
                          handleSkillChange(index, 'exp', e.target.value)
                        }
                      />
                    </Form.Item>
                    <Button onClick={() => removeSkill(index)}>Xóa</Button>
                  </div>
                ))}
                <Button onClick={addSkill}>Thêm kỹ năng</Button>
                <Button onClick={handleSubmit}>Lưu</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default UpdateForm;