'use client';

import React, { useState } from 'react';
import { Package, Clock, CheckCircle, Loader, ShoppingBag, XCircle, Phone, MapPin, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ShopkeeperNavbar from '../components/ShopkeeperNavbar';

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('new');

  const tabs = [
    { id: 'new', label: 'New Orders', icon: Package, color: '#FF9800', count: 2 },
    { id: 'accepted', label: 'Accepted', icon: CheckCircle, color: '#4CAF50', count: 2 },
    { id: 'processing', label: 'Processing', icon: Loader, color: '#FF9800', count: 2 },
    { id: 'ready', label: 'Ready for Pickup', icon: ShoppingBag, color: '#1A73E8', count: 2 },
    { id: 'completed', label: 'Completed', icon: CheckCircle, color: '#9C27B0', count: 3 },
    { id: 'cancelled', label: 'Cancelled', icon: XCircle, color: '#E53935', count: 2 },
  ];

  return (
    <>
      <ShopkeeperNavbar />
      <div className="min-h-screen bg-[#F5F7FA] pb-24 lg:pb-8">
        {/* Header */}
        <div className="bg-white border-b border-[#E0E0E0] px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#0C0C0C]">Orders Management</h1>
            <p className="text-sm lg:text-base text-[#555555] mt-1">Track and manage all your orders in real-time</p>
          </div>
        </div>

        {/* Tabs - Desktop */}
        <div className="hidden lg:flex bg-white border-b border-[#E0E0E0] px-8 space-x-1 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#00C897] text-[#00C897] bg-[#00C897]/5'
                      : 'border-transparent text-[#555555] hover:text-[#0C0C0C] hover:bg-[#F5F7FA]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold text-white shadow-sm"
                      style={{ backgroundColor: tab.color }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabs - Mobile/Tablet (Scrollable horizontal) */}
        <div className="lg:hidden bg-white border-b border-[#E0E0E0] px-4 py-3 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition whitespace-nowrap text-sm ${
                    activeTab === tab.id
                      ? 'bg-[#00C897] text-white'
                      : 'bg-[#F5F7FA] text-[#555555]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      activeTab === tab.id ? 'bg-white text-[#00C897]' : 'bg-white'
                    }`}
                    style={{ color: activeTab !== tab.id ? tab.color : undefined }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'new' && <NewOrdersTab />}
            {activeTab === 'accepted' && <AcceptedOrdersTab />}
            {activeTab === 'processing' && <ProcessingOrdersTab />}
            {activeTab === 'ready' && <ReadyForPickupTab />}
            {activeTab === 'completed' && <CompletedOrdersTab />}
            {activeTab === 'cancelled' && <CancelledOrdersTab />}
          </div>
        </div>
      </div>
    </>
  );
}

// New Orders Tab Component
function NewOrdersTab() {
  const router = useRouter();
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg lg:text-xl font-semibold text-[#0C0C0C]">New Orders</h2>
        <p className="text-sm text-[#555555] mt-1">Orders waiting for your confirmation</p>
      </div>
      <div className="space-y-4 lg:space-y-5">
        <NewOrderCard orderId="ORD37821" />
        <NewOrderCard orderId="ORD37822" />
      </div>
    </div>
  );
}

function NewOrderCard({ orderId }: { orderId: string }) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  const handleAccept = () => {
    alert(`Order ${orderId} accepted!`);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-4 md:p-6 hover:shadow-lg hover:border-[#00C897]/30 transition-all duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E0E0E0]">
          <div>
            <h3 className="text-base md:text-lg font-bold text-[#0C0C0C]">#{orderId}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="w-3.5 h-3.5 text-[#555555]" />
              <p className="text-xs md:text-sm text-[#555555]">2 minutes ago</p>
            </div>
          </div>
          <span className="bg-[#FF9800] text-white px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-sm">
            New
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {/* Professional Details */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3 flex items-center">
                <div className="w-1 h-4 bg-[#00C897] rounded mr-2"></div>
                Professional Details
              </h4>
              <div className="bg-[#F5F7FA] rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="/placeholder-avatar.jpg"
                    alt="Professional"
                    className="w-14 h-14 rounded-full border-2 border-[#00C897] shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Rahul+Das&background=00C897&color=fff';
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-[#0C0C0C] text-base">Rahul Das</h5>
                        <p className="text-xs text-[#555555] mt-0.5">Electrician</p>
                      </div>
                      <button className="bg-[#1A73E8] text-white p-2.5 rounded-lg hover:bg-[#1557B0] transition shadow-sm">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      <span className="text-yellow-500 text-sm">⭐</span>
                      <span className="text-sm font-semibold text-[#0C0C0C]">4.7</span>
                      <span className="text-xs text-[#555555]">(125 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div>
              <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3 flex items-center">
                <div className="w-1 h-4 bg-[#1A73E8] rounded mr-2"></div>
                Order Details
              </h4>
              <div className="bg-[#F5F7FA] rounded-lg p-4 space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-[#0C0C0C]">Copper Wire 10m</p>
                    <p className="text-xs text-[#555555] mt-0.5">Qty: 2</p>
                  </div>
                  <span className="font-semibold text-[#0C0C0C]">₹240</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-[#0C0C0C]">Tape</p>
                    <p className="text-xs text-[#555555] mt-0.5">Qty: 1</p>
                  </div>
                  <span className="font-semibold text-[#0C0C0C]">₹80</span>
                </div>
                <div className="pt-3 mt-2 border-t-2 border-[#E0E0E0] flex justify-between items-center">
                  <span className="font-semibold text-[#0C0C0C]">Total Price</span>
                  <span className="text-2xl font-bold text-[#00C897]">₹320</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Delivery Method */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3 flex items-center">
                <div className="w-1 h-4 bg-[#FF9800] rounded mr-2"></div>
                Delivery Method
              </h4>
              <div className="bg-[#00C897]/10 border border-[#00C897]/20 rounded-lg p-4 flex items-center space-x-3">
                <div className="bg-[#00C897] p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#0C0C0C]">Pickup by professional</p>
                  <p className="text-xs text-[#555555] mt-0.5">Professional will collect from store</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAccept}
                className="w-full bg-[#00C897] text-white py-3.5 md:py-4 rounded-lg font-semibold hover:bg-[#00B184] transition-all duration-200 shadow-md hover:shadow-xl text-sm md:text-base flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Accept Order</span>
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="w-full bg-white border-2 border-[#E53935] text-[#E53935] py-3.5 md:py-4 rounded-lg font-semibold hover:bg-[#E53935] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md text-sm md:text-base flex items-center justify-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>Reject Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <RejectOrderModal orderId={orderId} onClose={() => setShowRejectModal(false)} />
      )}
    </>
  );
}

function RejectOrderModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const reasons = [
    'Out of stock',
    'Wrong quantity',
    'Wrong quantity (in-store)',
    'Cannot fulfill',
    'Other',
  ];

  const handleReject = () => {
    const reason = selectedReason === 'Other' ? otherReason : selectedReason;
    alert(`Order ${orderId} rejected. Reason: ${reason}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-[#0C0C0C] mb-4">Reject Order #{orderId}</h3>
        <p className="text-[#555555] mb-4 text-sm">Please select a reason for rejection:</p>
        
        <div className="space-y-2 mb-4">
          {reasons.map((reason) => (
            <label key={reason} className="flex items-center space-x-3 p-3 border border-[#E0E0E0] rounded-lg cursor-pointer hover:bg-[#F5F7FA] transition">
              <input
                type="radio"
                name="reason"
                value={reason}
                checked={selectedReason === reason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-4 h-4 text-[#E53935]"
              />
              <span className="text-[#0C0C0C]">{reason}</span>
            </label>
          ))}
        </div>

        {selectedReason === 'Other' && (
          <textarea
            placeholder="Please specify the reason..."
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] mb-4 resize-none"
          />
        )}

        <div className="flex space-x-3">
          <button
            onClick={handleReject}
            disabled={!selectedReason || (selectedReason === 'Other' && !otherReason.trim())}
            className="flex-1 bg-[#E53935] text-white py-3 rounded-lg font-semibold hover:bg-[#D32F2F] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Rejection
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#E0E0E0] text-[#0C0C0C] py-3 rounded-lg font-semibold hover:bg-[#D0D0D0] transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Accepted Orders Tab
function AcceptedOrdersTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg lg:text-xl font-semibold text-[#0C0C0C]">Accepted Orders</h2>
        <p className="text-sm text-[#555555] mt-1">Prepare and pack items</p>
      </div>
      <div className="space-y-4 lg:space-y-5">
        <AcceptedOrderCard orderId="ORD37821" status="Dests" />
        <AcceptedOrderCard orderId="ORD37822" status="Paked" />
      </div>
    </div>
  );
}

function AcceptedOrderCard({ orderId, status }: { orderId: string; status: string }) {
  const handleMarkPacked = () => {
    alert(`Order ${orderId} marked as packed!`);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-4 md:p-6 hover:shadow-lg hover:border-[#4CAF50]/30 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E0E0E0]">
        <div>
          <h3 className="text-base md:text-lg font-bold text-[#0C0C0C]">#{orderId}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="w-3.5 h-3.5 text-[#555555]" />
            <p className="text-xs md:text-sm text-[#555555]">2 minutes ago</p>
          </div>
        </div>
        <span className="bg-[#4CAF50] text-white px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-sm">
          {status}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="md:col-span-1">
          <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3 flex items-center">
            <div className="w-1 h-4 bg-[#1A73E8] rounded mr-2"></div>
            Order Summary
          </h4>
          <div className="bg-[#F5F7FA] rounded-lg p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#555555]">Copper Wire 10m</span>
              <span className="font-medium">x2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555555]">Tape</span>
              <span className="font-medium">x1</span>
            </div>
            <div className="pt-3 border-t-2 border-[#E0E0E0]">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-[#0C0C0C]">Total price</span>
                <span className="font-bold text-[#00C897]">₹320</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#555555]">Payment Method</span>
                <div className="flex items-center space-x-1">
                  <CreditCard className="w-4 h-4 text-[#1A73E8]" />
                  <span className="font-medium text-[#1A73E8]">1A73E0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className="md:col-span-1">
          <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3 flex items-center">
            <div className="w-1 h-4 bg-[#00C897] rounded mr-2"></div>
            Professional Info
          </h4>
          <div className="bg-[#F5F7FA] rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://ui-avatars.com/api/?name=Rahul+Das&background=00C897&color=fff"
                alt="Professional"
                className="w-12 h-12 rounded-full border-2 border-[#00C897] shadow-sm"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-[#0C0C0C]">Rahul Das</h5>
                    <p className="text-xs text-[#555555]">Electrician</p>
                  </div>
                  <button className="bg-[#1A73E8] text-white px-3 py-1.5 rounded-lg hover:bg-[#1557B0] transition text-xs font-medium flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="md:col-span-1 flex items-end">
          <button
            onClick={handleMarkPacked}
            className="w-full bg-[#1A73E8] text-white py-3.5 md:py-4 rounded-lg font-semibold hover:bg-[#1557B0] transition-all duration-200 shadow-md hover:shadow-xl text-sm md:text-base flex items-center justify-center space-x-2"
          >
            <Package className="w-5 h-5" />
            <span>Mark as Packed</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Processing Orders Tab
function ProcessingOrdersTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg lg:text-xl font-semibold text-[#0C0C0C]">Processing Orders</h2>
        <p className="text-sm text-[#555555] mt-1">(Packing)</p>
      </div>
      <div className="space-y-4 lg:space-y-5">
        <ProcessingOrderCard orderId="ORD37821" time="10:33:50" />
        <ProcessingOrderCard orderId="ORD37822" time="11 fl m" />
      </div>
    </div>
  );
}

function ProcessingOrderCard({ orderId, time }: { orderId: string; time: string }) {
  const [notes, setNotes] = useState('');

  const handleMarkReady = () => {
    if (window.confirm(`Mark order ${orderId} as ready for pickup?`)) {
      alert(`Order ${orderId} marked as ready for pickup!`);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-4 md:p-6 hover:shadow-lg hover:border-[#FF9800]/30 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E0E0E0]">
        <div>
          <h3 className="text-base md:text-lg font-bold text-[#0C0C0C]">#{orderId}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="w-3.5 h-3.5 text-[#555555]" />
            <p className="text-xs md:text-sm text-[#555555]">2 minutes ago</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="bg-[#FF9800] text-white px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-sm flex items-center space-x-1.5 mb-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Packing</span>
          </span>
          <div className="bg-[#FF9800]/10 border border-[#FF9800]/30 px-3 py-1 rounded-lg">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF9800]" />
              <span className="text-sm font-semibold text-[#FF9800]">{time}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3 flex items-center">
            <div className="w-1 h-4 bg-[#1A73E8] rounded mr-2"></div>
            Items to Pack
          </h4>
          <div className="bg-[#F5F7FA] rounded-lg p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#FF9800] rounded flex items-center justify-center text-white font-semibold text-sm">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#0C0C0C]">Copper Wire 10m</p>
                <p className="text-xs text-[#555555] mt-0.5">Heavy item - Handle with care</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-[#FF9800] rounded flex items-center justify-center text-white font-semibold text-sm">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#0C0C0C]">Electrical Tape</p>
                <p className="text-xs text-[#555555] mt-0.5">Standard item</p>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3 flex items-center">
              <div className="w-1 h-4 bg-[#00C897] rounded mr-2"></div>
              Professional Info
            </h4>
            <div className="bg-[#F5F7FA] rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <img
                  src="https://ui-avatars.com/api/?name=Rahul+Das&background=00C897&color=fff"
                  alt="Professional"
                  className="w-12 h-12 rounded-full border-2 border-[#00C897] shadow-sm"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-[#0C0C0C]">Rahul Das</h5>
                      <p className="text-xs text-[#555555]">Electrician</p>
                    </div>
                    <button className="bg-[#1A73E8] text-white px-3 py-1.5 rounded-lg hover:bg-[#1557B0] transition text-xs font-medium flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E0E0E0]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#555555]">Est. Pickup Time</span>
                  <span className="font-semibold text-[#0C0C0C]">{time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col">
          {/* Notes Section */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3 flex items-center">
              <div className="w-1 h-4 bg-[#FF9800] rounded mr-2"></div>
              Packing Notes
            </h4>
            <textarea
              placeholder="Add notes for packing instructions, special handling, or any issues..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] resize-none text-sm bg-[#F5F7FA]"
            />
            <p className="text-xs text-[#555555] mt-2">These notes will be visible to the professional</p>
          </div>

          {/* Checklist */}
          <div className="bg-[#F5F7FA] rounded-lg p-4 mb-4">
            <h5 className="text-sm font-semibold text-[#0C0C0C] mb-3">Packing Checklist</h5>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-[#00C897] rounded" />
                <span className="text-sm text-[#555555]">All items collected</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-[#00C897] rounded" />
                <span className="text-sm text-[#555555]">Items properly packed</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-[#00C897] rounded" />
                <span className="text-sm text-[#555555]">Quality checked</span>
              </label>
            </div>
          </div>
          
          {/* Action Button */}
          <button
            onClick={handleMarkReady}
            className="w-full bg-[#00C897] text-white py-3.5 md:py-4 rounded-lg font-semibold hover:bg-[#00B184] transition-all duration-200 shadow-md hover:shadow-xl text-sm md:text-base flex items-center justify-center space-x-2 mt-auto"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Mark as Ready for Pickup</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Ready for Pickup Tab
function ReadyForPickupTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg lg:text-xl font-semibold text-[#0C0C0C]">Ready for Pickup</h2>
        <p className="text-sm text-[#555555] mt-1">Orders ready to be handed over</p>
      </div>
      <div className="space-y-4 lg:space-y-5">
        <ReadyOrderCard orderId="ORD37821" />
        <ReadyOrderCard orderId="ORD37822" status="Completed" />
      </div>
    </div>
  );
}

function ReadyOrderCard({ orderId, status = 'Success' }: { orderId: string; status?: string }) {
  const [otp, setOtp] = useState('');
  const [verifyWithOTP, setVerifyWithOTP] = useState(false);

  const handleComplete = () => {
    if (verifyWithOTP && otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    if (window.confirm(`Confirm handover of order ${orderId} to professional?`)) {
      alert(`Order ${orderId} completed and handed over!`);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm p-4 md:p-6 hover:shadow-lg hover:border-[#1A73E8]/30 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E0E0E0]">
        <div>
          <h3 className="text-base md:text-lg font-bold text-[#0C0C0C]">#{orderId}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="w-3.5 h-3.5 text-[#555555]" />
            <p className="text-xs md:text-sm text-[#555555]">2 minutes ago</p>
          </div>
        </div>
        <span className={`px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-sm ${
          status === 'Completed' ? 'bg-[#4CAF50]' : 'bg-[#1A73E8]'
        } text-white flex items-center space-x-1.5`}>
          <ShoppingBag className="w-4 h-4" />
          <span>{status}</span>
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          {/* Professional Info */}
          <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3 flex items-center">
            <div className="w-1 h-4 bg-[#00C897] rounded mr-2"></div>
            Professional Details
          </h4>
          <div className="bg-[#F5F7FA] rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://ui-avatars.com/api/?name=Rahul+Das&background=00C897&color=fff"
                alt="Professional"
                className="w-14 h-14 rounded-full border-2 border-[#00C897] shadow-sm"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-[#0C0C0C] text-base">Rahul Das</h5>
                    <p className="text-xs text-[#555555] mt-0.5">Electrician</p>
                  </div>
                  <button className="bg-[#1A73E8] text-white p-2.5 rounded-lg hover:bg-[#1557B0] transition shadow-sm">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-1 mt-2">
                  <span className="text-yellow-500 text-sm">⭐</span>
                  <span className="text-sm font-semibold text-[#0C0C0C]">4.7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Packed */}
          <div>
            <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3 flex items-center">
              <div className="w-1 h-4 bg-[#1A73E8] rounded mr-2"></div>
              Items Packed
            </h4>
            <div className="bg-[#F5F7FA] rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                <span className="text-[#0C0C0C]">Copper Wire 10m × 2</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                <span className="text-[#0C0C0C]">Electrical Tape × 1</span>
              </div>
              <div className="pt-2 mt-2 border-t border-[#E0E0E0]">
                <div className="flex justify-between">
                  <span className="text-sm text-[#555555]">Total Amount</span>
                  <span className="text-lg font-bold text-[#00C897]">₹320</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col">
          {/* OTP Verification Toggle */}
          <div className="bg-[#F5F7FA] rounded-lg p-4 mb-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={verifyWithOTP}
                onChange={(e) => setVerifyWithOTP(e.target.checked)}
                className="w-5 h-5 text-[#1A73E8] rounded"
              />
              <div>
                <p className="font-semibold text-[#0C0C0C] text-sm">Verify with OTP</p>
                <p className="text-xs text-[#555555] mt-0.5">Professional must provide OTP for secure handover</p>
              </div>
            </label>
          </div>

          {/* OTP Input */}
          {verifyWithOTP && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-[#0C0C0C] mb-2 flex items-center">
                <div className="w-1 h-4 bg-[#1A73E8] rounded mr-2"></div>
                Enter OTP
              </h4>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-4 border-2 border-[#1A73E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A73E8] text-center text-3xl font-bold tracking-[0.5em] bg-[#F5F7FA]"
                maxLength={6}
              />
              <p className="text-xs text-[#555555] mt-2 text-center">Ask professional for 6-digit OTP</p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-[#1A73E8]/20 rounded-lg p-4 mb-4">
            <h5 className="text-sm font-semibold text-[#1A73E8] mb-2">Handover Instructions</h5>
            <ul className="space-y-1.5 text-xs text-[#555555]">
              <li className="flex items-start space-x-2">
                <span className="text-[#1A73E8] mt-0.5">•</span>
                <span>Verify professional identity</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#1A73E8] mt-0.5">•</span>
                <span>Check all items are packed</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#1A73E8] mt-0.5">•</span>
                <span>Confirm OTP if verification enabled</span>
              </li>
            </ul>
          </div>

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            className="w-full bg-[#4CAF50] text-white py-3.5 md:py-4 rounded-lg font-semibold hover:bg-[#43A047] transition-all duration-200 shadow-md hover:shadow-xl text-sm md:text-base flex items-center justify-center space-x-2 mt-auto"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Confirm Handover & Complete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Completed Orders Tab
function CompletedOrdersTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg lg:text-xl font-semibold text-[#0C0C0C]">Completed Orders</h2>
        <p className="text-sm text-[#555555] mt-1">Successfully completed orders</p>
      </div>
      <div className="space-y-4 lg:space-y-5">
        <CompletedOrderCard orderId="ORD37821" completionTime="09:05:37 AM" earnings="₹87.85" />
        <CompletedOrderCard orderId="ORD37822" completionTime="07:55:33 PM" earnings="₹6,975" />
        <CompletedOrderCard orderId="ORD37823" completionTime="12:55:53 PM" earnings="N/A" cancelled />
      </div>
    </div>
  );
}

function CompletedOrderCard({ orderId, completionTime, earnings, cancelled = false }: { orderId: string; completionTime: string; earnings: string; cancelled?: boolean }) {
  const handleDownloadInvoice = () => {
    alert(`Downloading invoice for order ${orderId}...`);
  };

  const handleViewDetails = () => {
    alert(`Opening details for order ${orderId}...`);
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-4 md:p-6 transition-all duration-200 ${
      cancelled ? 'border-2 border-[#E53935] bg-red-50/20 hover:shadow-md' : 'border-[#E0E0E0] hover:shadow-lg hover:border-[#9C27B0]/30'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E0E0E0]">
        <div>
          <h3 className="text-base md:text-lg font-bold text-[#0C0C0C]">#{orderId}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <Clock className="w-3.5 h-3.5 text-[#555555]" />
            <p className="text-xs md:text-sm text-[#555555]">Completed 2 hours ago</p>
          </div>
        </div>
        <span className={`px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-semibold text-white shadow-sm flex items-center space-x-1.5 ${
          cancelled ? 'bg-[#E53935]' : 'bg-[#9C27B0]'
        }`}>
          {cancelled ? (
            <>
              <XCircle className="w-4 h-4" />
              <span>Cancelled</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Paid</span>
            </>
          )}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Column 1: Items/Cancellation */}
        <div>
          <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3 flex items-center">
            <div className={`w-1 h-4 rounded mr-2 ${
              cancelled ? 'bg-[#E53935]' : 'bg-[#1A73E8]'
            }`}></div>
            {cancelled ? 'Cancellation Details' : 'Order Items'}
          </h4>
          {cancelled ? (
            <div className="bg-red-50 border border-[#E53935]/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-[#E53935] mb-2">Shop closed</p>
              <div className="mt-3 pt-3 border-t border-[#E53935]/20">
                <p className="text-xs text-[#555555] mb-2">Cancelled by</p>
                <div className="flex items-center space-x-2">
                  <img
                    src="https://ui-avatars.com/api/?name=Rahul+Das&background=E53935&color=fff"
                    alt="Professional"
                    className="w-8 h-8 rounded-full border-2 border-[#E53935]"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#0C0C0C]">Rahul Das</p>
                    <p className="text-xs text-[#555555]">Professional</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#F5F7FA] rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#555555]">Copper Wire 10m</span>
                <span className="font-medium">× 2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#555555]">Electrical Tape</span>
                <span className="font-medium">× 1</span>
              </div>
              <div className="pt-2 mt-2 border-t border-[#E0E0E0]">
                <div className="flex justify-between">
                  <span className="text-sm text-[#555555]">Total</span>
                  <span className="text-lg font-bold text-[#00C897]">₹320</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Payment/Refund Details */}
        <div>
          <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3 flex items-center">
            <div className={`w-1 h-4 rounded mr-2 ${
              cancelled ? 'bg-[#FF9800]' : 'bg-[#4CAF50]'
            }`}></div>
            {cancelled ? 'Refund Information' : 'Payment Details'}
          </h4>
          <div className="bg-[#F5F7FA] rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#555555]">Completion Time</span>
              <span className="text-sm font-medium text-[#0C0C0C]">{completionTime}</span>
            </div>
            {!cancelled && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#555555]">Payment Method</span>
                  <div className="flex items-center space-x-1">
                    <CreditCard className="w-3.5 h-3.5 text-[#1A73E8]" />
                    <span className="text-sm font-medium text-[#1A73E8]">Card</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#E0E0E0]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#0C0C0C]">Your Earnings</span>
                    <span className="text-lg font-bold text-[#4CAF50]">{earnings}</span>
                  </div>
                </div>
              </>
            )}
            {cancelled && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#555555]">Refund Status</span>
                  <span className="text-sm font-semibold text-[#4CAF50]">Processed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#555555]">Refund Amount</span>
                  <span className="text-sm font-semibold text-[#0C0C0C]">₹320</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Column 3: Actions */}
        <div className="flex flex-col justify-center space-y-3">
          {!cancelled && (
            <>
              <button 
                onClick={handleDownloadInvoice}
                className="w-full bg-[#1A73E8] text-white py-2.5 md:py-3 rounded-lg font-medium hover:bg-[#1557B0] transition-all duration-200 shadow-sm hover:shadow-md text-sm flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Invoice</span>
              </button>
              <button 
                onClick={handleViewDetails}
                className="w-full bg-[#F5F7FA] border border-[#E0E0E0] text-[#0C0C0C] py-2.5 md:py-3 rounded-lg font-medium hover:bg-[#E0E0E0] transition-all duration-200 text-sm flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>View Details</span>
              </button>
            </>
          )}
          {cancelled && (
            <div className="bg-[#FFEBEE] border-2 border-[#E53935]/30 rounded-lg p-4 text-center">
              <XCircle className="w-8 h-8 text-[#E53935] mx-auto mb-2" />
              <p className="text-sm text-[#E53935] font-semibold mb-1">Order Cancelled</p>
              <p className="text-xs text-[#555555]">Refund processed successfully</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Cancelled Orders Tab
function CancelledOrdersTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg lg:text-xl font-semibold text-[#0C0C0C]">Cancelled Orders</h2>
        <p className="text-sm text-[#555555] mt-1">Track cancelled orders and reasons</p>
      </div>
      <div className="space-y-4 lg:space-y-5">
        <CancelledOrderCard orderId="ORD37821" reason="Shop closed" cancelledBy="Rahul Das" timestamp="0:35:57 AM" />
        <CancelledOrderCard orderId="ORD37822" reason="Shop closed" cancelledBy="Rahul Das" timestamp="10:51:51 PM" />
      </div>
    </div>
  );
}

function CancelledOrderCard({ orderId, reason, cancelledBy, timestamp }: { orderId: string; reason: string; cancelledBy: string; timestamp: string }) {
  return (
    <div className="bg-white rounded-xl border-2 border-[#E53935] shadow-sm p-4 md:p-6 bg-red-50/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E0E0E0]">
        <div>
          <h3 className="text-base md:text-lg font-bold text-[#0C0C0C]">#{orderId}</h3>
          <p className="text-xs md:text-sm text-[#555555]">2 minutes ago</p>
        </div>
        <span className="bg-[#E53935] text-white px-3 py-1 rounded-lg text-xs md:text-sm font-semibold">
          Cancelled
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cancellation Reason */}
        <div>
          <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3">Cancellation Reason</h4>
          <p className="text-sm text-[#555555] mb-3">{reason}</p>
          <div>
            <p className="text-xs text-[#555555] mb-2">Cancelled by</p>
            <div className="flex items-center space-x-2">
              <img
                src="https://ui-avatars.com/api/?name=Rahul+Das&background=E53935&color=fff"
                alt="User"
                className="w-8 h-8 rounded-full border border-[#E53935]"
              />
              <span className="text-sm font-medium text-[#0C0C0C]">{cancelledBy}</span>
            </div>
          </div>
        </div>

        {/* Refund Status */}
        <div>
          <h4 className="text-sm font-semibold text-[#0C0C0C] mb-3">Refund Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#555555]">Refund Status</span>
              <span className="font-medium text-[#4CAF50]">Refund</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#555555]">Timestamp</span>
              <span className="font-medium">{timestamp}</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center">
          <div className="w-full bg-[#FFEBEE] border border-[#E53935] rounded-lg p-4 text-center">
            <p className="text-sm text-[#E53935] font-medium">Bow can seten ranning</p>
          </div>
        </div>
      </div>
    </div>
  );
}
