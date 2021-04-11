import * as Yup from 'yup';

export const authValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
});
