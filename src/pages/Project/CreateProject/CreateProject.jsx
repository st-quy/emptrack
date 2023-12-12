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
import axios from 'axios';
import { Field, FieldArray, Formik, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '../../../components/atoms/Button/Button';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import './CreateProject.scss';
import './rolelist';
import roleSelection from './rolelist';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Text } = Typography;
const dateFormat = 'DD/MM/YYYY';

const emptyMember = {
  member: '',
  role: '',
};
const CreateProject = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [employeesSelection, setEmployeesSelection] = useState();
  const [members, setMembers] = useState([emptyMember]);
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
    members: Yup.array()
      .of(
        Yup.object().shape({
          member: Yup.string().required(
            t('VALIDATE.REQUIRED', { field: t('PROJECTS.MEMBER') }),
          ),
          role: Yup.string().required(
            t('VALIDATE.REQUIRED', { field: t('ROLE.ROLE') }),
          ),
        }),
      )
      .min(1, t('VALIDATE.MINONE', { field: t('PROJECTS.MEMBER') })),
  });
  const initialValues = {
    name: '',
    manager: '',
    description: '',
    //UI render 1 row member
    members: members,
    dateRange: { startDate: '', endDate: '' },
    status: 'active',
    technical: '',
  };

  const yupSync = {
    async validator({ field }, value) {
      await schema.validateSyncAt(field, { [field]: value });
    },
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: (value) => {
      const managerName = employeesSelection.find(
        (e) => e.id === value.manager,
      ).name;

      let member = [];
      members.map((mem) => {
        const memberName = employeesSelection.find(
          (e) => e.id === mem.member,
        ).name;

        member.push({
          role: mem.role,
          name: memberName,
          id: mem.member,
        });
      });

      let name = value.name.trim().replace(/  +/g, ' ');
      let description = value.description.trim().replace(/  +/g, ' ');
      let status = value.status;
      let technical = value.technical;
      let startDate = value.dateRange.startDate;
      let endDate = value.dateRange.endDate;
      let manager = [{ name: managerName, id: value.manager }];

      try {
        axios.post('https://api-emptrack.onrender.com/projects', {
          member,
          name,
          description,
          status,
          technical,
          startDate,
          endDate,
          manager,
        });

        //show notif
        //Clear form
        formik.resetForm();
        form.resetFields();

        //Redirect to details page
        navigate(`/projects`);
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    axios.get('https://api-emptrack.onrender.com/employees').then((res) => {
      const employeesSelection = res.data;

      setEmployeesSelection(employeesSelection);
    });
  }, []);

  // console.log(formik.errors);

  // const filterSelectedMembers = () =>
  //   employeesSelection.filter(
  //     (option) => !members.some((m) => m.member === option.value),
  //   );
  return (
    <div id="project_create">
      <Space className="w-100 justify-content-between">
        <Breadcrumb items={breadcrumbItems} />
        <Button onClick={formik.handleSubmit}>{t('BUTTON.SAVE')}</Button>
      </Space>

      <Card
        className="card-create-project"
        title={t('BREADCRUMB.PROJECTS_CREATE').toUpperCase()}
        style={{borderRadius: '30px' }}
      >
        <Formik initialValues={initialValues} validationSchema={schema}>
          {({ values, errors }) => (
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
              form={form}
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
                      value={formik.name}
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
                        <div className="text-danger">
                          {formik.errors.manager}
                        </div>
                      )
                    }
                    validateFirst
                    rules={[yupSync]}
                    hasFeedback
                  >
                    <Select
                      placeholder={t('PROJECTS.SELECT_MANAGER')}
                      onChange={(value) =>
                        formik.setFieldValue('manager', value)
                      }
                      allowClear
                      options={employeesSelection?.map((em) => {
                        return {
                          value: em.id,
                          label: em.name,
                        };
                      })}
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
                      <Radio value="active">
                        {t('PROJECTS.STATUS_ACTIVE')}
                      </Radio>
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
                        <div className="text-danger">
                          {formik.errors.technical}
                        </div>
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
              <Text>{t('PROJECTS.MEMBER')}:</Text>
              <FieldArray name="members">
                {(arrayHelpers) => (
                  <div>
                    {values.members.map((member, index) => (
                      <div key={index}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Field
                              component="select"
                              name={`members[${index}].member`}
                              id={`members[${index}].member`}
                              onChange={(value) => {
                                arrayHelpers.replace(index, {
                                  ...members[index],
                                  member: value.target.value,
                                });
                                setMembers((prevMembers) => {
                                  const updatedMembers = [...prevMembers];
                                  updatedMembers[index] = {
                                    ...updatedMembers[index],
                                    member: value.target.value,
                                  };
                                  return updatedMembers;
                                });
                                formik.setFieldValue(
                                  `members.${index}.member`,
                                  value.target.value,
                                );
                              }}
                              className="w-100 members-select"
                              placeholder="Email"
                            >
                              <option defaultValue>Select Member</option>
                              {employeesSelection &&
                                employeesSelection.map((e, index) => {
                                  return (
                                    <option key={index} value={e.id}>
                                      {e.name}
                                    </option>
                                  );
                                })}
                            </Field>
                            {formik.errors.members &&
                            formik.touched.members &&
                            {
                              /* formik.touched.members[index]?.member */
                            } &&
                            formik.errors.members[index]?.member ? (
                              <div className="text-danger">
                                {formik.errors.members[index]?.member}
                              </div>
                            ) : (
                              <div style={{ height: 22 }}></div>
                            )}
                          </Col>
                          <Col span={11}>
                            <Field
                              component="select"
                              name={`members[${index}].role`}
                              id={`members[${index}].role`}
                              onChange={(value) => {
                                arrayHelpers.replace(index, {
                                  ...members[index],
                                  role: value.target.value,
                                });
                                setMembers((prevMembers) => {
                                  const updatedMembers = [...prevMembers];
                                  updatedMembers[index] = {
                                    ...updatedMembers[index],
                                    role: value.target.value,
                                  };
                                  return updatedMembers;
                                });
                                formik.setFieldValue(
                                  `members.${index}.role`,
                                  value.target.value,
                                );
                              }}
                              className="w-100 members-select"
                              placeholder="First Name"
                            >
                              <option defaultValue>Select Role</option>
                              {roleSelection &&
                                roleSelection.map((e, index) => {
                                  return (
                                    <option key={index} value={e.value}>
                                      {e.label}
                                    </option>
                                  );
                                })}
                            </Field>
                            {formik.errors.members &&
                            formik.touched.members &&
                            {
                              /* formik.touched.members[index]?.role */
                            } &&
                            formik.errors.members[index]?.role ? (
                              <div className="text-danger">
                                {formik.errors.members[index]?.role}
                              </div>
                            ) : (
                              <div style={{ height: 22 }}></div>
                            )}
                          </Col>
                          <Col span={1}>
                            {values.members.length > 1 ? (
                              <MinusCircleOutlined
                                className="dynamic-delete-button pt-2"
                                onClick={() => {
                                  arrayHelpers.remove(index);
                                  setMembers((prev) => {
                                    const updatedMembers = [...prev];
                                    updatedMembers.splice(index, 1);
                                    return updatedMembers;
                                  });

                                  formik.setFieldValue(`members`, [...members]);
                                }}
                              />
                            ) : null}
                          </Col>
                        </Row>
                      </div>
                    ))}

                    {typeof formik.errors.members === 'string' && (
                      <div className="text-danger">{formik.errors.members}</div>
                    )}
                    <Form.Item>
                      <Button
                        onClick={() => {
                          arrayHelpers.push(emptyMember);

                          setMembers((prev) => [...prev, emptyMember]);
                          formik.setFieldValue(`members`, [...members]);
                        }}
                        icon={<PlusOutlined />}
                        className="button ant-btn-primary my-3"
                      >
                        {t('BUTTON.ADD_MEMBER')}
                      </Button>
                    </Form.Item>
                  </div>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default CreateProject;
