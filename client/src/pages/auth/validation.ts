import * as Yup from 'yup';

export const authValidationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
});
