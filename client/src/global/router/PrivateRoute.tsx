import useAuth from 'hooks/useAuth';
import React from 'react';
import { useLocation } from 'react-router-dom';
import RedirectRoute from './RedirectRoute';

const PrivateRoute = (props: TRoute) => {
  const { pathname } = useLocation();
  const path = React.useMemo(() => pathname === '/' ? '/new-game' : pathname, []);
  const { isAuth } = useAuth();

  return <RedirectRoute routeProps={props} redirect={`/?redirect=${path}`} condition={isAuth} />;
};

export default PrivateRoute;
