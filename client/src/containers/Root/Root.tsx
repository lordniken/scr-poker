import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useGlobalStyles } from 'hooks';
import { getValue } from 'utils';
import { renderRoutes, routes } from 'global/router';
import { AuthProvider } from '../Auth';

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = getValue('scr-poker-token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const renderedRoutes = renderRoutes(routes);

const Root: React.FC = () => {
  useGlobalStyles();

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          {renderedRoutes}
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default Root;