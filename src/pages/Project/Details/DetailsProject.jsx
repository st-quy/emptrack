import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Space,
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
    const colorTech = options.find((item) => item.value === value);
    const randomColor =
      options[Math.floor(Math.random() * options.length)].color;
    return (
      <Tag
        color={colorTech ? colorTech.color : randomColor}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  }

  const options = [
    { label: 'reactjs', value: 'ReactJS', color: 'green' },
    { label: 'php', value: 'PHP', color: 'purple' },
    { label: 'mongodb', value: 'MongoDB', color: 'blue' },
    { label: 'postgresql', value: 'PostgreSQL', color: 'orange' },
    { label: 'git', value: 'Git', color: 'volcano' },
    { label: 'docker', value: 'Docker', color: 'geekblue' },
    { label: 'aws', value: 'AWS', color: 'purple' },
    { label: 'kubernetes', value: 'Kubernetes', color: 'volcano' },
    { label: 'laravel', value: 'Laravel', color: 'purple' },
    { label: 'javascript', value: 'Javascript', color: 'blue' },
    { label: 'vuejs', value: 'VueJS', color: 'blue' },
    { label: 'nodejs', value: 'NodeJS', color: 'purple' },
    { label: 'typescript', value: 'TypeScript', color: 'volcano' },
    { label: 'mysql', value: 'MySQL', color: 'orange' },
  ];
  return (
    <div id="details-project">
      <Space className="w-100 justify-content-between">
        <Breadcrumb
          items={[
            { key: 'projects' },
            { key: 'projects_details', route: `/projects/details/${id}` },
          ]}
        />
        <Button onClick={() => navigate(`/projects/update/${id}`)}>
          {t('BREADCRUMB.PROJECTS_UPDATE')}
        </Button>
      </Space>

      <Card
        className="card-detail-project"
        title={t('BREADCRUMB.PROJECTS_DETAILS').toUpperCase()}
        style={{ borderRadius: '30px ' }}
      >
        {project ? (
          <>
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
                        dayjs(project?.endDate.toString(), dateFormat),
                      ]}
                      format={dateFormat}
                      disabled
                    />
                  </Form.Item>

                  <Form.Item label={t('PROJECTS.TECHNICAL')}>
                    {project?.technical.map((technical) =>
                      tagRender({
                        label: technical,
                        value: technical,
                        closable: false,
                        onClose: false,
                      }),
                    )}
                  </Form.Item>

                  <Form.Item label={t('PROJECTS.STATUS')}>
                    <Radio.Group name="status" value={project?.status}>
                      <Radio value="pending">
                        {t('PROJECTS.STATUS_PENDING')}
                      </Radio>
                      <Radio value="progress">
                        {t('PROJECTS.STATUS_IN_PROGRESS')}
                      </Radio>
                      <Radio value="completed">
                        {t('PROJECTS.STATUS_COMPLETED')}
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
                    >
                      {member.role.map((r) => {
                        return tagRender({
                          label: capitalizeFLetter(r),
                          value: r,
                          closable: false,
                          onClose: false,
                        });
                      })}
                    </Form.Item>
                  </Col>
                </Row>
              ))}
            </Form>
          </>
        ) : (
          <SpinLoading />
        )}
      </Card>
    </div>
  );
};

export default DetailsProject;
