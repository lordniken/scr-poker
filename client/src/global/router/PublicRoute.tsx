import React from 'react';
import useAuth from 'hooks/useAuth';
import RedirectRoute from './RedirectRoute';

const PublicRoute = (props: TRoute) => {
  const { isAuth } = useAuth();

  return <RedirectRoute routeProps={props} redirect="/dashboard" condition={!isAuth} />;
};

export default PublicRoute;
