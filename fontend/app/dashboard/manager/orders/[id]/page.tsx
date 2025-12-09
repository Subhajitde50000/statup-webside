'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, Package, User, Store, CreditCard, Truck, MapPin, Phone, 
  Mail, Star, Clock, CheckCircle, XCircle, FileText, Download, Ban,
  MessageSquare, Edit, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data
  const order = {
    id: params.id,
    status: 'out-for-delivery',
    placedAt: '2024-12-10 10:30 AM',
    customer: {
      name: 'Amit Sharma',
      phone: '+91 98765 43210',
      email: 'amit.sharma@email.com',
      address: '123 Service Lane, Electronic City Phase 1, Bangalore, Karnataka - 560100',
      coordinates: { lat: 12.8456, lng: 77.6632 }
    },
    shop: {
      name: 'ElectroWorld Pro',
      phone: '+91 98765 00000',
      rating: 4.8,
      location: 'MG Road, Bangalore'
    },
    items: [
      { id: 1, name: 'LED Bulb 15W', quantity: 4, price: 299, addOns: 'Cool White', image: 'https://via.placeholder.com/60' },
      { id: 2, name: 'Wall Socket Modular', quantity: 2, price: 149, addOns: 'Premium Finish', image: 'https://via.placeholder.com/60' },
      { id: 3, name: 'Extension Cord 5M', quantity: 1, price: 399, addOns: 'With Surge Protector', image: 'https://via.placeholder.com/60' },
    ],
    subtotal: 1993,
    tax: 359,
    deliveryCharge: 50,
    discount: 102,
    total: 2500,
    payment: {
      mode: 'UPI',
      transactionId: 'TXN2024120100123',
      status: 'paid',
      paidAt: '2024-12-10 10:32 AM'
    },
    delivery: {
      person: 'Rajesh Kumar',
      phone: '+91 98765 99999',
      vehicle: 'Bike - KA 01 AB 1234',
      status: 'on-the-way',
      estimatedTime: '15 mins',
      trackingUrl: '#'
    },
    timeline: [
      { time: '10:30 AM', event: 'Order Placed', description: 'Customer placed the order', status: 'completed' },
      { time: '10:35 AM', event: 'Shop Accepted', description: 'ElectroWorld Pro confirmed the order', status: 'completed' },
      { time: '10:45 AM', event: 'Preparing', description: 'Shop is preparing your order', status: 'completed' },
      { time: '11:00 AM', event: 'Assigned to Delivery', description: 'Rajesh Kumar accepted delivery', status: 'completed' },
      { time: '11:10 AM', event: 'Out for Delivery', description: 'On the way to customer', status: 'active' },
      { time: 'Pending', event: 'Delivered', description: 'Order will be delivered soon', status: 'pending' },
    ]
  };

  const statusSteps = ['Placed', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStepIndex = order.status === 'out-for-delivery' ? 3 : 
                          order.status === 'accepted' ? 1 : 
                          order.status === 'processing' ? 2 :
                          order.status === 'completed' ? 4 : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Link href="/dashboard/manager/orders">
                  <button className="flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Orders</span>
                  </button>
                </Link>

                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="text-2xl font-semibold text-[#1E293B] mb-2">Order Details</h1>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#64748B]">Order ID: <span className="font-mono font-semibold text-[#3B82F6]">{order.id}</span></span>
                        <span className="text-sm text-[#64748B]">Placed: {order.placedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        Change Status
                      </button>
                      <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Assign Delivery
                      </button>
                      <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Print Invoice
                      </button>
                      <button className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors text-sm font-medium flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Status Stepper */}
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      {statusSteps.map((step, index) => (
                        <div key={step} className="flex flex-col items-center relative flex-1">
                          {index < statusSteps.length - 1 && (
                            <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                              index < currentStepIndex ? 'bg-[#10B981]' : 'bg-[#E2E8F0]'
                            }`} style={{ zIndex: 0 }} />
                          )}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 ${
                            index < currentStepIndex 
                              ? 'bg-[#10B981] text-white' 
                              : index === currentStepIndex
                              ? 'bg-[#3B82F6] text-white ring-4 ring-[#DBEAFE]'
                              : 'bg-[#F1F5F9] text-[#94A3B8]'
                          }`}>
                            {index < currentStepIndex ? <CheckCircle className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                          </div>
                          <span className={`text-xs font-semibold mt-2 ${
                            index <= currentStepIndex ? 'text-[#1E293B]' : 'text-[#94A3B8]'
                          }`}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Order Items */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#3B82F6]" />
                      Order Items
                    </h2>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-lg">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border border-[#E2E8F0]" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#1E293B] text-sm">{item.name}</h3>
                            <p className="text-xs text-[#64748B] mt-1">{item.addOns}</p>
                            <p className="text-xs text-[#64748B] mt-1">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#1E293B]">₹{item.price * item.quantity}</p>
                            <p className="text-xs text-[#64748B]">₹{item.price} each</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="mt-6 pt-6 border-t border-[#E2E8F0] space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#64748B]">Subtotal</span>
                        <span className="font-semibold text-[#1E293B]">₹{order.subtotal}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#64748B]">Tax (18%)</span>
                        <span className="font-semibold text-[#1E293B]">₹{order.tax}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#64748B]">Delivery Charge</span>
                        <span className="font-semibold text-[#1E293B]">₹{order.deliveryCharge}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#10B981]">Discount</span>
                        <span className="font-semibold text-[#10B981]">-₹{order.discount}</span>
                      </div>
                      <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-[#E2E8F0]">
                        <span className="text-[#1E293B]">Total Amount</span>
                        <span className="text-[#3B82F6]">₹{order.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#3B82F6]" />
                      Payment Information
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase">Payment Mode</label>
                        <p className="text-sm font-semibold text-[#1E293B] mt-1">{order.payment.mode}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase">Transaction ID</label>
                        <p className="text-sm font-mono text-[#1E293B] mt-1">{order.payment.transactionId}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase">Payment Status</label>
                        <span className="inline-block mt-1 px-3 py-1 bg-[#D1FAE5] text-[#059669] rounded-full text-xs font-semibold">
                          {order.payment.status.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase">Paid At</label>
                        <p className="text-sm text-[#1E293B] mt-1">{order.payment.paidAt}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#3B82F6]" />
                      Delivery Details
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase">Delivery Person</label>
                        <p className="text-sm font-semibold text-[#1E293B] mt-1">{order.delivery.person}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase">Phone</label>
                        <a href={`tel:${order.delivery.phone}`} className="text-sm text-[#3B82F6] mt-1 block hover:underline">
                          {order.delivery.phone}
                        </a>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase">Vehicle</label>
                        <p className="text-sm text-[#1E293B] mt-1">{order.delivery.vehicle}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase">ETA</label>
                        <p className="text-sm font-semibold text-[#F59E0B] mt-1">{order.delivery.estimatedTime}</p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-[#EFF6FF] rounded-lg border border-[#DBEAFE]">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#3B82F6]">Live Tracking</span>
                        <button className="px-3 py-1 bg-[#3B82F6] text-white rounded text-xs font-medium hover:bg-[#2563EB] transition-colors">
                          Track Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Customer Details */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#3B82F6]" />
                      Customer Details
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase">Name</label>
                        <p className="text-sm font-semibold text-[#1E293B] mt-1">{order.customer.name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Phone
                        </label>
                        <a href={`tel:${order.customer.phone}`} className="text-sm text-[#3B82F6] mt-1 block hover:underline">
                          {order.customer.phone}
                        </a>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Email
                        </label>
                        <p className="text-sm text-[#3B82F6] mt-1">{order.customer.email}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Delivery Address
                        </label>
                        <p className="text-sm text-[#1E293B] mt-1 leading-relaxed">{order.customer.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shop Details */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <Store className="w-5 h-5 text-[#3B82F6]" />
                      Shop Details
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase">Shop Name</label>
                        <p className="text-sm font-semibold text-[#1E293B] mt-1">{order.shop.name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase">Contact</label>
                        <a href={`tel:${order.shop.phone}`} className="text-sm text-[#3B82F6] mt-1 block hover:underline">
                          {order.shop.phone}
                        </a>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase">Rating</label>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                          <span className="text-sm font-semibold text-[#1E293B]">{order.shop.rating}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase">Location</label>
                        <p className="text-sm text-[#1E293B] mt-1">{order.shop.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Log */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#3B82F6]" />
                      Timeline
                    </h2>
                    <div className="space-y-4">
                      {order.timeline.map((event, index) => (
                        <div key={index} className="flex gap-3 relative">
                          {index < order.timeline.length - 1 && (
                            <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-[#E2E8F0]" />
                          )}
                          <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 relative z-10 ${
                            event.status === 'completed' 
                              ? 'bg-[#10B981]' 
                              : event.status === 'active'
                              ? 'bg-[#3B82F6] ring-4 ring-[#DBEAFE]'
                              : 'bg-[#E2E8F0]'
                          }`} />
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-sm font-semibold ${
                                event.status === 'pending' ? 'text-[#94A3B8]' : 'text-[#1E293B]'
                              }`}>
                                {event.event}
                              </h3>
                              <span className="text-xs text-[#64748B]">{event.time}</span>
                            </div>
                            <p className="text-xs text-[#64748B] mt-1">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-xl border border-[#3B82F6]/20 p-6">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-white border border-[#E2E8F0] text-[#1E293B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Add Admin Note
                      </button>
                      <button className="w-full px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium flex items-center justify-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Process Refund
                      </button>
                      <button className="w-full px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors text-sm font-medium flex items-center justify-center gap-2">
                        <Ban className="w-4 h-4" />
                        Block Customer
                      </button>
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
