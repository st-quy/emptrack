import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

export default function SelectField(props) {
  const { t } = useTranslation();
  let deValue;
  if (props.index < props.members.length) {
    // deValue = props.members[props.index].role?.map((r) => {
    //   return {
    //     value: r,
    //     label: r,
    //   };
    // });
    deValue = props.members[props.index].role;
  }

  const [field, state, { setValue, setTouched }] = useField(props.field.name);

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
      defaultValue={deValue}
      options={props.options}
      isMulti
      onChange={onChange}
      onBlur={setTouched}
      placeholder={t('PROJECTS.SELECT_ROLE')}
      isSearchable
      menuPlacement="auto"
    />
  );
}
