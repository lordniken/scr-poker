import React from 'react';
import QueryString from 'query-string';
import { useLocation } from 'react-router-dom';

const useRedirectedPath = () => {
  const { pathname, search } = useLocation();
  const redirectedPath = React.useMemo(() => {
    if (search) {
      const { redirect } = QueryString.parse(search);
  
      return String(redirect);
    }
  
    return '/new-game';
  }, [search]);

  return pathname === '/' ? redirectedPath : pathname;
};

export default useRedirectedPath;
