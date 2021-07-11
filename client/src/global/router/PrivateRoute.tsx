import useAuth from 'hooks/useAuth';
import React from 'react';
import RedirectRoute from './RedirectRoute';
import useRedirectedPath from './useRedirectedPath';

const PrivateRoute = (props: TRoute) => {
  const { isAuth } = useAuth();
  const redirectedPath = useRedirectedPath();

  return <RedirectRoute routeProps={props} redirect={`/?redirect=${redirectedPath}`} condition={isAuth} />;
};

export default PrivateRoute;
