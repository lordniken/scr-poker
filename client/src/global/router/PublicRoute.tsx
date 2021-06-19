import React from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import RedirectRoute from './RedirectRoute';

const PublicRoute = (props: TRoute) => {
  const { isAuth } = useAuth();
  const { pathname } = useLocation();  

  return <RedirectRoute routeProps={props} redirect={pathname === '/' ? '/new-game' : pathname} condition={!isAuth} />;
};

export default PublicRoute;
