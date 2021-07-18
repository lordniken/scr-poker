export const sortByKey = (key) => {
  return (a, b) => {
    if (a[key].toLowerCase() < b[key].toLowerCase()) {
      return -1;
    }
    if (a[key].toLowerCase() > b[key].toLowerCase()) {
      return 1;
    }

    return 0;
  };
};
