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
  Row,
  Space,
  Upload,
  Select,
  Modal,
} from 'antd';
import './Employees.scss';
import Card from 'antd/es/card/Card';
import axios from 'axios';
import { validationSchema } from './ValidationSchema';

const Employees = () => {
  const { TextArea } = Input;
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      code: '',
      nameEmployee: '',
      phone: '',
      gender: '',
      birth: null,
      description: '',
      citizen_card: '',
      is_manager: null,
      status: '',
      position: '',
      line_manager: '',
      skills: [{ skillname: '', exp: '' }],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      console.log(fileImg);
      // axios
      //   .post('https://api-emptrack.onrender.com/employees', {
      //     ...values,
      //     skills,
      //     avatar: fileImg,
      //   })
      //   .then((response) => {
      //     console.log('Gửi dữ liệu thành công!');
      //     console.log(response.data);
      //   })
      //   .catch((error) => {
      //     console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
      //   });
      formik.resetForm();
    },
  });

  const breadcrumbItems = [
    { key: 'EMPLOYEES', route: '/employees' },
    { key: 'EMPLOYEES_CREATE', route: '/employees/create' },
  ];

  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handlePic = async ({ fileList }) => {
    try {
      const formData = new FormData();
      formData.append('file', fileList[0].originFileObj);
      formData.append('upload_preset', 'hvmlst6p');
      formData.append('cloud_name', 'do32v7ajg');

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/do32v7ajg/image/upload',
        formData,
      );
      const imageUrl = response.data.secure_url;

      const updatedFileList = fileList.map((file) => {
        if (file.uid === fileList[0].uid) {
          return {
            ...file,
            status: 'done',
            url: imageUrl,
            public_id: response.data.public_id,
          };
        }
        return file;
      });

      setFileList(updatedFileList);
    } catch (error) {
      console.error('Lỗi khi tải lên ảnh:', error);
    }
  };

  const handlePreview = async (file) => {
    setPreviewImage(file.url);
    setShowModal(true);
  };

  const handlePreviewCancel = () => {
    setPreviewImage(null);
    setShowModal(false);
  };

  const handleRemove = async () => {
    // const publicId = file.public_id;

    try {
      // // Gửi yêu cầu xóa ảnh bằng Axios
      // await axios.delete(
      //   `https://api.cloudinary.com/v1_1/do32v7ajg/delete_by_token/${publicId}`,
      // );

      // // Cập nhật fileList sau khi xóa ảnh
      // const updatedFileList = fileList.filter(
      //   (item) => item.public_id !== publicId,
      // );
      setFileList([]);
    } catch (error) {
      console.log('Error deleting image from Cloudinary:', error);
    }
  };

  const fileImg = fileList.map((file) => ({
    url: file.url,
    public_id: file.public_id,
  }));

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

  return (
    <div id="employees">
      <Space
        direction="horizontal"
        style={{ justifyContent: 'space-between', width: '100%' }}
      >
        <Breadcrumb items={breadcrumbItems} />
        <Button className="button__create" onClick={formik.handleSubmit}>
          {t('EMPLOYEES.CREATE')}
        </Button>
      </Space>
      <div
        style={{
          maxHeight: '600px',
          overflowY: 'auto',
        }}
      >
        <Card title={t('EMPLOYEES.CODE')}>
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
                  status={
                    formik.errors.code && formik.touched.code ? 'error' : ''
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
                  status={
                    formik.errors.nameEmployee && formik.touched.nameEmployee
                      ? 'error'
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
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  placeholder={t('EMPLOYEES.PHONE')}
                  onBlur={formik.handleBlur}
                  status={
                    formik.errors.phone && formik.touched.phone ? 'error' : ''
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
                  placeholder={t('EMPLOYEES.GENDER')}
                  status={
                    formik.errors.gender && formik.touched.gender ? 'error' : ''
                  }
                  style={{
                    width: '100%',
                  }}
                  options={[
                    {
                      value: 'male',
                      label: t('EMPLOYEES.GENDER_MEN'),
                    },
                    {
                      value: 'female',
                      label: t('EMPLOYEES.GENDER_WOMEN'),
                    },
                    {
                      value: 'unknown',
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
                  status={
                    formik.errors.birth && formik.touched.birth ? 'error' : ''
                  }
                  name="birth"
                  selected={formik.values.birth}
                  value={formik.values.birth}
                  onChange={(date) => formik.setFieldValue('birth', date)}
                  onBlur={formik.handleBlur}
                  placeholder={t('EMPLOYEES.BIRTH')}
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
                <Input
                  status={
                    formik.errors.citizen_card && formik.touched.citizen_card
                      ? 'error'
                      : ''
                  }
                  size="large"
                  style={{ width: '100%' }}
                  name="citizen_card"
                  value={formik.values.citizen_card}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t('EMPLOYEES.CITIZEN_CARD')}
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
                  status={
                    formik.errors.description && formik.touched.description
                      ? 'error'
                      : ''
                  }
                  size="large"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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

                <div>
                  <ImgCrop rotationSlider>
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handlePic}
                      onPreview={handlePreview}
                      onRemove={handleRemove}
                    >
                      {fileList.length === 0 && '+ Upload'}
                    </Upload>
                  </ImgCrop>
                  {previewImage && (
                    <Modal
                      open={showModal}
                      footer={null}
                      onCancel={handlePreviewCancel}
                    >
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{ width: '100%', maxHeight: '550px' }}
                      />
                    </Modal>
                  )}
                </div>
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
                  status={
                    formik.errors.is_manager && formik.touched.is_manager
                      ? 'error'
                      : ''
                  }
                  value={formik.values.is_manager}
                  onChange={(selectedOption) => {
                    formik.setFieldValue('is_manager', selectedOption);
                  }}
                  onBlur={formik.handleBlur}
                  placeholder={t('EMPLOYEES.IS_MANAGER')}
                  name="is_manager"
                  size="large"
                  style={{
                    width: '100%',
                  }}
                  options={[
                    {
                      value: true,
                      label: t('EMPLOYEES.MANAGER'),
                    },
                    {
                      value: false,
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
                  status={
                    formik.errors.status && formik.touched.status ? 'error' : ''
                  }
                  size="large"
                  onChange={(selectedOption) => {
                    formik.setFieldValue('status', selectedOption);
                  }}
                  onBlur={formik.handleBlur}
                  placeholder={t('EMPLOYEES.STATUS')}
                  value={formik.values.status}
                  style={{
                    width: '100%',
                  }}
                  options={[
                    {
                      value: 'active',
                      label: t('EMPLOYEES.ACTIVE'),
                    },
                    {
                      value: 'unactive',
                      label: t('EMPLOYEES.UNACTIVE'),
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
                  status={
                    formik.errors.position && formik.touched.position
                      ? 'error'
                      : ''
                  }
                  size="large"
                  name="position"
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
                  status={
                    formik.errors.line_manager && formik.touched.line_manager
                      ? 'error'
                      : ''
                  }
                  name="line_manager"
                  value={formik.values.line_manager}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t('EMPLOYEES.LINE_MANAGER')}
                  size="large"
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
                <Button onClick={addSkill}>Thêm kỹ năng</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Employees;
