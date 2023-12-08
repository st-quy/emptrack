import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const ValidationSchema = () => {
  const { t } = useTranslation();

  return Yup.object({
    name: Yup.string()
      .required(t('EMPLOYEE_VALIDATION.NAME_REQUIRED'))
      .matches(
        /^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý]+( [A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý]+)*$/,
        t('EMPLOYEE_VALIDATION.NAME_MATCH_CAPITAL_LETTER'),
      )
      .matches(/\s/, t('EMPLOYEE_VALIDATION.NAME_MATCH_SPACE')),
    email: Yup.string().required(t('EMPLOYEE_VALIDATION.EMAIL_REQUIRED')),
    phone: Yup.string()
      .matches(/^0\d{9}$/, t('EMPLOYEE_VALIDATION.PHONE_MATCH'))
      .required(t('EMPLOYEE_VALIDATION.PHONE_REQUIRED')),
    gender: Yup.string().required(t('EMPLOYEE_VALIDATION.GENDER_REQUIRED')),
    status: Yup.string().required(t('EMPLOYEE_VALIDATION.STATUS_REQUIRED')),
    isManager: Yup.boolean().required(
      t('EMPLOYEE_VALIDATION.IS_MANAGER_REQUIRED'),
    ),
    position: Yup.string().required(t('EMPLOYEE_VALIDATION.POSITION_REQUIRED')),
    lineManager: Yup.string().required(
      t('EMPLOYEE_VALIDATION.LINE_MANAGER_REQUIRED'),
    ),
    birth: Yup.date()
      .max(new Date(), t('EMPLOYEE_VALIDATION.BIRTH_MAX'))
      .test('age', t('EMPLOYEE_VALIDATION.BIRTH_ENOUGH_AGE'), function (value) {
        const today = new Date();
        const minBirthDate = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate(),
        );
        return value <= minBirthDate;
      })
      .required(t('EMPLOYEE_VALIDATION.BIRTH_REQUIRED')),
    description: Yup.string().required(
      t('EMPLOYEE_VALIDATION.DESCRIPTION_REQUIRED'),
    ),
    address: Yup.string().required(t('EMPLOYEE_VALIDATION.ADDRESS_REQUIRED')),
    citizen_card: Yup.string()
      .matches(/^[0-9]{10}$/, t('EMPLOYEE_VALIDATION.CITIZEN_CARD_MATCH'))
      .required(t('EMPLOYEE_VALIDATION.CITIZEN_CARD_REQUIRED')),
    skills: Yup.array().of(
      Yup.object().shape({
        skillname: Yup.string().required(
          t('EMPLOYEE_VALIDATION.SKILL_REQUIRED'),
        ),
        exp: Yup.string().required(t('EMPLOYEE_VALIDATION.EXP_REQUIRED')),
      }),
    ),
  });
};

export default ValidationSchema;
