import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const caviteLocations = ["Alfonso","Amadeo","Bacoor City","Carmona","Cavite City","Cavite Province","City of General Trias","Dasmariñas City","General Emilio Aguinaldo","General Mariano Alvarez","Imus City","Indang","Kawit","Magallanes","Maragondon","Mendez","Naic","Noveleta","Rosario","Silang","Tagaytay City","Tanza","Ternate","Trece Martires City"];

export const educationLevels = [
  "No grade completed",
  "Elementary Level",
  "Elementary Graduate",
  "Junior High School Level",
  "Junior High School Graduate",
  "Senior High School Level",
  "Senior High School Graduate",
  "High School Level (Non K-12)",
  "High School Graduate (Non K-12)",
  "Alternative Learning System",
  "Vocational Level",
  "College Level",
  "College Graduate",
  "Some Masteral Units",
  "Master's Degree Holder",
  "Some Doctorate Units",
];
