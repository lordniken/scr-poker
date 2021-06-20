import { useLocation } from 'react-router-dom';

const useGameIdSelector = () => {
  const { pathname } = useLocation();

  if (!pathname.match('/game')) {
    return null;
  }

  return pathname.split('/')[2];
};

export default useGameIdSelector;
