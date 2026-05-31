import validator from 'validator';

export const validateEmail = (email: string) => {
  return validator.isEmail(email);
};

export const validatePassword = (password: string) => {
  // Tối thiểu 8 ký tự, tối đa 15 ký tự. Bao gồm số, chữ thường, chữ in hoa và ký tự đặc biệt
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/;
  return regex.test(password);
};
