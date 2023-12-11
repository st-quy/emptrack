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
  Switch,
  Tag,
  Typography,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';
import SpinLoading from '../../../components/atoms/SpinLoading/SpinLoading';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import { axiosInstance } from '../../../config/axios';
import './DetailsProject.scss';
const { RangePicker } = DatePicker;
const { Text } = Typography;
const dateFormat = 'DD/MM/YYYY';
const DetailsProject = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [project, setProject] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const projectData = await axiosInstance
        .get(`projects/${id}`)
        .then((res) => res.data);
      setProject(projectData);
    };
    fetchData();
  }, [id]);

  function capitalizeFLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  function tagRender(props) {
    const { label, value, closable, onClose } = props;

    return (
      <Tag
        color={options.find((item) => item.value === value).color}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  }

  const options = [
    { label: 'Fullstack', value: 'Fullstack', color: 'green' },
    { label: 'Devops', value: 'Devops', color: 'blue' },
    { label: 'Backend', value: 'Backend', color: 'orange' },
    { label: 'Frontend', value: 'Frontend', color: 'geekblue' },
    { label: 'BA', value: 'BA', color: 'cyan' },
    { label: 'Tester', value: 'Tester', color: 'volcano' },
    { label: 'PO', value: 'PO', color: 'geekblue' },
    { label: 'SM', value: 'SM', color: 'purple' },
  ];
  return (
    <div id="details-project">
      {project ? (
        <>
          <Space className="w-100 justify-content-between">
            <Breadcrumb
              items={[
                { key: 'projects' },
                { key: 'projects_details', route: `/projects/details/${id}` },
              ]}
            />
            <Button onClick={() => navigate(`/projects/details/${id}`)}>
              {t('BREADCRUMB.PROJECTS_UPDATE')}
            </Button>
          </Space>

          <Card
            className="card-detail-project"
            title={t('BREADCRUMB.PROJECTS_DETAILS').toUpperCase()}
            style={{ borderRadius: '30px' }}
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
            >
              <Typography.Title level={5}>
                {t('PROJECTS.BASIC_INFORMATION')}
              </Typography.Title>
              <Row className="w-100" gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label={t('PROJECTS.NAME')}
                    initialValue={project?.name}
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    name="manager"
                    label={t('PROJECTS.MANAGER')}
                    initialValue={project?.manager[0].name}
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label={t('PROJECTS.DESCRIPTION')}
                    initialValue={project?.description}
                  >
                    <TextArea rows={4} disabled style={{ resize: 'none' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('PROJECTS.TIME')} name="dateRange">
                    <RangePicker
                      className="w-100"
                      defaultValue={[
                        dayjs(project?.startDate.toString(), dateFormat),
                        dayjs(project?.startDate.toString(), dateFormat),
                      ]}
                      format={dateFormat}
                      disabled
                    />
                  </Form.Item>
                  <Form.Item
                    name="technical"
                    label={t('PROJECTS.TECHNICAL')}
                    initialValue={project?.technical}
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item label={t('PROJECTS.STATUS')}>
                    <Radio.Group name="status" value={project?.status}>
                      <Radio value="active">
                        {t('PROJECTS.STATUS_ACTIVE')}
                      </Radio>
                      <Radio value="inactive">
                        {t('PROJECTS.STATUS_INACTIVE')}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Typography.Title level={5}>
                {t('PROJECTS.MEMBER_LIST')}:
              </Typography.Title>

              {project?.member.map((member, index) => (
                <Row className="w-100" gutter={16} key={index}>
                  <Col span={12}>
                    <Form.Item
                      name={`members[${index}].member`}
                      label={`${index + 1} - ` + t('PROJECTS.MEMBER')}
                      initialValue={member?.name}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={`members[${index}].role`}
                      label={t('PROJECTS.ROLE')}
                      initialValue={[
                        capitalizeFLetter(member?.role),
                        'Backend',
                        'Frontend',
                      ]}
                    >
                      <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        options={options}
                        tagRender={tagRender}
                        disabled
                      />
                      {/* <Tag color="magenta">
                        {capitalizeFLetter(member?.role)}
                      </Tag> */}

                      {/* <Input disabled /> */}
                    </Form.Item>
                  </Col>
                </Row>
              ))}
            </Form>
          </Card>
        </>
      ) : (
        <SpinLoading />
      )}
    </div>
  );
};

export default DetailsProject;
