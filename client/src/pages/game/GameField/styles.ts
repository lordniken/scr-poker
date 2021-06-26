import { makeStyles } from '@material-ui/core';

export const gameFieldStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    justifyContent: 'center',
  },
  table: {
    padding: theme.spacing(10),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.grey[300]}`,
    width: '100%',
    margin: '0 20%',
    order: 2,
  },
  userCard: {
    padding: theme.spacing(2, 4),
    width: 100,
    textAlign: 'center',
    overflow: 'hidden',
  },
}));