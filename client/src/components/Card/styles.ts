import { makeStyles } from '@material-ui/core';

export const cardStyles = makeStyles((theme) => ({
  card: {
    width: 50,
    height: 80,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(1),
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.common.white,
    '&:disabled': {
      borderColor: theme.palette.grey[300],
      color: theme.palette.grey[300],
      backgroundColor: 'inherit',
    },
  },
  selected: {
    backgroundColor: theme.palette.primary.light + ' !important',
    borderColor: theme.palette.primary.light + ' !important',
    color: theme.palette.primary.contrastText + ' !important',
  },
}));
