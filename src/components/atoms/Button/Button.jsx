import { Button as ButtonAntd } from 'antd';

import './Button.scss';

const Button = ({ children, ...props }) => {
  const className = props.className ? props.className : '';
  return (
    <ButtonAntd {...props} className={`button ${className}`}>
      {children}
    </ButtonAntd>
  );
};
export default Button;
