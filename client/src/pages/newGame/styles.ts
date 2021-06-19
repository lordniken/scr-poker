import { makeStyles } from '@material-ui/core';

export const newGameStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(6),
  },
  list: {
    background: theme.palette.background.default,
    borderRadius: theme.spacing(1),
  },
  listItems: {
    overflowY: 'auto',
    height: 150,
  },
}));