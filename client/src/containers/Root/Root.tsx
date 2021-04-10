import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core';
import { useGlobalStyles } from 'hooks';
import { theme } from 'global';
import { MainPage } from 'pages';

const Root: React.FC = () => {
  useGlobalStyles();
  
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route>
            <MainPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
};

export default Root;