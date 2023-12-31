import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import dayjs from 'dayjs';

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
    email: Yup.string()
      .required(t('EMPLOYEE_VALIDATION.EMAIL_REQUIRED'))
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        t('EMPLOYEE_VALIDATION.EMAIL_INVALID'),
      ),
    phone: Yup.string()
      .matches(/^0\d{9}$/, t('EMPLOYEE_VALIDATION.PHONE_MATCH'))
      .required(t('EMPLOYEE_VALIDATION.PHONE_REQUIRED')),
    gender: Yup.string().required(t('EMPLOYEE_VALIDATION.GENDER_REQUIRED')),
    status: Yup.string().required(t('EMPLOYEE_VALIDATION.STATUS_REQUIRED')),
    isManager: Yup.boolean().required(
      t('EMPLOYEE_VALIDATION.IS_MANAGER_REQUIRED'),
    ),
    position: Yup.string().required(t('EMPLOYEE_VALIDATION.POSITION_REQUIRED')),
    birth: Yup.string()
      .transform((value, originalValue) => {
        // Chuyển đổi định dạng ngày thành 'DD-MM-YYYY'
        if (originalValue && dayjs(originalValue, 'DD-MM-YYYY').isValid()) {
          return dayjs(originalValue, 'DD-MM-YYYY').format('DD-MM-YYYY');
        }
        return value;
      })
      .test(
        'birth',
        t('EMPLOYEE_VALIDATION.BIRTH_ENOUGH_AGE'),
        function (value) {
          const today = new Date();
          const minBirthDate = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate(),
          );

          const birthDate = dayjs(value, 'DD-MM-YYYY').toDate();

          const isOldEnough = birthDate <= minBirthDate;
          const isValidDate = dayjs(value, 'DD-MM-YYYY').isValid();

          return isValidDate && isOldEnough;
        },
      )
      .required(t('EMPLOYEE_VALIDATION.BIRTH_REQUIRED')),
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
