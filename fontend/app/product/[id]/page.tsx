'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, 
  Star, MapPin, Truck, Shield, Award, Check, X, Plus, Minus,
  Download, Camera, ThumbsUp, MessageCircle, AlertCircle, Package, Zap
} from 'lucide-react';
import StoreNavbar from '../../Component/StoreNavbar';

// Mock product data (in real app, fetch from API)
const MOCK_PRODUCTS = {
  1: {
    id: 1,
    name: 'Philips LED Bulb 9W Cool Day Light',
    brand: 'Philips',
    model: 'PHL-LED-9W-CDL',
    price: 129,
    mrp: 199,
    discount: 35,
    rating: 4.5,
    reviews: 1234,
    stock: 47,
    category: 'Lighting',
    images: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    badges: ['🔥 Best Seller', '⚡ Fast Delivery'],
    description: 'High-quality LED bulb with cool day light for optimal brightness and energy efficiency. Perfect for homes, offices, and commercial spaces.',
    features: [
      'Energy-efficient LED technology saves up to 85% electricity',
      'Cool day light (6500K) for bright illumination',
      'Long lifespan of 25,000 hours',
      'Instant on - no warm-up time required',
      'Mercury-free and eco-friendly',
      'Suitable for living rooms, kitchens, and workspaces'
    ],
    specifications: {
      'Power': '9W',
      'Voltage': '220-240V',
      'Base Type': 'B22',
      'Lumens': '900 lm',
      'Color Temperature': '6500K (Cool Day Light)',
      'Lifespan': '25,000 hours',
      'Warranty': '2 Years',
      'Dimensions': '60mm x 110mm',
      'Weight': '45g'
    },
    offers: [
      '💳 10% instant discount on HDFC Credit Cards',
      '🎁 Buy 10 or more, get 15% bulk discount',
      '🎊 Festival offer: Extra 5% off on orders above ₹999'
    ],
    services: [
      { name: 'Electrician Service', icon: '⚡', link: '/bookings' },
      { name: 'Home Repair', icon: '🔧', link: '/services' }
    ],
    addons: [
      { id: 101, name: 'LED Bulb Holder B22', price: 25, image: 'https://placehold.co/80x80', checked: false },
      { id: 102, name: 'Anchor 6A Switch', price: 45, image: 'https://placehold.co/80x80', checked: false },
      { id: 103, name: 'Extension Board 4 Socket', price: 249, image: 'https://placehold.co/80x80', checked: false }
    ],
    howToUse: [
      'Turn off the power supply before installation',
      'Remove old bulb from the socket',
      'Insert the LED bulb into B22 socket',
      'Turn on the power and test',
      'Dispose of old bulbs responsibly'
    ],
    safetyTips: [
      'Always switch off power before handling',
      'Do not use in enclosed fixtures unless specified',
      'Keep away from water and moisture',
      'Do not attempt to open or repair'
    ]
  },
  2: {
    id: 2,
    name: 'Anchor Roma Classic 6A Switch',
    brand: 'Anchor',
    model: 'ANC-ROMA-6A-WHT',
    price: 45,
    mrp: 65,
    discount: 30,
    rating: 4.3,
    reviews: 856,
    stock: 124,
    category: 'Switches',
    images: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    badges: ['🟢 In Stock'],
    description: 'Premium quality modular switch with elegant design and superior performance. Ideal for modern homes and offices.',
    features: [
      'High-grade polycarbonate body',
      'Smooth on/off operation',
      'Fire retardant material',
      'Easy to install and maintain',
      'Corrosion-resistant contacts',
      'Suitable for all electrical loads up to 6A'
    ],
    specifications: {
      'Current Rating': '6A',
      'Voltage': '240V',
      'Material': 'Polycarbonate',
      'Color': 'White',
      'Series': 'Roma Classic',
      'Warranty': '2 Years',
      'Dimensions': '75mm x 75mm',
      'Weight': '35g'
    },
    offers: [
      '💳 5% cashback on Paytm wallet',
      '🎁 Buy 10 switches, get 1 free',
      '📦 Free delivery on orders above ₹499'
    ],
    services: [
      { name: 'Electrician Service', icon: '⚡', link: '/bookings' }
    ],
    addons: [
      { id: 104, name: 'Switch Box (2M)', price: 30, image: 'https://placehold.co/80x80', checked: false },
      { id: 105, name: 'Screws Set', price: 15, image: 'https://placehold.co/80x80', checked: false }
    ],
    howToUse: [
      'Turn off main power supply',
      'Remove existing switch',
      'Connect wires as per color coding',
      'Secure switch in the box',
      'Turn on power and test'
    ],
    safetyTips: [
      'Installation should be done by qualified electrician',
      'Ensure proper earthing',
      'Do not overload the switch',
      'Keep dry and clean'
    ]
  },
  3: {
    id: 3,
    name: 'Polycab 2.5 sqmm FR Wire 90m',
    brand: 'Polycab',
    model: 'PCB-FR-2.5-90M-RED',
    price: 2499,
    mrp: 3200,
    discount: 22,
    rating: 4.7,
    reviews: 543,
    stock: 23,
    category: 'Wires',
    images: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    badges: ['🔥 Best Seller', '🟢 In Stock'],
    description: 'Premium flame retardant house wire suitable for residential and commercial wiring. ISI marked and certified for safety.',
    features: [
      'ISI marked FR (Flame Retardant) wire',
      'High-grade electrolytic copper conductor',
      'HRPVC insulation for durability',
      'Suitable for concealed and surface wiring',
      'Temperature rating: 70°C',
      'Complies with IS:694:2010 standards'
    ],
    specifications: {
      'Conductor Size': '2.5 sq mm',
      'Length': '90 meters',
      'Material': 'Electrolytic Copper',
      'Insulation': 'HRPVC',
      'Color': 'Red',
      'Current Rating': '24A',
      'Voltage': '1100V',
      'Standard': 'IS:694:2010',
      'Warranty': '1 Year'
    },
    offers: [
      '💳 No cost EMI available on select cards',
      '🎁 Buy 5 coils, save ₹745 (bulk discount)',
      '🚚 Free installation guide included'
    ],
    services: [
      { name: 'Electrician Service', icon: '⚡', link: '/bookings' },
      { name: 'Wiring Installation', icon: '🔌', link: '/services' }
    ],
    addons: [
      { id: 106, name: 'Wire Connectors (Pack of 50)', price: 120, image: 'https://placehold.co/80x80', checked: false },
      { id: 107, name: 'Insulation Tape', price: 35, image: 'https://placehold.co/80x80', checked: false },
      { id: 108, name: 'Cable Clips (100 pcs)', price: 80, image: 'https://placehold.co/80x80', checked: false }
    ],
    howToUse: [
      'Calculate wire length required for circuit',
      'Turn off main power supply',
      'Lay wire through conduit or surface',
      'Strip insulation at connection points',
      'Connect to MCB and outlets securely',
      'Test circuit before final use'
    ],
    safetyTips: [
      'Must be installed by licensed electrician',
      'Use appropriate conductor size for load',
      'Ensure proper earthing throughout',
      'Protect from sharp edges and heat sources',
      'Store in cool, dry place'
    ]
  }
};

const RELATED_PRODUCTS = [
  { id: 4, name: 'Syska LED 12W Bulb', brand: 'Syska', price: 149, mrp: 229, rating: 4.4, image: 'https://placehold.co/200x200' },
  { id: 5, name: 'Havells 9W LED', brand: 'Havells', price: 139, mrp: 199, rating: 4.6, image: 'https://placehold.co/200x200' },
  { id: 6, name: 'Wipro 9W Cool White', brand: 'Wipro', price: 119, mrp: 179, rating: 4.3, image: 'https://placehold.co/200x200' },
  { id: 7, name: 'Bajaj LED Bulb 9W', brand: 'Bajaj', price: 125, mrp: 185, rating: 4.5, image: 'https://placehold.co/200x200' }
];

const MOCK_REVIEWS = [
  { 
    id: 1, 
    user: 'Rajesh Kumar', 
    rating: 5, 
    date: '2 days ago', 
    comment: 'Excellent product! Very bright and energy efficient. Highly recommended.',
    verified: true,
    images: ['https://placehold.co/80x80', 'https://placehold.co/80x80'],
    helpful: 45
  },
  { 
    id: 2, 
    user: 'Priya Sharma', 
    rating: 4, 
    date: '5 days ago', 
    comment: 'Good quality bulb. Little pricey but worth it for the brand.',
    verified: true,
    images: [],
    helpful: 23
  },
  { 
    id: 3, 
    user: 'Amit Patel', 
    rating: 5, 
    date: '1 week ago', 
    comment: 'Bought 10 pieces for my office. All working perfectly. Great bulk deal!',
    verified: true,
    images: ['https://placehold.co/80x80'],
    helpful: 67
  }
];

const MOCK_QUESTIONS = [
  { id: 1, question: 'Is this suitable for bathroom use?', answer: 'Yes, but ensure proper ventilation and avoid direct water contact.', askedBy: 'User', answeredBy: 'Seller', date: '3 days ago' },
  { id: 2, question: 'What is the warranty period?', answer: '2 years manufacturer warranty from date of purchase.', askedBy: 'User', answeredBy: 'Seller', date: '1 week ago' },
  { id: 3, question: 'Can I use with dimmer switch?', answer: 'This model is not dimmable. Please check our dimmable LED range.', askedBy: 'User', answeredBy: 'Seller', date: '2 weeks ago' }
];

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);
  
  const [product, setProduct] = useState(MOCK_PRODUCTS[productId] || MOCK_PRODUCTS[1]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addons, setAddons] = useState(product.addons);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('Tomorrow');

  const totalPrice = product.price * quantity + addons.filter(a => a.checked).reduce((sum, a) => sum + a.price, 0);
  const totalSavings = (product.mrp - product.price) * quantity;

  const handleAddonToggle = (addonId: number) => {
    setAddons(addons.map(a => a.id === addonId ? { ...a, checked: !a.checked } : a));
  };

  const handleAddToCart = () => {
    console.log('Added to cart:', { product, quantity, addons: addons.filter(a => a.checked) });
    // Add your cart logic here
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const handleBookService = () => {
    router.push('/bookings');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at ₹${product.price}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-32 md:pb-8">
      <StoreNavbar 
        location="Mumbai, Maharashtra"
        searchQuery=""
        setSearchQuery={() => {}}
        cartItemCount={0}
        onCartClick={() => router.push('/cart')}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b mt-[57px] md:mt-[73px]">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-600 overflow-x-auto scrollbar-hide">
            <button onClick={() => router.push('/')} className="hover:text-[#00BFA6]">Home</button>
            <span>/</span>
            <button onClick={() => router.push('/store')} className="hover:text-[#00BFA6]">Store</button>
            <span>/</span>
            <button onClick={() => router.push('/store')} className="hover:text-[#00BFA6]">{product.category}</button>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* LEFT: Image Gallery */}
          <div className="bg-white rounded-lg p-3 md:p-6 lg:sticky lg:top-24 h-fit">
            {/* Badges */}
            <div className="flex gap-2 mb-3 md:mb-4">
              {product.badges.map((badge, idx) => (
                <span key={idx} className="px-3 py-1 bg-[#FF9F43] text-white text-xs font-semibold rounded-full">
                  {badge}
                </span>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-3 md:mb-4 group">
              <img 
                src={product.images[currentImageIndex]} 
                alt={product.name}
                className="w-full h-[280px] md:h-[400px] object-contain transition-transform group-hover:scale-110"
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((currentImageIndex - 1 + product.images.length) % product.images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 md:p-2 rounded-full shadow-lg active:scale-95 transition z-10"
                  >
                    <ChevronLeft size={24} className="md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((currentImageIndex + 1) % product.images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 md:p-2 rounded-full shadow-lg active:scale-95 transition z-10"
                  >
                    <ChevronRight size={24} className="md:w-5 md:h-5" />
                  </button>
                </>
              )}

              {/* Image Indicators (Mobile) */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                {product.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition ${
                      currentImageIndex === idx ? 'bg-[#00BFA6] w-6' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 overflow-hidden transition active:scale-95 ${
                    currentImageIndex === idx ? 'border-[#00BFA6] shadow-md' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Action Buttons (Mobile - Below Image) */}
            <div className="flex gap-2 mt-4 md:hidden">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex-1 py-3.5 border-2 rounded-lg font-medium text-sm transition active:scale-95 ${
                  isWishlisted 
                    ? 'border-red-500 text-red-500 bg-red-50' 
                    : 'border-gray-300 text-gray-700 hover:border-[#00BFA6]'
                }`}
              >
                <Heart size={18} className={`inline mr-1.5 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Saved' : 'Wishlist'}
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-3.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:border-[#00BFA6] transition active:scale-95"
              >
                <Share2 size={18} className="inline mr-1.5" />
                Share
              </button>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-4 md:space-y-6">
            {/* Title & Brand */}
            <div className="bg-white rounded-lg p-4 md:p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium">{product.brand}</span>
                <span>•</span>
                <span>Model: {product.model}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-1 bg-[#22C55E] text-white px-3 py-1.5 rounded-lg font-semibold">
                  <Star size={16} fill="white" />
                  <span>{product.rating}</span>
                </div>
                <button className="text-[#00BFA6] font-medium hover:underline">
                  {product.reviews.toLocaleString()} ratings & reviews
                </button>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg p-4 md:p-6">
              <div className="flex items-baseline gap-2 md:gap-3 mb-2 flex-wrap">
                <span className="text-3xl md:text-4xl font-bold text-gray-900">₹{product.price}</span>
                <span className="text-lg md:text-xl text-gray-400 line-through">₹{product.mrp}</span>
                <span className="px-2.5 md:px-3 py-1 bg-[#FF9F43] text-white text-sm md:text-base font-semibold rounded-lg">
                  {product.discount}% OFF
                </span>
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Offers */}
            <div className="bg-white rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl md:text-2xl">🎉</span>
                Available Offers
              </h3>
              <div className="space-y-2">
                {product.offers.map((offer, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 md:p-3 bg-[#F6F7FB] rounded-lg">
                    <Check size={18} className="text-[#22C55E] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{offer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Compatibility */}
            {product.services.length > 0 && (
              <div className="bg-gradient-to-r from-[#00BFA6]/10 to-[#1E2A5E]/10 rounded-lg p-4 md:p-6 border-2 border-[#00BFA6]">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔧</span>
                  Can be used with
                </h3>
                <div className="space-y-2 mb-4">
                  {product.services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="text-xl">{service.icon}</span>
                      <span className="font-medium">{service.name}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleBookService}
                  className="w-full py-3.5 md:py-3 bg-[#1E2A5E] text-white rounded-lg text-sm md:text-base font-semibold hover:bg-[#2A3A7E] transition active:scale-95"
                >
                  📅 Book Professional with this Product
                </button>
              </div>
            )}

            {/* Quantity & Stock */}
            <div className="bg-white rounded-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-900">Quantity</span>
                {product.stock > 0 && product.stock <= 20 && (
                  <span className="text-sm text-[#FF9F43] font-medium flex items-center gap-1">
                    <AlertCircle size={16} />
                    Only {product.stock} left in stock
                  </span>
                )}
                {product.stock > 20 && (
                  <span className="text-sm text-[#22C55E] font-medium flex items-center gap-1">
                    <Check size={16} />
                    In Stock ({product.stock} available)
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 md:px-4 py-3.5 md:py-3 hover:bg-gray-50 active:bg-gray-100 transition"
                  >
                    <Minus size={22} className="md:w-5 md:h-5" />
                  </button>
                  <span className="px-6 md:px-6 py-3.5 md:py-3 font-bold text-lg md:text-base border-x-2 border-gray-300 min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-5 md:px-4 py-3.5 md:py-3 hover:bg-gray-50 active:bg-gray-100 transition"
                  >
                    <Plus size={22} className="md:w-5 md:h-5" />
                  </button>
                </div>
                
                {quantity >= 10 && (
                  <span className="text-sm text-[#22C55E] font-medium">
                    🎁 Bulk discount applied!
                  </span>
                )}
              </div>

              {totalSavings > 0 && (
                <div className="mt-4 p-3 bg-[#22C55E]/10 rounded-lg">
                  <span className="text-sm text-[#22C55E] font-semibold">
                    💰 You save ₹{totalSavings} on this order!
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons (Desktop) */}
            <div className="hidden md:block bg-white rounded-lg p-6 space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#00BFA6] text-white rounded-lg font-semibold text-lg hover:bg-[#00A894] transition flex items-center justify-center gap-2"
              >
                <ShoppingCart size={22} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-[#1E2A5E] text-white rounded-lg font-semibold text-lg hover:bg-[#2A3A7E] transition flex items-center justify-center gap-2"
              >
                <Zap size={22} />
                Buy Now
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 py-3 border-2 rounded-lg font-medium transition ${
                    isWishlisted 
                      ? 'border-red-500 text-red-500 bg-red-50' 
                      : 'border-gray-300 text-gray-700 hover:border-[#00BFA6]'
                  }`}
                >
                  <Heart size={20} className={`inline mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-[#00BFA6] transition"
                >
                  <Share2 size={20} className="inline mr-2" />
                  Share
                </button>
              </div>
            </div>

            {/* Delivery & Trust */}
            <div className="bg-white rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-base font-bold text-gray-900 mb-3 md:mb-4">Delivery & Services</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="flex items-start gap-3">
                  <Truck size={20} className="text-[#00BFA6] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Fast Delivery</p>
                    <p className="text-xs text-gray-600">Delivery by {deliveryDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-[#00BFA6] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">7-Day Replacement</p>
                    <p className="text-xs text-gray-600">Easy returns</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award size={20} className="text-[#00BFA6] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{product.specifications.Warranty || '1 Year'} Warranty</p>
                    <p className="text-xs text-gray-600">Manufacturer warranty</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check size={20} className="text-[#00BFA6] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Secure Payments</p>
                    <p className="text-xs text-gray-600">100% safe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Tabs Section */}
        <div className="bg-white rounded-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max md:min-w-0">
              {['description', 'specifications', 'howToUse', 'reviews', 'questions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-semibold transition whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-[#00BFA6] border-b-2 border-[#00BFA6]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'description' && 'Description'}
                  {tab === 'specifications' && 'Specifications'}
                  {tab === 'howToUse' && 'How to Use'}
                  {tab === 'reviews' && `Reviews (${product.reviews})`}
                  {tab === 'questions' && 'Q & A'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-6">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check size={18} className="text-[#22C55E] flex-shrink-0 mt-1" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Who should buy this?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#F6F7FB] rounded-lg text-center">
                      <span className="text-3xl mb-2 block">🏠</span>
                      <p className="text-sm font-medium">Homeowners</p>
                    </div>
                    <div className="p-4 bg-[#F6F7FB] rounded-lg text-center">
                      <span className="text-3xl mb-2 block">👷</span>
                      <p className="text-sm font-medium">Professionals</p>
                    </div>
                    <div className="p-4 bg-[#F6F7FB] rounded-lg text-center">
                      <span className="text-3xl mb-2 block">🏢</span>
                      <p className="text-sm font-medium">Businesses</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Specifications</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value], idx) => (
                        <tr key={key} className={idx % 2 === 0 ? 'bg-[#F6F7FB]' : 'bg-white'}>
                          <td className="px-4 py-3 font-semibold text-gray-700 w-1/3">{key}</td>
                          <td className="px-4 py-3 text-gray-900">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* How to Use Tab */}
            {activeTab === 'howToUse' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Installation Steps</h3>
                  <ol className="space-y-3">
                    {product.howToUse.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-[#00BFA6] text-white rounded-full flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700 pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="p-4 bg-[#FF9F43]/10 border-l-4 border-[#FF9F43] rounded">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={20} className="text-[#FF9F43]" />
                    Safety Tips
                  </h4>
                  <ul className="space-y-1">
                    {product.safetyTips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-700 ml-7">• {tip}</li>
                    ))}
                  </ul>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#1E2A5E] text-white rounded-lg font-semibold hover:bg-[#2A3A7E] transition">
                  <Download size={20} />
                  Download User Manual (PDF)
                </button>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                  <button className="px-4 py-2 border-2 border-[#00BFA6] text-[#00BFA6] rounded-lg font-medium hover:bg-[#00BFA6] hover:text-white transition">
                    Write a Review
                  </button>
                </div>

                {/* Rating Summary */}
                <div className="flex items-center gap-8 p-6 bg-[#F6F7FB] rounded-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-2">{product.rating}</div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} fill={i < Math.floor(product.rating) ? '#FFB800' : 'none'} stroke="#FFB800" />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">{product.reviews.toLocaleString()} ratings</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-12">{star} Star</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#FFB800] rounded-full"
                            style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '5%' : star === 2 ? '3%' : '2%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filter Options */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  <button className="px-4 py-2 bg-[#1E2A5E] text-white rounded-lg text-sm font-medium whitespace-nowrap">
                    All Reviews
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
                    With Photos
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
                    Verified Purchase
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
                    5 Star
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
                    4 Star
                  </button>
                </div>

                {/* Review List */}
                <div className="space-y-4">
                  {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="p-6 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{review.user}</span>
                            {review.verified && (
                              <span className="px-2 py-0.5 bg-[#22C55E]/10 text-[#22C55E] text-xs font-medium rounded">
                                ✓ Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < review.rating ? '#FFB800' : 'none'} stroke="#FFB800" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      {review.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {review.images.map((img, idx) => (
                            <img key={idx} src={img} alt="Review" className="w-20 h-20 object-cover rounded-lg border" />
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#00BFA6]">
                          <ThumbsUp size={16} />
                          Helpful ({review.helpful})
                        </button>
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#00BFA6]">
                          <MessageCircle size={16} />
                          Comment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-[#00BFA6] hover:text-[#00BFA6] transition">
                  Load More Reviews
                </button>
              </div>
            )}

            {/* Q&A Tab */}
            {activeTab === 'questions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Questions & Answers</h3>
                  <button className="px-4 py-2 border-2 border-[#00BFA6] text-[#00BFA6] rounded-lg font-medium hover:bg-[#00BFA6] hover:text-white transition">
                    Ask a Question
                  </button>
                </div>

                <div className="space-y-4">
                  {MOCK_QUESTIONS.map((qa) => (
                    <div key={qa.id} className="p-6 border rounded-lg">
                      <div className="mb-4">
                        <div className="flex items-start gap-3 mb-2">
                          <MessageCircle size={20} className="text-[#1E2A5E] flex-shrink-0 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-900">{qa.question}</p>
                            <p className="text-sm text-gray-500 mt-1">Asked by {qa.askedBy} • {qa.date}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-8 p-4 bg-[#F6F7FB] rounded-lg">
                        <p className="text-gray-700 mb-2">{qa.answer}</p>
                        <p className="text-sm text-gray-500">Answered by {qa.answeredBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Frequently Bought Together / Add-ons */}
        {addons.length > 0 && (
          <div className="bg-white rounded-lg p-4 md:p-6 mt-6 md:mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={24} className="text-[#00BFA6]" />
              Frequently Bought Together
            </h3>
            <div className="space-y-2 md:space-y-3 mb-4">
              {addons.map((addon) => (
                <label key={addon.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border rounded-lg cursor-pointer hover:border-[#00BFA6] active:border-[#00BFA6] transition">
                  <input
                    type="checkbox"
                    checked={addon.checked}
                    onChange={() => handleAddonToggle(addon.id)}
                    className="w-5 h-5 accent-[#00BFA6]"
                  />
                  <img src={addon.image} alt={addon.name} className="w-16 h-16 object-contain" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{addon.name}</p>
                    <p className="text-sm text-gray-600">+ ₹{addon.price}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-between p-4 bg-[#F6F7FB] rounded-lg">
              <span className="font-semibold text-gray-900">
                Total Price: ₹{totalPrice}
                {addons.some(a => a.checked) && (
                  <span className="text-sm text-[#22C55E] ml-2">
                    (Save ₹{addons.filter(a => a.checked).length * 15} on combo)
                  </span>
                )}
              </span>
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-[#00BFA6] text-white rounded-lg font-semibold hover:bg-[#00A894] transition"
              >
                Add All to Cart
              </button>
            </div>
          </div>
        )}

        {/* Related Products */}
        <div className="bg-white rounded-lg p-4 md:p-6 mt-6 md:mt-8">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Related Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {RELATED_PRODUCTS.map((relProduct) => (
              <button
                key={relProduct.id}
                onClick={() => router.push(`/product/${relProduct.id}`)}
                className="text-left border rounded-lg p-3 md:p-4 hover:shadow-lg active:shadow-xl transition group"
              >
                <img 
                  src={relProduct.image} 
                  alt={relProduct.name}
                  className="w-full h-40 object-contain mb-3 group-hover:scale-105 transition"
                />
                <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{relProduct.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{relProduct.brand}</p>
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center gap-1 bg-[#22C55E] text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                    <Star size={10} fill="white" />
                    <span>{relProduct.rating}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-gray-900">₹{relProduct.price}</span>
                  <span className="text-xs text-gray-400 line-through">₹{relProduct.mrp}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom Bar - Above Navigation */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t-2 shadow-2xl z-40 p-3">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 min-w-0">
            <div className="text-[10px] text-gray-600 leading-tight">Total</div>
            <div className="text-lg font-bold text-gray-900 truncate leading-tight">₹{totalPrice}</div>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 px-3 py-3.5 bg-[#00BFA6] text-white rounded-lg text-sm font-semibold hover:bg-[#00A894] active:scale-95 transition shadow-lg"
          >
            🛒 Add Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 px-3 py-3.5 bg-[#1E2A5E] text-white rounded-lg text-sm font-semibold hover:bg-[#2A3A7E] active:scale-95 transition shadow-lg"
          >
            ⚡ Buy Now
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-base md:text-lg font-bold text-gray-800">Share Product</h3>
              <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-100 rounded-full active:scale-95">
                <X size={22} />
              </button>
            </div>
            <div className="p-4 grid grid-cols-4 gap-3 md:gap-4">
              {['WhatsApp', 'Facebook', 'Twitter', 'Copy Link'].map((platform) => (
                <button key={platform} className="flex flex-col items-center gap-2 p-2 md:p-3 hover:bg-gray-50 rounded-lg active:scale-95">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-200 rounded-full flex items-center justify-center">
                    <Share2 size={20} />
                  </div>
                  <span className="text-[10px] md:text-xs text-gray-600 text-center leading-tight">{platform}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
