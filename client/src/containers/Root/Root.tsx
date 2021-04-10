import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useGlobalStyles } from 'hooks';
import { AuthPage } from 'pages';

const Root: React.FC = () => {
  useGlobalStyles();
  
  return (
    <BrowserRouter>
      <Switch>
        <Route>
          <AuthPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Root;