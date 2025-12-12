'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { MapPin, Phone, Mail, Store, Calendar, FileText, CheckCircle2, XCircle, Clock, Download, Eye, AlertTriangle, Star, Ban, TrendingUp, Package, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ShopProfileViewPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data
  const shopData = {
    id: 'SHOP001',
    name: 'Super Electronics Store',
    logo: 'SE',
    category: 'Electronics',
    rating: 4.7,
    totalReviews: 1245,
    status: 'active',
    verified: true,
    owner: {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      avatar: 'RK',
    },
    address: {
      street: '123 Main Street, Commercial Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      coordinates: { lat: 19.0760, lng: 72.8777 },
    },
    business: {
      gst: 'GST1234567890',
      type: 'Retail Store',
      onboardingDate: '2024-01-15',
    },
    documents: [
      { id: 1, name: 'Owner Aadhar Card', type: 'ID Proof', status: 'verified', url: '#', uploadDate: '2024-01-10' },
      { id: 2, name: 'GST Certificate', type: 'Tax Document', status: 'verified', url: '#', uploadDate: '2024-01-10' },
      { id: 3, name: 'Trade License', type: 'Business License', status: 'pending', url: '#', uploadDate: '2024-01-12' },
      { id: 4, name: 'Shop Registration', type: 'Registration', status: 'verified', url: '#', uploadDate: '2024-01-10' },
    ],
    photos: [
      { id: 1, type: 'Exterior', url: '#', caption: 'Shop front view' },
      { id: 2, type: 'Interior', url: '#', caption: 'Inside store' },
      { id: 3, type: 'Work Area', url: '#', caption: 'Service counter' },
      { id: 4, type: 'Shelf Display', url: '#', caption: 'Product display' },
    ],
    businessHours: [
      { day: 'Monday', open: '09:00 AM', close: '09:00 PM', closed: false },
      { day: 'Tuesday', open: '09:00 AM', close: '09:00 PM', closed: false },
      { day: 'Wednesday', open: '09:00 AM', close: '09:00 PM', closed: false },
      { day: 'Thursday', open: '09:00 AM', close: '09:00 PM', closed: false },
      { day: 'Friday', open: '09:00 AM', close: '09:00 PM', closed: false },
      { day: 'Saturday', open: '10:00 AM', close: '08:00 PM', closed: false },
      { day: 'Sunday', open: '-', close: '-', closed: true },
    ],
    products: [
      { id: 1, name: 'iPhone 15 Pro', price: 134900, stock: 25, status: 'approved', category: 'Smartphones' },
      { id: 2, name: 'Samsung Galaxy S24', price: 79999, stock: 15, status: 'approved', category: 'Smartphones' },
      { id: 3, name: 'MacBook Air M2', price: 114900, stock: 8, status: 'pending', category: 'Laptops' },
      { id: 4, name: 'AirPods Pro', price: 24900, stock: 0, status: 'rejected', category: 'Accessories' },
    ],
    reviews: [
      { id: 1, customer: 'Amit Sharma', rating: 5, comment: 'Excellent service and genuine products!', date: '2024-12-05', flagged: false },
      { id: 2, customer: 'Priya Patel', rating: 4, comment: 'Good prices but delivery was delayed.', date: '2024-12-03', flagged: false },
      { id: 3, customer: 'Rahul Gupta', rating: 2, comment: 'Product was damaged. Poor packaging.', date: '2024-11-28', flagged: true },
    ],
    strikes: [
      { id: 1, date: '2024-11-20', reason: 'Late delivery complaints', issuedBy: 'Admin Team', evidence: 'customer_complaints.pdf' },
    ],
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-50 text-green-700 border-green-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
      verified: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Shop Profile</h1>
            <p className="text-sm text-gray-500">Complete shop information and verification details</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-[#D32F2F] text-white rounded-lg hover:bg-[#b71c1c] transition-colors font-medium flex items-center space-x-2">
              <Ban className="w-4 h-4" />
              <span>Suspend Shop</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-[#1A73E8] to-[#6C63FF] rounded-2xl p-8 mb-8 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-4xl font-bold backdrop-blur-sm">
                  {shopData.logo}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-3xl font-bold">{shopData.name}</h2>
                    {shopData.verified && (
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <p className="text-white text-opacity-90 text-lg mb-2">{shopData.category}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                      <span className="font-bold text-xl">{shopData.rating}</span>
                      <span className="text-white text-opacity-80 text-sm">({shopData.totalReviews} reviews)</span>
                    </div>
                    <span className="px-4 py-1 bg-white bg-opacity-20 rounded-full text-sm font-semibold">
                      {shopData.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-opacity-80 text-sm mb-1">Shop ID</p>
                <p className="text-xl font-bold">{shopData.id}</p>
              </div>
            </div>
          </div>

          {/* 1. Shop Information Card */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
              <Store className="w-6 h-6 text-[#1A73E8]" />
              <span>Shop Information</span>
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold text-[#0B0F19]">{shopData.owner.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold text-[#0B0F19]">{shopData.owner.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-semibold text-[#0B0F19]">{shopData.address.street}</p>
                    <p className="text-sm text-gray-600">{shopData.address.city}, {shopData.address.state} - {shopData.address.pincode}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">GST Number</p>
                    <p className="font-semibold text-[#0B0F19]">{shopData.business.gst}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Store className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Shop Type</p>
                    <p className="font-semibold text-[#0B0F19]">{shopData.business.type}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Onboarding Date</p>
                    <p className="font-semibold text-[#0B0F19]">{new Date(shopData.business.onboardingDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Google Map Location</span>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  View on Map
                </button>
              </div>
            </div>
          </div>

          {/* 2. Documents Section */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-[#1A73E8]" />
              <span>Documents & Verification</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {shopData.documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-[#0B0F19]">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type}</p>
                      <p className="text-xs text-gray-400 mt-1">Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-[#1A73E8] text-white rounded-lg text-sm hover:bg-[#1557b0] transition-colors flex items-center justify-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    {doc.status === 'pending' && (
                      <>
                        <button className="px-3 py-2 bg-[#00C853] text-white rounded-lg text-sm hover:bg-[#00a844] transition-colors">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-2 bg-[#D32F2F] text-white rounded-lg text-sm hover:bg-[#b71c1c] transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Shop Photos */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
              <ImageIcon className="w-6 h-6 text-[#1A73E8]" />
              <span>Shop Photos Gallery</span>
            </h3>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-semibold">{shopData.photos[currentImageIndex].type}</p>
                  <p className="text-sm text-gray-500">{shopData.photos[currentImageIndex].caption}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? shopData.photos.length - 1 : prev - 1))}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex space-x-2">
                  {shopData.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-[#1A73E8]' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === shopData.photos.length - 1 ? 0 : prev + 1))}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 4. Business Hours */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
              <Clock className="w-6 h-6 text-[#1A73E8]" />
              <span>Business Hours</span>
            </h3>
            <div className="space-y-2">
              {shopData.businessHours.map((schedule) => (
                <div key={schedule.day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-[#0B0F19] w-32">{schedule.day}</span>
                  {schedule.closed ? (
                    <span className="text-red-600 font-semibold">Closed</span>
                  ) : (
                    <span className="text-gray-600">{schedule.open} - {schedule.close}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5. Product List */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
              <Package className="w-6 h-6 text-[#1A73E8]" />
              <span>Product List</span>
            </h3>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shopData.products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 font-medium text-[#0B0F19]">{product.name}</td>
                    <td className="px-4 py-3 font-semibold text-[#00C853]">₹{product.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`${product.stock === 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="px-3 py-1 bg-[#1A73E8] text-white rounded-lg text-sm hover:bg-[#1557b0] transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 6. Reviews & Ratings */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
              <Star className="w-6 h-6 text-[#1A73E8]" />
              <span>Reviews & Ratings</span>
            </h3>
            <div className="space-y-4">
              {shopData.reviews.map((review) => (
                <div key={review.id} className={`p-4 rounded-xl border ${review.flagged ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-[#0B0F19]">{review.customer}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    {review.flagged && (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Warnings & Strike History */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-[#D32F2F]" />
              <span>Warnings & Strike History</span>
            </h3>
            {shopData.strikes.length > 0 ? (
              <div className="space-y-4">
                {shopData.strikes.map((strike) => (
                  <div key={strike.id} className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-red-900">Strike #{strike.id}</p>
                        <p className="text-sm text-red-700 mt-1">{strike.reason}</p>
                      </div>
                      <span className="text-xs text-red-600">{new Date(strike.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-red-200">
                      <p className="text-xs text-red-600">Issued by: {strike.issuedBy}</p>
                      <button className="text-xs text-red-700 hover:text-red-900 font-semibold">View Evidence</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600">No strikes or warnings issued</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
