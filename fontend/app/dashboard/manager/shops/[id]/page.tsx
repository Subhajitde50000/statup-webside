'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle, Ban, MessageSquare, Download, Mail, Phone, MapPin, 
  Calendar, Package, Star, Clock, AlertTriangle, FileText, Eye, XCircle, Edit, Trash2,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function ShopProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('info');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data - replace with actual API call
  const shop = {
    id: params.id,
    name: 'ElectroWorld Pro',
    email: 'contact@electroworld.com',
    phone: '+91 98765 43210',
    gstNumber: '29ABCDE1234F1Z5',
    address: '123 Park Street, Sector V, Salt Lake, Kolkata - 700091, West Bengal, India',
    category: 'Electronics',
    owner: 'Rajesh Kumar',
    registrationDate: '2024-01-15',
    status: 'active',
    verified: true,
    rating: 4.8,
    reviewCount: 234,
    photos: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    ],
    documents: [
      { id: 1, name: 'GST Certificate', type: 'gst', status: 'approved', url: '#' },
      { id: 2, name: 'Business License', type: 'license', status: 'approved', url: '#' },
      { id: 3, name: 'Owner ID Proof', type: 'id', status: 'pending', url: '#' },
      { id: 4, name: 'Shop Registration', type: 'registration', status: 'approved', url: '#' },
    ],
    timings: {
      monday: '9:00 AM - 9:00 PM',
      tuesday: '9:00 AM - 9:00 PM',
      wednesday: '9:00 AM - 9:00 PM',
      thursday: '9:00 AM - 9:00 PM',
      friday: '9:00 AM - 9:00 PM',
      saturday: '9:00 AM - 10:00 PM',
      sunday: '10:00 AM - 8:00 PM',
    },
    warnings: [
      { id: 1, type: 'Late Delivery', date: '2024-11-20', severity: 'low', description: '3 orders delivered late this week' },
      { id: 2, type: 'Customer Complaint', date: '2024-10-15', severity: 'medium', description: 'Product quality issues reported' },
    ]
  };

  const products = [
    { id: 1, name: 'LED Bulb 15W', category: 'Lighting', price: 299, stock: 450, visibility: 'shown', rating: 4.5 },
    { id: 2, name: 'Wall Socket Modular', category: 'Electrical', price: 149, stock: 230, visibility: 'shown', rating: 4.7 },
    { id: 3, name: 'Extension Cord 5M', category: 'Accessories', price: 399, stock: 0, visibility: 'hidden', rating: 4.2 },
    { id: 4, name: 'MCB 32A Double Pole', category: 'Switchgear', price: 549, stock: 120, visibility: 'shown', rating: 4.8 },
  ];

  const reviews = [
    { id: 1, customer: 'Amit Kumar', rating: 5, review: 'Excellent products and fast delivery!', date: '2024-12-05' },
    { id: 2, customer: 'Priya Singh', rating: 4, review: 'Good quality, but packaging could be better.', date: '2024-12-03' },
    { id: 3, customer: 'Rahul Sharma', rating: 5, review: 'Genuine products at reasonable prices', date: '2024-12-01' },
  ];

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
          <Link href="/dashboard/manager/shops">
            <button className="flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Shops</span>
            </button>
          </Link>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white text-2xl font-bold">
                  {shop.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-[#1E293B] mb-2">{shop.name}</h1>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      shop.status === 'active' 
                        ? 'bg-[#D1FAE5] text-[#059669]' 
                        : 'bg-[#FEE2E2] text-[#DC2626]'
                    }`}>
                      {shop.status.toUpperCase()}
                    </span>
                    {shop.verified && (
                      <div className="flex items-center gap-1 text-[#059669]">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-semibold">Verified</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                      <span className="text-sm font-semibold text-[#1E293B]">{shop.rating}</span>
                      <span className="text-xs text-[#64748B]">({shop.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!shop.verified && (
                  <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                )}
                <button className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors text-sm font-medium flex items-center gap-2">
                  <Ban className="w-4 h-4" />
                  Suspend
                </button>
                <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>
                <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] mb-6 overflow-hidden">
          <div className="flex items-center gap-1 p-2 overflow-x-auto">
            {['info', 'photos', 'documents', 'products', 'timings', 'reviews', 'warnings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#3B82F6] text-white shadow-sm'
                    : 'text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Shop Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Shop Name</label>
                  <p className="text-sm text-[#1E293B] mt-1 font-medium">{shop.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <p className="text-sm text-[#3B82F6] mt-1">{shop.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone
                  </label>
                  <p className="text-sm text-[#3B82F6] mt-1">{shop.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">GST Number</label>
                  <p className="text-sm text-[#1E293B] mt-1 font-mono">{shop.gstNumber}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Owner Name</label>
                  <p className="text-sm text-[#1E293B] mt-1 font-medium">{shop.owner}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Category</label>
                  <p className="text-sm text-[#1E293B] mt-1">{shop.category}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Registration Date
                  </label>
                  <p className="text-sm text-[#1E293B] mt-1">{shop.registrationDate}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Complete Address
                  </label>
                  <p className="text-sm text-[#1E293B] mt-1 leading-relaxed">{shop.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Shop Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {shop.photos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden border border-[#E2E8F0] group cursor-pointer relative hover:shadow-lg transition-all">
                  <img src={photo} alt={`Shop ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
              ))}
              <div className="aspect-square rounded-lg border-2 border-dashed border-[#E2E8F0] flex items-center justify-center cursor-pointer hover:border-[#3B82F6] transition-colors">
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                  <p className="text-xs text-[#64748B]">Add Photo</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shop.documents.map((doc) => (
                <div key={doc.id} className="border border-[#E2E8F0] rounded-lg p-4 hover:border-[#3B82F6] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[#3B82F6]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1E293B] text-sm">{doc.name}</h3>
                        <span className={`text-xs font-semibold mt-1 inline-block ${
                          doc.status === 'approved' ? 'text-[#059669]' : 'text-[#F59E0B]'
                        }`}>
                          {doc.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-3 py-2 bg-[#F8FAFC] text-[#3B82F6] rounded-lg hover:bg-[#EFF6FF] transition-colors text-xs font-medium flex items-center justify-center gap-1">
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    {doc.status === 'pending' && (
                      <>
                        <button className="flex-1 px-3 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-xs font-medium flex items-center justify-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </button>
                        <button className="flex-1 px-3 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors text-xs font-medium flex items-center justify-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-semibold text-[#1E293B]">Products</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase">Product</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase">Category</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase">Price</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase">Stock</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase">Visibility</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase">Rating</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                      <td className="py-4 px-6 font-semibold text-[#1E293B] text-sm">{product.name}</td>
                      <td className="py-4 px-6 text-[#64748B] text-sm">{product.category}</td>
                      <td className="py-4 px-6 text-[#1E293B] font-semibold text-sm">₹{product.price}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          product.stock === 0 
                            ? 'bg-[#FEE2E2] text-[#DC2626]' 
                            : product.stock < 50 
                            ? 'bg-[#FEF3C7] text-[#D97706]' 
                            : 'bg-[#D1FAE5] text-[#059669]'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          product.visibility === 'shown' 
                            ? 'bg-[#D1FAE5] text-[#059669]' 
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}>
                          {product.visibility}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                          <span className="text-sm font-semibold">{product.rating}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-[#3B82F6] hover:bg-[#EFF6FF] rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-[#EF4444] hover:bg-[#FEF2F2] rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'timings' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#3B82F6]" />
              Opening Hours
            </h2>
            <div className="space-y-3">
              {Object.entries(shop.timings).map(([day, time]) => (
                <div key={day} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                  <span className="font-semibold text-[#1E293B] capitalize">{day}</span>
                  <span className="text-sm text-[#64748B]">{time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border border-[#E2E8F0] rounded-lg p-4 hover:border-[#3B82F6] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-[#1E293B] text-sm">{review.customer}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E2E8F0]'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#64748B]">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-[#EF4444] hover:bg-[#FEF2F2] rounded transition-colors text-xs">
                        Remove
                      </button>
                      <button className="p-1.5 text-[#F59E0B] hover:bg-[#FFFBEB] rounded transition-colors text-xs">
                        Flag
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[#64748B] leading-relaxed">{review.review}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'warnings' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              Warnings & Strikes
            </h2>
            {shop.warnings.length > 0 ? (
              <div className="space-y-4">
                {shop.warnings.map((warning) => (
                  <div 
                    key={warning.id} 
                    className={`border-l-4 rounded-lg p-4 ${
                      warning.severity === 'high' 
                        ? 'border-[#EF4444] bg-[#FEF2F2]' 
                        : warning.severity === 'medium' 
                        ? 'border-[#F59E0B] bg-[#FFFBEB]' 
                        : 'border-[#3B82F6] bg-[#EFF6FF]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-[#1E293B] text-sm mb-1">{warning.type}</h3>
                        <p className="text-sm text-[#64748B] mb-2">{warning.description}</p>
                        <span className="text-xs text-[#64748B]">{warning.date}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        warning.severity === 'high' 
                          ? 'bg-[#FEE2E2] text-[#DC2626]' 
                          : warning.severity === 'medium' 
                          ? 'bg-[#FEF3C7] text-[#D97706]' 
                          : 'bg-[#DBEAFE] text-[#2563EB]'
                      }`}>
                        {warning.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
                <p className="text-[#64748B]">No warnings or strikes</p>
              </div>
            )}
          </div>
        )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
