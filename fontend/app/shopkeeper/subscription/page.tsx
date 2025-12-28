'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Calendar, CheckCircle, Download, Clock, Shield, 
  Star, Zap, Award, AlertCircle, Loader2, X, IndianRupee 
} from 'lucide-react';
import ShopkeeperNavbar from '../components/ShopkeeperNavbar';
import Footer from '../../Component/Footer';
import {
  getSubscriptionPlans,
  getMySubscription,
  subscribeToPlan,
  cancelSubscription,
  getPaymentHistory,
  downloadReceipt,
  SubscriptionPlan,
  UserSubscription,
  PaymentHistory,
} from '../../../utils/subscriptions';

export default function ShopkeeperSubscription() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [inTrial, setInTrial] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [processing, setProcessing] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansData, subscriptionData, paymentsData] = await Promise.all([
        getSubscriptionPlans(),
        getMySubscription(),
        getPaymentHistory(),
      ]);

      setPlans(plansData);
      setCurrentSubscription(subscriptionData.subscription);
      setInTrial(subscriptionData.in_trial);
      setTrialDaysRemaining(subscriptionData.trial_days_remaining || 0);
      setPaymentHistory(paymentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    try {
      setProcessing(true);
      await subscribeToPlan(selectedPlan.id, paymentMethod);
      setShowPaymentModal(false);
      await fetchData();
      alert('Subscription successful! 🎉');
    } catch (error: any) {
      alert(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    try {
      await cancelSubscription();
      await fetchData();
      alert('Subscription cancelled successfully.');
    } catch (error: any) {
      alert(error.message || 'Failed to cancel subscription.');
    }
  };

  const handleDownloadReceipt = async (subscriptionId: string, customerName: string) => {
    try {
      await downloadReceipt(subscriptionId, customerName);
    } catch (error) {
      alert('Failed to download receipt');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ShopkeeperNavbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopkeeperNavbar />
      
      <div className="pb-12 mb-16 lg:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Subscription Plans</h1>
            <p className="text-gray-600 text-lg">Choose the perfect plan for your business</p>
          </div>

          {/* Trial Status Banner */}
          {inTrial && (
            <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Free Trial Active! 🎉</h3>
                  <p className="text-gray-700 mb-2">
                    You have <span className="font-bold text-green-600">{trialDaysRemaining} days</span> remaining in your free trial period.
                  </p>
                  <p className="text-sm text-gray-600">
                    After the trial ends, subscribe to continue enjoying all platform features.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Current Subscription */}
          {currentSubscription && (
            <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-black text-gray-900">{currentSubscription.plan_name}</h3>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Valid until: <span className="font-bold">{new Date(currentSubscription.end_date).toLocaleDateString()}</span>
                  </p>
                </div>
                <button
                  onClick={handleCancelSubscription}
                  className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all"
                >
                  Cancel Plan
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Amount Paid</div>
                  <div className="flex items-center gap-1 text-2xl font-black text-gray-900">
                    <IndianRupee className="w-5 h-5" />
                    {currentSubscription.amount_paid}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Duration</div>
                  <div className="text-2xl font-black text-gray-900">{currentSubscription.duration_months} Months</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Days Remaining</div>
                  <div className="text-2xl font-black text-gray-900">
                    {Math.ceil((new Date(currentSubscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Plans */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Available Plans</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, index) => {
                const isRecommended = plan.duration_months === 6;
                const isBestValue = plan.duration_months === 12;
                
                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all hover:-translate-y-2 hover:shadow-2xl ${
                      isBestValue ? 'border-yellow-400' : isRecommended ? 'border-blue-400' : 'border-gray-200'
                    }`}
                  >
                    {(isRecommended || isBestValue) && (
                      <div className={`${isBestValue ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'} text-white text-center py-2 font-bold`}>
                        {isBestValue ? '⭐ BEST VALUE' : '🔥 RECOMMENDED'}
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <IndianRupee className="w-6 h-6 text-gray-900" />
                          <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                        </div>
                        {plan.discount_percentage > 0 && (
                          <div className="text-green-600 font-bold">
                            Save {plan.discount_percentage}%
                          </div>
                        )}
                        <div className="text-gray-600">for {plan.duration_months} month{plan.duration_months > 1 ? 's' : ''}</div>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowPaymentModal(true);
                        }}
                        disabled={currentSubscription !== null}
                        className={`w-full py-3 rounded-xl font-bold transition-all ${
                          currentSubscription
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : isBestValue
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-xl hover:scale-105'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-105'
                        }`}
                      >
                        {currentSubscription ? 'Already Subscribed' : 'Subscribe Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment History */}
          {paymentHistory.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Payment History</h2>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Plan</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Payment ID</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(payment.transaction_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.plan_name}</td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            <div className="flex items-center gap-0.5">
                              <IndianRupee className="w-4 h-4" />
                              {payment.amount}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-mono">{payment.payment_id}</td>
                          <td className="px-6 py-4">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                              {payment.payment_status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDownloadReceipt(payment.subscription_id, 'Customer')}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">Complete Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Selected Plan</div>
              <div className="text-xl font-black text-gray-900">{selectedPlan.name}</div>
              <div className="flex items-center gap-1 text-2xl font-black text-blue-600 mt-2">
                <IndianRupee className="w-5 h-5" />
                {selectedPlan.price}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">Payment Method</label>
              <div className="space-y-2">
                {[
                  { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
                  { value: 'debit_card', label: 'Debit Card', icon: CreditCard },
                  { value: 'upi', label: 'UPI', icon: Zap },
                  { value: 'net_banking', label: 'Net Banking', icon: Shield },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5"
                    />
                    <method.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-bold text-gray-900">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={processing}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay ₹{selectedPlan.price}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
