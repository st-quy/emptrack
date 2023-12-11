import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

export default function SelectField(props) {
  const { t } = useTranslation();

  const [field, state, { setValue, setTouched }] = useField(props.field.name);

  // value is an array now
  const onChange = async (value) => {
    setValue(value);

    props.setMembers((prevMembers) => {
      const updatedMembers = [...prevMembers];
      updatedMembers[props.index] = {
        ...updatedMembers[props.index],
        role: value,
      };
      return updatedMembers;
    });
    props.formik.setFieldValue(`members.${props.index}.role`, value);
  };

  return (
    <Select
      {...props}
      value={state?.value}
      isMulti
      onChange={onChange}
      onBlur={setTouched}
      placeholder={t('PROJECTS.SELECT_ROLE')}
      isSearchable
      menuPlacement="auto"
    />
  );
}
