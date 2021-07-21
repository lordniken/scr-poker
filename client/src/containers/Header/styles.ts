import { makeStyles } from '@material-ui/core';

export const headerStyles = makeStyles((theme) => ({
  header: {
    borderBottom: `2px solid ${theme.palette.primary.dark}`,
  },
  title: {
    flexGrow: 1,
    textShadow: `1px 1px 1px ${theme.palette.common.black}`,
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  username: {
    textShadow: `1px 1px 1px ${theme.palette.common.black}`,
  },
}));