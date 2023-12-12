import * as Yup from 'yup';

export const validationSchema = Yup.object({
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
});