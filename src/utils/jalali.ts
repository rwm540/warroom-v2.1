// Jalali Solar Hijri and Iranian Validation Helpers

export function validateNationalCode(code: string): boolean {
  if (!/^\d{10}$/.test(code)) return false;
  
  // Check if all digits are the same e.g. 1111111111
  if (/^(\d)\1{9}$/.test(code)) return false;

  const check = parseInt(code[9], 10);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(code[i], 10) * (10 - i);
  }
  const remainder = sum % 11;

  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
}

export function validatePhoneNumber(phone: string): boolean {
  return /^09\d{9}$/.test(phone.trim());
}

export function validateJalaliDate(dateStr: string): boolean {
  // Format: YYYY/MM/DD or YYYY-MM-DD
  const parts = dateStr.replace(/-/g, '/').split('/');
  if (parts.length !== 3) return false;
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
  if (year < 1330 || year > 1403) return false;
  if (month < 1 || month > 12) return false;
  if (month <= 6 && (day < 1 || day > 31)) return false;
  if (month > 6 && (day < 1 || day > 30)) return false;

  return true;
}

export function generatePersonalCode(): string {
  // Generates 9-digit unique numerical personal code
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

export function generateRegistrationCode(): string {
  // Generates squad code like WRS-8942
  return `WRS-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function getCurrentJalaliDate(): string {
  const today = new Date();
  const year = 1403; // Static approximate current year for demo consistency
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export function getJalaliDate(): string {
  return getCurrentJalaliDate();
}

export function formatToPersianDigits(numStr: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(numStr).replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}
