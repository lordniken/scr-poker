import * as Yup from 'yup';

export const authValidationSchema = Yup.object().shape({
  username: Yup.string().trim().required('Username is required'),
});
