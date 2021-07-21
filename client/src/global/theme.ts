import { createMuiTheme } from '@material-ui/core';
import { Shadows } from '@material-ui/core/styles/shadows';

export default createMuiTheme({
  props: {},
  shadows: Array(25).fill('none') as Shadows,
  typography: {
    h1: {
      fontSize: '1.5rem',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
  },
  palette: {
    background: {
      default: '#EFEFEF',
      paper: '#F7F7F7',
    },
    primary: {
      main: '#6186BC',
      dark: '#5F789D',
    },
    secondary: {
      main: '#BC6161',
    },
  },
});
