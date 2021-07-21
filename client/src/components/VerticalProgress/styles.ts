import { makeStyles } from '@material-ui/core';
import { IProps } from './types';

export const verticalProgressStyles = makeStyles((theme) => ({
  root: ({ highlighted, progress }: IProps) => ({
    width: 8,
    height: 80,
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    position: 'relative',
    boxSizing: 'initial',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 6,
      height: `${progress}%`,
      bottom: 0,
      backgroundColor: theme.palette.primary.main,
      borderRadius: theme.spacing(1),
      margin: 1,
      opacity: highlighted ? 1 : .3,
    },
  }),
}));
