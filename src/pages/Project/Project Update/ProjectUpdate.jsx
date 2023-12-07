import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Card,
  Radio,
  Row,
  Col,
  Select,
  DatePicker,
  Space,
} from 'antd';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import Button from '../../../components/atoms/Button/Button';
import './ProjectUpdate.scss';
import dayjs from 'dayjs';
import { Formik, FieldArray, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import './rolelist';
import roleSelection from './rolelist';

const ProjectUpdate = () => {
  const [managerOptions, setManagerOptions] = useState([]);
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const dateFormat = 'DD-MM-YYYY';
  const { RangePicker } = DatePicker;

  useEffect(() => {
    const managerEmployees = employees.filter(
      (employee) => employee.isManager === true,
    );
    setManagerOptions(managerEmployees);
  }, [employees]);

  useEffect(() => {
    Promise.all([
      fetch(`https://api-emptrack.onrender.com/projects/${projectId}`).then(
        (response) => response.json(),
      ),
      fetch('https://api-emptrack.onrender.com/employees').then((response) =>
        response.json(),
      ),
    ])
      .then(([projectData, employeeData]) => {
        setProject(projectData);
        setEmployees(employeeData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [projectId]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Project name is required'),
    manager: Yup.array().min(1, 'At least one manager is required'),
    description: Yup.string().required('Project description is required'),
    status: Yup.string().required('Project status is required'),
    technical: Yup.string().required('Technical details are required'),
    member: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Member name is required'),
        role: Yup.string().required('Member role is required'),
      }),
    ),
  });

  const formik = useFormik({
    initialValues: {
      name: project?.name || '',
      manager: project?.manager?.map((manager) => manager.id) || [],
      description: project?.description || '',
      technical: project?.technical || '',
      startDate: project?.startDate || null,
      endDate: project?.endDate || null,
      status: project?.status || '',
      member: project?.member.map((member) => ({
        name: member.name,
        role: member.role,
      })),
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `https://api-emptrack.onrender.com/projects/${projectId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          },
        );
  
        if (!response.ok) {
          throw new Error('Failed to update project');
        }
  
        const responseData = await response.json();
        console.log('Project updated successfully!', responseData);
        // Optionally, you can redirect or show a success message to the user
      } catch (error) {
        console.error('Error updating project:', error);
        // Handle error, e.g., show an error message to the user
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
        title={t('BREADCRUMB.PROJECTS_UPDATE')}
      >
        <Formik
          initialValues={formik.initialValues}
          validationSchema={validationSchema}
        >
          {(formikProps) => (
            <Form
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 20,
              }}
              layout="horizontal"
              className="p-4"
              name="projectUpdateForm"
              onFinish={formik.handleSubmit}
            >
              <Row className="w-100" gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label={t('PROJECTS.NAME')}
                    initialValue={project?.name}
                  >
                    <Input placeholder={t('PROJECTS.NAME')} />
                  </Form.Item>
                  <Form.Item
                    name="manager"
                    label={t('PROJECTS.MANAGER')}
                    initialValue={project?.manager?.map(
                      (manager) => manager.id,
                    )}
                  >
                    <Select mode="multiple" placeholder={t('PROJECTS.MANAGER')}>
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
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder={t('PROJECTS.DESCRIPTION')}
                      style={{ resize: 'none' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('PROJECTS.TIME')}>
                    <RangePicker
                      placeholder={[
                        t('PROJECTS.TIME_START'),
                        t('PROJECTS.TIME_END'),
                      ]}
                      defaultValue={[
                        dayjs(project?.startDate, dateFormat),
                        dayjs(project?.endDate, dateFormat),
                      ]}
                      format={dateFormat}
                    />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    label={t('PROJECTS.STATUS')}
                    initialValue={project?.status}
                  >
                    <Radio.Group>
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
                  >
                    <Input placeholder={t('PROJECTS.TECHNICAL')} />
                  </Form.Item>
                </Col>
              </Row>

              <FieldArray name="member">
                {(arrayHelpers) => (
                  <>
                    <Button
                      type="primary"
                      onClick={() => {
                        arrayHelpers.push({ id: '', name: '', role: '' });
                        project.member.push({ id: '', name: '', role: '' });
                      }}
                      style={{ marginBottom: '20px' }}
                    >
                      Add Member
                    </Button>
                    {project.member.map((member, index) => (
                      <Row gutter={16} key={index} className="mb-2">
                        <Col span={12}>
                          <Form.Item
                            name={`member[${index}].name`}
                            label={t('PROJECTS.SELECT_MEMBER')}
                            initialValue={member.name}
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
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name={`member[${index}].role`}
                            label={t('PROJECTS.SELECT_ROLE')}
                            initialValue={member.role}
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
                        </Col>
                      </Row>
                    ))}
                  </>
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
