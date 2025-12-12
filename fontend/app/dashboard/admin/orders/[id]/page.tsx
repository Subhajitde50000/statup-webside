'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { ArrowLeft, User, Phone, MapPin, Briefcase, Star, Package, CreditCard, Clock, CheckCircle2, XCircle, AlertTriangle, Download, Edit, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [selectedStatus, setSelectedStatus] = useState('Processing');
  const [notes, setNotes] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'update' | 'refund' | 'cancel' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{ status?: string; notes?: string }>({});

  // Mock order data
  const order = {
    id: 'ORD001234',
    date: '2024-12-12 14:30',
    type: 'Material Order',
    status: 'Processing',
    paymentStatus: 'Paid',
    totalAmount: 2450,
    customer: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      address: '45, Green Park Extension, Sector 12, New Delhi - 110016',
      mapUrl: 'https://maps.google.com',
    },
    professional: {
      name: 'Amit Singh',
      phone: '+91 98234 56789',
      category: 'Electrician',
      rating: 4.8,
      completedJobs: 452,
      complaints: 2,
    },
    shop: {
      name: 'Super Electronics',
      owner: 'Suresh Gupta',
      phone: '+91 97654 32109',
      gst: 'GST29ABCDE1234F1Z5',
      location: 'Connaught Place, New Delhi',
      mapUrl: 'https://maps.google.com',
    },
    items: [
      {
        id: 1,
        name: 'Electrical Wire 10 meters',
        image: 'EW',
        quantity: 2,
        price: 450,
        warranty: '1 year',
        stock: 'In Stock',
      },
      {
        id: 2,
        name: 'Modular Switch Board',
        image: 'MS',
        quantity: 1,
        price: 850,
        warranty: '2 years',
        stock: 'In Stock',
      },
      {
        id: 3,
        name: 'LED Bulb 9W',
        image: 'LB',
        quantity: 5,
        price: 140,
        warranty: '6 months',
        stock: 'In Stock',
      },
    ],
    payment: {
      mode: 'UPI',
      referenceId: 'UPI2024121214301234',
      status: 'Success',
      transactionTime: '2024-12-12 14:35',
    },
    timeline: [
      { step: 'Order Placed', status: 'completed', time: '2024-12-12 14:30', by: 'Customer', notes: 'Order created successfully' },
      { step: 'Accepted', status: 'completed', time: '2024-12-12 14:32', by: 'Shop: Super Electronics', notes: 'Order accepted by shop' },
      { step: 'Processing', status: 'active', time: '2024-12-12 14:40', by: 'Shop: Super Electronics', notes: 'Items being prepared' },
      { step: 'Ready for Pickup', status: 'pending', time: '', by: '', notes: '' },
      { step: 'Completed', status: 'pending', time: '', by: '', notes: '' },
    ],
  };

  const getTimelineColor = (status: string) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'active') return 'bg-amber-500';
    return 'bg-gray-300';
  };

  const validateForm = () => {
    const errors: { status?: string; notes?: string } = {};
    
    if (!selectedStatus) {
      errors.status = 'Please select a status';
    }
    
    if (confirmAction === 'cancel' && !notes.trim()) {
      errors.notes = 'Please provide a reason for cancellation';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAction = (action: 'update' | 'refund' | 'cancel') => {
    if (action === 'update' && !validateForm()) return;
    
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const executeAction = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    setShowConfirmDialog(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setNotificationMessage(
      confirmAction === 'update' ? 'Order status updated successfully!' :
      confirmAction === 'refund' ? 'Refund initiated successfully!' :
      'Order cancelled successfully!'
    );
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    setConfirmAction(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                confirmAction === 'cancel' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {confirmAction === 'cancel' ? (
                  <XCircle className="w-8 h-8 text-red-600" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {confirmAction === 'update' && 'Update Order Status?'}
                {confirmAction === 'refund' && 'Initiate Refund?'}
                {confirmAction === 'cancel' && 'Cancel Order?'}
              </h3>
              <p className="text-gray-600">
                {confirmAction === 'update' && `Change order status to "${selectedStatus}"?`}
                {confirmAction === 'refund' && 'This will process a refund for this order.'}
                {confirmAction === 'cancel' && 'This action cannot be undone.'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className={`flex-1 px-4 py-3 text-white rounded-xl transition-colors font-semibold ${
                  confirmAction === 'cancel' 
                    ? 'bg-[#D32F2F] hover:bg-[#b71c1c]' 
                    : 'bg-[#1A73E8] hover:bg-[#1557b0]'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-24 right-8 z-50 animate-slide-in">
          <div className="bg-[#00C853] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border border-green-300">
            <CheckCircle2 className="w-5 h-5" />
            <p className="font-semibold">{notificationMessage}</p>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              <RefreshCw className="w-12 h-12 text-[#1A73E8] animate-spin" />
              <p className="text-gray-600 font-semibold">Processing...</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#0B0F19]">Order Details</h1>
              <p className="text-sm text-gray-500">Order ID: {order.id}</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-[#1A73E8] text-white rounded-xl hover:bg-[#1557b0] transition-colors font-semibold">
            <Download className="w-4 h-4" />
            <span>Download Invoice</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Top Summary Card */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-5 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Order ID</p>
                <p className="font-bold text-[#0B0F19]">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                <p className="font-bold text-[#0B0F19]">{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Order Type</p>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  {order.type}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold border border-amber-200">
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                <p className="font-bold text-[#00C853] text-xl">₹{order.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Section 1: Customer Information */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B0F19] mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-[#1A73E8]" />
              <span>Customer Information</span>
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1A73E8] to-[#6C63FF] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    RK
                  </div>
                  <div>
                    <p className="font-bold text-[#0B0F19] text-lg">{order.customer.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${order.customer.phone}`} className="text-[#1A73E8] hover:underline">
                        {order.customer.phone}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>{order.customer.address}</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-xl overflow-hidden h-48">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.0347!2d77.2090!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzUwLjAiTiA3N8KwMTInMzIuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Information */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B0F19] mb-4 flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-[#1A73E8]" />
              <span>Professional Information</span>
            </h3>
            <div className="grid grid-cols-4 gap-6">
              <div className="col-span-2">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    AS
                  </div>
                  <div>
                    <p className="font-bold text-[#0B0F19] text-lg">{order.professional.name}</p>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {order.professional.category}
                    </span>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${order.professional.phone}`} className="text-[#1A73E8] hover:underline">
                        {order.professional.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <p className="font-bold text-green-900 text-xl">{order.professional.rating}</p>
                </div>
                <p className="text-sm text-green-700">{order.professional.completedJobs} Jobs Completed</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="font-bold text-red-900 text-xl">{order.professional.complaints}</p>
                </div>
                <p className="text-sm text-red-700">Active Complaints</p>
              </div>
            </div>
          </div>

          {/* Section 3: Shop Information */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B0F19] mb-4 flex items-center space-x-2">
              <Package className="w-5 h-5 text-[#1A73E8]" />
              <span>Shop Information</span>
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Shop Name</p>
                  <p className="font-bold text-[#0B0F19] text-lg">{order.shop.name}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Owner Name</p>
                  <p className="font-semibold text-[#0B0F19]">{order.shop.owner}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <a href={`tel:${order.shop.phone}`} className="text-[#1A73E8] font-semibold hover:underline">
                    {order.shop.phone}
                  </a>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">GST Number</p>
                  <p className="font-mono text-sm text-gray-700">{order.shop.gst}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <p className="text-sm text-gray-600">{order.shop.location}</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-xl overflow-hidden h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2!2d77.2167!3d28.6304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM3JzQ5LjQiTiA3N8KwMTMnMDAuMSJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Ordered Items */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B0F19] mb-4">Ordered Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FFAB00] to-[#FF6F00] rounded-lg flex items-center justify-center text-white font-bold">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#0B0F19]">{item.name}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-sm text-gray-600">Warranty: {item.warranty}</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {item.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                    <p className="font-bold text-[#0B0F19] text-lg">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-[#0B0F19]">Total Amount</p>
                <p className="text-2xl font-bold text-[#00C853]">₹{order.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Section 5: Payment Information */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B0F19] mb-4 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-[#1A73E8]" />
              <span>Payment Information</span>
            </h3>
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-blue-700 mb-1">Payment Mode</p>
                <p className="font-bold text-blue-900 text-lg">{order.payment.mode}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-purple-700 mb-1">Reference ID</p>
                <p className="font-mono text-xs text-purple-900">{order.payment.referenceId}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-green-700 mb-1">Payment Status</p>
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
                  {order.payment.status}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-700 mb-1">Transaction Time</p>
                <p className="font-semibold text-gray-900 text-sm">{order.payment.transactionTime}</p>
              </div>
            </div>
          </div>

          {/* Section 6: Status Timeline */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#1A73E8]" />
              <span>Order Timeline</span>
            </h3>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-6 w-1 h-full bg-gray-200" style={{ height: 'calc(100% - 48px)' }} />
              
              {/* Timeline Steps */}
              <div className="space-y-6">
                {order.timeline.map((step, index) => (
                  <div key={index} className="relative flex items-start space-x-4">
                    <div className={`w-12 h-12 ${getTimelineColor(step.status)} rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-white shadow-lg`}>
                      {step.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-white" />}
                      {step.status === 'active' && <Clock className="w-6 h-6 text-white animate-pulse" />}
                      {step.status === 'pending' && <div className="w-3 h-3 bg-white rounded-full" />}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="font-bold text-[#0B0F19] text-lg">{step.step}</p>
                      {step.time && (
                        <p className="text-sm text-gray-600 mt-1">{step.time} • {step.by}</p>
                      )}
                      {step.notes && (
                        <p className="text-sm text-gray-500 mt-2">{step.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Tools */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B0F19] mb-4">Admin Tools</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Change Status</label>
                <select
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white ${
                    formErrors.status ? 'border-red-500' : 'border-gray-200'
                  }`}
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setFormErrors(prev => ({ ...prev, status: undefined }));
                  }}
                >
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Processing</option>
                  <option>Ready for Pickup</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
                {formErrors.status && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.status}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Add Internal Notes</label>
                <textarea
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] resize-none ${
                    formErrors.notes ? 'border-red-500' : 'border-gray-200'
                  }`}
                  rows={3}
                  placeholder="Add notes..."
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setFormErrors(prev => ({ ...prev, notes: undefined }));
                  }}
                />
                {formErrors.notes && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.notes}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-6">
              <button 
                onClick={() => handleAction('update')}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-[#1A73E8] text-white rounded-xl hover:bg-[#1557b0] transition-colors font-semibold flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Update Status</span>
              </button>
              <button 
                onClick={() => handleAction('refund')}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-[#00C853] text-white rounded-xl hover:bg-[#00a844] transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Initiate Refund
              </button>
              <button 
                onClick={() => handleAction('cancel')}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-[#D32F2F] text-white rounded-xl hover:bg-[#b71c1c] transition-colors font-semibold flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <XCircle className="w-5 h-5" />
                <span>Cancel Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
