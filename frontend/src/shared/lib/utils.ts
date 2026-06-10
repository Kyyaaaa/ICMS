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
