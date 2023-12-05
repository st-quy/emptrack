import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

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
import { FieldArray, Formik, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import './CreateProject.scss';
import './rolelist';
import roleSelection from './rolelist';
// import schema from './schema';
import * as Yup from 'yup';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Text } = Typography;
const dateFormat = 'DD/MM/YYYY';

// const options = [];
// for (let i = 10; i < 16; i++) {
//   options.push({
//     value: i.toString(36) + i,
//     label: i.toString(36) + i,
//   });
// }
// const formItemLayout = {
//   labelCol: {
//     xs: {
//       span: 12,
//     },
//     sm: {
//       span: 4,
//     },
//     md: {
//       span: 2,
//     },
//   },
//   wrapperCol: {
//     xs: {
//       span: 12,
//     },
//     sm: {
//       span: 20,
//     },
//     md: {
//       span: 22,
//     },
//   },
// };
// const formItemLayoutWithOutLabel = {
//   wrapperCol: {
//     xs: {
//       span: 24,
//       offset: 0,
//     },
//     sm: {
//       span: 20,
//       offset: 4,
//     },
//     md: {
//       span: 24,
//       // offset: 4,
//     },
//   },
// };
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
    // members: [
    //   {
    //     member: '',
    //     role: '',
    //   },
    // ],
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
    initialValues: {
      name: '',
      manager: '',
      description: '',
      members: members,
      dateRange: { startDate: '', endDate: '' },
      status: 'active',
      technical: '',
    },
    validationSchema: schema,
    onSubmit: (value) => {
      value.name = value.name.trim().replace(/  +/g, ' ');
      value.description = value.description.trim().replace(/  +/g, ' ');
      // value.members = members;
      console.log(value);
      // console.log(value.status);
      // const fields = form.getFieldsValue();
      // console.log('fields');
      // console.log(fields);
    },
  });

  useEffect(() => {
    axios.get('https://api-emptrack.onrender.com/employees').then((res) => {
      const employeesSelection = res.data.map((em, index) => {
        return {
          value: em.name,
          label: em.name,
        };
      });
      setEmployeesSelection(employeesSelection);
    });
  }, []);
  console.log(formik.errors);

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
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          // onSubmit={formik.handleSubmit}
          // onSubmit={(values) => {
          //   console.log(values);
          // }}
        >
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
                      // mode="multiple"
                      // maxTagCount={1}
                      placeholder={t('PROJECTS.SELECT_MANAGER')}
                      onChange={(value) =>
                        formik.setFieldValue('manager', value)
                      }
                      allowClear
                      options={employeesSelection}
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
              {/* <Form.List
                name="members"
                rules={[
                  {
                    validator: async (_, members) => {
                      if (!members || members.length < 1) {
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
                        // {...(index === 0 && formItemLayout)}
                        // {...(index === 0
                        //   ? formItemLayout
                        //   : formItemLayoutWithOutLabel)}
                        // label={index === 0 ? t('PROJECTS.MEMBER') : ''}
                        // required={false}
                        key={field.key}
                      >
                        <Row gutter={16}>
                          <Col span={11}>
                            <Form.Item
                              name={[field.name, 'member']}
                              label={`${index + 1} - ` + t('PROJECTS.MEMBER')}
                              // help={
                              //   formik.errors.members &&
                              //   formik.touched.members && (
                              //     <div className="text-danger">
                              //       {formik.errors.members}
                              //     </div>
                              //   )
                              // }
                              // validateFirst
                              // rules={[yupSync]}
                              // hasFeedback
                            >
                              <Select
                                placeholder={t('PROJECTS.SELECT_MEMBER')}
                                // onChange={(e) => console.log(e)}
                                // onChange={(value) =>
                                //   formik.setFieldValue('members', value)
                                // }
                                // onChange={(value) =>
                                //   formik.setFieldValue('members', value)
                                // }
                                allowClear
                                options={employeesSelection}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={[field.name, 'role']}
                              label={t('PROJECTS.ROLE')}
                              // help={
                              //   formik.errors.members &&
                              //   formik.touched.members && (
                              //     <div className="text-danger">
                              //       {formik.errors.members}
                              //     </div>
                              //   )
                              // }
                              // validateFirst
                              // rules={[yupSync]}
                              // hasFeedback
                            >
                              <Select
                                placeholder={t('PROJECTS.SELECT_ROLE')}
                                // onChange={(value) =>
                                //   formik.setFieldValue('members', value)
                                // }
                                // onChange={(value) =>s
                                // onChange={(e) => console.log(e)}
                                allowClear
                                options={roleSelection}
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
              </Form.List> */}
              <FieldArray name="members">
                {(arrayHelpers) => (
                  <div>
                    {values.members.map((member, index) => (
                      <div key={index}>
                        <Row gutter={16} className="align-items-center">
                          <Col span={11}>
                            <Form.Item
                              name={`members[${index}].member`}
                              id={`members[${index}].member`}
                              // name={`members`}
                              label={`${index + 1} - ` + t('PROJECTS.MEMBER')}
                              help={
                                formik.errors.members &&
                                formik.touched.members &&
                                formik.touched.members[index]?.member &&
                                formik.errors.members[index]?.member && (
                                  <div className="text-danger">
                                    {formik.errors.members[index]?.member}
                                  </div>
                                )
                              }
                              validateFirst
                              // rules={[yupSync]}
                              // hasFeedback
                            >
                              <Select
                                placeholder={t('PROJECTS.SELECT_MEMBER')}
                                onChange={(value) => {
                                  arrayHelpers.replace(index, {
                                    ...values.members[index],
                                    member: value,
                                  });
                                  setMembers((prevMembers) => {
                                    const updatedMembers = [...prevMembers];
                                    updatedMembers[index] = {
                                      ...updatedMembers[index],
                                      member: value,
                                    };
                                    return updatedMembers;
                                  });
                                  formik.setFieldValue(
                                    `members.${index}.member`,
                                    value,
                                  );
                                }}
                                // onChange={(v) =>
                                //   formik.setFieldValue(
                                //     `members.${index}.member`,
                                //     v,
                                //   )
                                // }
                                allowClear
                                options={employeesSelection}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={11}>
                            <Form.Item
                              name={`members[${index}].role`}
                              id={`members[${index}].role`}
                              // name={`members`}
                              label={t('PROJECTS.ROLE')}
                              help={
                                formik.errors.members &&
                                formik.touched.members &&
                                formik.touched.members[index]?.role &&
                                formik.errors.members[index]?.role && (
                                  <div className="text-danger">
                                    {formik.errors.members[index]?.role}
                                  </div>
                                )
                              }
                              validateFirst
                              // rules={[yupSync]}
                              // hasFeedback
                            >
                              <Select
                                placeholder={t('PROJECTS.SELECT_ROLE')}
                                onChange={(value) => {
                                  arrayHelpers.replace(index, {
                                    ...values.members[index],
                                    role: value,
                                  });
                                  setMembers((prevMembers) => {
                                    const updatedMembers = [...prevMembers];
                                    updatedMembers[index] = {
                                      ...updatedMembers[index],
                                      role: value,
                                    };
                                    return updatedMembers;
                                  });
                                  formik.setFieldValue(
                                    `members.${index}.role`,
                                    value,
                                  );

                                  console.log(values.members);
                                }}
                                // onChange={(v) => {
                                //   formik.setFieldValue(
                                //     `members.${index}.role`,
                                //     v,
                                //   );
                                // }}
                                allowClear
                                options={roleSelection}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={1}>
                            {values.members.length > 1 ? (
                              <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => {
                                  arrayHelpers.remove(index);
                                  values.members.splice(index, 1);
                                  setMembers((prev) => {
                                    const updatedMembers = [...prev];
                                    updatedMembers.splice(index, 1);
                                    return updatedMembers;
                                  });
                                  formik.setFieldValue(`members`, [
                                    ...values.members,
                                  ]);
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
                          values.members.push(emptyMember);
                          formik.setFieldValue(`members`, [...values.members]);
                          setMembers((prev) => [...prev, emptyMember]);
                        }}
                        icon={<PlusOutlined />}
                        className="button ant-btn-primary"
                      >
                        {t('BUTTON.ADD_MEMBER')}
                      </Button>
                    </Form.Item>
                  </div>
                )}
              </FieldArray>
              {/* <button type="submit">Submit</button> */}
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default CreateProject;

// import { Field, FieldArray, Form, Formik } from 'formik';
// import React from 'react';

// // Here is an example of a form with an editable list.
// // Next to each input are buttons for insert and remove.
// // If the list is empty, there is a button to add an item.
// const CreateProject = () => (
//   <div>
//     <h1>Friend List</h1>
//     <Formik
//       initialValues={{ friends: ['jared', 'ian', 'brent'] }}
//       onSubmit={(values) =>
//         setTimeout(() => {
//           alert(JSON.stringify(values, null, 2));
//         }, 500)
//       }
//       render={({ values }) => (
//         <Form>
//           <FieldArray
//             name="friends"
//             render={(arrayHelpers) => (
//               <div>
//                 {values.friends && values.friends.length > 0 ? (
//                   values.friends.map((friend, index) => (
//                     <div key={index}>
//                       <Field name={`friends.${index}`} />
//                       <button
//                         type="button"
//                         onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
//                       >
//                         -
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => arrayHelpers.insert(index, '')} // insert an empty string at a position
//                       >
//                         +
//                       </button>
//                     </div>
//                   ))
//                 ) : (
//                   <button type="button" onClick={() => arrayHelpers.push('')}>
//                     {/* show this when user has removed all friends from the list */}
//                     Add a friend
//                   </button>
//                 )}
//                 <div>
//                   <button type="submit">Submit</button>
//                 </div>
//               </div>
//             )}
//           />
//         </Form>
//       )}
//     />
//   </div>
// );
// export default CreateProject;
