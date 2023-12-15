import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { Field, FieldArray, Formik, useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
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

  const [technologies, setTechnologies] = useState();

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
    status: 'progress',
    technical: [],
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
        let technical = value.technical;
        let startDate = value.dateRange.startDate;
        let endDate = value.dateRange.endDate;
        let manager = [{ name: managerName, id: value.manager }];
        try {
          await axiosInstance
            .post('projects', {
              member,
              name,
              description,
              status,
              technical,
              startDate,
              endDate,
              manager,
            })
            .then((result) => {
              const dataHistory = result.data.data.member.map(
                (member) => `${member.name} Joined project`,
              );
              axiosInstance.post('tracking', {
                project: result.data.data,
                history: [
                  {
                    time: result.data.data.createdAt,
                    value: [`Start project`, ...dataHistory],
                  },
                ],
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
            });
        } catch (error) {
          Toast(
            'error',
            t('TOAST.CREATED_ERROR', {
              field: t('BREADCRUMB.PROJECTS'),
            }),
            2,
          );
        }
      }
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance.get('employees').then((res) => {
        const employeesSelection = res.data.filter((em) => !em.deletedAt);
        setEmployeesSelection(employeesSelection);
      });

      await axiosInstance.get('technology').then((res) => {
        const items = res.data.map((item) => item.name);
        setTechnologies(items);
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

  const [newTech, setNewTech] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const inputRef = useRef(null);
  const onTechChange = (event) => {
    setNewTech(event.target.value);

    if (event.target.value.trim().replace(/  +/g, ' ') !== '') {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };
  const addItem = async (e) => {
    e.preventDefault();
    const trimmedNewTech = newTech.trim().replace(/  +/g, ' ');
    const isExist = technologies.some(
      (t) => t.toLowerCase() === trimmedNewTech.toLowerCase(),
    );
    if (isExist) {
      setNewTech('');
      Toast('error', t('TOAST.CREATED_ERROR_SAME_TECH'), 2);
      return;
    }

    if (trimmedNewTech !== '' && !isExist) {
      await axiosInstance
        .post('technology', { name: trimmedNewTech })
        .then((res) => {});

      setTechnologies([...technologies, newTech]);
      setNewTech('');
      setIsDisabled(true);
      setTimeout(() => {
        inputRef.current?.focus();
        Toast(
          'success',
          t('TOAST.CREATED_SUCCESS', {
            field: t('PROJECTS.TECHNICAL').toLowerCase(),
          }),
          2,
        );
      }, 0);
    }
  };
  return (
    <div id="project_create">
      <Space className="w-100 justify-content-between">
        <Breadcrumb items={breadcrumbItems} />
        <Button onClick={formik.handleSubmit}>{t('BUTTON.SAVE')}</Button>
      </Space>
      <div
        style={{
          maxHeight: '80vh',
          maxWidth: '100%',
          overflowY: 'auto',
          borderRadius: '30px',
        }}
      >
        <Card
          className="card-create-project"
          title={t('BREADCRUMB.PROJECTS_CREATE').toUpperCase()}
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
                          <div className="text-danger">
                            {formik.errors.name}
                          </div>
                        )
                      }
                      validateFirst
                      rules={[
                        yupSync,
                        {
                          required: true,
                        },
                      ]}
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
                      rules={[
                        yupSync,
                        {
                          required: true,
                        },
                      ]}
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
                      rules={[
                        {
                          required: true,
                        },
                      ]}
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
                      rules={[
                        yupSync,
                        {
                          required: true,
                        },
                      ]}
                      hasFeedback
                    >
                      <Select
                        mode="multiple"
                        onChange={(value) => {
                          formik.setFieldValue('technical', value);
                        }}
                        allowClear
                        placeholder={t('PROJECTS.TECHNICAL')}
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Divider
                              style={{
                                margin: '8px 0',
                              }}
                            />
                            <Space.Compact
                              style={{
                                padding: '0 8px 4px',
                                width: '100%',
                              }}
                            >
                              <Input
                                style={{
                                  borderRadius: '12px 0 0 12px',
                                }}
                                placeholder={t('VALIDATE.PLACEHOLDER', {
                                  name: t(
                                    'PROJECTS.TECHNICAL',
                                  ).toLocaleLowerCase(),
                                })}
                                ref={inputRef}
                                value={newTech}
                                onChange={onTechChange}
                                onKeyDown={(e) => e.stopPropagation()}
                              />
                              <Button
                                type="text"
                                icon={<PlusOutlined />}
                                onClick={addItem}
                                className="button ant-btn-primary"
                                disabled={isDisabled}
                              >
                                {t('BUTTON.ADD')}
                              </Button>
                            </Space.Compact>
                          </>
                        )}
                        options={technologies?.map((item) => ({
                          label: item,
                          value: item,
                        }))}
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
                                    : t('PROJECTS.SELECT_MEMBER')}
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

                                    formik.setFieldValue(`members`, [
                                      ...members,
                                    ]);
                                  }}
                                />
                              ) : null}
                            </Col>
                          </Row>
                        </div>
                      ))}

                      {typeof formik.errors.members === 'string' && (
                        <div className="text-danger">
                          {formik.errors.members}
                        </div>
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
    </div>
  );
};
export default CreateProject;
