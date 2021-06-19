import React from 'react';
import RedirectRoute from './RedirectRoute';

const PublicRoute = (props: TRoute) => {
  const isAuth = false;

  return <RedirectRoute routeProps={props} redirect="/dashboard" condition={!isAuth} />;
};

export default PublicRoute;
