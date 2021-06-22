import { makeStyles } from '@material-ui/core';

export const gameControlsStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(6),
    width: 1000,
  },
}));