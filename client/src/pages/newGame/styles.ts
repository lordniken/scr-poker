import { makeStyles } from '@material-ui/core';

export const newGameStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4, 6),
    border: `1px solid ${theme.palette.grey[300]}`,
  },
  list: {
    background: theme.palette.background.default,
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.grey[300]}`,
  },
  listItems: {
    overflowY: 'auto',
    height: 200,
  },
}));