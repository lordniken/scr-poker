// eslint-disable-next-line no-unused-vars
declare type TRoute = {
  path: string;
  exact?: boolean;
  private?: boolean;
  component: React.ComponentType;
  defaultRoute?: boolean;
};
