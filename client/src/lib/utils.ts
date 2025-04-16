import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function validateVIN(vin: string): boolean {
  // Basic VIN validation - 17 alphanumeric characters excluding I, O, Q
  if (!vin) return true; // Empty VIN is considered valid (as it's optional)
  
  // Remove spaces and convert to uppercase
  const cleanVin = vin.replace(/\s/g, '').toUpperCase();
  
  // Check length
  if (cleanVin.length !== 17) return false;
  
  // Check for invalid characters (I, O, Q)
  if (/[IOQ]/.test(cleanVin)) return false;
  
  // Check for alphanumeric characters only
  if (!/^[A-HJ-NPR-Z0-9]+$/.test(cleanVin)) return false;
  
  return true;
}

export function formatPhoneNumber(value: string): string {
  if (!value) return value;
  
  // Remove all non-numeric characters
  const phoneNumber = value.replace(/[^\d]/g, '');
  
  // Format the phone number as (XXX) XXX-XXXX
  if (phoneNumber.length < 4) return phoneNumber;
  if (phoneNumber.length < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidZipCode(zip: string): boolean {
  // US ZIP code pattern: 5 digits or 5+4 format (XXXXX or XXXXX-XXXX)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
}
