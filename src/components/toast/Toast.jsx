import { notification } from 'antd';

export const Toast = (type, message) => {
  notification[type]({
    message: message,
  });
};
