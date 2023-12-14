import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const Schema = () => {
  const { t } = useTranslation();
  const schema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .max(60, t('VALIDATE.MAX', { field: t('PROJECTS.NAME'), number: '60' }))
      .required(t('VALIDATE.REQUIRED', { field: t('PROJECTS.NAME') })),
    // description: Yup.string()
    //   .trim()
    //   .required(t('VALIDATE.REQUIRED', { field: t('PROJECTS.DESCRIPTION') })),
    technical: Yup.string()
      .trim()
      .required(t('VALIDATE.REQUIRED', { field: t('PROJECTS.TECHNICAL') })),
    dateRange: Yup.object().shape({
      startDate: Yup.string().required(
        t('VALIDATE.REQUIRED', { field: t('PROJECTS.TIME_START') }),
      ),
      endDate: Yup.string().required(
        t('VALIDATE.REQUIRED', { field: t('PROJECTS.TIME_END') }),
      ),
    }),
    manager: Yup.string()
      .trim()
      .required(t('VALIDATE.REQUIRED', { field: t('PROJECTS.MANAGER') })),
    members: Yup.array()
      .of(
        Yup.object().shape({
          member: Yup.string().required(
            t('VALIDATE.REQUIRED', { field: t('PROJECTS.MEMBER') }),
          ),
          role: Yup.array()
            .required(t('VALIDATE.REQUIRED', { field: t('ROLE.ROLE') }))
            .min(1, t('VALIDATE.MINONE', { field: t('ROLE.ROLE') })),
        }),
      )
      .min(1, t('VALIDATE.MINONE', { field: t('PROJECTS.MEMBER') })),
  });

  return schema;
};

export default Schema;
