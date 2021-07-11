import React from 'react';
import useAuth from 'hooks/useAuth';
import RedirectRoute from './RedirectRoute';
import useRedirectedPath from './useRedirectedPath';

const PublicRoute = (props: TRoute) => {
  const { isAuth } = useAuth();
  const redirectedPath = useRedirectedPath();
  
  return <RedirectRoute routeProps={props} redirect={redirectedPath} condition={!isAuth} />;
};

export default PublicRoute;
