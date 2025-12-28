// Subscription-related TypeScript interfaces and API functions

export interface SubscriptionPlan {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  discount_percentage: number;
  features: string[];
  is_active: boolean;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  user_type: string;
  plan_id: string;
  plan_name: string;
  duration_months: number;
  amount_paid: number;
  is_trial: boolean;
  trial_end_date?: string;
  start_date: string;
  end_date: string;
  payment_method?: string;
  payment_id?: string;
  payment_status: string;
  status: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentHistory {
  id: string;
  user_id: string;
  subscription_id: string;
  plan_name: string;
  amount: number;
  payment_method: string;
  payment_id: string;
  payment_status: string;
  transaction_date: string;
  receipt_url?: string;
}

export interface Receipt {
  receipt_id: string;
  subscription_id: string;
  customer_name: string;
  customer_email: string;
  plan_name: string;
  duration_months: number;
  amount: number;
  payment_method: string;
  payment_id: string;
  payment_status: string;
  transaction_date: string;
  start_date: string;
  end_date: string;
  company_name: string;
  company_address: string;
  company_email: string;
  company_phone: string;
}

const API_BASE_URL = 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Get all subscription plans
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await fetch(`${API_BASE_URL}/subscriptions/plans`);
  if (!response.ok) {
    throw new Error('Failed to fetch subscription plans');
  }
  const data = await response.json();
  return data.plans;
};

// Get current user's subscription
export const getMySubscription = async (): Promise<{
  subscription: UserSubscription | null;
  in_trial: boolean;
  trial_days_remaining?: number;
  trial_end_date?: string;
  trial_expired?: boolean;
  message?: string;
}> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/subscriptions/my-subscription`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch subscription');
  }
  return response.json();
};

// Subscribe to a plan
export const subscribeToPlan = async (
  planId: string,
  paymentMethod: string
): Promise<{
  message: string;
  subscription: UserSubscription;
  payment_id: string;
}> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/subscriptions/subscribe/${planId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ payment_method: paymentMethod }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to subscribe');
  }
  
  return response.json();
};

// Cancel subscription
export const cancelSubscription = async (): Promise<{ message: string }> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/subscriptions/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to cancel subscription');
  }
  
  return response.json();
};

// Get payment history
export const getPaymentHistory = async (): Promise<PaymentHistory[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/subscriptions/payment-history`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch payment history');
  }
  
  const data = await response.json();
  return data.payments;
};

// Get receipt
export const getReceipt = async (subscriptionId: string): Promise<Receipt> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/subscriptions/receipt/${subscriptionId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch receipt');
  }
  
  return response.json();
};

// Check subscription eligibility
export const checkSubscriptionEligibility = async (): Promise<{
  needs_subscription: boolean;
  has_active_subscription?: boolean;
  subscription_valid_until?: string;
  in_trial?: boolean;
  trial_days_remaining?: number;
  trial_end_date?: string;
  trial_expired?: boolean;
  message?: string;
}> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/subscriptions/check-eligibility`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to check eligibility');
  }
  
  return response.json();
};

// Download receipt as PDF (browser download)
export const downloadReceipt = async (subscriptionId: string, customerName: string) => {
  try {
    const receipt = await getReceipt(subscriptionId);
    
    // Create a simple HTML receipt
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${receipt.receipt_id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; color: #2563eb; }
          .receipt-title { font-size: 20px; margin-top: 10px; }
          .details { margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .label { font-weight: bold; }
          .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
          .amount { font-size: 24px; font-weight: bold; color: #16a34a; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">${receipt.company_name}</div>
          <div>${receipt.company_address}</div>
          <div>${receipt.company_email} | ${receipt.company_phone}</div>
          <div class="receipt-title">PAYMENT RECEIPT</div>
        </div>
        
        <div class="details">
          <div class="detail-row">
            <span class="label">Receipt ID:</span>
            <span>${receipt.receipt_id}</span>
          </div>
          <div class="detail-row">
            <span class="label">Customer Name:</span>
            <span>${receipt.customer_name}</span>
          </div>
          <div class="detail-row">
            <span class="label">Email:</span>
            <span>${receipt.customer_email}</span>
          </div>
          <div class="detail-row">
            <span class="label">Plan:</span>
            <span>${receipt.plan_name}</span>
          </div>
          <div class="detail-row">
            <span class="label">Duration:</span>
            <span>${receipt.duration_months} Month(s)</span>
          </div>
          <div class="detail-row">
            <span class="label">Payment Method:</span>
            <span>${receipt.payment_method}</span>
          </div>
          <div class="detail-row">
            <span class="label">Payment ID:</span>
            <span>${receipt.payment_id}</span>
          </div>
          <div class="detail-row">
            <span class="label">Transaction Date:</span>
            <span>${new Date(receipt.transaction_date).toLocaleString()}</span>
          </div>
          <div class="detail-row">
            <span class="label">Validity Period:</span>
            <span>${new Date(receipt.start_date).toLocaleDateString()} - ${new Date(receipt.end_date).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div class="amount">
          Amount Paid: ₹${receipt.amount.toFixed(2)}
        </div>
        
        <div class="footer">
          <p>Thank you for your payment!</p>
          <p>For any queries, please contact us at ${receipt.company_email}</p>
        </div>
      </body>
      </html>
    `;
    
    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  } catch (error) {
    console.error('Error downloading receipt:', error);
    throw error;
  }
};
