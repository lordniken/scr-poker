import React from 'react';
import { Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

export const addIndexPath = (path: string): string => `(${path}|/)`;

export const renderRoutes = (routes: TRoute[]) =>
  routes.map(({ path, component, defaultRoute, exact, ...rest }) => {
    if (!rest.private) {
      return (
        <PublicRoute
          key={path}
          component={component}
          path={defaultRoute ? addIndexPath(path) : path}
          exact={exact}
        />
      );
    }

    if (rest.private) {
      return (
        <PrivateRoute
          key={path}
          component={component}
          path={defaultRoute ? addIndexPath(path) : path}
          exact={exact}
        />
      );
    }

    return (
      <Route
        key={path}
        component={component}
        path={defaultRoute ? addIndexPath(path) : path}
        exact={exact}
      />
    );
  });
