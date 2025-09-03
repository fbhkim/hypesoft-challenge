import { Product } from './Product';

export interface DashboardData {
  totalProducts: number;
  totalStockValue: number;
  lowStockProducts: Product[];
  productsByCategory: Record<string, number>;
}