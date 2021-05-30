import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface IRedirectRouteProps {
  condition?: boolean;
  redirect: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routeProps?: any;
}

const RedirectRoute: React.FunctionComponent<IRedirectRouteProps> = ({
  condition,
  redirect,
  routeProps,
}) => {
  const { component: Comp, ...restProps } = routeProps;

  return condition ? (
    <Route {...restProps} render={(props) => <Comp {...props} />} />
  ) : (
    <Redirect
      to={
        !routeProps.location
          ? redirect
          : {
            pathname: redirect,
            state: {
              from: routeProps.location,
            },
          }
      }
    />
  );
};

export default RedirectRoute;
