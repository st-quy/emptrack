import { notification } from 'antd';

export const Toast = (type, message, duration = 3) => {
  notification[type]({
    message: message,
    duration: duration,
  });
};
