export const validator = {
  password: (password: string): boolean => {
    return /(?=.*[A-za-z])(?=.*[0-9])[A-Za-z\d]{6,}/.test(password);
  },
  email: (email: string): boolean => {
    return /^[a-zA-Z0-9.!#$%&'*+\=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
  },
};
