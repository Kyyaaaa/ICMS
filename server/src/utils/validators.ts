import validator from 'validator';

export const validateEmail = (email: string) => {
  return validator.isEmail(email);
};

export const validatePassword = (password: string) => {
  // Tối thiểu 8 ký tự, tối đa 15 ký tự. Bao gồm số, chữ thường, chữ in hoa và ký tự đặc biệt
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/;
  return regex.test(password);
};

export const validatePhoneNumber = (phone: string) => {
  const regex = /^0[35789]\d{8}$/;
  return regex.test(phone);
};

export const validateFullName = (fullName: string) => {
  const regex = /^[\p{L}\s]{2,50}$/u;
  return regex.test(fullName);
};

export const validateRole = (role: string) => {
  const allowedRoles = ['ADMIN', 'STAFF', 'TUTOR', 'LEARNER'];
  return allowedRoles.includes(role.toUpperCase());
};

export const validateDateOfBirth = (dob: string) => {
  return validator.isISO8601(dob, { strict: true, strictSeparator: true });
};

export const validateGender = (gender: string) => {
  const allowed = ['MALE', 'FEMALE', 'OTHER'];
  return allowed.includes(gender.toUpperCase());
};

export const validateAvatarUrl = (url: string) => {
  return validator.isURL(url, { require_protocol: true });
};

export const validateOtp = (otp: string) => {
  const regex = /^\d{6}$/;
  return regex.test(otp);
};

export const validateUUID = (uuid: string) => {
  return validator.isUUID(uuid);
};
