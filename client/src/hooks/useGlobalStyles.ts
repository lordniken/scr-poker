import { makeStyles } from '@material-ui/core';

const useGlobalStyles = makeStyles(theme => ({
  '@global': {
    '*': {
      boxSizing: 'border-box'
    },
    'html, body, #root': {
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0
    },
    body: {
      backgroundColor: theme.palette.background.default
    }
  }
}));

export default useGlobalStyles;
