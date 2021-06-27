import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { useGlobalStyles } from 'hooks';
import { getValue } from 'utils';
import { renderRoutes, routes } from 'global/router';
import { AuthProvider } from '../Auth';

const getProtocol = {
  get http() {
    return window.location.protocol === 'https:' ? 'https' : 'http';
  },
  get ws() {
    return window.location.protocol === 'https:' ? 'wss' : 'ws';
  },
};

const authLink = setContext((_, { headers }) => {
  const token = getValue('scr-poker-token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = createHttpLink({
  uri: `${getProtocol.http}://${window.location.hostname}:${window.location.port}/graphql`,
});

const wsLink = () => {
  const token = getValue('scr-poker-token');
  
  return new WebSocketLink({
    uri: `${getProtocol.ws}://${window.location.hostname}:${window.location.port}/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink(),
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link: splitLink,
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