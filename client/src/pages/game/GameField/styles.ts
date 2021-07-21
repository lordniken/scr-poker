import { makeStyles } from '@material-ui/core';

export const gameFieldStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 0),
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    paddingBottom: theme.spacing(2),
    textAlign: 'center',
  },
  main: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));