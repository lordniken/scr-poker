import React from 'react';
import { useQuery } from '@apollo/client';
import MeQuery from './MeQuery.graphql';

interface IAuthContext {
  isAuth: boolean;
}

export const AuthContext = React.createContext<IAuthContext>({
  isAuth: false,
});

export const AuthProvider: React.FC = ({ children }) => {
  const { data, loading } = useQuery(MeQuery, {
    notifyOnNetworkStatusChange: true,
  });
  const [isAuth, setAuth] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(loading);
    setAuth(!!data);
  }, [data, loading, isAuth]);

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
