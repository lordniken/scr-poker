import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useGlobalStyles } from 'hooks';
import { renderRoutes, routes } from 'global/router';

const renderedRoutes = renderRoutes(routes);

const Root: React.FC = () => {
  useGlobalStyles();
  
  return (
    <BrowserRouter>
      {renderedRoutes}
    </BrowserRouter>
  );
};

export default Root;