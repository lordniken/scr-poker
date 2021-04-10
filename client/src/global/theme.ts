import { createMuiTheme } from '@material-ui/core';
import { Shadows } from '@material-ui/core/styles/shadows';

export default createMuiTheme({
  props: {},
  shadows: Array(25).fill('none') as Shadows,
  typography: {
    h1: {
      fontSize: '2.5rem',
    }
  },
  palette: {
    background: {
      default: '#f5fafd',
    }
  },
});