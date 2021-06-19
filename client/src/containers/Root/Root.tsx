import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from '@apollo/client';
import { useGlobalStyles } from 'hooks';
import { renderRoutes, routes } from 'global/router';

const renderedRoutes = renderRoutes(routes);
const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
});

const Root: React.FC = () => {
  useGlobalStyles();

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        {renderedRoutes}
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default Root;