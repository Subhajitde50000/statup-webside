'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Filter, Star } from 'lucide-react';
import StoreNavbar from '../Component/StoreNavbar';

// Mock data for demonstration
const CATEGORIES = [
  { id: 1, name: 'Lighting', icon: '💡', subCategories: ['LED Bulbs', 'Tube Lights', 'Panel Lights', 'Emergency Lights'] },
  { id: 2, name: 'Switches', icon: '🔌', subCategories: ['Wall Switches', 'Modular Switches', 'Smart Switches', 'Dimmers'] },
  { id: 3, name: 'Wires', icon: '🧵', subCategories: ['House Wires', 'Flex Cables', 'Coaxial Cables', 'Specialty Wires'] },
  { id: 4, name: 'Tools', icon: '⚙️', subCategories: ['Screwdrivers', 'Pliers', 'Wire Cutters', 'Testers'] },
  { id: 5, name: 'Power', icon: '🔋', subCategories: ['Extension Boards', 'Stabilizers', 'Inverters', 'UPS'] },
  { id: 6, name: 'Plumbing', icon: '🚿', subCategories: ['Pipes', 'Fittings', 'Taps', 'Valves'] },
  { id: 7, name: 'Safety', icon: '🧯', subCategories: ['MCBs', 'RCCBs', 'Fire Alarms', 'Safety Gear'] },
];

const OFFERS = [
  { id: 1, icon: '⚡', text: 'Save 10% on Wiring Items', color: '#FF9F43' },
  { id: 2, icon: '🛠️', text: 'Bulk discount on Switches', color: '#00BFA6' },
  { id: 3, icon: '🚚', text: 'Free delivery above ₹499', color: '#22C55E' },
];

const MOCK_PRODUCTS = [
  { id: 1, name: 'Philips LED Bulb 9W Cool Day Light', brand: 'Philips', price: 129, mrp: 199, rating: 4.5, reviews: 1234, stock: 'In Stock', discount: 35, category: 'Lighting', image: 'https://placehold.co/200x200', bulkPrice: { quantity: 10, price: 115, savings: 140 } },
  { id: 2, name: 'Anchor Roma Classic 6A Switch', brand: 'Anchor', price: 45, mrp: 65, rating: 4.3, reviews: 856, stock: 'In Stock', discount: 30, category: 'Switches', image: 'https://placehold.co/200x200', bulkPrice: { quantity: 10, price: 40, savings: 50 } },
  { id: 3, name: 'Polycab 2.5 sqmm FR Wire 90m', brand: 'Polycab', price: 2499, mrp: 3200, rating: 4.7, reviews: 543, stock: 'In Stock', discount: 22, category: 'Wires', image: 'https://placehold.co/200x200', bulkPrice: { quantity: 5, price: 2350, savings: 745 } },
  { id: 4, name: 'Stanley Screwdriver Set (6 Pcs)', brand: 'Stanley', price: 399, mrp: 599, rating: 4.6, reviews: 789, stock: 'Low Stock', discount: 33, category: 'Tools', image: 'https://placehold.co/200x200' },
  { id: 5, name: 'GM 4 Socket Extension Board 3m', brand: 'GM', price: 249, mrp: 350, rating: 4.2, reviews: 967, stock: 'In Stock', discount: 29, category: 'Power', image: 'https://placehold.co/200x200', bulkPrice: { quantity: 5, price: 230, savings: 95 } },
  { id: 6, name: 'Havells Crabtree 16A Switch', brand: 'Havells', price: 89, mrp: 125, rating: 4.5, reviews: 654, stock: 'In Stock', discount: 29, category: 'Switches', image: 'https://placehold.co/200x200', bulkPrice: { quantity: 10, price: 80, savings: 90 } },
  { id: 7, name: 'Syska LED Tube Light 20W', brand: 'Syska', price: 299, mrp: 450, rating: 4.4, reviews: 432, stock: 'In Stock', discount: 34, category: 'Lighting', image: 'https://placehold.co/200x200', bulkPrice: { quantity: 5, price: 280, savings: 95 } },
  { id: 8, name: 'V-Guard Voltage Stabilizer', brand: 'V-Guard', price: 1599, mrp: 2100, rating: 4.6, reviews: 321, stock: 'Out of Stock', discount: 24, category: 'Power', image: 'https://placehold.co/200x200' },
];

export default function StorePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Mumbai, Maharashtra');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [cart, setCart] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [dismissedOffers, setDismissedOffers] = useState([]);
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id === parseInt(id));
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const addToCart = (productId) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => {
      const newQty = (prev[productId] || 0) + delta;
      if (newQty <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const getFilteredProducts = () => {
    let filtered = products;
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory.name);
    }
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Quick filters
    if (activeFilter === 'inStock') {
      filtered = filtered.filter(p => p.stock === 'In Stock');
    } else if (activeFilter === 'topRated') {
      filtered = filtered.filter(p => p.rating >= 4.5);
    } else if (activeFilter === 'lowPrice') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (activeFilter === 'bulkDeals') {
      filtered = filtered.filter(p => p.bulkPrice);
    }
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const handleCartClick = () => {
    // You can add navigation to cart page here
    console.log('Cart clicked');
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-32 md:pb-24">
      {/* Store Navbar */}
      <StoreNavbar 
        location={location}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItemCount={cartItemCount}
        onCartClick={handleCartClick}
      />

      {/* Category Navigation */}
      <div className="bg-white border-b sticky top-[57px] md:top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          {/* Level 1: Main Categories */}
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedSubCategory('All');
                }}
                className={`flex flex-col items-center gap-2 px-6 py-2 rounded-lg transition-all whitespace-nowrap ${
                  selectedCategory.id === category.id
                    ? 'bg-[#00BFA6]/10 border-b-2 border-[#00BFA6] scale-105'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className={`text-sm font-medium ${
                  selectedCategory.id === category.id ? 'text-[#00BFA6]' : 'text-gray-700'
                }`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>

          {/* Level 2: Sub-Categories */}
          {selectedCategory && (
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              <button
                onClick={() => setSelectedSubCategory('All')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  selectedSubCategory === 'All'
                    ? 'bg-[#00BFA6] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {selectedCategory.subCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
                    selectedSubCategory === sub
                      ? 'bg-[#00BFA6] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Offer Section */}
      {OFFERS.filter(o => !dismissedOffers.includes(o.id)).length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {OFFERS.filter(o => !dismissedOffers.includes(o.id)).map((offer) => (
              <div
                key={offer.id}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 min-w-max"
                style={{ borderColor: offer.color }}
              >
                <span className="text-xl">{offer.icon}</span>
                <span className="text-sm font-medium text-gray-700">{offer.text}</span>
                <button
                  onClick={() => setDismissedOffers([...dismissedOffers, offer.id])}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Filters */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#1E2A5E] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setActiveFilter('inStock')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeFilter === 'inStock'
                ? 'bg-[#1E2A5E] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => setActiveFilter('topRated')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeFilter === 'topRated'
                ? 'bg-[#1E2A5E] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ⭐ Top Rated
          </button>
          <button
            onClick={() => setActiveFilter('lowPrice')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeFilter === 'lowPrice'
                ? 'bg-[#1E2A5E] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Low Price
          </button>
          <button
            onClick={() => setActiveFilter('bulkDeals')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeFilter === 'bulkDeals'
                ? 'bg-[#1E2A5E] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🎁 Bulk Deals
          </button>
          <button
            onClick={() => setShowFilters(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 whitespace-nowrap"
          >
            <Filter size={16} />
            More Filters
          </button>
        </div>
      </div>

      {/* Product Listing */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        {filteredProducts.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found here yet</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#1E2A5E] text-white rounded-lg hover:bg-[#2A3A7E] transition"
            >
              Browse other categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
                {/* Product Image */}
                <div 
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="relative p-4 bg-gray-50 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-[#FF9F43] text-white px-2 py-1 rounded text-xs font-bold">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 min-h-[40px] cursor-pointer hover:text-[#00BFA6]"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{product.brand}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center gap-1 bg-[#22C55E] text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                      <Star size={10} fill="white" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                    <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-3">
                    {product.stock === 'In Stock' ? (
                      <span className="text-xs text-[#22C55E] font-medium">✓ {product.stock}</span>
                    ) : product.stock === 'Low Stock' ? (
                      <span className="text-xs text-[#FF9F43] font-medium">⚠ {product.stock}</span>
                    ) : (
                      <span className="text-xs text-[#EF4444] font-medium">✗ {product.stock}</span>
                    )}
                  </div>

                  {/* Bulk Price Hint */}
                  {cart[product.id] >= 5 && product.bulkPrice && (
                    <div className="mb-3 p-2 bg-[#00BFA6]/10 border border-[#00BFA6] rounded text-xs">
                      <span className="text-[#00BFA6] font-semibold">
                        💰 Save ₹{product.bulkPrice.savings} when you buy {product.bulkPrice.quantity}+
                      </span>
                      <div className="text-gray-600 mt-1">
                        Bulk price: ₹{product.bulkPrice.price}/unit
                      </div>
                    </div>
                  )}

                  {/* Add to Cart / Quantity Control */}
                  {product.stock === 'Out of Stock' ? (
                    <button className="w-full py-2.5 border-2 border-[#00BFA6] text-[#00BFA6] rounded-lg font-medium hover:bg-[#00BFA6]/5 transition">
                      Notify Me
                    </button>
                  ) : !cart[product.id] ? (
                    <button
                      onClick={() => addToCart(product.id)}
                      className="w-full py-2.5 bg-[#00BFA6] text-white rounded-lg font-medium hover:bg-[#00A894] transition"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-[#00BFA6] rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="px-4 py-2.5 text-white font-bold text-xl hover:bg-[#00A894] transition"
                      >
                        −
                      </button>
                      <span className="text-white font-bold">{cart[product.id]}</span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="px-4 py-2.5 text-white font-bold text-xl hover:bg-[#00A894] transition"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended for You</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">👷</div>
                <p className="text-sm text-gray-600">Used by electricians</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🔧</div>
                <p className="text-sm text-gray-600">Frequently bought with wires</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🏠</div>
                <p className="text-sm text-gray-600">Commonly used for home repair</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">✨</div>
                <p className="text-sm text-gray-600">Recommended for your service</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Cart Bar - Desktop Only */}
      {cartItemCount > 0 && (
        <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧺</span>
                  <span className="font-semibold text-gray-800">{cartItemCount} items</span>
                </div>
                <div className="text-xl font-bold text-gray-900">₹{cartTotal.toFixed(2)}</div>
              </div>
              <button 
                onClick={handleCartClick}
                className="px-8 py-3 bg-[#00BFA6] text-white rounded-lg font-semibold hover:bg-[#00A894] transition"
              >
                View Cart →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Modal (Placeholder) */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-800">Advanced Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Brand</h4>
                <div className="space-y-2">
                  {['Philips', 'Anchor', 'Polycab', 'Stanley', 'Havells', 'Syska'].map(brand => (
                    <label key={brand} className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Price Range</h4>
                <input type="range" className="w-full" min="0" max="5000" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Warranty</h4>
                <div className="space-y-2">
                  {['1 Year', '2 Years', '5 Years', 'Lifetime'].map(warranty => (
                    <label key={warranty} className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">{warranty}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t sticky bottom-0 bg-white">
              <button className="w-full py-3 bg-[#1E2A5E] text-white rounded-lg font-semibold">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
