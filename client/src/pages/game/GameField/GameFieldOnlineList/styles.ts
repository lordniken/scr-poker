import { makeStyles } from '@material-ui/core';

export const gameFieldOnlineListStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  userCard: {
    padding: theme.spacing(2, 4),
    width: 100,
    textAlign: 'center',
    overflow: 'hidden',
    alignItems: 'center',
  },
  username: {
    paddingTop: theme.spacing(1),
  },
}));