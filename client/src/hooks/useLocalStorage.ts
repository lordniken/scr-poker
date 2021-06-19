import React from 'react';

const useLocalStorage = () => {
  const getValue = React.useCallback((name: string) => localStorage.getItem(name), []);
  const setValue = React.useCallback((name: string, value: string) => localStorage.setItem(name, value), []);

  return { getValue, setValue };
};

export default useLocalStorage;
