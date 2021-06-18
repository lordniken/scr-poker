export const isCorrectUsername = (username: string): boolean => {
  return !!username.match('^[A-Za-z0-9]+$');
};
