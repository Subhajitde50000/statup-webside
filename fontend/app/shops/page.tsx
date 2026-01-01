'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, ChevronDown, MapPin, Star, Phone, CheckCircle, Truck, ShoppingBag, X, Heart, Navigation, Share2, Clock, Loader2 } from 'lucide-react';
import StoreNavbar from '../Component/StoreNavbar';

// Mock data for demonstration
const MOCK_SHOPS = [
  {
    id: 1,
    name: 'Prime Electronics Store',
    category: 'Electrical',
    rating: 4.7,
    reviews: 328,
    distance: 1.2,
    isOpen: true,
    verified: true,
    delivery: true,
    pickup: true,
    minOrder: 199,
    freeDeliveryAbove: 499,
    offer: 'Flat 10% off on switches',
    phone: '+91 98765 43210',
    coverImage: 'https://placehold.co/400x200',
    logo: 'https://placehold.co/100x100'
  },
  {
    id: 2,
    name: 'City Electrical Mart',
    category: 'Electrical',
    rating: 4.5,
    reviews: 456,
    distance: 2.4,
    isOpen: true,
    verified: true,
    delivery: true,
    pickup: true,
    minOrder: 299,
    freeDeliveryAbove: 599,
    offer: 'Buy 3 Get 1 Free on LED bulbs',
    phone: '+91 98765 43211',
    coverImage: 'https://placehold.co/400x200',
    logo: 'https://placehold.co/100x100'
  },
  {
    id: 3,
    name: 'Kumar Plumbing Supply',
    category: 'Plumbing',
    rating: 4.8,
    reviews: 234,
    distance: 0.8,
    isOpen: false,
    verified: true,
    delivery: true,
    pickup: true,
    minOrder: 250,
    freeDeliveryAbove: 500,
    phone: '+91 98765 43212',
    coverImage: 'https://placehold.co/400x200',
    logo: 'https://placehold.co/100x100'
  },
  {
    id: 4,
    name: 'Modern Hardware Store',
    category: 'Electrical',
    rating: 4.3,
    reviews: 567,
    distance: 3.1,
    isOpen: true,
    verified: false,
    delivery: false,
    pickup: true,
    minOrder: 150,
    phone: '+91 98765 43213',
    coverImage: 'https://placehold.co/400x200',
    logo: 'https://placehold.co/100x100'
  },
  {
    id: 5,
    name: 'Elite Plumbing Solutions',
    category: 'Plumbing',
    rating: 4.9,
    reviews: 189,
    distance: 1.5,
    isOpen: true,
    verified: true,
    delivery: true,
    pickup: true,
    minOrder: 200,
    freeDeliveryAbove: 450,
    offer: 'Free installation on orders above ₹1000',
    phone: '+91 98765 43214',
    coverImage: 'https://placehold.co/400x200',
    logo: 'https://placehold.co/100x100'
  },
  {
    id: 6,
    name: 'Tech Electronics Hub',
    category: 'Electrical',
    rating: 4.6,
    reviews: 423,
    distance: 2.8,
    isOpen: true,
    verified: true,
    delivery: true,
    pickup: true,
    minOrder: 299,
    freeDeliveryAbove: 599,
    phone: '+91 98765 43215',
    coverImage: 'https://placehold.co/400x200',
    logo: 'https://placehold.co/100x100'
  },
];

export default function ShopsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location] = useState('Mumbai, Maharashtra');
  const [shops, setShops] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('nearest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favoriteShops, setFavoriteShops] = useState(new Set());
  
  // Filter states
  const [filters, setFilters] = useState({
    category: 'all',
    openNow: false,
    verified: false,
    delivery: false,
    pickup: false,
    minRating: 0
  });

  const [cart] = useState({});
  const cartItemCount = 0;

  // Simulate fetching shops data
  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setShops(MOCK_SHOPS);
        setLoading(false);
      }, 1000);
    };
    fetchShops();
  }, []);

  const handleCartClick = () => {
    router.push('/cart');
  };

  const toggleFavorite = (shopId) => {
    setFavoriteShops(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(shopId)) {
        newFavorites.delete(shopId);
      } else {
        newFavorites.add(shopId);
      }
      return newFavorites;
    });
  };

  const handleGetDirections = (shop) => {
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(shop.name)}`;
    window.open(url, '_blank');
  };

  const handleShareShop = async (shop) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shop.name,
          text: `Check out ${shop.name} - ${shop.category} store`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getFilteredAndSortedShops = () => {
    let filtered = [...shops];

    // Apply filters
    if (filters.category !== 'all') {
      filtered = filtered.filter(shop => shop.category === filters.category);
    }
    if (filters.openNow) {
      filtered = filtered.filter(shop => shop.isOpen);
    }
    if (filters.verified) {
      filtered = filtered.filter(shop => shop.verified);
    }
    if (filters.delivery) {
      filtered = filtered.filter(shop => shop.delivery);
    }
    if (filters.pickup) {
      filtered = filtered.filter(shop => shop.pickup);
    }
    if (filters.minRating > 0) {
      filtered = filtered.filter(shop => shop.rating >= filters.minRating);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy === 'nearest') {
      filtered.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popularity') {
      filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
  };

  const filteredShops = getFilteredAndSortedShops();

  const resetFilters = () => {
    setFilters({
      category: 'all',
      openNow: false,
      verified: false,
      delivery: false,
      pickup: false,
      minRating: 0
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-32 md:pb-8">
      {/* Store Navbar */}
      <StoreNavbar 
        location={location}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItemCount={cartItemCount}
        onCartClick={handleCartClick}
      />

      {/* Page Header */}
      <div className="bg-white border-b sticky top-[57px] md:top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-2">Stores Near You</h1>
              <p className="text-sm md:text-base text-[#6B7280]">
                Trusted electrical & plumbing stores around you
                {!loading && filteredShops.length > 0 && (
                  <span className="ml-2 text-[#00BFA6] font-semibold">
                    • {filteredShops.length} store{filteredShops.length !== 1 ? 's' : ''} found
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="p-2 md:px-4 md:py-2 border-2 border-[#1E2A5E] text-[#1E2A5E] rounded-lg hover:bg-[#1E2A5E] hover:text-white transition flex items-center gap-2 active:scale-95"
              >
                <Filter size={18} />
                <span className="hidden md:inline font-semibold">Filters</span>
                {(filters.category !== 'all' || filters.openNow || filters.verified || filters.delivery || filters.pickup || filters.minRating > 0) && (
                  <span className="w-2 h-2 bg-[#FF9F43] rounded-full"></span>
                )}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="p-2 md:px-4 md:py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#00BFA6] hover:text-[#00BFA6] transition flex items-center gap-2"
                >
                  <span className="hidden md:inline font-semibold">
                    {sortBy === 'nearest' ? 'Nearest' : sortBy === 'rating' ? 'Top Rated' : 'Popular'}
                  </span>
                  <ChevronDown size={18} />
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => { setSortBy('nearest'); setShowSortDropdown(false); }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${sortBy === 'nearest' ? 'text-[#00BFA6] font-semibold' : 'text-gray-700'}`}
                    >
                      Nearest First
                    </button>
                    <button
                      onClick={() => { setSortBy('rating'); setShowSortDropdown(false); }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${sortBy === 'rating' ? 'text-[#00BFA6] font-semibold' : 'text-gray-700'}`}
                    >
                      Top Rated
                    </button>
                    <button
                      onClick={() => { setSortBy('popularity'); setShowSortDropdown(false); }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${sortBy === 'popularity' ? 'text-[#00BFA6] font-semibold' : 'text-gray-700'}`}
                    >
                      Most Popular
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {(filters.category !== 'all' || filters.openNow || filters.verified || filters.delivery || filters.pickup || filters.minRating > 0) && (
            <div className="flex flex-wrap gap-2 pt-4">
              {filters.category !== 'all' && (
                <span className="px-3 py-1 bg-[#00BFA6]/10 text-[#00BFA6] rounded-full text-xs font-semibold flex items-center gap-2">
                  {filters.category}
                  <button onClick={() => setFilters({...filters, category: 'all'})} className="hover:text-[#00A894]">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.openNow && (
                <span className="px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] rounded-full text-xs font-semibold flex items-center gap-2">
                  Open Now
                  <button onClick={() => setFilters({...filters, openNow: false})} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.verified && (
                <span className="px-3 py-1 bg-[#1E2A5E]/10 text-[#1E2A5E] rounded-full text-xs font-semibold flex items-center gap-2">
                  Verified Only
                  <button onClick={() => setFilters({...filters, verified: false})} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.delivery && (
                <span className="px-3 py-1 bg-[#00BFA6]/10 text-[#00BFA6] rounded-full text-xs font-semibold flex items-center gap-2">
                  Delivery
                  <button onClick={() => setFilters({...filters, delivery: false})} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.pickup && (
                <span className="px-3 py-1 bg-[#FF9F43]/10 text-[#FF9F43] rounded-full text-xs font-semibold flex items-center gap-2">
                  Pickup
                  <button onClick={() => setFilters({...filters, pickup: false})} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.minRating > 0 && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-2">
                  {filters.minRating}+ Rating
                  <button onClick={() => setFilters({...filters, minRating: 0})} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="px-3 py-1 text-xs font-semibold text-[#EF4444] hover:text-[#DC2626]"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Store Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-4 pt-10 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No stores found near you</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search location</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#1E2A5E] text-white rounded-lg hover:bg-[#2A3A7E] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group"
              >
                {/* Cover Image with Logo */}
                <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={shop.coverImage}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Action Icons Overlay */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(shop.id); }}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                        favoriteShops.has(shop.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <Heart size={14} fill={favoriteShops.has(shop.id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShareShop(shop); }}
                      className="p-2 bg-white/90 rounded-full backdrop-blur-sm hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                  
                  {/* Logo */}
                  <div className="absolute -bottom-8 left-4 w-16 h-16 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                    <img
                      src={shop.logo}
                      alt={`${shop.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Verification Badge */}
                  {shop.verified && (
                    <div className="absolute top-2 left-2 bg-[#22C55E] text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle size={12} />
                      Verified
                    </div>
                  )}
                </div>

                {/* Store Info */}
                <div className="p-4 pt-10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold text-[#1F2937] flex-1">{shop.name}</h3>
                  </div>
                  <p className="text-sm text-[#6B7280] mb-3">{shop.category}</p>

                  {/* Rating & Distance */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1 bg-[#22C55E] text-white px-2 py-0.5 rounded text-xs font-bold">
                        <Star size={10} fill="white" />
                        <span>{shop.rating}</span>
                      </div>
                      <span className="text-xs text-[#6B7280]">({shop.reviews})</span>
                    </div>
                    <button
                      onClick={() => handleGetDirections(shop)}
                      className="flex items-center gap-1 text-xs text-[#00BFA6] hover:text-[#00A894] font-semibold"
                    >
                      <Navigation size={12} />
                      <span className="hidden sm:inline">{shop.distance} km</span>
                    </button>
                  </div>

                  {/* Status & Service Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      shop.isOpen 
                        ? 'bg-[#22C55E]/10 text-[#22C55E]' 
                        : 'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                      <Clock size={10} />
                      {shop.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                    {shop.delivery && (
                      <span className="px-2 py-1 bg-[#00BFA6]/10 text-[#00BFA6] rounded-full text-xs font-semibold flex items-center gap-1">
                        <Truck size={10} />
                        Delivery
                      </span>
                    )}
                    {shop.pickup && (
                      <span className="px-2 py-1 bg-[#FF9F43]/10 text-[#FF9F43] rounded-full text-xs font-semibold flex items-center gap-1">
                        <ShoppingBag size={10} />
                        Pickup
                      </span>
                    )}
                  </div>

                  {/* Offer Highlight */}
                  {shop.offer && (
                    <div className="mb-3 p-2 bg-[#FF9F43]/10 border border-[#FF9F43]/30 rounded-lg">
                      <p className="text-xs text-[#FF9F43] font-semibold">🎉 {shop.offer}</p>
                    </div>
                  )}

                  {/* Minimum Order Info */}
                  <div className="mb-4 text-xs text-[#6B7280] space-y-1">
                    {shop.minOrder && (
                      <p className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-[#6B7280] rounded-full"></span>
                        Min order: ₹{shop.minOrder}
                      </p>
                    )}
                    {shop.freeDeliveryAbove && (
                      <p className="flex items-center gap-1 text-[#22C55E]">
                        <span className="w-1 h-1 bg-[#22C55E] rounded-full"></span>
                        Free delivery above ₹{shop.freeDeliveryAbove}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/shops/${shop.id}`)}
                      className="flex-1 py-2.5 bg-[#00BFA6] text-white rounded-lg font-semibold hover:bg-[#00A894] transition text-sm active:scale-95"
                    >
                      View Store
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); window.open(`tel:${shop.phone}`); }}
                      className="px-4 py-2.5 border-2 border-[#1E2A5E] text-[#1E2A5E] rounded-lg hover:bg-[#1E2A5E] hover:text-white transition active:scale-95"
                      title="Call Store"
                    >
                      <Phone size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleGetDirections(shop); }}
                      className="px-4 py-2.5 border-2 border-[#00BFA6] text-[#00BFA6] rounded-lg hover:bg-[#00BFA6] hover:text-white transition active:scale-95"
                      title="Get Directions"
                    >
                      <Navigation size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-[#1F2937]">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Category Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-[#1F2937]">Category</h4>
                <div className="space-y-2">
                  {['all', 'Electrical', 'Plumbing'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat}
                        onChange={() => setFilters({...filters, category: cat})}
                        className="w-4 h-4 text-[#00BFA6]"
                      />
                      <span className="text-sm capitalize">{cat === 'all' ? 'All Categories' : cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h4 className="font-semibold mb-3 text-[#1F2937]">Quick Filters</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.openNow}
                      onChange={(e) => setFilters({...filters, openNow: e.target.checked})}
                      className="w-4 h-4 text-[#00BFA6]"
                    />
                    <span className="text-sm">Open Now</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.verified}
                      onChange={(e) => setFilters({...filters, verified: e.target.checked})}
                      className="w-4 h-4 text-[#00BFA6]"
                    />
                    <span className="text-sm">Verified Stores Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.delivery}
                      onChange={(e) => setFilters({...filters, delivery: e.target.checked})}
                      className="w-4 h-4 text-[#00BFA6]"
                    />
                    <span className="text-sm">Delivery Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pickup}
                      onChange={(e) => setFilters({...filters, pickup: e.target.checked})}
                      className="w-4 h-4 text-[#00BFA6]"
                    />
                    <span className="text-sm">Pickup Available</span>
                  </label>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-[#1F2937]">Minimum Rating</h4>
                <div className="space-y-2">
                  {[0, 4, 4.5].map(rating => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.minRating === rating}
                        onChange={() => setFilters({...filters, minRating: rating})}
                        className="w-4 h-4 text-[#00BFA6]"
                      />
                      <span className="text-sm">
                        {rating === 0 ? 'All Ratings' : `${rating}+ Stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t sticky bottom-0 bg-white flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 bg-[#1E2A5E] text-white rounded-lg font-semibold hover:bg-[#2A3A7E]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
