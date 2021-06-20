import { Auth, Dashboard, Game, NewGame } from 'pages';

const routes: TRoute[] = [
  {
    path: '/',
    exact: true,
    component: Auth,
    private: false,
    defaultRoute: true,
  },
  {
    path: '/dashboard',
    title: 'Dashboard',
    exact: true,
    component: Dashboard,
    private: true,
  },   
  {
    path: '/new-game',
    title: 'New game',
    exact: true,
    component: NewGame,
    private: true,
  },
  {
    path: '/game',
    title: 'Game',
    exact: false,
    component: Game,
    private: true,
  },  
];

export default routes;
