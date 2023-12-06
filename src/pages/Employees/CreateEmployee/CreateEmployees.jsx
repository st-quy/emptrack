import React, { useState } from 'react';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ImgCrop from 'antd-img-crop';
import Toast from '../../../components/toast/Toast';
import {
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
import Button from '../../../components/atoms/Button/Button';
import './CreateEmployees.scss';
import Card from 'antd/es/card/Card';
import axios from 'axios';
import ValidationSchema from './ValidationSchema';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from 'crypto-js';
const { Item } = Form;
const { Option } = Select;

const CreateEmployee = () => {
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
      address: '',
      skills: [{ skillname: '', exp: '' }],
    },
    validationSchema: ValidationSchema(),
    onSubmit: (values) => {
      console.log(values);
      console.log(fileImg);
      fileList.length > 0 &&
        axios
          .post('http://localhost:4000/employees', {
            ...values,
            avatar: fileImg,
          })
          .then((response) => {
            console.log('Gửi dữ liệu thành công!');
            console.log(response.data);
            <Toast type="success" message="Gửi dữ liệu thành công!!!" />;
          })
          .catch((error) => {
            <Toast type="error" message="Gửi dữ liệu thất bại!!!" />;
            console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
          });

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

  const apiKey = '722147886179251';
  const apiSecret = 'xYvEodr_5WS06SyphifPtymGRio';
  const deleteUrl = 'https://api.cloudinary.com/v1_1/do32v7ajg/image/destroy';

  const handleRemove = async (file) => {
    try {
      const publicId = file.public_id;
      const timestamp = new Date().getTime();
      const string = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = CryptoJS.SHA1(string).toString();
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', apiKey);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      axios.post(deleteUrl, formData);
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
        <Button onClick={formik.handleSubmit}>{t('EMPLOYEES.CREATE')}</Button>
      </Space>
      <div
        style={{
          maxHeight: '600px',
          overflowY: 'auto',
        }}
      >
        <Card title={t('EMPLOYEES.CODE')} className="first-card">
          <Form>
            <Row gutter={[16, 0]}>
              {/* CODE EMPLOYEE */}
              <Col span={12}>
                <Item
                  label={t('EMPLOYEES.CODE')}
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the code',
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
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Item>
              </Col>
              {/* NAME EMPLOYEE */}
              <Col span={12}>
                <Item
                  label={t('EMPLOYEES.NAME')}
                  name="nameEmployee"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the nameEmployee',
                    },
                  ]}
                  hasFeedback
                  validateStatus={
                    formik.errors.nameEmployee && formik.touched.nameEmployee
                      ? 'error'
                      : formik.touched.nameEmployee
                      ? 'success'
                      : ''
                  }
                  help={
                    formik.errors.nameEmployee &&
                    formik.touched.nameEmployee &&
                    formik.errors.nameEmployee
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    size="large"
                    placeholder={t('EMPLOYEES.NAME')}
                    value={formik.values.nameEmployee}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Item>
              </Col>
              {/* PHONE EMPLOYEE */}
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
              {/* GENDER EMPLOYEE */}
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
              {/* BIRTHDAY EMPLOYEE */}
              <Col span={12}>
                <Item
                  label={t('EMPLOYEES.BIRTH')}
                  name="birth"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the birth date',
                    },
                  ]}
                  hasFeedback
                  validateStatus={
                    formik.errors.birth && formik.touched.birth
                      ? 'error'
                      : formik.touched.birth
                      ? 'success'
                      : ''
                  }
                  help={
                    formik.errors.birth &&
                    formik.touched.birth &&
                    formik.errors.birth
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <DatePicker
                    size="large"
                    value={formik.values.birth}
                    onChange={(date) => formik.setFieldValue('birth', date)}
                    onBlur={formik.handleBlur}
                    placeholder={t('EMPLOYEES.BIRTH')}
                    style={{ width: '100%' }}
                  />
                </Item>
              </Col>
              {/* CITIZEN_CARD EMPLOYEE */}
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
              <Col span={12} style={{ paddingLeft: 0, paddingRight: 0 }}>
                {/* ADDRESS EMPLOYEE*/}
                <Col span={24}>
                  <Form.Item
                    label={t('EMPLOYEES.ADDRESS')}
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the address',
                      },
                    ]}
                    hasFeedback
                    validateStatus={
                      formik.errors.address && formik.touched.address
                        ? 'error'
                        : formik.touched.address
                        ? 'success'
                        : ''
                    }
                    help={
                      formik.errors.address &&
                      formik.touched.address &&
                      formik.errors.address
                    }
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    <Input
                      size="large"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t('EMPLOYEES.ADDRESS')}
                    />
                  </Form.Item>
                </Col>
                {/* AVATAR EMPLOYEE */}
                <Col span={24}>
                  <Form.Item
                    label={t('EMPLOYEES.AVATAR')}
                    validateStatus={fileList.length === 0 && 'error'}
                    help={
                      fileList.length === 0 && t('EMPLOYEE_VALIDATION.AVATAR')
                    }
                    required
                    hasFeedback
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
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
                  </Form.Item>
                </Col>
              </Col>
              {/* DESCRIPTION EMPLOYEE*/}
              <Col span={12}>
                <Form.Item
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
                    rows={8}
                    style={{ resize: 'none' }}
                    placeholder={t('EMPLOYEES.DESCRIPTION')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title={t('EMPLOYEES.DETAILS')} className="second-card">
          <Form>
            <Row gutter={[16, 0]}>
              {/* IS_MANAGER EMPLOYEE */}
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
              {/* STATUS EMPLOYEE */}
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
                    <Option value="unactive">{t('EMPLOYEES.UNACTIVE')}</Option>
                  </Select>
                </Item>
              </Col>
              {/* POSITION EMPLOYEE */}
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
              {/* LINE_MANAGER EMPLOYEE */}
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
              {/* SKILLS EMPLOYEE */}
              <Col span={24}>
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
                          placeholder={t('EMPLOYEES.SKILL_NAME')}
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
                          placeholder={t('EMPLOYEES.EXP')}
                          name={`skills[${index}].exp`}
                          value={formik.values.skills[index].exp}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Form.Item>
                      <Button onClick={() => removeSkill(index)}>
                        {t('EMPLOYEES.REMOVE_SKILL')}
                      </Button>
                    </div>
                  ))}
                </Form.Item>
                <Button onClick={addSkill}>{t('EMPLOYEES.ADD_SKILL')}</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateEmployee;
