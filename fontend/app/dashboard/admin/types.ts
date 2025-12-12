// Admin Dashboard Types

export interface KPIMetric {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  breakdown?: BreakdownItem[];
  graphData?: number[];
}

export interface BreakdownItem {
  label: string;
  value: string;
}

export interface SystemHealthMetric {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
}

export interface Activity {
  id: string;
  type: 'order_placed' | 'order_cancelled' | 'professional_registered' | 'shop_updated' | 'payment_received' | 'complaint_created' | 'verification_submitted' | 'order_completed';
  message: string;
  user?: string;
  timestamp: string;
  details?: string;
  clickable?: boolean;
}

export interface VerificationItem {
  id: string;
  name: string;
  type: 'professional' | 'shop';
  documentType: string;
  submittedAt: string;
  status: 'pending' | 'under_review';
}

export interface Complaint {
  id: string;
  user: string;
  type: string;
  status: 'pending' | 'under_review' | 'assigned' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

export interface PaymentGateway {
  name: string;
  amount: string;
  percentage: number;
  color: string;
}

export interface Product {
  name: string;
  sales: number;
  trend: number;
}

export interface StockAlert {
  shop: string;
  product: string;
  stock: number;
  severity: 'critical' | 'low';
}

export interface ProfessionalCategory {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyRevenue {
  month: string;
  value: number;
}

export interface CTAButton {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  onClick?: () => void;
}

export interface QuickStat {
  icon: React.ReactNode;
  title: string;
  stats: StatItem[];
  gradient: string;
}

export interface StatItem {
  label: string;
  value: string;
  color?: string;
}

// User roles
export type UserRole = 'admin' | 'manager' | 'customer' | 'professional' | 'shopkeeper';

// Dashboard view types
export type DashboardView = 'overview' | 'analytics' | 'reports' | 'settings';

// Time range for analytics
export type TimeRange = 'today' | 'week' | 'month' | 'year' | 'custom';

// Status types
export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type VerificationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';
