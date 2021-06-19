// eslint-disable-next-line no-unused-vars
declare type TRoute = {
  path: string;
  title?: string;
  exact?: boolean;
  private?: boolean;
  component: React.ComponentType;
  defaultRoute?: boolean;
};
