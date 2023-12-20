import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import { Breadcrumb as BreadcrumbAntd } from 'antd';
import { Link } from 'react-router-dom';
import './Breadcrumb.scss';
import { useTranslation } from 'react-i18next';

const { Item } = BreadcrumbAntd;

const Breadcrumb = ({ items }) => {
  const { t } = useTranslation();
  return (
    <BreadcrumbAntd
      style={{ paddingTop: 15, paddingBottom: 10 }}
      separator={<RightOutlined style={{ fontSize: 10 }} />}
    >
      <Item>
        <Link to="/dashboard">
          <HomeOutlined />
        </Link>
      </Item>
      {items.map(({ key, route, title }, index, items) => {
        return (
          <Item key={index}>
            <Link to={route ?? `/${key}`}>
              {t(`BREADCRUMB.${key.toUpperCase()}`)} {title}
            </Link>
          </Item>
        );
      })}
    </BreadcrumbAntd>
  );
};
export default Breadcrumb;
