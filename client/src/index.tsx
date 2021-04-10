import React from 'react';
import ReactDOM from 'react-dom';
import { RootContainer } from 'containers';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from 'global';

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <RootContainer />
  </MuiThemeProvider>, 
  document.getElementById('root'),
);
