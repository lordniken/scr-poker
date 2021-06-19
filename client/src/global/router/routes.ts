import { Auth, Dashboard, NewGame } from 'pages';

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
    exact: true,
    component: Dashboard,
    private: true,
  },   
  {
    path: '/dashboard/new-game',
    exact: true,
    component: NewGame,
    private: true,
  },  
];

export default routes;
