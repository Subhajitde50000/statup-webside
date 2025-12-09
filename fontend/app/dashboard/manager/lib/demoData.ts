// Demo data for Manager Dashboard
// Replace with actual API calls in production

export interface KPIMetric {
  id: number;
  title: string;
  value: string;
  badge: string;
  badgeColor: string;
  trend: 'up' | 'down';
  trendValue: string;
  sparklineData: number[];
}

export interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  actionRequired: boolean;
}

export interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  category: string;
}

export interface Shop {
  id: number;
  name: string;
  owner: string;
  category: string;
  status: 'active' | 'pending';
  registeredDate: string;
}

export interface Professional {
  id: number;
  name: string;
  phone: string;
  category: string;
  kycStatus: 'verified' | 'pending';
  registeredDate: string;
}

export interface Order {
  id: string;
  professional: string;
  shop: string;
  amount: number;
  status: 'completed' | 'ongoing' | 'pending';
  date: string;
}

// Helper function to generate mock data
export const generateMockKPIData = (): KPIMetric[] => {
  return [
    {
      id: 1,
      title: 'Total Shops',
      value: '1,248',
      badge: '+18 today',
      badgeColor: 'bg-[#2ECC71]',
      trend: 'up',
      trendValue: '+12%',
      sparklineData: [30, 40, 35, 50, 49, 60, 70, 65, 75, 80, 85, 90]
    },
    {
      id: 2,
      title: 'Total Professionals',
      value: '3,462',
      badge: '+42 new today',
      badgeColor: 'bg-[#3B82F6]',
      trend: 'up',
      trendValue: '+18%',
      sparklineData: [40, 45, 35, 55, 60, 65, 70, 75, 80, 85, 90, 95]
    },
    {
      id: 3,
      title: 'Jobs Booked Today',
      value: '987',
      badge: 'Active',
      badgeColor: 'bg-[#2ECC71]',
      trend: 'up',
      trendValue: '+8%',
      sparklineData: [20, 30, 25, 40, 45, 50, 55, 60, 65, 70, 75, 80]
    },
  ];
};

// API Integration Examples
export const fetchDashboardStats = async () => {
  // Replace with actual API call
  // const response = await fetch('/api/dashboard/stats');
  // return response.json();
  
  return {
    totalShops: 1248,
    totalProfessionals: 3462,
    jobsBookedToday: 987,
    completedJobs: 842,
    newComplaints: 12,
    revenueToday: 42560,
  };
};

export const fetchRecentAlerts = async (): Promise<Alert[]> => {
  // Replace with actual API call
  // const response = await fetch('/api/alerts/recent');
  // return response.json();
  
  return [
    {
      id: 1,
      type: 'critical',
      title: 'Fake Document Detection',
      description: 'Professional "Amit Kumar" submitted suspicious Aadhar card',
      time: '5 mins ago',
      actionRequired: true,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Suspicious Login Attempts',
      description: 'Multiple failed login attempts from Shop "TechFix Electronics"',
      time: '18 mins ago',
      actionRequired: true,
    },
  ];
};

export const fetchLiveActivities = async (): Promise<Activity[]> => {
  // Replace with actual API call or WebSocket connection
  // const response = await fetch('/api/activities/live');
  // return response.json();
  
  return [
    {
      id: 1,
      type: 'shop',
      message: 'Shop "ElectroWorld" added 12 new products',
      time: '2 mins ago',
      category: 'shop'
    },
    {
      id: 2,
      type: 'professional',
      message: 'Professional "Ravi Kumar" completed job #45213',
      time: '5 mins ago',
      category: 'professional'
    },
  ];
};

export const fetchLatestShops = async (): Promise<Shop[]> => {
  // Replace with actual API call
  // const response = await fetch('/api/shops/latest');
  // return response.json();
  
  return [
    {
      id: 1,
      name: 'ElectroWorld Pro',
      owner: 'Rajesh Kumar',
      category: 'Electronics',
      status: 'active',
      registeredDate: '2024-12-08'
    },
  ];
};

export const fetchLatestProfessionals = async (): Promise<Professional[]> => {
  // Replace with actual API call
  // const response = await fetch('/api/professionals/latest');
  // return response.json();
  
  return [
    {
      id: 1,
      name: 'Ravi Kumar',
      phone: '+91 98765 43210',
      category: 'Electrician',
      kycStatus: 'verified',
      registeredDate: '2024-12-08'
    },
  ];
};

export const fetchRecentOrders = async (): Promise<Order[]> => {
  // Replace with actual API call
  // const response = await fetch('/api/orders/recent');
  // return response.json();
  
  return [
    {
      id: '#ORD-45213',
      professional: 'Ravi Kumar',
      shop: 'ElectroWorld Pro',
      amount: 1250,
      status: 'completed',
      date: '2024-12-09'
    },
  ];
};

// WebSocket connection for live updates
export const connectToActivityStream = (onMessage: (activity: Activity) => void) => {
  // Replace with actual WebSocket connection
  // const ws = new WebSocket('ws://your-api.com/activities');
  
  // ws.onmessage = (event) => {
  //   const activity = JSON.parse(event.data);
  //   onMessage(activity);
  // };
  
  // return () => ws.close();
  
  // Mock implementation
  const interval = setInterval(() => {
    const mockActivity: Activity = {
      id: Date.now(),
      type: 'shop',
      message: 'New activity detected',
      time: 'Just now',
      category: 'shop'
    };
    onMessage(mockActivity);
  }, 10000);
  
  return () => clearInterval(interval);
};

// Export all helper functions
export const DashboardAPI = {
  fetchDashboardStats,
  fetchRecentAlerts,
  fetchLiveActivities,
  fetchLatestShops,
  fetchLatestProfessionals,
  fetchRecentOrders,
  connectToActivityStream,
};
