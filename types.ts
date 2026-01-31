
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
  // Propiedades
  HOUSE = 'Vivienda',
  COMMERCIAL = 'Local Comercial',
  STORAGE = 'Trastero/Garaje',
  // Vehículos
  VEHICLE_CAR = 'Coche',
  VEHICLE_MOTO = 'Moto',
  // Finanzas
  CREDIT_CARD = 'Tarjeta de Crédito',
  LOAN = 'Préstamo/Hipoteca',
  // Seguros
  INSURANCE_HOME = 'Seguro de Hogar',
  INSURANCE_LIFE = 'Seguro de Vida',
  INSURANCE_MEDICAL = 'Seguro Médico',
  INSURANCE_AUTO = 'Seguro de Auto'
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  detail?: string; // Dirección, Modelo, o Número de cuenta
  limit?: number;  // Para tarjetas
  provider?: string;
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
}

export interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export interface ConsumerRight {
  title: string;
  description: string;
  lawReference: string;
}

export interface AIRecommendation {
  category: Category;
  currentCost: number;
  potentialCost: number;
  reasoning: string;
  action: string;
}
