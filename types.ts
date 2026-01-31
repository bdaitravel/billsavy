
export enum Category {
  ELECTRICITY = 'Electricidad',
  WATER = 'Agua',
  GAS = 'Gas',
  INTERNET = 'Internet',
  MOBILE = 'Móvil',
  INSURANCE = 'Seguros',
  TAX = 'IBI / Impuestos',
  MAINTENANCE = 'Mantenimiento',
  SUBSCRIPTION = 'Suscripciones',
  FINANCE = 'Finanzas',
  OTHER = 'Otros'
}

export enum AssetType {
  HOUSE = 'Vivienda',
  COMMERCIAL = 'Local Comercial',
  STORAGE = 'Trastero/Garaje',
  VEHICLE_CAR = 'Coche',
  VEHICLE_MOTO = 'Moto',
  CREDIT_CARD = 'Tarjeta de Crédito',
  LOAN = 'Préstamo/Hipoteca',
  INSURANCE_HOME = 'Seguro de Hogar',
  INSURANCE_LIFE = 'Seguro de Vida',
  INSURANCE_MEDICAL = 'Seguro Médico',
  INSURANCE_AUTO = 'Seguro de Auto'
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  detail?: string;
  limit?: number;
  provider?: string;
  status?: 'active' | 'warning' | 'optimizing';
}

export interface Expense {
  id: string;
  assetId: string;
  category: Category;
  amount: number;
  date: string;
  provider: string;
  description: string;
  isRecurring: boolean;
  expiryDate?: string;
  predictedValue?: number;
  source?: 'manual' | 'bank' | 'email';
}

export interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
  tier: 'free' | 'premium';
  isBankConnected: boolean;
  isEmailConnected: boolean;
}

export interface AIRecommendation {
  id: string;
  category: Category;
  currentCost: number;
  potentialCost: number;
  reasoning: string;
  action: string;
  confidence: number;
  isAutomatedSwitchAvailable: boolean;
}

export interface FinancialHealth {
  score: number;
  monthlySavings: number;
  yearlyProjection: number;
  leakageAlerts: number;
}

export interface ConsumerRight {
  title: string;
  description: string;
  lawReference: string;
}
