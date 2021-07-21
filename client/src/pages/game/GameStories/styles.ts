import { makeStyles } from '@material-ui/core';

export const gameStoriesStyles = makeStyles((theme) => ({
  root: {
    borderLeft: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(2),
    width: 500,
  },
  completedStory: {
    color: theme.palette.grey[500],
  },
}));