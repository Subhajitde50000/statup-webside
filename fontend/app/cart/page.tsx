'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Heart, Plus, Minus, Tag, MapPin, Truck, Store, AlertCircle, ArrowRight, X, ShoppingBag } from 'lucide-react';
import StoreNavbar from '../Component/StoreNavbar';

// Mock cart data
const MOCK_CART_ITEMS = [
  {
    id: 1,
    productId: 1,
    name: 'Philips LED Bulb 9W Cool Day Light',
    brand: 'Philips',
    price: 129,
    mrp: 199,
    discount: 35,
    quantity: 2,
    image: 'https://placehold.co/100x100',
    stock: 'in-stock',
    stockCount: 50,
    bulkSavings: { minQty: 10, savings: 140 },
    linkedService: {
      id: 123,
      name: 'Electrician Booking',
      date: '12 July'
    }
  },
  {
    id: 2,
    productId: 2,
    name: 'Anchor Roma Classic 6A Switch',
    brand: 'Anchor',
    price: 45,
    mrp: 65,
    discount: 30,
    quantity: 8,
    image: 'https://placehold.co/100x100',
    stock: 'in-stock',
    stockCount: 120
  },
  {
    id: 3,
    productId: 3,
    name: 'Polycab 2.5 sqmm FR Wire 90m',
    brand: 'Polycab',
    price: 2499,
    mrp: 3200,
    discount: 22,
    quantity: 1,
    image: 'https://placehold.co/100x100',
    stock: 'limited',
    stockCount: 3
  }
];

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [location] = useState('Mumbai, Maharashtra');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [showOffers, setShowOffers] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  const FREE_DELIVERY_THRESHOLD = 499;
  const DELIVERY_FEE = 40;

  const handleCartClick = () => {
    // Already on cart page
  };

  const updateQuantity = (itemId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const saveForLater = (itemId) => {
    // Implementation for save for later
    console.log('Save for later:', itemId);
  };

  const moveToWishlist = (itemId) => {
    // Implementation for wishlist
    console.log('Move to wishlist:', itemId);
  };

  // Calculate totals
  const itemsTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + ((item.mrp - item.price) * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'delivery' && itemsTotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  const platformFee = 5;
  const taxes = Math.round((itemsTotal - totalDiscount) * 0.18);
  const totalPayable = itemsTotal + deliveryFee + platformFee + taxes;
  
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const amountForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - itemsTotal);
  const freeDeliveryProgress = Math.min(100, (itemsTotal / FREE_DELIVERY_THRESHOLD) * 100);

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

      <div className="max-w-7xl mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl">
            <div className="w-32 h-32 mb-6 text-gray-300">
              <ShoppingBag className="w-full h-full" strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
            <button
              onClick={() => router.push('/store')}
              className="px-8 py-3 bg-[#00BFA6] text-white rounded-lg font-semibold hover:bg-[#00A894] transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SECTION: Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Header */}
              <div className="bg-white rounded-xl p-4 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-2">My Cart</h1>
                <p className="text-sm md:text-base text-[#6B7280]">Review your items before checkout</p>
              </div>

              {/* Free Delivery Progress */}
              {deliveryMethod === 'delivery' && amountForFreeDelivery > 0 && (
                <div className="bg-gradient-to-r from-[#00BFA6]/10 to-[#00BFA6]/5 rounded-xl p-4 border border-[#00BFA6]/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-[#1F2937]">
                      Add ₹{amountForFreeDelivery} more for free delivery 🚚
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#00BFA6] to-[#22C55E] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${freeDeliveryProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Cart Items */}
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="p-4 md:p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h3 className="text-base md:text-lg font-bold text-[#1F2937] mb-1 line-clamp-2">
                              {item.name}
                            </h3>
                            <p className="text-sm text-[#6B7280] mb-2">{item.brand}</p>
                            
                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-2">
                              {item.stock === 'in-stock' ? (
                                <span className="text-xs font-semibold text-[#22C55E] flex items-center gap-1">
                                  <span className="w-2 h-2 bg-[#22C55E] rounded-full"></span>
                                  In Stock
                                </span>
                              ) : item.stock === 'limited' ? (
                                <span className="text-xs font-semibold text-[#FF9F43] flex items-center gap-1">
                                  <AlertCircle size={12} />
                                  Only {item.stockCount} left
                                </span>
                              ) : (
                                <span className="text-xs font-semibold text-[#EF4444] flex items-center gap-1">
                                  <span className="w-2 h-2 bg-[#EF4444] rounded-full"></span>
                                  Out of Stock
                                </span>
                              )}
                            </div>

                            {/* Service Link Badge */}
                            {item.linkedService && (
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#1E2A5E]/10 text-[#1E2A5E] rounded-full text-xs font-semibold mb-2">
                                🔧 Linked to: {item.linkedService.name} – {item.linkedService.date}
                              </div>
                            )}
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg md:text-xl font-bold text-[#1F2937]">₹{item.price}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-[#6B7280] line-through">₹{item.mrp}</span>
                              <span className="text-xs font-bold text-[#FF9F43]">{item.discount}% OFF</span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Control */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-2 md:p-3 hover:bg-gray-100 transition active:bg-gray-200"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} className={item.quantity <= 1 ? 'text-gray-300' : 'text-gray-700'} />
                            </button>
                            <span className="px-4 md:px-6 py-2 md:py-3 font-bold text-[#1F2937] min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-2 md:p-3 hover:bg-gray-100 transition active:bg-gray-200"
                            >
                              <Plus size={16} className="text-gray-700" />
                            </button>
                          </div>

                          <div className="text-sm font-semibold text-[#1F2937]">
                            Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>

                        {/* Bulk Savings Message */}
                        {item.bulkSavings && item.quantity >= 5 && item.quantity < item.bulkSavings.minQty && (
                          <div className="p-2 bg-[#00BFA6]/10 border border-[#00BFA6]/30 rounded-lg mb-3">
                            <p className="text-xs text-[#00BFA6] font-semibold">
                              💰 Add {item.bulkSavings.minQty - item.quantity} more to save ₹{item.bulkSavings.savings}
                            </p>
                          </div>
                        )}

                        {/* Item Actions */}
                        <div className="flex items-center gap-3 md:gap-4">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-1 text-xs md:text-sm text-[#EF4444] hover:text-[#DC2626] font-semibold transition"
                          >
                            <Trash2 size={14} />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                          <button
                            onClick={() => saveForLater(item.id)}
                            className="flex items-center gap-1 text-xs md:text-sm text-[#6B7280] hover:text-[#1F2937] font-semibold transition"
                          >
                            <Tag size={14} />
                            <span className="hidden sm:inline">Save for Later</span>
                          </button>
                          <button
                            onClick={() => moveToWishlist(item.id)}
                            className="flex items-center gap-1 text-xs md:text-sm text-[#6B7280] hover:text-red-500 font-semibold transition"
                          >
                            <Heart size={14} />
                            <span className="hidden sm:inline">Wishlist</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SECTION: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Delivery Method */}
                <div className="bg-white rounded-xl p-4 md:p-6">
                  <h3 className="text-lg font-bold text-[#1F2937] mb-4">Delivery Options</h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition hover:border-[#00BFA6]"
                      style={{ borderColor: deliveryMethod === 'delivery' ? '#00BFA6' : '#E5E7EB' }}>
                      <input
                        type="radio"
                        name="delivery"
                        value="delivery"
                        checked={deliveryMethod === 'delivery'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Truck size={16} className="text-[#00BFA6]" />
                          <span className="font-semibold text-[#1F2937]">Home Delivery</span>
                        </div>
                        <p className="text-xs text-[#6B7280]">Delivered to your address</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition hover:border-[#00BFA6]"
                      style={{ borderColor: deliveryMethod === 'pickup' ? '#00BFA6' : '#E5E7EB' }}>
                      <input
                        type="radio"
                        name="delivery"
                        value="pickup"
                        checked={deliveryMethod === 'pickup'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Store size={16} className="text-[#FF9F43]" />
                          <span className="font-semibold text-[#1F2937]">Store Pickup</span>
                        </div>
                        <p className="text-xs text-[#6B7280]">Pick up from nearest store</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Offers/Coupons */}
                <div className="bg-white rounded-xl p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-[#1F2937]">Offers & Coupons</h3>
                  </div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tag className="text-[#22C55E]" size={16} />
                        <span className="text-sm font-semibold text-[#22C55E]">{appliedCoupon}</span>
                      </div>
                      <button onClick={() => setAppliedCoupon(null)}>
                        <X size={16} className="text-[#22C55E]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowOffers(true)}
                      className="w-full flex items-center justify-between p-3 border-2 border-dashed border-[#00BFA6] rounded-lg text-[#00BFA6] hover:bg-[#00BFA6]/5 transition"
                    >
                      <span className="font-semibold">Apply Coupon</span>
                      <ArrowRight size={18} />
                    </button>
                  )}
                </div>

                {/* Price Summary */}
                <div className="bg-white rounded-xl p-4 md:p-6">
                  <h3 className="text-lg font-bold text-[#1F2937] mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">Items Total ({cartItemCount} items)</span>
                      <span className="font-semibold text-[#1F2937]">₹{itemsTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">Discount</span>
                      <span className="font-semibold text-[#22C55E]">- ₹{totalDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">Delivery Fee</span>
                      {deliveryFee === 0 ? (
                        <span className="font-semibold text-[#22C55E]">FREE</span>
                      ) : (
                        <span className="font-semibold text-[#1F2937]">₹{deliveryFee.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">Platform Fee</span>
                      <span className="font-semibold text-[#1F2937]">₹{platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">GST (18%)</span>
                      <span className="font-semibold text-[#1F2937]">₹{taxes.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[#1F2937]">Total Payable</span>
                        <span className="text-2xl font-bold text-[#00BFA6]">₹{totalPayable.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-[#22C55E] mt-1 text-right">
                        You saved ₹{totalDiscount.toFixed(2)} on this order!
                      </p>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full mt-6 py-3 md:py-4 bg-[#00BFA6] text-white rounded-lg font-bold text-base md:text-lg hover:bg-[#00A894] transition active:scale-98 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Offers Modal */}
      {showOffers && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-[#1F2937]">Available Offers</h3>
              <button onClick={() => setShowOffers(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <button
                onClick={() => { setAppliedCoupon('FIRST10'); setShowOffers(false); }}
                className="w-full p-4 border-2 border-gray-200 rounded-lg text-left hover:border-[#00BFA6] transition"
              >
                <div className="flex items-start gap-3">
                  <Tag className="text-[#00BFA6] flex-shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-[#1F2937]">FIRST10</p>
                    <p className="text-sm text-[#6B7280]">Get 10% off on first order</p>
                    <p className="text-xs text-[#22C55E] mt-1">Save up to ₹100</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => { setAppliedCoupon('BULK15'); setShowOffers(false); }}
                className="w-full p-4 border-2 border-gray-200 rounded-lg text-left hover:border-[#00BFA6] transition"
              >
                <div className="flex items-start gap-3">
                  <Tag className="text-[#00BFA6] flex-shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-[#1F2937]">BULK15</p>
                    <p className="text-sm text-[#6B7280]">15% off on orders above ₹2000</p>
                    <p className="text-xs text-[#22C55E] mt-1">Save up to ₹300</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
