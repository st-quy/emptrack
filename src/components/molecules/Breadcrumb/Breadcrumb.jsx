import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import { Breadcrumb as BreadcrumbAntd } from 'antd';
import { Link } from 'react-router-dom';
import './Breadcrumb.scss';

const { Item } = BreadcrumbAntd;

export const Breadcrumb = ({ items }) => {
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
        if (index === items.length - 1) {
          return (
            <Item key={index}>
              {key} {title}
            </Item>
          );
        }

        return (
          <Item key={index}>
            <Link to={route ?? `/${key}`}>
              {key} {title}
            </Link>
          </Item>
        );
      })}
    </BreadcrumbAntd>
  );
};
