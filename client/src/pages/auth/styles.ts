import { makeStyles } from '@material-ui/core';

export const authStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 100,
  },
  paper: {
    padding: theme.spacing(4),
  },
  input: {
    margin: theme.spacing(4, 0),
  }
}));