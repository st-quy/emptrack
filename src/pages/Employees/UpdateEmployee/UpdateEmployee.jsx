import {
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  Divider,
  Upload,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import Card from 'antd/es/card/Card';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useFormik } from 'formik';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../../components/atoms/Button/Button';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import { Toast } from '../../../components/toast/Toast';
import { axiosInstance } from '../../../config/axios';
import './UpdateEmployee.scss';
import ValidationSchema from '../CreateEmployee/ValidationSchema';
import SpinLoading from '../../../components/atoms/SpinLoading/SpinLoading';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
const { Item } = Form;
const { Option } = Select;
const dateFormat = 'DD-MM-YYYY';
const UpdateEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [position, setPosition] = useState('');
  const [listSkills, setListSkills] = useState([]);
  const [inputSkill, setInputSkill] = useState('');
  const inputRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [listEmployees, setListEmployees] = useState([]);
  useEffect(() => {
    const getEmployee = async () => {
      axiosInstance
        .get(`employees/${id}`)
        .then((response) => {
          setEmployee(response.data);
          setFileList([
            {
              status: 'done',
              url: response.data.avatar[0].url,
            },
          ]);
          formik.setValues({
            name: response.data.name || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            gender: response.data.gender || '',
            birth: response.data.birth || null,
            description: response.data.description || '',
            citizen_card: response.data.citizen_card || '',
            isManager: response.data.isManager || false,
            status: response.data.status || '',
            position: response.data.position || '',
            lineManager: response.data.lineManager || '',
            address: response.data.address || '',
            skills: response.data.skills || [
              { skillname: null, exp: '', addonAfter: 'years' },
            ],
          });
        })
        .catch((error) => {
          console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
        });
    };

    const getPosition = async () => {
      axiosInstance
        .get('position')
        .then((response) => {
          const items = response.data.map((item) => item.name);
          setItems(items);
        })
        .catch((error) => {
          console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
        });
    };

    const getManager = async () => {
      axiosInstance
        .get('employees')
        .then((response) => {
          setListEmployees(response.data);
          const employees = response.data;
          const managerEmployees = employees.filter(
            (e) => e.isManager && !e.deletedAt,
          );
          setEmployeeOptions(managerEmployees);
          console.log(employeeOptions);
        })
        .catch((error) => {
          console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
        });
    };
    const getSkill = async () => {
      axiosInstance
        .get('skill')
        .then((response) => {
          const items = response.data.map((item) => item.name);
          setListSkills(items);
        })
        .catch((error) => {
          console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
        });
    };
    getEmployee();
    getPosition();
    getManager();
    getSkill();
  }, []);

  const selectAfterOptions = [
    { value: 'years', label: 'years' },
    { value: 'months', label: 'months' },
  ];
  const formik = useFormik({
    initialValues: '',
    email: '',
    phone: '',
    gender: '',
    birth: null,
    description: '',
    citizen_card: '',
    isManager: false,
    status: '',
    position: '',
    lineManager: '',
    address: '',
    skills: [{ skillname: null, exp: '', addonAfter: 'years' }],
    validationSchema: ValidationSchema(),
    onSubmit: (values) => {
      if (values.birth === formik.values.birth) {
        values.birth = dayjs(values.birth, dateFormat).format('DD-MM-YYYY');
      } else {
        console.log(values.birth);
        values.birth = dayjs(values.birth).format('DD-MM-YYYY');
      }

      const isEmailDuplicate = listEmployees.some((e) => {
        return e.email === values.email && e.code !== employee.code;
      });

      const isCitizenDuplicate = listEmployees.some((e) => {
        return (
          e.citizen_card === values.citizen_card && e.code !== employee.code
        );
      });

      if (isEmailDuplicate) {
        formik.setFieldError('email', t('EMPLOYEE_VALIDATION.DUPLICATE_EMAIL'));
        Toast('error', t('EMPLOYEE_VALIDATION.DUPLICATE_EMAIL'), 2);
      } else if (isCitizenDuplicate) {
        formik.setFieldError(
          'citizen_card',
          t('EMPLOYEE_VALIDATION.DUPLICATE_CITIZEN'),
        );
        Toast('error', t('EMPLOYEE_VALIDATION.DUPLICATE_CITIZEN'), 2);
      } else if (values.skills.length === 0) {
        Toast('error', t('EMPLOYEE_VALIDATION.SKILL'), 2);
      } else if (fileList.length > 0) {
        axiosInstance
          .patch(`employees/${id}`, {
            ...values,
            avatar: fileImg,
          })
          .then(() => {
            Toast(
              'success',
              t('TOAST.UPDATED_SUCCESS', {
                field: t('BREADCRUMB.EMPLOYEES').toLowerCase(),
              }),
            );
            setTimeout(() => {
              formik.resetForm();
              form.resetFields();
              navigate(`/employees/details/${id}`);
            }, 1000);
          })
          .catch((error) => {
            console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
          });
      } else {
        Toast('error', t('EMPLOYEE_VALIDATION.AVATAR'));
      }
      console.log('formik', formik.values);
    },
  });

  const getAvailableOptions = () => {
    const selectedOptions = formik?.values.skills.map(s => s.skillname)

    return listSkills?.filter(
      (option) => !selectedOptions.includes(option),
    );
  };

  const onPositionChange = (event) => {
    setPosition(event.target.value);
  };
  const onSkillChange = (event) => {
    setInputSkill(event.target.value);
  };
  const addItem = (e) => {
    const trimmedInputPosition = position.trim();
    if (trimmedInputPosition !== '') {
      e.preventDefault();
      axiosInstance
        .post('position', { name: position })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
        });
      setItems([...items, position]);
      setPosition('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      return Toast('error', t('EMPLOYEE_VALIDATION.ADD_POSITION'), 2);
    }
  };

  const addSkillToServer = (e) => {
    const trimmedInputSkill = inputSkill.trim();
    if (trimmedInputSkill !== '') {
      e.preventDefault();
      axiosInstance
        .post('skill', { name: inputSkill })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
        });
      setListSkills([...listSkills, inputSkill]);
      setInputSkill('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      return Toast('error', t('EMPLOYEE_VALIDATION.ADD_POSITION'), 2);
    }
  };

  const breadcrumbItems = [
    { key: 'EMPLOYEES', route: '/employees' },
    {
      key: 'EMPLOYEES_DETAILS',
      route: `/employees/details/${id}`,
    },
    { key: 'EMPLOYEES_UPDATE', route: `/employees/update/${id}` },
  ];
  const handlePic = async ({ fileList }) => {
    try {
      setUploading(true);
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
      setUploading(false);
    } catch (error) {
      console.error('Lỗi khi tải lên ảnh:', error);
      setUploading(false);
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
      { skillname: null, exp: '', addonAfter: 'years' },
    ]);
  };

  const removeSkill = (index) => {
    const newSkills = [...formik.values.skills];
    newSkills.splice(index, 1);
    formik.setFieldValue('skills', newSkills);
  };

  return (
    <div id="update_employees">
      <Space
        direction="horizontal"
        style={{ justifyContent: 'space-between', width: '100%' }}
      >
        <Breadcrumb items={breadcrumbItems} />
        <Button onClick={formik.handleSubmit}>{t('BUTTON.SAVE')}</Button>
      </Space>
      <Card
        title={t('BREADCRUMB.EMPLOYEES_UPDATE')}
        className="card-create-employees"
        style={{ borderRadius: '30px' }}
      >
        <Form form={form}>
          {formik.values ? (
            <>
              <Row gutter={[16, 0]}>
                {/* CODE EMPLOYEE */}
                <Col span={12}>
                  <Item
                    label={t('EMPLOYEES.CODE')}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    <Input
                      size="large"
                      placeholder={t('EMPLOYEES.CODE')}
                      readOnly
                      value={employee.code}
                      disabled
                    />
                  </Item>
                </Col>
                {/* NAME EMPLOYEE */}
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
                      defaultValue={formik.values.name}
                      onChange={(e) => {
                        formik.setFieldValue('name', e.target.value);
                      }}
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
                      defaultValue={formik.values.phone}
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
                      defaultValue={formik.values.gender}
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
                      defaultValue={dayjs(formik.values.birth, dateFormat)}
                      onChange={(date) => formik.setFieldValue('birth', date)}
                      onBlur={formik.handleBlur}
                      placeholder={t('EMPLOYEES.BIRTH')}
                      style={{ width: '100%' }}
                      format={'DD-MM-YYYY'}
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
                      defaultValue={formik.values.citizen_card}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Item>
                </Col>

                {/* ADDRESS EMPLOYEE*/}
                <Col span={12}>
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
                      defaultValue={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t('EMPLOYEES.ADDRESS')}
                    />
                  </Form.Item>
                </Col>
                {/* EMAIL EMPLOYEE*/}
                <Col span={12}>
                  <Form.Item
                    label={t('EMPLOYEES.EMAIL')}
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter the email',
                      },
                    ]}
                    hasFeedback
                    validateStatus={
                      formik.errors.email && formik.touched.email
                        ? 'error'
                        : formik.touched.email
                        ? 'success'
                        : ''
                    }
                    help={
                      formik.errors.email &&
                      formik.touched.email &&
                      formik.errors.email
                    }
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    <Input
                      size="large"
                      defaultValue={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t('EMPLOYEES.EMAIL')}
                    />
                  </Form.Item>
                </Col>
                {/* AVATAR EMPLOYEE */}
                <Col span={12}>
                  <Form.Item
                    label={t('EMPLOYEES.AVATAR')}
                    status={fileList.length === 0 && 'error'}
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
                          {uploading ? (
                            <SpinLoading />
                          ) : (
                            fileList.length === 0 && '+ Upload'
                          )}
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
                {/* DESCRIPTION EMPLOYEE*/}
                <Col span={12}>
                  <Form.Item
                    label={t('EMPLOYEES.DESCRIPTION')}
                    name="description"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    <TextArea
                      size="large"
                      defaultValue={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      rows={4}
                      style={{ resize: 'none' }}
                      placeholder={t('EMPLOYEES.DESCRIPTION')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Typography.Title level={5}>
                {t('EMPLOYEES.DETAILS')}
              </Typography.Title>
              <Row gutter={[16, 0]}>
                {/* IS_MANAGER EMPLOYEE */}
                <Col span={12}>
                  <Item
                    label={t('EMPLOYEES.IS_MANAGER')}
                    name="isManager"
                    rules={[
                      {
                        required: true,
                        message: 'Please select the manager status',
                      },
                    ]}
                    validateStatus={
                      formik.errors.isManager && formik.touched.isManager
                        ? 'error'
                        : formik.touched.isManager
                        ? 'success'
                        : ''
                    }
                    help={
                      formik.errors.isManager &&
                      formik.touched.isManager &&
                      formik.errors.isManager
                    }
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    hasFeedback
                  >
                    <Select
                      size="large"
                      defaultValue={formik.values.isManager}
                      onChange={(value) => {
                        formik.setFieldValue('isManager', value);
                      }}
                      onBlur={formik.handleBlur}
                      placeholder={t('EMPLOYEES.IS_MANAGER')}
                      style={{ width: '100%' }}
                    >
                      <Option value={true}>{t('EMPLOYEES.MANAGER')}</Option>
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
                      defaultValue={formik.values.status}
                      onChange={(value) => {
                        formik.setFieldValue('status', value);
                      }}
                      onBlur={formik.handleBlur}
                      placeholder={t('EMPLOYEES.STATUS')}
                      style={{ width: '100%' }}
                    >
                      <Option value="unassigned">
                        {t('EMPLOYEES.STATUS_UNASSIGNED')}
                      </Option>
                      <Option value="assigned">
                        {t('EMPLOYEES.STATUS_ASSIGNED')}
                      </Option>
                      <Option value="off">{t('EMPLOYEES.STATUS_OFF')}</Option>
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
                    <Select
                      size="large"
                      placeholder={t('EMPLOYEES.POSITION')}
                      defaultValue={formik.values.position}
                      onChange={(value) => {
                        formik.setFieldValue('position', value);
                      }}
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <Divider
                            style={{
                              margin: '10px 0',
                            }}
                          />
                          <Space
                            style={{
                              padding: '0 8px 5px',
                            }}
                          >
                            <Input
                              style={{ width: '500px' }}
                              size="large"
                              placeholder={t('EMPLOYEES.POSITION')}
                              ref={inputRef}
                              value={position}
                              onChange={onPositionChange}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                            <Button
                              type="text"
                              icon={<PlusOutlined />}
                              onClick={addItem}
                            >
                              {t('EMPLOYEES.ADD_POSITION')}
                            </Button>
                          </Space>
                        </>
                      )}
                      options={items.map((item) => ({
                        label: item,
                        value: item,
                      }))}
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
                    <Select
                      size="large"
                      defaultValue={formik.values.lineManager}
                      placeholder={t('EMPLOYEES.LINE_MANAGER')}
                      onChange={(value) => {
                        formik.setFieldValue('lineManager', value);
                      }}
                      onBlur={formik.handleBlur}
                      style={{ width: '100%' }}
                    >
                      {employeeOptions &&
                        employeeOptions.map((e, index) => {
                          if (e.code !== employee.code)
                            return (
                              <Option key={index} value={e.name}>
                                {e.name}
                              </Option>
                            );
                        })}
                    </Select>
                  </Item>
                </Col>

                {/* SKILLS EMPLOYEE */}
                <Row>
                  <Form.Item label={t('EMPLOYEES.SKILLS')} required>
                    <Button
                      onClick={addSkill}
                      className="buttonSkills btn-skills"
                    >
                      {t('EMPLOYEES.ADD_SKILL')}
                    </Button>
                  </Form.Item>
                  <Col span={24} style={{ display: 'flex', width: '100%' }}>
                    <Space wrap className="w-100">
                      {formik.values.skills.map((skill, index) => (
                        <Col key={index}>
                          <div
                            style={{
                              marginRight: '10px',
                              marginBottom: '10px',
                            }}
                          >
                            <Form.Item
                              style={{ width: '200px' }}
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
                              <Select
                                size="large"
                                placeholder={t('EMPLOYEES.SKILL_NAME')}
                                name={`skills[${index}].skillname`}
                                value={formik.values.skills[index].skillname}
                                onChange={(value) => {
                                  formik.setFieldValue(
                                    `skills[${index}].skillname`,
                                    value,
                                  );
                                }}
                                dropdownRender={(menu) => (
                                  <>
                                    {menu}
                                    <Divider
                                      style={{
                                        margin: '10px 0',
                                      }}
                                    />

                                    <Input
                                      size="large"
                                      value={inputSkill}
                                      ref={inputRef}
                                      onChange={onSkillChange}
                                      onKeyDown={(e) => e.stopPropagation()}
                                    />
                                    <Button
                                      type="text"
                                      icon={<PlusOutlined />}
                                      onClick={addSkillToServer}
                                      style={{
                                        width: '100%',
                                        paddingLeft: '0px',
                                        paddingRight: '0px',
                                      }}
                                    >
                                      {t('EMPLOYEES.ADD_SKILL')}
                                    </Button>
                                  </>
                                )}
                                options={getAvailableOptions().map((item) => ({
                                  label: item,
                                  value: item,
                                }))}
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
                                type="number"
                                style={{
                                  webkitAppearance: 'none',
                                  MozAppearance: 'textfield',
                                }}
                                min={1}
                                max={30}
                                addonAfter={
                                  <Select
                                    style={{ width: 70 }}
                                    name={`skills[${index}].addonAfter`}
                                    value={
                                      formik.values.skills[index].addonAfter ||
                                      'years'
                                    }
                                    onChange={(value) => {
                                      formik.setFieldValue(
                                        `skills[${index}].addonAfter`,
                                        value,
                                      );
                                    }}
                                  >
                                    {selectAfterOptions.map((option) => (
                                      <Option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </Option>
                                    ))}
                                  </Select>
                                }
                              />
                            </Form.Item>

                            <Button
                              onClick={() => removeSkill(index)}
                              className="buttonSkills btn-skills"
                            >
                              {t('EMPLOYEES.REMOVE_SKILL')}
                            </Button>
                          </div>
                        </Col>
                      ))}
                    </Space>
                  </Col>
                </Row>
              </Row>
            </>
          ) : (
            ''
          )}
        </Form>
      </Card>
      {/* </div> */}
    </div>
  );
};

export default UpdateEmployee;
