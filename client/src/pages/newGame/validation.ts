import * as Yup from 'yup';

export const newGameValidationSchema = Yup.object().shape({
  gameName: Yup.string().trim().required('Game name is required!'),
  voteSystem: Yup.string().required('Game type is required!'),
});
