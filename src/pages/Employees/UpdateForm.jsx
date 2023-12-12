
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Select,
  Upload,
  Modal,
} 
from 'antd';
import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/molecules/Breadcrumb/Breadcrumb';
import { useTranslation } from 'react-i18next';
import Card from 'antd/es/card/Card';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../config/axios';
import moment from 'moment';
import dayjs from 'dayjs';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import ImgCrop from 'antd-img-crop';




const { Item } = Form;
const { Option } = Select;

const skillDatas = {
  skillname:'',
  exp:'',
};

const UpdateForm = () => {
  const { TextArea } = Input;
  const { t } = useTranslation();
  const {id} = useParams();
  const [employeesData, setEmployeesData] = useState();
  const [skillData, setSkillData] = useState(skillDatas);

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
   const handleSubmit = () =>{

   }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axiosInstance.get(`employees/${id}`).then((response) => {
          setEmployeesData(response.data);
          setSkillData(response.data);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
 
 

  const breadcrumbItems = [
    { key: 'employees', route: '/employees' },
    { key: 'employees_details', route: `/employees/update/${id}`},
    { key: 'employees_update', route: `/employees/update/${id}`},
  ];
  const validateBirthDate = (_, value) => {
    const currentDate = moment();
    const selectedDate = moment(value, 'DD-MM-YYYY');
    const age = currentDate.diff(selectedDate, 'years');

    if (age < 18) {
      return Promise.reject('Ngày sinh phải lớn hơn hoặc bằng 18 tuổi');
    }

    return Promise.resolve();
  };
  const handleUpdate = () => {
    console.log(employeesData.avatar[0].url);
    // const apiUrl = `employees/${id}`;  
    // axios.patch(apiUrl, { skillData })
    //   .then(response => {
    //     console.log('Data updated successfully:', response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error updating data:', error);
    //     console.log('Error details:', error.response.data); // In ra thông tin lỗi chi tiết
    //   }); 
  };
 
  const handleChange = (name, value) => {
    setEmployeesData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangeDatePicker = (date, dateString) => {
    setEmployeesData((prevData) => ({
      ...prevData,
      birth: dateString,  
    }));
  };
  const handleAddSkill = () => {
    setSkillData((prevData) => ({
      ...prevData,
      skills: [...prevData.skills, { skillname: '', exp: '' }],
    }));
  };
  
  const handleChangeSkill = (index, field, value) => {
    console.log('handleChangeSkill:', { index, field, value });
    const newSkills = [...skillData.skills];
    newSkills[index][field] = value;
    setSkillData((prevData) => ({
      ...prevData,
      skills: newSkills,
    }));
  };
  
  const RemoveSkill = (index) => {
    console.log('RemoveSkill:', { index });
    setSkillData((prevData) => {
      const updatedSkills = [...prevData.skills];
      updatedSkills.splice(index, 1);
      return { ...prevData, skills: updatedSkills };
    });
  };
  
  

  return (
    <div>
      {   employeesData &&  
        <>
          <Space
        direction="horizontal"
        style={{ justifyContent: 'space-between', width: '100%' }}
      >
        <Breadcrumb items={breadcrumbItems} />
        <Button className="button__update" onClick={() => handleUpdate()}>
          {t('Sửa')}
        </Button>     
      </Space>
      <div
  style={{
    maxHeight: '650px',
    overflowY: 'auto',
  }}
></div>

      <Card
          title={
            <span style={{ fontSize: '30px' }}>{t('EMPLOYEES.UPDATE')} </span>
          }>
        <Form>
            <Row gutter={[16, 16]}>
          {/* MaNV */}
        <Col span={12}>
                <Form.Item
                  label={t('EMPLOYEES.CODE')}
                  name="code"  
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}                 
                >
                  <Input
                    size="large"
                    placeholder={t('EMPLOYEES.CODE')}  
                    defaultValue={employeesData.code}   
                    disabled={true}                                    
                  />
                </Form.Item>
              </Col>
            {/* TenNV */}
              <Col span={12}>
                <Form.Item
                  label={t('EMPLOYEES.NAME')}                  
                  labelCol={{ span: 24 }}
                  name="name" 
                  wrapperCol={{ span: 24 }}   
                  rules={[
                    {
                      required: true,
                      message: 'vui lòng nhập tên',
                    },
                    {
                      pattern: /^[A-Z][a-z]*(\s+[A-Z][a-z]*)*$/,
                      message: 'Họ tên phải bắt đầu bằng chữ hoa và cách nhau bằng một khoảng trắng',
                    },
                  ]}             
                >
                  <Input
                  size="large"
                  placeholder={t('EMPLOYEES.NAME')}
                  defaultValue={employeesData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  name='name'
                />
                </Form.Item>
              </Col>
              {/* email  */}
              <Col span={12}>
              <Form.Item
                label={t('EMPLOYEES.EMAIL')}
                name="email"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập email',
                  },
                  {
                    type: 'email',
                    message: 'Email không hợp lệ',
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder={t('EMPLOYEES.EMAIL')}
                  defaultValue={employeesData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  name="email"
                />
              </Form.Item>
            </Col>
            {/* Phone */}
            <Col span={12}>
                <Form.Item
                  label={t('EMPLOYEES.PHONE')}
                  name="phone"  
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}       
                  rules={[
                    {
                      required: true,
                      message: 'vui lòng nhập số điện thoại',
                    },
                    {
                      pattern:/^0\d{9}$/,
                      message: 'Số điện thoại không hợp lệ',
                    },
                  ]}           
                >
                  <Input
                    size="large"
                    placeholder={t('EMPLOYEES.PHONE')}  
                    defaultValue={employeesData.phone}    
                    onChange={(e) => handleChange('phone', e.target.value)}
                    name="phone"        
                  />
                </Form.Item>
              </Col>

              {/* Gender */}
              <Col span={12}>
                <Item
                  label={t('EMPLOYEES.GENDER')}
                  name="gender"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'vui lòng chọn giới tính',
                    },
                  ]}  
                >
                  <Select
                    size="large"               
                    placeholder={t('EMPLOYEES.GENDER')}
                    defaultValue={employeesData.gender}
                    onChange={(value) => handleChange('gender', value)}
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
                    {/* địa  chỉ */}
              <Col span={12}>
                <Form.Item
                  label={t('Địa chỉ')}
                  name="address"    
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}    
                  rules={[
                    {
                      required: true,
                      message: 'vui lòng nhập địa chỉ',
                    },
                  ]}           
                >
                  <Input
                    size="large"
                    placeholder={t('Địa chỉ')}    
                    defaultValue={employeesData.address}   
                    onChange={handleChange}
                    name="address"      
                  />
                </Form.Item>
              </Col>
                    {/* cccd */}
              <Col span={12}>
                <Form.Item
                  label={t('EMPLOYEES.CITIZEN_CARD')}
                  name="citizen_card"   
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}    
                  rules={[
                    {
                      required: true,
                      message: 'vui lòng nhập căn cước công dân',                    
                    },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: 'Số căn cước bắt buộc phải là 10 số',
                    },
                  ]}              
                >
                  <Input
                    size="large"
                    placeholder={t('EMPLOYEES.CITIZEN_CARD')}   
                    defaultValue={employeesData.citizen_card} 
                    onChange={(e) => handleChange('citizen_card', e.target.value)}
                    name="citizen_card"          
                  />
                  
                </Form.Item>
              </Col>
              {/* day of birth */}
              <Col span={12}>
              <Form.Item
                label={t('EMPLOYEES.BIRTH')}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                name="birthDate"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập ngày sinh',
                  },
                  ({
                    validator(_, value) {
                      return validateBirthDate(_, value);
                    },
                  }),
                ]}
              >
                <DatePicker
                  size="large"
                  placeholder={t('EMPLOYEES.BIRTH')}
                  style={{ width: '100%' }}
                  defaultValue={dayjs(employeesData.birth, 'DD-MM-YYYY')}
                  format={'DD-MM-YYYY'}
                  onChange={handleChangeDatePicker}
              
                />
              </Form.Item>
          </Col>
         {/* mo ta  */}
         <Col span={12}>
                <Item
                  label={t('EMPLOYEES.DESCRIPTION')}
                  name="description"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'vui lòng nhập mô tả ',
                    },
                  ]}  
                >
                  <TextArea
                    size="large"         
                    placeholder={t('EMPLOYEES.DESCRIPTION')}
                    defaultValue={employeesData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    name="description" 
                  />
                </Item>
              </Col>    

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
      <div>
      <ImgCrop rotationSlider>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={handlePic}
        onPreview={handlePreview}
        onRemove={handleRemove}
      >
        Click to upload
      </Upload>
      <Img src={employeesData?.avatar[0].url} style={{ padding: '0 20px', width: '50%' }} />
    </ImgCrop>
            <div>         
          </div>  
          </div>
          
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
          </div>

          
                </Form.Item>
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
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'vui lòng nhập người quản lí ',
                    },
                  ]}  
                >
                  <Select
                    size="large"          
                    placeholder={t('EMPLOYEES.IS_MANAGER')}
                    style={{ width: '100%' }}
                    defaultValue={employeesData.isManager}
                    onChange={(value) => handleChange('is_manager', value)}
                    name="is_manager"
                  >
                    <Option value={true}>{t('EMPLOYEES.YES')}</Option>
                    <Option value={false}>{t('EMPLOYEES.NO')}</Option>
                  </Select>
                </Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={t('EMPLOYEES.STATUS')}
                  name="status"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn trạng thái',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder={t('EMPLOYEES.STATUS')}
                    defaultValue={employeesData.status}
                    style={{ width: '100%' }}
                    onChange={(value) => handleChange('status', value)}
                    name='status'
                  >
                    <Select.Option value="active">{t('EMPLOYEES.ACTIVE')}</Select.Option>
                    <Select.Option value="inactive">{t('EMPLOYEES.INACTIVE')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

               <Col span={12}>
                <Item     
                  label={t('EMPLOYEES.POSITION')}      
                  labelCol={{ span: 24 }}
                  name="position"
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the position',
                    },
                  ]}               
                >
                  <Input
                    size="large"                  
                    placeholder={t('EMPLOYEES.POSITION')}
                    defaultValue={employeesData.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    name="position"
                  />
                </Item>
              </Col>

               <Col span={12}>
                <Item    
                 label={t('EMPLOYEES.LINE_MANAGER')}             
                  labelCol={{ span: 24 }}
                  name="lineManager"
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn người quản lí',
                    },
                    {
                      pattern: /^[A-Z][a-z]*(\s+[A-Z][a-z]*)*$/,
                      message: 'Họ tên phải bắt đầu bằng chữ hoa và cách nhau bằng một khoảng trắng',
                    },
                  ]}
                
                >
                  <Input
                    size="large"
                    placeholder={t('EMPLOYEES.LINE_MANAGER')}  
                    defaultValue={employeesData.lineManager}       
                    onChange={(e) => handleChange('lineManager', e.target.value)}
                    name="lineManager"  
                  />
                </Item>
              </Col>   
              <Col span={12}>
  <Form.Item
    label={t('EMPLOYEES.SKILLS')}
    labelCol={{ span: 24 }}
    name="skills"
    wrapperCol={{ span: 24 }}
    rules={[
      {
        required: true,
        message: 'Vui lòng nhập kỹ năng',
      },
    ]}
   
 
  >
 {skillData.skills.map((skillData, index) => (
  <div key={index}>
    <Input
      size="large"
      name={`skills[${index}].skillname`}
      placeholder={t('EMPLOYEES.SKILL_NAME')}
      value={skillData.skillname}
      onChange={(e) => handleChangeSkill(index, 'skillname', e.target.value)}
    
     
    />
    <Input
      size="large"
      placeholder={t('EMPLOYEES.EXP')}
      name={`skills[${index}].exp`}
      value={skillData.exp}
          onChange={(e) => handleChangeSkill(index, 'exp', e.target.value)}

          />
             <Button type="primary" onClick={() => RemoveSkill(index)}>
              Xóa kỹ năng
             </Button>
           </div>
        ))}
          <Button type="primary" onClick={handleAddSkill}>
          Thêm kỹ năng
        </Button>
  </Form.Item>  
</Col>
            </Row>
          </Form>
        </Card>
        </>
      }
    </div>
  );
};
export default UpdateForm;