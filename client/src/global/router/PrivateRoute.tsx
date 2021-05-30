import React from 'react';
import { TRoute } from 'types';
import RedirectRoute from './RedirectRoute';

const PrivateRoute = (props: TRoute) => {
  const isAuth = false;

  return <RedirectRoute routeProps={props} redirect="/" condition={isAuth} />;
};

export default PrivateRoute;
