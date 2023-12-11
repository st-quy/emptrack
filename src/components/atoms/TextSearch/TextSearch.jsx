import './TextSearch.scss';
import { Input } from 'antd';

import { useTranslation } from 'react-i18next';
const TextSearch = ({ label, func }) => {
  const { t } = useTranslation();

  return (
    <Input
      allowClear
      id="outlined-search"
      label={label}
      size="medium"
      placeholder={t('TEXT_SEARCH.TYPE', { label })}
      onChange={func}
    />
  );
};
export default TextSearch;
