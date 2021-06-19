declare type TRoute = {
  path: string;
  exact?: boolean;
  private?: boolean;
  component: React.ComponentType;
  defaultRoute?: boolean;
};
