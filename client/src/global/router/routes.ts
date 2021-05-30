import { TRoute } from 'types';
import { Auth, Dashboard } from 'pages';

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
];

export default routes;
