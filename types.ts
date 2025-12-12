
export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifsc: string;
}

export interface FinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  countryCode: string;
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  profession: string;
  password?: string;
  createdAt?: string;
  isAdmin?: boolean;
  
  // Extended Profile
  bankDetails?: BankDetails;
  financialData?: FinancialData;
  goals?: string[];
  watchlist?: string[]; // Array of stock symbols
  savingsJarBalance?: number; // New field for Savings Jar
}

export interface CountryData {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
  digits: number[]; // Array of valid lengths
}

export enum ViewState {
  LOGIN,
  SIGNUP,
  LINK_BANK,
  FINANCIAL_PROFILE,
  SET_GOALS,
  DASHBOARD,
  ADMIN_DASHBOARD
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}