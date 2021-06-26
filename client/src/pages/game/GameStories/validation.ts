import * as Yup from 'yup';

export const storieValidationSchema = Yup.object().shape({
  storieId: Yup.string().required('Storie is required'),
});
