const USERNAME_MAX_LENGTH = 25;

export const isCorrectUsername = (username: string): boolean => {
  // return !!username.match('^[A-Za-z0-9 ]+$');

  return username.length <= USERNAME_MAX_LENGTH;
};
