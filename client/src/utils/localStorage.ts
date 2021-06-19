const getValue = (name: string) => localStorage.getItem(name);
const setValue = (name: string, value: string) => localStorage.setItem(name, value);

export { getValue, setValue };