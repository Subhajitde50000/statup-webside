'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, CreditCard, Building, 
  User, Phone, Mail, MapPin, Package, RefreshCw, FileText, Shield,
  AlertTriangle, Download
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../../components/TopNavbar';
import LeftSidebar from '../../../components/LeftSidebar';

export default function TransactionDetailsPage({ params }: { params: { id: string } }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const transaction = {
    transactionId: 'TXN20241210001',
    orderId: 'ORD12345',
    status: 'Success',
    timestamp: '2024-12-10 10:30:25 AM',
    customer: {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      address: 'Flat 204, Green Valley Apartments, MG Road, Bangalore - 560001',
    },
    amount: {
      subtotal: 2200,
      tax: 396,
      platformFee: 50,
      discount: 146,
      finalAmount: 2500,
    },
    gateway: {
      name: 'Razorpay',
      transactionRef: 'pay_MNopQRst123456',
      paymentMethod: 'UPI',
      upiId: 'rajesh@paytm',
      speed: 'Instant',
    },
    settlement: {
      status: 'Settled',
      date: '2024-12-11 02:00 AM',
      amountToShop: 2200,
      platformCommission: 300,
      commissionPercentage: 12,
    },
    refund: {
      status: 'No Refund',
      history: [],
    },
    vendor: {
      name: 'ElectroWorld Pro',
      type: 'Shop',
      phone: '+91 98765 11111',
      email: 'electroworld@shop.com',
    },
    logs: [
      { time: '10:30:12 AM', event: 'Payment initiated by customer', type: 'info' },
      { time: '10:30:18 AM', event: 'Payment gateway request sent to Razorpay', type: 'info' },
      { time: '10:30:22 AM', event: 'Customer authorized UPI payment', type: 'success' },
      { time: '10:30:25 AM', event: 'Payment successful - ₹2500 received', type: 'success' },
      { time: '10:30:30 AM', event: 'Order confirmed and notified to shop', type: 'success' },
      { time: '02:00:15 AM', event: 'Settlement processed - ₹2200 transferred to shop', type: 'success' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Back Button */}
              <Link href="/dashboard/manager/payments/transactions">
                <button className="flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Transactions</span>
                </button>
              </Link>

              {/* Header */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-semibold text-[#1E293B]">Transaction Details</h1>
                      {transaction.status === 'Success' && (
                        <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Success
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#64748B]">
                      <span className="font-mono text-[#3B82F6] font-medium">{transaction.transactionId}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {transaction.timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 text-sm font-medium">
                      <Download className="w-4 h-4" />
                      Download Invoice
                    </button>
                    <button className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors flex items-center gap-2 text-sm font-medium">
                      <RefreshCw className="w-4 h-4" />
                      Process Refund
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Payment Information */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#3B82F6]" />
                      Payment Information
                    </h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#64748B] mb-1">Order ID</p>
                          <Link href={`/dashboard/manager/orders/${transaction.orderId}`}>
                            <p className="text-sm font-mono font-medium text-[#3B82F6] hover:underline cursor-pointer">{transaction.orderId}</p>
                          </Link>
                        </div>
                        <div>
                          <p className="text-sm text-[#64748B] mb-1">Customer</p>
                          <p className="text-sm font-medium text-[#1E293B]">{transaction.customer.name}</p>
                        </div>
                      </div>

                      <div className="bg-[#F8FAFC] rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#64748B]">Subtotal</span>
                          <span className="text-sm font-medium text-[#1E293B]">₹{transaction.amount.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#64748B]">Tax (18%)</span>
                          <span className="text-sm font-medium text-[#1E293B]">₹{transaction.amount.tax.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#64748B]">Platform Fee</span>
                          <span className="text-sm font-medium text-[#1E293B]">₹{transaction.amount.platformFee.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#10B981]">Discount</span>
                          <span className="text-sm font-medium text-[#10B981]">-₹{transaction.amount.discount.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-[#E2E8F0]">
                          <div className="flex items-center justify-between">
                            <span className="text-base font-semibold text-[#1E293B]">Final Amount Paid</span>
                            <span className="text-xl font-bold text-[#3B82F6]">₹{transaction.amount.finalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gateway Information */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#3B82F6]" />
                      Gateway Information
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Payment Gateway</p>
                        <p className="text-sm font-medium text-[#1E293B]">{transaction.gateway.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Transaction Reference</p>
                        <p className="text-sm font-mono font-medium text-[#1E293B]">{transaction.gateway.transactionRef}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Payment Method</p>
                        <p className="text-sm font-medium text-[#1E293B]">{transaction.gateway.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">UPI ID</p>
                        <p className="text-sm font-medium text-[#1E293B]">{transaction.gateway.upiId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Payment Speed</p>
                        <span className="inline-block px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-medium">
                          {transaction.gateway.speed}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Settlement Information */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-[#3B82F6]" />
                      Settlement Information
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Settlement Status</p>
                        <span className="inline-block px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-medium">
                          {transaction.settlement.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Settlement Date</p>
                        <p className="text-sm font-medium text-[#1E293B]">{transaction.settlement.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Amount to Shop</p>
                        <p className="text-sm font-bold text-[#10B981]">₹{transaction.settlement.amountToShop.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Platform Commission ({transaction.settlement.commissionPercentage}%)</p>
                        <p className="text-sm font-medium text-[#1E293B]">₹{transaction.settlement.platformCommission.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Refund Section */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-[#3B82F6]" />
                      Refund Status
                    </h2>
                    <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-[#1E293B] mb-1">Current Status</p>
                        <span className="inline-block px-3 py-1 bg-[#F1F5F9] text-[#64748B] rounded-full text-xs font-medium">
                          {transaction.refund.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium">
                          Approve Full Refund
                        </button>
                        <button className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-[#D97706] transition-colors text-sm font-medium">
                          Partial Refund
                        </button>
                        <button className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors text-sm font-medium">
                          Reject Refund
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Customer & Logs */}
                <div className="space-y-6">
                  {/* Customer Details */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#3B82F6]" />
                      Customer Details
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Name</p>
                        <p className="text-sm font-medium text-[#1E293B]">{transaction.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Phone</p>
                        <a href={`tel:${transaction.customer.phone}`} className="text-sm text-[#3B82F6] hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {transaction.customer.phone}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Email</p>
                        <a href={`mailto:${transaction.customer.email}`} className="text-sm text-[#3B82F6] hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {transaction.customer.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Address</p>
                        <p className="text-sm text-[#1E293B] flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                          <span>{transaction.customer.address}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Details */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#3B82F6]" />
                      {transaction.vendor.type} Details
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Name</p>
                        <p className="text-sm font-medium text-[#1E293B]">{transaction.vendor.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Type</p>
                        <span className="inline-block px-2 py-1 bg-[#EFF6FF] text-[#3B82F6] rounded text-xs font-medium">
                          {transaction.vendor.type}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Phone</p>
                        <a href={`tel:${transaction.vendor.phone}`} className="text-sm text-[#3B82F6] hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {transaction.vendor.phone}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Email</p>
                        <a href={`mailto:${transaction.vendor.email}`} className="text-sm text-[#3B82F6] hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {transaction.vendor.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Logs */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#3B82F6]" />
                      Transaction Logs
                    </h2>
                    <div className="space-y-3">
                      {transaction.logs.map((log, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-2 h-2 rounded-full ${
                              log.type === 'success' ? 'bg-[#10B981]' : 
                              log.type === 'error' ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'
                            }`} />
                            {index < transaction.logs.length - 1 && (
                              <div className="w-0.5 h-8 bg-[#E2E8F0]" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="text-xs text-[#64748B] mb-1">{log.time}</p>
                            <p className="text-sm text-[#1E293B]">{log.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
