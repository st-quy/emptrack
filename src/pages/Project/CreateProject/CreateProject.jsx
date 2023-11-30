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
  Table,
  Typography,
} from 'antd';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';
import Breadcrumb from '../../../components/molecules/Breadcrumb/Breadcrumb';
import './CreateProject.scss';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Text } = Typography;

const options = [];
for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}
const data = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Brown',
  },
  // {
  //   key: '2',
  //   firstName: 'Jim',
  //   lastName: 'Green',
  // },
  // {
  //   key: '3',
  //   firstName: 'Joe',
  //   lastName: 'Black',
  // },
];

const CreateProject = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const breadcrumbItems = [
    { key: 'projects' },
    { key: 'projects_create', route: '/projects/create' },
  ];
  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: () => (
        <Select
          mode="multiple"
          placeholder={t('PROJECTS.SELECT_MEMBER')}
          // onChange={handleChange}
          style={{
            width: '100%',
          }}
          allowClear
          maxTagCount={4}
          options={options}
        />
      ),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: () => (
        <Select
          mode="multiple"
          placeholder={t('PROJECTS.SELECT_ROLE')}
          // onChange={handleChange}
          style={{
            width: '100%',
          }}
          allowClear
          maxTagCount={4}
          options={options}
        />
      ),
    },
  ];
  return (
    <div id="project_create">
      <Space>
        <Breadcrumb items={breadcrumbItems} />
        <Button>{t('BUTTON.SAVE')}</Button>
      </Space>

      <Card
        className="card-create-project"
        title={t('BREADCRUMB.PROJECTS_CREATE').toUpperCase()}
      >
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
          layout="horizontal"
          className="p-4"
        >
          <Row className="w-100" gutter={16}>
            <Col span={12}>
              <Form.Item label={t('PROJECTS.NAME')}>
                <Input placeholder={t('PROJECTS.NAME')} />
              </Form.Item>
              <Form.Item label={t('PROJECTS.MANAGER')}>
                <Select
                  // mode="multiple"
                  placeholder={t('PROJECTS.SELECT_MANAGER')}
                  // onChange={handleChange}
                  style={{
                    width: '100%',
                  }}
                  allowClear
                  maxTagCount={4}
                  options={options}
                />
              </Form.Item>
              <Form.Item label={t('PROJECTS.DESCRIPTION')}>
                <TextArea
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
                />
              </Form.Item>
              <Form.Item label={t('PROJECTS.STATUS')}>
                <Radio.Group>
                  <Radio value="active"> {t('PROJECTS.STATUS_ACTIVE')} </Radio>
                  <Radio value="inactive">
                    {' '}
                    {t('PROJECTS.STATUS_INACTIVE')}{' '}
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label={t('PROJECTS.TECHNICAL')}>
                <Input placeholder={t('PROJECTS.TECHNICAL')} />
              </Form.Item>
            </Col>
          </Row>
          <Row className="w-100" gutter={16}>
            <Col span={24}>
              <Space className="p-2">
                <Text className="w-100">{t('PROJECTS.MEMBER')}</Text>
                <Button className="button ant-btn-primary">
                  {t('BUTTON.ADD_MEMBER')}
                </Button>
              </Space>
              <Table
                dataSource={data}
                pagination={false}
                showHeader={false}
                columns={columns}
              ></Table>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default CreateProject;
