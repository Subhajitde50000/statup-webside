'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Star, MapPin, Clock, CheckCircle, Heart, Share2, MessageCircle, Phone, Navigation, Package, Truck, Timer, TrendingUp, ChevronDown, ShoppingCart, Plus, Eye, Filter, ChevronRight, Shield, Zap, Wrench, RefreshCw, X } from 'lucide-react';
import StoreNavbar from '../../Component/StoreNavbar';

// Mock store data
const MOCK_STORE_DATA = {
  1: {
    id: 1,
    name: 'Prime Electronics Store',
    category: 'Electrical',
    rating: 4.7,
    reviews: 328,
    description: 'Official Authorized Electrical Store',
    bannerImage: 'https://placehold.co/1200x300',
    logo: 'https://placehold.co/120x120',
    verified: true,
    since: '2021',
    location: 'Andheri West, Mumbai',
    isOpen: true,
    openTime: '9:00 AM - 9:00 PM',
    phone: '+91 98765 43210',
    
    stats: {
      products: 248,
      orders: 12430,
      avgDeliveryTime: '45 mins',
      responseRate: '98%'
    },
    
    services: {
      delivery: true,
      pickup: true,
      sameDay: true,
      installation: true
    },
    
    highlights: [
      { icon: '✔', title: 'Genuine Products', desc: '100% authentic products' },
      { icon: '⚡', title: 'Fast Delivery', desc: 'Same-day delivery available' },
      { icon: '🔧', title: 'Professional Compatible', desc: 'Works with professionals' },
      { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' }
    ],
    
    policies: {
      return: 'Products can be returned within 7 days of delivery. Items must be unused and in original packaging.',
      warranty: 'We honor manufacturer warranties. Extended warranty available on select products.',
      delivery: 'We deliver within 5km radius. Free delivery on orders above ₹499.',
      cancellation: 'Orders can be cancelled within 1 hour of placement for full refund.'
    },
    
    about: {
      fullDescription: 'Prime Electronics Store has been serving Mumbai with quality electrical products since 2021. We are an official authorized dealer for leading brands like Philips, Anchor, Polycab, and more. Our mission is to provide genuine products at competitive prices with excellent customer service.',
      specialties: ['Electrical Supplies', 'Professional Tools', 'Home Automation', 'Safety Equipment'],
      paymentMethods: ['Cash', 'Card', 'UPI', 'Net Banking', 'Wallets'],
      workingDays: 'Monday - Sunday',
      established: '2021',
      ownerName: 'Rajesh Sharma',
      email: 'contact@primeelectronics.com',
      address: 'Shop No. 15, Ground Floor, Andheri Link Road, Andheri West, Mumbai - 400053'
    },
    
    shopPhotos: [
      { id: 1, url: 'https://placehold.co/800x600', caption: 'Store Front View' },
      { id: 2, url: 'https://placehold.co/800x600', caption: 'Interior - Product Display' },
      { id: 3, url: 'https://placehold.co/800x600', caption: 'Tools Section' },
      { id: 4, url: 'https://placehold.co/800x600', caption: 'Lighting Products' },
      { id: 5, url: 'https://placehold.co/800x600', caption: 'Customer Service Area' },
      { id: 6, url: 'https://placehold.co/800x600', caption: 'Warehouse' }
    ]
  },
  2: {
    id: 2,
    name: 'City Electrical Mart',
    category: 'Electrical',
    rating: 4.5,
    reviews: 456,
    description: 'Trusted Electrical Solutions Since 2019',
    bannerImage: 'https://placehold.co/1200x300',
    logo: 'https://placehold.co/120x120',
    verified: true,
    since: '2019',
    location: 'Bandra East, Mumbai',
    isOpen: true,
    openTime: '8:00 AM - 10:00 PM',
    phone: '+91 98765 43211',
    
    stats: {
      products: 312,
      orders: 15680,
      avgDeliveryTime: '35 mins',
      responseRate: '96%'
    },
    
    services: {
      delivery: true,
      pickup: true,
      sameDay: true,
      installation: false
    },
    
    highlights: [
      { icon: '✔', title: 'Genuine Products', desc: '100% authentic products' },
      { icon: '⚡', title: 'Fast Delivery', desc: 'Express delivery available' },
      { icon: '🔧', title: 'Professional Compatible', desc: 'Bulk orders welcome' },
      { icon: '🔄', title: 'Easy Returns', desc: '10-day return policy' }
    ],
    
    policies: {
      return: 'Products can be returned within 10 days of delivery. Items must be unused and in original packaging.',
      warranty: 'We honor all manufacturer warranties and provide assistance with warranty claims.',
      delivery: 'We deliver within 8km radius. Free delivery on orders above ₹599.',
      cancellation: 'Orders can be cancelled within 2 hours of placement for full refund.'
    },
    
    about: {
      fullDescription: 'City Electrical Mart is your trusted partner for all electrical solutions in Mumbai. Established in 2019, we have built a reputation for quality products and exceptional service. We stock a wide range of electrical items from top brands.',
      specialties: ['Electrical Components', 'LED Lighting', 'Wiring Solutions', 'Circuit Protection'],
      paymentMethods: ['Cash', 'Card', 'UPI', 'Net Banking'],
      workingDays: 'Monday - Sunday',
      established: '2019',
      ownerName: 'Amit Patel',
      email: 'info@cityelectrical.com',
      address: 'Shop No. 8, Building A, Bandra Kurla Complex, Bandra East, Mumbai - 400051'
    },
    
    shopPhotos: [
      { id: 1, url: 'https://placehold.co/800x600', caption: 'Main Store Entrance' },
      { id: 2, url: 'https://placehold.co/800x600', caption: 'Product Showroom' },
      { id: 3, url: 'https://placehold.co/800x600', caption: 'LED Display Section' },
      { id: 4, url: 'https://placehold.co/800x600', caption: 'Wire & Cable Department' },
      { id: 5, url: 'https://placehold.co/800x600', caption: 'Billing Counter' }
    ]
  }
};

const MOCK_PRODUCTS = [
  { id: 1, name: 'Philips LED Bulb 9W Cool Day Light', brand: 'Philips', price: 129, mrp: 199, rating: 4.5, reviews: 1234, stock: 'In Stock', discount: 35, category: 'Lighting', image: 'https://placehold.co/200x200' },
  { id: 2, name: 'Anchor Roma Classic 6A Switch', brand: 'Anchor', price: 45, mrp: 65, rating: 4.3, reviews: 856, stock: 'In Stock', discount: 30, category: 'Switches', image: 'https://placehold.co/200x200' },
  { id: 3, name: 'Polycab 2.5 sqmm FR Wire 90m', brand: 'Polycab', price: 2499, mrp: 3200, rating: 4.7, reviews: 543, stock: 'In Stock', discount: 22, category: 'Wires', image: 'https://placehold.co/200x200' },
  { id: 4, name: 'Stanley Screwdriver Set (6 Pcs)', brand: 'Stanley', price: 399, mrp: 599, rating: 4.6, reviews: 789, stock: 'Low Stock', discount: 33, category: 'Tools', image: 'https://placehold.co/200x200' },
  { id: 5, name: 'GM 4 Socket Extension Board 3m', brand: 'GM', price: 249, mrp: 350, rating: 4.2, reviews: 967, stock: 'In Stock', discount: 29, category: 'Power', image: 'https://placehold.co/200x200' },
  { id: 6, name: 'Havells Crabtree 16A Switch', brand: 'Havells', price: 89, mrp: 125, rating: 4.5, reviews: 654, stock: 'In Stock', discount: 29, category: 'Switches', image: 'https://placehold.co/200x200' },
  { id: 7, name: 'Syska LED Tube Light 20W', brand: 'Syska', price: 299, mrp: 450, rating: 4.4, reviews: 432, stock: 'In Stock', discount: 34, category: 'Lighting', image: 'https://placehold.co/200x200' },
  { id: 8, name: 'V-Guard Voltage Stabilizer', brand: 'V-Guard', price: 1599, mrp: 2100, rating: 4.6, reviews: 321, stock: 'Out of Stock', discount: 24, category: 'Power', image: 'https://placehold.co/200x200' },
];

const MOCK_REVIEWS = [
  {
    id: 1,
    userName: 'Rajesh Kumar',
    rating: 5,
    date: '2 days ago',
    comment: 'Excellent store! Very genuine products and fast delivery. The staff is very helpful and professional.',
    verified: true,
    images: ['https://placehold.co/80x80', 'https://placehold.co/80x80']
  },
  {
    id: 2,
    userName: 'Priya Sharma',
    rating: 4,
    date: '1 week ago',
    comment: 'Good collection of electrical items. Prices are competitive. Delivery was on time.',
    verified: true,
    images: []
  },
  {
    id: 3,
    userName: 'Amit Patel',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Best electrical store in the area! They have everything you need and the quality is top-notch.',
    verified: true,
    images: ['https://placehold.co/80x80']
  }
];

const SIMILAR_STORES = [
  { id: 3, name: 'Kumar Plumbing Supply', logo: 'https://placehold.co/60x60', rating: 4.8, category: 'Plumbing', distance: 0.8 },
  { id: 4, name: 'Modern Hardware Store', logo: 'https://placehold.co/60x60', rating: 4.3, category: 'Electrical', distance: 3.1 },
  { id: 5, name: 'Elite Plumbing Solutions', logo: 'https://placehold.co/60x60', rating: 4.9, category: 'Plumbing', distance: 1.5 }
];

export default function StoreViewPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;
  
  const [store, setStore] = useState(MOCK_STORE_DATA[storeId] || MOCK_STORE_DATA[1]);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [isFollowing, setIsFollowing] = useState(false);
  const [reviewSort, setReviewSort] = useState('recent');
  const [expandedPolicy, setExpandedPolicy] = useState(null);
  const [showMobileActions, setShowMobileActions] = useState(true);
  const [showAboutShop, setShowAboutShop] = useState(false);
  const [showShopPhotos, setShowShopPhotos] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const categories = [
    'All Products',
    'Lighting',
    'Switches',
    'Wires',
    'Tools',
    'Power',
    'Offers 🔥'
  ];

  const filteredProducts = activeCategory === 'All Products' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
    // Implement cart functionality
  };

  const handleCallStore = () => {
    window.open(`tel:${store.phone}`);
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.name)}`;
    window.open(url, '_blank');
  };

  const handleChatStore = () => {
    router.push(`/messages/store-${storeId}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: store.name,
          text: `Check out ${store.name}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const togglePolicy = (policy) => {
    setExpandedPolicy(expandedPolicy === policy ? null : policy);
  };

  const ratingDistribution = [
    { stars: 5, percentage: 75, count: 246 },
    { stars: 4, percentage: 15, count: 49 },
    { stars: 3, percentage: 7, count: 23 },
    { stars: 2, percentage: 2, count: 7 },
    { stars: 1, percentage: 1, count: 3 }
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-32 md:pb-8">
      {/* Navbar */}
      <StoreNavbar 
        location={store.location}
        searchQuery=""
        setSearchQuery={() => {}}
        cartItemCount={0}
        onCartClick={() => router.push('/cart')}
      />

      {/* Back Button */}
      <div className="bg-white border-b sticky top-[57px] md:top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#1E2A5E] hover:text-[#00BFA6] transition"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Stores</span>
          </button>
        </div>
      </div>

      {/* Store Header Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-[#1E2A5E] to-[#2A3A7E] overflow-hidden">
        <img
          src={store.bannerImage}
          alt={store.name}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E2A5E]/80 to-transparent"></div>
        
        {/* Banner Text Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-sm md:text-base font-semibold opacity-90">
            {store.description}
          </p>
        </div>
      </div>

      {/* Store Profile Card (Overlapping Banner) */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-6">
          {/* Mobile: Logo and Basic Info in Row */}
          <div className="flex gap-4 mb-4">
            {/* Store Logo */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-xl border-4 border-white shadow-lg overflow-hidden bg-white">
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Store Name and Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <h1 className="text-xl md:text-3xl font-bold text-[#1F2937] flex-1">{store.name}</h1>
                {store.verified && (
                  <div className="flex items-center gap-1 bg-[#22C55E] text-white px-2 py-1 rounded-full text-xs font-bold flex-shrink-0">
                    <CheckCircle size={12} />
                    <span className="hidden sm:inline">Verified</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs md:text-sm text-[#6B7280]">
                  <span className="font-semibold text-[#1E2A5E]">{store.category}</span>
                  <span>•</span>
                  <span>Since {store.since}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#22C55E] text-white px-2 py-1 rounded-lg font-bold text-xs md:text-sm">
                    <Star size={12} fill="white" />
                    <span>{store.rating}</span>
                  </div>
                  <span className="text-xs md:text-sm text-[#6B7280]">{store.reviews}</span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg font-semibold text-xs ${
                    store.isOpen 
                      ? 'bg-[#22C55E]/10 text-[#22C55E]' 
                      : 'bg-[#EF4444]/10 text-[#EF4444]'
                  }`}>
                    <Clock size={12} />
                    {store.isOpen ? 'Open' : 'Closed'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location and Hours (Full Width on Mobile) */}
          <div className="space-y-2 mb-4 text-xs md:text-sm text-[#6B7280]">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="flex-shrink-0" />
              <span>{store.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="flex-shrink-0" />
              <span>{store.openTime}</span>
            </div>
          </div>

          {/* Service Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {store.services.delivery && (
              <span className="px-2.5 py-1 bg-[#00BFA6]/10 text-[#00BFA6] rounded-full text-xs font-semibold flex items-center gap-1">
                <Truck size={11} />
                <span className="hidden sm:inline">Delivery</span>
              </span>
            )}
            {store.services.pickup && (
              <span className="px-2.5 py-1 bg-[#FF9F43]/10 text-[#FF9F43] rounded-full text-xs font-semibold flex items-center gap-1">
                <Package size={11} />
                <span className="hidden sm:inline">Pickup</span>
              </span>
            )}
            {store.services.sameDay && (
              <span className="px-2.5 py-1 bg-[#1E2A5E]/10 text-[#1E2A5E] rounded-full text-xs font-semibold flex items-center gap-1">
                <Timer size={11} />
                <span className="hidden sm:inline">Same-Day</span>
              </span>
            )}
          </div>

          {/* Action Buttons - Full Width on Mobile */}
          <div className="grid grid-cols-3 md:flex md:flex-wrap gap-2">
            <button
              onClick={handleChatStore}
              className="col-span-3 md:col-span-1 px-4 py-2.5 bg-[#00BFA6] text-white rounded-lg font-semibold hover:bg-[#00A894] transition flex items-center justify-center gap-2 active:scale-95"
            >
              <MessageCircle size={18} />
              <span>Chat Store</span>
            </button>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-4 py-2.5 rounded-lg font-semibold transition flex items-center justify-center gap-2 active:scale-95 ${
                isFollowing
                  ? 'bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20'
                  : 'border-2 border-[#1E2A5E] text-[#1E2A5E] hover:bg-[#1E2A5E] hover:text-white'
              }`}
            >
              <Heart size={18} fill={isFollowing ? 'currentColor' : 'none'} />
              <span className="hidden md:inline">{isFollowing ? 'Following' : 'Follow'}</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#00BFA6] hover:text-[#00BFA6] transition active:scale-95 flex items-center justify-center"
              title="Share Store"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={handleCallStore}
              className="p-2.5 border-2 border-[#1E2A5E] text-[#1E2A5E] rounded-lg hover:bg-[#1E2A5E] hover:text-white transition active:scale-95 flex items-center justify-center"
              title="Call Store"
            >
              <Phone size={18} />
            </button>
            <button
              onClick={handleGetDirections}
              className="p-2.5 border-2 border-[#00BFA6] text-[#00BFA6] rounded-lg hover:bg-[#00BFA6] hover:text-white transition active:scale-95 flex items-center justify-center"
              title="Get Directions"
            >
              <Navigation size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* About Shop Section */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <button
            onClick={() => setShowAboutShop(!showAboutShop)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1E2A5E]/10 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-[#1E2A5E]" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-[#1F2937]">About Shop</h3>
                <p className="text-xs text-[#6B7280]">Store information and details</p>
              </div>
            </div>
            <ChevronDown
              size={24}
              className={`text-[#1E2A5E] transition-transform ${showAboutShop ? 'rotate-180' : ''}`}
            />
          </button>

          {showAboutShop && (
            <div className="px-6 py-4 border-t border-gray-200 space-y-6 animate-in slide-in-from-top">
              {/* Full Description */}
              <div>
                <h4 className="font-bold text-[#1F2937] mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00BFA6] rounded-full"></span>
                  About Us
                </h4>
                <p className="text-sm text-[#6B7280] leading-relaxed">{store.about.fullDescription}</p>
              </div>

              {/* Store Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock size={18} className="text-[#00BFA6] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#1F2937] mb-1">Working Hours</p>
                      <p className="text-xs text-[#6B7280]">{store.about.workingDays}</p>
                      <p className="text-xs text-[#6B7280]">{store.openTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin size={18} className="text-[#FF9F43] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#1F2937] mb-1">Address</p>
                      <p className="text-xs text-[#6B7280]">{store.about.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone size={18} className="text-[#1E2A5E] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#1F2937] mb-1">Contact</p>
                      <p className="text-xs text-[#6B7280]">{store.phone}</p>
                      <p className="text-xs text-[#6B7280]">{store.about.email}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-semibold text-[#1F2937] mb-2 flex items-center gap-2">
                      <Star size={16} className="text-[#00BFA6]" />
                      Specialties
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {store.about.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white text-[#1E2A5E] rounded-full text-xs font-semibold border border-[#1E2A5E]/20"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-semibold text-[#1F2937] mb-2 flex items-center gap-2">
                      <CheckCircle size={16} className="text-[#22C55E]" />
                      Payment Methods
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {store.about.paymentMethods.map((method, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white text-[#00BFA6] rounded-full text-xs font-semibold border border-[#00BFA6]/20"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-semibold text-[#1F2937] mb-2 flex items-center gap-2">
                      <TrendingUp size={16} className="text-[#FF9F43]" />
                      Business Info
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs text-[#6B7280]">
                        <span className="font-semibold">Owner:</span> {store.about.ownerName}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        <span className="font-semibold">Established:</span> {store.about.established}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        <span className="font-semibold">Category:</span> {store.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCallStore}
                  className="flex-1 min-w-[140px] px-4 py-2.5 bg-[#1E2A5E] text-white rounded-lg font-semibold hover:bg-[#2A3A7E] transition flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  Call Now
                </button>
                <button
                  onClick={handleGetDirections}
                  className="flex-1 min-w-[140px] px-4 py-2.5 bg-[#00BFA6] text-white rounded-lg font-semibold hover:bg-[#00A894] transition flex items-center justify-center gap-2"
                >
                  <Navigation size={16} />
                  Get Directions
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 min-w-[140px] px-4 py-2.5 border-2 border-[#FF9F43] text-[#FF9F43] rounded-lg font-semibold hover:bg-[#FF9F43] hover:text-white transition flex items-center justify-center gap-2"
                >
                  <Share2 size={16} />
                  Share Store
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shop Photos Section */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <button
            onClick={() => setShowShopPhotos(!showShopPhotos)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00BFA6]/10 rounded-lg flex items-center justify-center">
                <Eye size={20} className="text-[#00BFA6]" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-[#1F2937]">Shop Photos</h3>
                <p className="text-xs text-[#6B7280]">{store.shopPhotos.length} photos available</p>
              </div>
            </div>
            <ChevronDown
              size={24}
              className={`text-[#00BFA6] transition-transform ${showShopPhotos ? 'rotate-180' : ''}`}
            />
          </button>

          {showShopPhotos && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {store.shopPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-sm font-semibold">{photo.caption}</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-2 bg-white/90 rounded-full backdrop-blur-sm">
                        <Eye size={16} className="text-[#1E2A5E]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition"
          >
            <X size={24} />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <p className="text-white text-lg font-semibold">{selectedPhoto.caption}</p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => {
                    const currentIndex = store.shopPhotos.findIndex(p => p.id === selectedPhoto.id);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : store.shopPhotos.length - 1;
                    setSelectedPhoto(store.shopPhotos[prevIndex]);
                  }}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition flex items-center gap-2"
                >
                  <ChevronDown size={18} className="rotate-90" />
                  Previous
                </button>
                <span className="text-white text-sm">
                  {store.shopPhotos.findIndex(p => p.id === selectedPhoto.id) + 1} / {store.shopPhotos.length}
                </span>
                <button
                  onClick={() => {
                    const currentIndex = store.shopPhotos.findIndex(p => p.id === selectedPhoto.id);
                    const nextIndex = currentIndex < store.shopPhotos.length - 1 ? currentIndex + 1 : 0;
                    setSelectedPhoto(store.shopPhotos[nextIndex]);
                  }}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition flex items-center gap-2"
                >
                  Next
                  <ChevronDown size={18} className="-rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Store Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#00BFA6]/10 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-[#00BFA6]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1F2937]">{store.stats.products}</p>
                <p className="text-xs text-[#6B7280]">Products</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-[#22C55E]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1F2937]">{store.stats.orders.toLocaleString()}</p>
                <p className="text-xs text-[#6B7280]">Orders Delivered</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF9F43]/10 rounded-lg flex items-center justify-center">
                <Timer size={24} className="text-[#FF9F43]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1F2937]">{store.stats.avgDeliveryTime}</p>
                <p className="text-xs text-[#6B7280]">Avg Delivery Time</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1E2A5E]/10 rounded-lg flex items-center justify-center">
                <MessageCircle size={24} className="text-[#1E2A5E]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1F2937]">{store.stats.responseRate}</p>
                <p className="text-xs text-[#6B7280]">Response Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation (Sticky) */}
      <div className="sticky top-[113px] md:top-[129px] z-20 bg-white border-b shadow-sm mt-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'bg-[#1E2A5E] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Store Highlights */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {store.highlights.map((highlight, index) => (
            <div key={index} className="bg-white rounded-xl p-4 text-center shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-2">{highlight.icon}</div>
              <h4 className="font-bold text-[#1F2937] mb-1">{highlight.title}</h4>
              <p className="text-xs text-[#6B7280]">{highlight.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1F2937]">
            {activeCategory === 'All Products' ? 'All Products' : activeCategory}
            <span className="text-sm font-normal text-[#6B7280] ml-2">
              ({filteredProducts.length} items)
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-[#FF9F43] text-white px-2 py-1 rounded-lg text-xs font-bold">
                    {product.discount}% OFF
                  </div>
                )}
                <button
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="absolute top-2 right-2 p-2 bg-white/90 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <Eye size={16} className="text-[#1E2A5E]" />
                </button>
              </div>

              <div className="p-3">
                <h3 className="text-sm font-semibold text-[#1F2937] mb-1 line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>
                <p className="text-xs text-[#6B7280] mb-2">{product.brand}</p>

                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center gap-1 bg-[#22C55E] text-white px-1.5 py-0.5 rounded text-xs font-bold">
                    <Star size={10} fill="white" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-[#6B7280]">({product.reviews})</span>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-bold text-[#1F2937]">₹{product.price}</span>
                  <span className="text-xs text-[#6B7280] line-through">₹{product.mrp}</span>
                </div>

                <div className={`text-xs font-semibold mb-3 ${
                  product.stock === 'In Stock' 
                    ? 'text-[#22C55E]' 
                    : product.stock === 'Low Stock'
                    ? 'text-[#FF9F43]'
                    : 'text-[#EF4444]'
                }`}>
                  {product.stock}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 py-2 bg-[#00BFA6] text-white rounded-lg font-semibold hover:bg-[#00A894] transition text-sm flex items-center justify-center gap-1 active:scale-95"
                    disabled={product.stock === 'Out of Stock'}
                  >
                    <ShoppingCart size={14} />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                  <button
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="px-3 py-2 border-2 border-[#1E2A5E] text-[#1E2A5E] rounded-lg hover:bg-[#1E2A5E] hover:text-white transition active:scale-95"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Reviews & Ratings</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Overall Rating */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-[#1E2A5E] to-[#2A3A7E] rounded-xl p-6 text-white text-center">
                <div className="text-5xl font-bold mb-2">{store.rating}</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      fill={star <= Math.floor(store.rating) ? 'white' : 'none'}
                      className="text-white"
                    />
                  ))}
                </div>
                <p className="text-sm opacity-90">{store.reviews} reviews</p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2">
              <div className="space-y-3">
                {ratingDistribution.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-semibold">{dist.stars}</span>
                      <Star size={14} fill="#FF9F43" className="text-[#FF9F43]" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#FF9F43] h-full rounded-full transition-all"
                        style={{ width: `${dist.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-[#6B7280] w-12 text-right">{dist.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1F2937]">Customer Reviews</h3>
            <select
              value={reviewSort}
              onChange={(e) => setReviewSort(e.target.value)}
              className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold focus:border-[#00BFA6] focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
              <option value="photos">With Photos</option>
            </select>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#1F2937]">{review.userName}</span>
                      {review.verified && (
                        <span className="text-xs bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 rounded-full font-semibold">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            fill={star <= review.rating ? '#FF9F43' : 'none'}
                            className="text-[#FF9F43]"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#6B7280]">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#1F2937] mb-3">{review.comment}</p>
                {review.images.length > 0 && (
                  <div className="flex gap-2">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Review"
                        className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-80 transition"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 border-2 border-[#1E2A5E] text-[#1E2A5E] rounded-lg font-semibold hover:bg-[#1E2A5E] hover:text-white transition">
            View All Reviews
          </button>
        </div>
      </div>

      {/* Store Policies Section */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Store Policies</h2>

          <div className="space-y-3">
            {Object.entries(store.policies).map(([key, value]) => (
              <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => togglePolicy(key)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
                >
                  <span className="font-semibold text-[#1F2937] capitalize flex items-center gap-2">
                    {key === 'return' && <RefreshCw size={18} className="text-[#00BFA6]" />}
                    {key === 'warranty' && <Shield size={18} className="text-[#1E2A5E]" />}
                    {key === 'delivery' && <Truck size={18} className="text-[#FF9F43]" />}
                    {key === 'cancellation' && <X size={18} className="text-[#EF4444]" />}
                    {key} Policy
                  </span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${expandedPolicy === key ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedPolicy === key && (
                  <div className="px-4 py-3 bg-white">
                    <p className="text-sm text-[#6B7280]">{value}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar Stores Section */}
      <div className="max-w-7xl mx-auto px-4 mt-8 mb-8">
        <h2 className="text-2xl font-bold text-[#1F2937] mb-4">Similar Stores</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {SIMILAR_STORES.map((similarStore) => (
            <div
              key={similarStore.id}
              onClick={() => router.push(`/shops/${similarStore.id}`)}
              className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={similarStore.logo}
                  alt={similarStore.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#1F2937] truncate">{similarStore.name}</h3>
                  <p className="text-sm text-[#6B7280]">{similarStore.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-[#22C55E] text-white px-2 py-1 rounded text-xs font-bold">
                  <Star size={10} fill="white" />
                  <span>{similarStore.rating}</span>
                </div>
                <span className="text-xs text-[#6B7280]">{similarStore.distance} km away</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40 md:hidden">
        <div className="flex gap-2">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              isFollowing
                ? 'bg-[#EF4444]/10 text-[#EF4444]'
                : 'border-2 border-[#1E2A5E] text-[#1E2A5E]'
            }`}
          >
            <Heart size={18} fill={isFollowing ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleChatStore}
            className="flex-1 py-3 bg-[#00BFA6] text-white rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            Chat Store
          </button>
          <button
            onClick={() => router.push('/cart')}
            className="px-4 py-3 bg-[#1E2A5E] text-white rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
