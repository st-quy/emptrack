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
import { FieldArray, Formik, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import { Toast } from '../../../components/toast/Toast';
import { axiosInstance } from '../../../config/axios';
import './ProjectUpdate.scss';
import './rolelist';
import roleSelection from './rolelist';
import Schema from './schema';
const { Text } = Typography;
const emptyMember = {
  member: '',
  role: '',
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
    members: project?.member.map((members) => ({
      name: members.name,
      role: members.role,
    })),
  };
  const yupSync = {
    async validator({ field }, value) {
      await schema.validateSyncAt(field, { [field]: value });
    },
  };
  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: schema,
    onSubmit: async (value) => {
      const managerName = employees.find((e) => e.id === value.manager).name;

      let member = [];
      members.map((mem) => {
        const memberName = employees.find((e) => e.id === mem.member).name;

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
        // axiosInstance.patch(`projects/${projectId}`, {
        //   member,
        //   name,
        //   description,
        //   status,
        //   technical,
        //   startDate,
        //   endDate,
        //   manager,
        // });
        Toast(
          'success',
          t('TOAST.CREATED_SUCCESS', {
            field: t('BREADCRUMB.PROJECTS').toLowerCase(),
          }),
          2,
        );

        formik.resetForm();
        form.resetFields();

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
        <Formik Formik initialValues={initialValues} validationSchema={schema}>
          {(values, errors) => (
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
                      onChange={() => {
                        formik.handleChange;
                      }}
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
                    {project.member.map((member, index) => (
                      <div key={index}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={`members[${index}].name`}
                              id={`members[${index}].member`}
                              initialValue={member.name}
                              onChange={(value) => {
                                arrayHelpers.replace(index, {
                                  ...members[index],
                                  name: value.target.value,
                                });
                                setMembers((prevMembers) => {
                                  const updatedMembers = [...prevMembers];
                                  updatedMembers[index] = {
                                    ...updatedMembers[index],
                                    name: value.target.value,
                                  };
                                  return updatedMembers;
                                });
                              }}
                            >
                              <Select
                                showSearch
                                placeholder={t('PROJECTS.SELECT_MEMBER')}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {employees.map((employee) => (
                                  <Select.Option
                                    key={employee.id}
                                    value={employee.name}
                                  >
                                    {employee.name}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
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
                            <Form.Item
                              name={`member[${index}].role`}
                              id={`members[${index}].role`}
                              initialValue={member.role}
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
                            >
                              <Select
                                showSearch
                                placeholder={t('PROJECTS.SELECT_ROLE')}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {roleSelection.map((role) => (
                                  <Select.Option
                                    key={role.value}
                                    value={role.value}
                                  >
                                    {role.label}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                            {formik.errors.members &&
                            formik.touched.members &&
                            {
                              /* formik.touched.member[index]?.role */
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
                            {project.member.length > 1 ? (
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
                      <div className="text-danger">{formik.errors.member}</div>
                    )}
                    <Form.Item>
                      <Button
                        onClick={() => {
                          arrayHelpers.push(emptyMember);
                          project.member.push(emptyMember);
                          setMembers((prev) => [...prev, emptyMember]);
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
