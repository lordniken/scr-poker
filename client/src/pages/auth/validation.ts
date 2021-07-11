import * as Yup from 'yup';
import { AUTH } from '../../constants';

export const authValidationSchema = Yup.object().shape({
  username: Yup.string().trim().required('Username is required').max(Number(AUTH.MAX_LENGTH), 'Username is too long'),
});
