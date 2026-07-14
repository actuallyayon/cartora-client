import type { Order } from '@/features/orders/orders.types';

export interface AdminDashboardKPIs {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
}

export interface RevenueOverTimeItem {
  date: string;
  revenue: number;
  orders: number;
}

export interface SalesByCategoryItem {
  name: string;
  value: number;
}

export interface AnalyticsStats {
  kpis: AdminDashboardKPIs;
  recentOrders: Order[];
  revenueOverTime: RevenueOverTimeItem[];
  salesByCategory: SalesByCategoryItem[];
}
