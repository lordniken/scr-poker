import { makeStyles } from '@material-ui/core';
import { IProps } from './VerticalProgress';

export const verticalProgressStyles = makeStyles((theme) => ({
  root: (props: IProps) => ({
    width: 8,
    height: 80,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.spacing(1),
    position: 'relative',
    boxSizing: 'initial',
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 6,
      height: `${props.progress}%`,
      bottom: 0,
      backgroundColor: theme.palette.primary.main,
      borderRadius: theme.spacing(1),
      margin: 1,
    },
  }),
}));
