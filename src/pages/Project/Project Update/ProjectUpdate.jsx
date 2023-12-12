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
import dayjs from 'dayjs';
import { Field, FieldArray, Formik, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import { axiosInstance } from '../../../config/axios';
import SelectField from './CustomSelect';
import './ProjectUpdate.scss';
import './rolelist';
import roleSelection from './rolelist';
import Schema from './schema';
const { Text } = Typography;
const emptyMember = {
  member: '',
  role: [],
};
const ProjectUpdate = () => {
  const [managerOptions, setManagerOptions] = useState([]);
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([emptyMember]);
  const { t } = useTranslation();
  const dateFormat = 'DD/MM/YYYY';
  const { RangePicker } = DatePicker;
  const schema = Schema();
  const [form] = Form.useForm();
  const [select, setSelect] = useState([]);

  useEffect(() => {
    const managerEmployees = employees.filter(
      (employee) => employee.isManager === true,
    );
    setManagerOptions(managerEmployees);
  }, [employees]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectResponse = await axiosInstance.get(
          `projects/${projectId}`,
        );
        const employeeResponse = await axiosInstance.get('employees');

        const projectData = projectResponse.data;
        const employeeData = employeeResponse.data;

        setProject(projectData);
        setEmployees(employeeData);
        setSelect(projectData.member.map((m) => m.id));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const initialValues = {
    name: project?.name || '',
    manager: project?.manager?.map((manager) => manager.id) || [],
    description: project?.description || '',
    technical: project?.technical || '',
    startDate: project?.startDate || null,
    endDate: project?.endDate || null,
    status: project?.status || '',
    members:
      project?.member.map((member) => ({
        member: member.id,
        role: member.role,
      })) || [],
  };
  const yupSync = {
    async validator({ field }, value) {
      await schema.validateSyncAt(field, { [field]: value });
    },
  };
  const formik = useFormik({
    initialValues: initialValues,

    onSubmit: async (value) => {
      console.log(value);
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const breadcrumbItems = [
    { key: 'projects' },
    { key: 'projects_update', route: `/projects/update/${projectId}` },
  ];

  const getAvailableOptions = () => {
    const selectedOptions = select.map((member) => member?.id);
    return employees?.filter((option) => !selectedOptions.includes(option.id));
  };
  return (
    <div id="project_update">
      <Space className="w-100 justify-content-between">
        <Breadcrumb items={breadcrumbItems} />
        <Button type="primary" onClick={formik.handleSubmit}>
          {t('BUTTON.SAVE')}
        </Button>
      </Space>
      <Card
        className="card-update-project"
        style={{ borderRadius: '30px' }}
        title={t('BREADCRUMB.PROJECTS_UPDATE').toUpperCase()}
      >
        <Formik Formik initialValues={initialValues}>
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
                    initialValue={project?.name}
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
                    initialValue={project?.manager[0].name}
                  >
                    <Select
                      mode="single"
                      placeholder={t('PROJECTS.MANAGER')}
                      onChange={(value) => {
                        formik.setFieldValue('manager', value);
                      }}
                      allowClear
                    >
                      {managerOptions.map((employee) => (
                        <Select.Option key={employee.id} value={employee.id}>
                          {employee.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label={t('PROJECTS.DESCRIPTION')}
                    initialValue={project?.description}
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
                    <Input.TextArea
                      rows={4}
                      placeholder={t('PROJECTS.DESCRIPTION')}
                      onChange={() => {
                        formik.handleChange;
                      }}
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
                      className={
                        formik.errors.dateRange && formik.touched.dateRange
                          ? 'ant-form-item-has-error'
                          : ''
                      }
                      placeholder={[
                        t('PROJECTS.TIME_START'),
                        t('PROJECTS.TIME_END'),
                      ]}
                      defaultValue={[
                        dayjs(project?.startDate, dateFormat),
                        dayjs(project?.endDate, dateFormat),
                      ]}
                      format={dateFormat}
                      onChange={(date, dateString) => {
                        formik.setFieldValue('dateRange', {
                          startDate: dateString[0],
                          endDate: dateString[1],
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    label={t('PROJECTS.STATUS')}
                    initialValue={project?.status}
                  >
                    <Radio.Group
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
                    initialValue={project?.technical}
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
                      onChange={() => {
                        formik.handleChange;
                      }}
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
                            {/* <Field
                              component="select"
                              name={`members[${index}].member`}
                              id={`members[${index}].member`}
                              onChange={(target) => {
                                arrayHelpers.replace(index, {
                                  ...members[index],
                                  member: target.value,
                                });
                                setMembers((prevMembers) => {
                                  const updatedMembers = [...prevMembers];
                                  updatedMembers[index] = {
                                    ...updatedMembers[index],
                                    member: target.value,
                                  };
                                  return updatedMembers;
                                });
                                formik.setFieldValue(
                                  `members.${index}.member`,
                                  target.value,
                                );
                              }}
                              className="w-100 members-select"
                            >
                              <option defaultValue>
                                {project.member[index]?.name
                                  ? employees.find(
                                      (e) => e.id === project.member[index].id,
                                    ).name
                                  : 'Select member'}
                              </option>
                              {employees &&
                                getAvailableOptions(index).map((e, i) => {
                                  return (
                                    <option key={i} value={e.id}>
                                      {e.name}
                                    </option>
                                  );
                                })}
                            </Field> */}
                            <Field
                              component="select"
                              name={`members[${index}].member`}
                              id={`members[${index}].member`}
                              onChange={(target) => {
                                const selectedMemberId = target.target.value;
                                // Add the selected employee to the 'select' array
                                setSelect((prevSelect) => {
                                  const newSelect = [
                                    ...prevSelect,
                                    selectedMemberId,
                                  ];
                                  return newSelect;
                                });
                                arrayHelpers.replace(index, {
                                  ...members[index],
                                  member: selectedMemberId,
                                });

                                setMembers((prevMembers) => {
                                  const updatedMembers = [...prevMembers];
                                  updatedMembers[index] = {
                                    ...updatedMembers[index],
                                    member: selectedMemberId,
                                  };
                                  return updatedMembers;
                                });

                                formik.setFieldValue(
                                  `members.${index}.member`,
                                  selectedMemberId,
                                );
                              }}
                              className="w-100 members-select"
                            >
                              <option defaultValue>
                                {/* {project.member[index]?.name
                                  ? employees.find(
                                      (e) => e.id === project.member[index].id,
                                    ).name
                                  : 'Select member'} */}
                                {select[index] 
                                  ? employees.find(
                                      (e) => e.id === select[index],
                                    ).name
                                  : 'Select member'}
                              </option>
                              {employees &&
                                getAvailableOptions(index).map((e, i) => {
                                  // Only render the employee if not already selected
                                  if (!select.includes(e.id)) {
                                    return (
                                      <option key={i} value={e.id}>
                                        {e.name}
                                      </option>
                                    );
                                  }
                                  return null;
                                })}
                            </Field>
                            {formik.errors.members &&
                            formik.touched.members &&
                            {} &&
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
                              component={SelectField}
                              name={`members[${index}].role`}
                              index={index}
                              options={roleSelection}
                              isMulti={true}
                              defaultValue={
                                index < values.members.length && project?.member
                              }
                              setMembers={setMembers}
                              formik={formik}
                            ></Field>
                            {formik.errors.members &&
                            formik.touched.members &&
                            {} &&
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

export default ProjectUpdate;
