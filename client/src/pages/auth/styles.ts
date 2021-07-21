import { makeStyles } from '@material-ui/core';

export const authStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 100,
  },
  paper: {
    padding: theme.spacing(4),
    border: `1px solid ${theme.palette.grey[300]}`,
  },
  form: {
    margin: theme.spacing(4, 0),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
}));