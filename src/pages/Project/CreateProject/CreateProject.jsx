import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '../../../components/atoms/Button/Button';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import './CreateProject.scss';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Text } = Typography;
const dateFormat = 'DD/MM/YYYY';

const options = [];
for (let i = 10; i < 16; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}
const formItemLayout = {
  labelCol: {
    xs: {
      span: 12,
    },
    sm: {
      span: 4,
    },
    md: {
      span: 2,
    },
  },
  wrapperCol: {
    xs: {
      span: 12,
    },
    sm: {
      span: 20,
    },
    md: {
      span: 22,
    },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 4,
    },
    md: {
      span: 24,
      // offset: 4,
    },
  },
};

const CreateProject = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const breadcrumbItems = [
    { key: 'projects' },
    { key: 'projects_create', route: '/projects/create' },
  ];

  let schema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .max(60, t('VALIDATE.MAX', { field: t('PROJECTS.NAME'), number: '60' }))
      .required(t('VALIDATE.REQUIRED', { field: t('PROJECTS.NAME') })),
    description: Yup.string()
      .trim()
      .required(t('VALIDATE.REQUIRED', { field: t('PROJECTS.DESCRIPTION') })),
    technical: Yup.string()
      .trim()
      .required(t('VALIDATE.REQUIRED', { field: t('PROJECTS.TECHNICAL') })),
    dateRange: Yup.object().shape({
      startDate: Yup.string().required(
        t('VALIDATE.REQUIRED', { field: t('PROJECTS.TIME_START') }),
      ),
      endDate: Yup.string().required(
        t('VALIDATE.REQUIRED', { field: t('PROJECTS.TIME_END') }),
      ),
    }),
    manager: Yup.string()
      .trim()
      .required(t('VALIDATE.REQUIRED', { field: t('PROJECTS.MANAGER') })),
  });
  const yupSync = {
    async validator({ field }, value) {
      await schema.validateSyncAt(field, { [field]: value });
    },
  };
  const formik = useFormik({
    initialValues: {
      name: '',
      manager: '',
      description: '',
      members: [],
      dateRange: { startDate: '', endDate: '' },
      status: 'active',
      technical: '',
    },
    validationSchema: schema,
    onSubmit: (value) => {
      value.name = value.name.trim().replace(/  +/g, ' ');
      value.description = value.description.trim().replace(/  +/g, ' ');
      console.log(value);
    },
  });

  // const columns = [
  //   {
  //     title: 'First Name',
  //     dataIndex: 'firstName',
  //     key: 'firstName',
  //     render: () => (
  //       <Select
  //         name="member"
  //         value={formik.values.members}
  //         mode="multiple"
  //         placeholder={t('PROJECTS.SELECT_MEMBER')}
  //         // onChange={handleChange}
  //         style={{
  //           width: '100%',
  //         }}
  //         allowClear
  //         maxTagCount={4}
  //         options={options}
  //       />
  //     ),
  //   },
  //   {
  //     title: 'Last Name',
  //     dataIndex: 'lastName',
  //     key: 'lastName',
  //     render: () => (
  //       <Select
  //         name="role"
  //         mode="multiple"
  //         placeholder={t('PROJECTS.SELECT_ROLE')}
  //         // onChange={handleChange}
  //         style={{
  //           width: '100%',
  //         }}
  //         allowClear
  //         maxTagCount={4}
  //         options={options}
  //       />
  //     ),
  //   },
  // ];

  return (
    <div id="project_create">
      <Space className="w-100 justify-content-between">
        <Breadcrumb items={breadcrumbItems} />
        <Button onClick={formik.handleSubmit}>{t('BUTTON.SAVE')}</Button>
      </Space>

      <Card
        className="card-create-project"
        title={t('BREADCRUMB.PROJECTS_CREATE').toUpperCase()}
      >
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
          initialValues={{ members: [''] }}
        >
          <Row className="w-100" gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={t('PROJECTS.NAME')}
                help={
                  formik.errors.name &&
                  formik.touched.name && (
                    <div className="text-danger">{formik.errors.name}</div>
                  )
                }
                validateFirst
                rules={[yupSync]}
                hasFeedback
              >
                <Input
                  placeholder={t('PROJECTS.NAME')}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  autoFocus
                />
              </Form.Item>
              <Form.Item
                name="manager"
                label={t('PROJECTS.MANAGER')}
                help={
                  formik.errors.manager &&
                  formik.touched.manager && (
                    <div className="text-danger">{formik.errors.manager}</div>
                  )
                }
                validateFirst
                rules={[yupSync]}
                hasFeedback
              >
                <Select
                  // mode="multiple"
                  // maxTagCount={1}
                  placeholder={t('PROJECTS.SELECT_MANAGER')}
                  onChange={(value) => formik.setFieldValue('manager', value)}
                  // onChange={(e) => console.log(e)}
                  allowClear
                  options={options}
                />
              </Form.Item>
              <Form.Item
                name="description"
                label={t('PROJECTS.DESCRIPTION')}
                help={
                  formik.errors.description &&
                  formik.touched.description && (
                    <div className="text-danger">
                      {formik.errors.description}
                    </div>
                  )
                }
                validateFirst
                rules={[yupSync]}
                hasFeedback
              >
                <TextArea
                  rows={4}
                  placeholder={t('PROJECTS.DESCRIPTION')}
                  onChange={formik.handleChange}
                  style={{ resize: 'none' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('PROJECTS.TIME')}
                name="dateRange"
                help={
                  formik.errors.dateRange &&
                  formik.touched.dateRange && (
                    <div className="text-danger">
                      {formik.errors.dateRange.startDate}
                    </div>
                  )
                }
                // hasFeedback
              >
                <RangePicker
                  status={
                    formik.errors.dateRange &&
                    formik.touched.dateRange &&
                    'error'
                  }
                  placeholder={[
                    t('PROJECTS.TIME_START'),
                    t('PROJECTS.TIME_END'),
                  ]}
                  format={dateFormat}
                  onChange={(date, dateString) => {
                    formik.setFieldValue('dateRange', {
                      startDate: dateString[0],
                      endDate: dateString[1],
                    });
                  }}
                  className="w-100"
                />
              </Form.Item>
              <Form.Item label={t('PROJECTS.STATUS')}>
                <Radio.Group
                  name="status"
                  value={formik.values.status}
                  onChange={(e) =>
                    formik.setFieldValue('status', e.target.value)
                  }
                >
                  <Radio value="active">{t('PROJECTS.STATUS_ACTIVE')}</Radio>
                  <Radio value="inactive">
                    {t('PROJECTS.STATUS_INACTIVE')}
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="technical"
                label={t('PROJECTS.TECHNICAL')}
                help={
                  formik.errors.technical &&
                  formik.touched.technical && (
                    <div className="text-danger">{formik.errors.technical}</div>
                  )
                }
                validateFirst
                rules={[yupSync]}
                hasFeedback
              >
                <Input
                  placeholder={t('PROJECTS.TECHNICAL')}
                  onChange={formik.handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row className="w-100" gutter={16}>
            <Col span={24}>
              {/* <Text>{t('PROJECTS.MEMBER')}:</Text> */}
              {/* <Form.List
                name="members"
                rules={[
                  {
                    validator: async (_, names) => {
                      if (!names || names.length < 2) {
                        return Promise.reject(
                          new Error('At least 2 passengers'),
                        );
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        className="w-100 justify-content-between align-items-baseline"
                      >
                        <Form.Item
                          name="member"
                          label={t('PROJECTS.MEMBER')}
                          // validateFirst
                          // rules={[yupSync]}
                          // hasFeedback
                        >
                          <Select
                            // mode="multiple"
                            // maxTagCount={1}
                            placeholder={t('PROJECTS.SELECT_MEMBER')}
                            // onChange={(value) =>
                            //   formik.setFieldValue('manager', value)
                            // }
                            // onChange={(e) => console.log(e)}
                            allowClear
                            options={options}
                          />
                        </Form.Item>
                        <Form.Item
                          name="role"
                          label={t('PROJECTS.ROLE')}
                          // help={
                          //   formik.errors.manager &&
                          //   formik.touched.manager && (
                          //     <div className="text-danger">
                          //       {formik.errors.manager}
                          //     </div>
                          //   )
                          // }
                          // validateFirst
                          // rules={[yupSync]}
                          // hasFeedback
                        >
                          <Select
                            // mode="multiple"
                            // maxTagCount={1}
                            placeholder={t('PROJECTS.SELECT_ROLE')}
                            // onChange={(value) =>s
                            // onChange={(e) => console.log(e)}
                            allowClear
                            options={options}
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                        className="button ant-btn-primary"
                      >
                        {t('BUTTON.ADD_MEMBER')}
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List> */}
              <Form.List
                name="members"
                rules={[
                  {
                    validator: async (_, members) => {
                      if (!members || members.length < 1) {
                        console.log(members);
                        return Promise.reject(
                          new Error('At least 1 passengers'),
                        );
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        {...(index === 0
                          ? formItemLayout
                          : formItemLayoutWithOutLabel)}
                        label={index === 0 ? t('PROJECTS.MEMBER') : ''}
                        required={false}
                        key={field.key}
                      >
                        <Row>
                          <Col span={12}>
                            <Form.Item
                              name="member"
                              // label={t('PROJECTS.MEMBER')}
                              // validateFirst
                              // rules={[yupSync]}
                              // hasFeedback
                            >
                              <Select
                                // mode="multiple"
                                // maxTagCount={1}
                                placeholder={t('PROJECTS.SELECT_MEMBER')}
                                // onChange={(value) =>
                                //   formik.setFieldValue('manager', value)
                                // }
                                // onChange={(e) => console.log(e)}
                                allowClear
                                options={options}
                              />
                            </Form.Item>
                            {/* <Form.Item
                              name="role"
                              label={t('PROJECTS.ROLE')}
                              // help={
                              //   formik.errors.manager &&
                              //   formik.touched.manager && (
                              //     <div className="text-danger">
                              //       {formik.errors.manager}
                              //     </div>
                              //   )
                              // }
                              // validateFirst
                              // rules={[yupSync]}
                              // hasFeedback
                            >
                              <Select
                                // mode="multiple"
                                // maxTagCount={1}
                                placeholder={t('PROJECTS.SELECT_ROLE')}
                                // onChange={(value) =>s
                                // onChange={(e) => console.log(e)}
                                allowClear
                                options={options}
                              />
                            </Form.Item>
                            {fields.length > 1 ? (
                              <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => remove(field.name)}
                              />
                            ) : null} */}
                          </Col>
                          <Col span={11}>
                            {/* <Form.Item
                              name="member"
                              // label={t('PROJECTS.MEMBER')}
                              // validateFirst
                              // rules={[yupSync]}
                              // hasFeedback
                            >
                              <Select
                                // mode="multiple"
                                // maxTagCount={1}
                                placeholder={t('PROJECTS.SELECT_MEMBER')}
                                // onChange={(value) =>
                                //   formik.setFieldValue('manager', value)
                                // }
                                // onChange={(e) => console.log(e)}
                                allowClear
                                options={options}
                              />
                            </Form.Item> */}
                            <Form.Item
                              name="role"
                              label={t('PROJECTS.ROLE')}
                              // help={
                              //   formik.errors.manager &&
                              //   formik.touched.manager && (
                              //     <div className="text-danger">
                              //       {formik.errors.manager}
                              //     </div>
                              //   )
                              // }
                              // validateFirst
                              // rules={[yupSync]}
                              // hasFeedback
                            >
                              <Select
                                // mode="multiple"
                                // maxTagCount={1}
                                placeholder={t('PROJECTS.SELECT_ROLE')}
                                // onChange={(value) =>s
                                // onChange={(e) => console.log(e)}
                                allowClear
                                options={options}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={1}>
                            {fields.length > 1 ? (
                              <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => remove(field.name)}
                              />
                            ) : null}
                          </Col>
                        </Row>
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                        className="button ant-btn-primary"
                      >
                        {t('BUTTON.ADD_MEMBER')}
                      </Button>

                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default CreateProject;
