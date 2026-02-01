
export enum Category {
  ELECTRICITY = 'Luz',
  WATER = 'Agua',
  GAS = 'Gas',
  INTERNET = 'Fibra/Móvil',
  INSURANCE = 'Seguros',
  TAX = 'Impuestos',
  MAINTENANCE = 'Reparaciones',
  VEHICLE = 'Vehículo',
  SUBSCRIPTION = 'Suscripciones',
  FINANCE = 'Bancos',
  MORTGAGE = 'Hipoteca',
  OTHER = 'Otros'
}

export enum AssetType {
  HOUSE = 'Mi Casa',
  VEHICLE = 'Mi Vehículo',
  FINANCE = 'Mis Préstamos',
  INSURANCE = 'Mis Pólizas'
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  detail?: string;
  provider?: string;
  amount?: number;
  status: 'active' | 'empty' | 'optimizing';
}

export type AuditStatus = 'ABUSIVO' | 'OPTIMIZADO' | 'JUSTO';

export interface Expense {
  id: string;
  assetId: string;
  category: Category;
  amount: number;
  date: string;
  provider: string;
  description: string;
  isRecurring: boolean;
  source: 'manual' | 'bank' | 'email';
  auditStatus?: AuditStatus;
  auditDetail?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  birthDate?: string;
  city?: string;
  isLoggedIn: boolean;
  isBankConnected: boolean;
  isEmailConnected: boolean;
}

export interface AIRecommendation {
  id: string;
  category: string;
  currentCost: number;
  potentialCost: number;
  reasoning: string;
  action: string;
}

export interface ConsumerRight {
  title: string;
  description: string;
  lawReference: string;
}
