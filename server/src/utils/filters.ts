export const replaceValues = (
  arr: Array<Record<string, any>>,
  key,
  oldValues: Array<string>,
  newValues: Array<string>,
) => {
  return arr?.map((item) => {
    if (oldValues.includes(item[key])) {
      const itemIndex = oldValues.indexOf(item[key]);

      return {
        ...item,
        [key]: newValues[itemIndex],
      };
    }
    return item;
  });
};
