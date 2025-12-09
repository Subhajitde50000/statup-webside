'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Activity, AlertTriangle, CheckCircle, XCircle, 
  Clock, Code, RefreshCw, Download, Eye
} from 'lucide-react';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function GatewayLogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gatewayFilter, setGatewayFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = {
    totalRequests: 2456,
    successfulRequests: 2341,
    failedRequests: 115,
    gatewayDowntime: 0,
  };

  const logs = [
    {
      logId: 'LOG20241210001',
      timestamp: '2024-12-10 10:30:25.342',
      gateway: 'Razorpay',
      apiCalled: 'POST /v1/payments/create',
      transactionId: 'TXN20241210001',
      orderId: 'ORD12345',
      requestBody: { amount: 2500, currency: 'INR', method: 'upi' },
      responseCode: 200,
      responseTime: '342ms',
      status: 'Success',
      responseMessage: 'Payment initiated successfully',
    },
    {
      logId: 'LOG20241210002',
      timestamp: '2024-12-10 10:31:12.567',
      gateway: 'Stripe',
      apiCalled: 'POST /v1/payment_intents',
      transactionId: 'TXN20241210002',
      orderId: 'ORD12346',
      requestBody: { amount: 1800, currency: 'inr', payment_method: 'card' },
      responseCode: 200,
      responseTime: '567ms',
      status: 'Success',
      responseMessage: 'Payment intent created',
    },
    {
      logId: 'LOG20241210003',
      timestamp: '2024-12-10 10:32:45.123',
      gateway: 'Razorpay',
      apiCalled: 'GET /v1/payments/verify',
      transactionId: 'TXN20241210003',
      orderId: 'ORD12347',
      requestBody: { payment_id: 'pay_ABC123', signature: 'xyz789' },
      responseCode: 200,
      responseTime: '123ms',
      status: 'Success',
      responseMessage: 'Signature verified successfully',
    },
    {
      logId: 'LOG20241210004',
      timestamp: '2024-12-10 10:33:28.892',
      gateway: 'Paytm',
      apiCalled: 'POST /order/status',
      transactionId: 'TXN20241210004',
      orderId: 'ORD12348',
      requestBody: { orderId: 'ORD12348' },
      responseCode: 500,
      responseTime: '892ms',
      status: 'Error',
      responseMessage: 'Internal server error - Gateway timeout',
      retryCount: 2,
    },
    {
      logId: 'LOG20241210005',
      timestamp: '2024-12-10 10:34:15.234',
      gateway: 'Razorpay',
      apiCalled: 'POST /v1/refunds',
      transactionId: 'TXN20241210005',
      orderId: 'ORD12349',
      requestBody: { payment_id: 'pay_DEF456', amount: 850 },
      responseCode: 400,
      responseTime: '234ms',
      status: 'Failed',
      responseMessage: 'Invalid payment ID or insufficient balance',
    },
    {
      logId: 'LOG20241210006',
      timestamp: '2024-12-10 10:35:02.678',
      gateway: 'Stripe',
      apiCalled: 'POST /v1/webhooks',
      transactionId: 'TXN20241210006',
      orderId: 'ORD12350',
      requestBody: { event: 'payment_intent.succeeded' },
      responseCode: 401,
      responseTime: '678ms',
      status: 'Failed',
      responseMessage: 'Signature verification failed - Invalid webhook secret',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-[#D1FAE5] text-[#065F46]';
      case 'Failed': return 'bg-[#FEE2E2] text-[#991B1B]';
      case 'Error': return 'bg-[#FEE2E2] text-[#991B1B]';
      case 'Pending': return 'bg-[#FEF3C7] text-[#92400E]';
      default: return 'bg-[#F1F5F9] text-[#475569]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success': return <CheckCircle className="w-4 h-4" />;
      case 'Failed': return <XCircle className="w-4 h-4" />;
      case 'Error': return <AlertTriangle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getResponseCodeColor = (code: number) => {
    if (code >= 200 && code < 300) return 'text-[#10B981]';
    if (code >= 400 && code < 500) return 'text-[#F59E0B]';
    if (code >= 500) return 'text-[#EF4444]';
    return 'text-[#64748B]';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1600px] mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold text-[#1E293B] mb-2 flex items-center gap-3">
                      <Activity className="w-8 h-8 text-[#3B82F6]" />
                      Payment Gateway Logs
                    </h1>
                    <p className="text-[#64748B] text-sm">Debug gateway requests, monitor API calls, and track errors</p>
                  </div>
                  <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Export Logs
                  </button>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.totalRequests.toLocaleString()}</h3>
                  <p className="text-sm opacity-90">Total API Requests</p>
                  <p className="text-xs opacity-75 mt-2">Last 24 hours</p>
                </div>

                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.successfulRequests.toLocaleString()}</h3>
                  <p className="text-sm opacity-90">Successful Requests</p>
                  <p className="text-xs opacity-75 mt-2">{((stats.successfulRequests / stats.totalRequests) * 100).toFixed(1)}% success rate</p>
                </div>

                <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <XCircle className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.failedRequests}</h3>
                  <p className="text-sm opacity-90">Failed Requests</p>
                  <p className="text-xs opacity-75 mt-2">{((stats.failedRequests / stats.totalRequests) * 100).toFixed(1)}% failure rate</p>
                </div>

                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.gatewayDowntime}h</h3>
                  <p className="text-sm opacity-90">Gateway Downtime</p>
                  <p className="text-xs opacity-75 mt-2">All systems operational</p>
                </div>
              </div>

              {/* Gateway Status */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Gateway Health Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 bg-[#F0FDF4] rounded-lg border border-[#10B981]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse" />
                      <div>
                        <p className="text-sm font-semibold text-[#1E293B]">Razorpay</p>
                        <p className="text-xs text-[#64748B]">Operational</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#10B981]">99.8% uptime</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#F0FDF4] rounded-lg border border-[#10B981]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse" />
                      <div>
                        <p className="text-sm font-semibold text-[#1E293B]">Stripe</p>
                        <p className="text-xs text-[#64748B]">Operational</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#10B981]">99.9% uptime</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#FEF3C7] rounded-lg border border-[#F59E0B]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#F59E0B] animate-pulse" />
                      <div>
                        <p className="text-sm font-semibold text-[#1E293B]">Paytm</p>
                        <p className="text-xs text-[#64748B]">Degraded Performance</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#F59E0B]">97.2% uptime</span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search Log ID, Transaction ID, Order ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>

                  <select
                    value={gatewayFilter}
                    onChange={(e) => setGatewayFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Gateways</option>
                    <option value="razorpay">Razorpay</option>
                    <option value="stripe">Stripe</option>
                    <option value="paytm">Paytm</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="error">Error</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All API Endpoints</option>
                    <option value="create">Payment Create</option>
                    <option value="verify">Payment Verify</option>
                    <option value="refund">Refund</option>
                    <option value="webhook">Webhook</option>
                  </select>
                </div>
              </div>

              {/* Logs Table */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Log ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Gateway</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">API Endpoint</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Transaction</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Response Code</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Time</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {logs.map((log) => (
                        <tr key={log.logId} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-xs font-mono text-[#64748B]">{log.logId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-xs text-[#64748B]">
                              <Clock className="w-3 h-3" />
                              {log.timestamp}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-[#F1F5F9] text-[#64748B] rounded text-xs font-medium">
                              {log.gateway}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Code className="w-3 h-3 text-[#8B5CF6]" />
                              <span className="text-xs font-mono text-[#1E293B]">{log.apiCalled}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-xs font-mono text-[#3B82F6]">{log.transactionId}</p>
                              <p className="text-xs font-mono text-[#64748B]">{log.orderId}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-bold font-mono ${getResponseCodeColor(log.responseCode)}`}>
                              {log.responseCode}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-mono text-[#64748B]">{log.responseTime}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(log.status)}`}>
                              {getStatusIcon(log.status)}
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors" title="View Full Log">
                                <Eye className="w-4 h-4" />
                              </button>
                              {log.status === 'Failed' || log.status === 'Error' ? (
                                <button className="p-2 text-[#F59E0B] hover:bg-[#FEF3C7] rounded-lg transition-colors" title="Retry Request">
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <p className="text-sm text-[#64748B]">Showing 1 to 6 of 2456 logs</p>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm">
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm">
                      1
                    </button>
                    <button className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm">
                      2
                    </button>
                    <button className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm">
                      3
                    </button>
                    <button className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm">
                      Next
                    </button>
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
