import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Kiểm tra định dạng mật khẩu: 8-15 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt
export function validatePassword(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/;
  return regex.test(password);
}

// Kiểm tra số điện thoại Việt Nam: 10 số, bắt đầu bằng 03/05/07/08/09
export function validatePhoneNumber(phone: string): boolean {
  const regex = /^0[35789]\d{8}$/;
  return regex.test(phone);
}

// Kiểm tra họ tên: 2-50 ký tự, chỉ chứa chữ cái và dấu cách
export function validateFullName(fullName: string): boolean {
  const regex = /^[\p{L}\s]{2,50}$/u;
  return regex.test(fullName);
}

// Generate a 6-digit ID based on UUID and Role
export function formatAccountID(uuidOrCode: string, role: string): string {
  if (!uuidOrCode) return '';
  
  // If the provided string is already an account code (e.g. from the database), return it
  if (/^(AD|ST|TU|LE|UN)\d{6}$/.test(uuidOrCode)) {
      return uuidOrCode;
  }
  
  // Create a simple numeric hash from the UUID string as a fallback
  let hash = 0;
  for (let i = 0; i < uuidOrCode.length; i++) {
    hash = (hash << 5) - hash + uuidOrCode.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Get a positive 6 digit number
  const numericId = Math.abs(hash) % 1000000;
  const paddedId = numericId.toString().padStart(6, '0');
  
  // Get Role Prefix
  let prefix = 'UN';
  switch(role?.toUpperCase()) {
      case 'ADMIN': prefix = 'AD'; break;
      case 'STAFF': prefix = 'ST'; break;
      case 'TUTOR': prefix = 'TU'; break;
      case 'LEARNER': prefix = 'LE'; break;
  }
  
  return `${prefix}${paddedId}`;
}
