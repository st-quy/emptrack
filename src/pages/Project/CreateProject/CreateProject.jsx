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
import { Field, FieldArray, Formik, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import { Toast } from '../../../components/toast/Toast';
import { axiosInstance } from '../../../config/axios';
import './CreateProject.scss';
import CustomSelect from './CustomSelect';
import './rolelist';
import roleSelection from './rolelist';
import Schema from './schema';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Text } = Typography;
const dateFormat = 'DD/MM/YYYY';

const emptyMember = {
  member: '',
  role: [],
};

const CreateProject = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [employeesSelection, setEmployeesSelection] = useState();
  const [members, setMembers] = useState([emptyMember]);
  const schema = Schema();
  const breadcrumbItems = [
    { key: 'projects' },
    { key: 'projects_create', route: '/projects/create' },
  ];

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
    onSubmit: async (value) => {
      let name = value.name.trim().replace(/  +/g, ' ');
      const allProjects = await axiosInstance
        .get('projects')
        .then((res) => res.data);
      const isSameName = allProjects.find((project) => project.name === name);
      if (!isSameName) {
        const managerName = employeesSelection.find(
          (e) => e.id === value.manager,
        ).name;
        let member = [];
        members.map((mem) => {
          const memberName = employeesSelection.find(
            (e) => e.id === mem.member,
          ).name;
          member.push({
            role: mem.role.map((r) => r.value),
            name: memberName,
            id: mem.member,
          });
        });
        let description = value.description.trim().replace(/  +/g, ' ');
        let status = value.status;
        let technical = value.technical.replace(/[ ]+/g, ' ').trim();
        let startDate = value.dateRange.startDate;
        let endDate = value.dateRange.endDate;
        let manager = [{ name: managerName, id: value.manager }];
        try {
          await axiosInstance.post('projects', {
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
          Toast(
            'success',
            t('TOAST.CREATED_SUCCESS', {
              field: t('BREADCRUMB.PROJECTS').toLowerCase(),
            }),
            2,
          );
          //Clear form
          formik.resetForm();
          form.resetFields();
          //Redirect to details page
          setTimeout(() => {
            navigate(`/projects`);
          }, 2000);
        } catch (error) {
          Toast(
            'error',
            t('TOAST.CREATED_ERROR', {
              field: t('BREADCRUMB.PROJECTS'),
            }),
            2,
          );
        }
      } else {
        Toast('error', t('TOAST.CREATED_ERROR_SAME_NAME'), 3);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance.get('employees').then((res) => {
        const employeesSelection = res.data.filter((em) => !em.deletedAt);
        setEmployeesSelection(employeesSelection);
      });
    };
    fetchData();
  }, []);

  const getAvailableOptions = () => {
    const selectedOptions = members?.map((member) => member.member);

    return employeesSelection?.filter(
      (option) => !selectedOptions.includes(option.id),
    );
  };

  return (
    <div id="project_create">
      <Space className="w-100 justify-content-between">
        <Breadcrumb items={breadcrumbItems} />
        <Button onClick={formik.handleSubmit}>{t('BUTTON.SAVE')}</Button>
      </Space>

      <Card
        className="card-create-project"
        title={t('BREADCRUMB.PROJECTS_CREATE').toUpperCase()}
        style={{ borderRadius: '30px' }}
      >
        <Formik initialValues={initialValues} validationSchema={schema}>
          {({ values }) => (
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
                      options={employeesSelection
                        ?.filter((em) => em.isManager === true)
                        .map((em) => {
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
                            >
                              <option defaultValue>
                                {members[index]?.member
                                  ? employeesSelection.find(
                                      (e) => e.id === members[index].member,
                                    ).name
                                  : 'Select member'}
                              </option>
                              {employeesSelection &&
                                getAvailableOptions(index).map((e, i) => {
                                  return (
                                    <option key={i} value={e.id}>
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
                            {/* <Field
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
                            </Field> */}
                            {/* <Field
                              className="w-100 members-select"
                              name={`members[${index}].role`}
                              id={`members[${index}].role`}
                              options={roleSelection}
                              component={CustomSelect}
                              // placeholder="Select multi languages..."
                              isMulti={true}
                            /> */}
                            <Field
                              component={CustomSelect}
                              name={`members[${index}].role`}
                              index={index}
                              options={roleSelection}
                              isMulti={true}
                              members={members}
                              setMembers={setMembers}
                              formik={formik}
                            ></Field>
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
