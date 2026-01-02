'use client';

import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Plus, X, Shield, Upload, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ShopkeeperNavbar from '../../components/ShopkeeperNavbar';

export default function AddProductPage() {
  const router = useRouter();
  const [productData, setProductData] = useState({
    name: '',
    category: 'Electrical',
    brand: '',
    model: '',
    warranty: 'Options',
    price: '',
    mrp: '',
    stockQuantity: '',
    minReorderLevel: '',
    description: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState([
    { field: 'Power', attribute: '' },
    { field: 'Voltage', attribute: '' },
    { field: 'Warranty', attribute: '' },
  ]);
  const [badges, setBadges] = useState<string[]>([]);
  const [badgeInput, setBadgeInput] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [offers, setOffers] = useState<string[]>(['']);
  const [howToUse, setHowToUse] = useState<string[]>(['']);
  const [safetyTips, setSafetyTips] = useState<string[]>(['']);

  const categories = [
    'Electrical',
    'Plumbing',
    'Common Calves',
    'Warranty',
    'Options',
    'AC Repair',
    'Hardware',
    'Carpentry',
    'House Appliance Parts',
    'Tools',
    'Fittings',
    'Others',
  ];

  const warrantyOptions = [
    'Options',
    'No Warranty',
    '3 Months',
    '6 Months',
    '12 Months',
    '24 Months',
    'Warranty',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - images.length).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { field: '', attribute: '' }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, key: 'field' | 'attribute', value: string) => {
    const updated = [...specifications];
    updated[index][key] = value;
    setSpecifications(updated);
  };

  const addBadge = () => {
    if (badgeInput.trim() && badges.length < 5) {
      setBadges([...badges, badgeInput.trim()]);
      setBadgeInput('');
    }
  };

  const removeBadge = (index: number) => {
    setBadges(badges.filter((_, i) => i !== index));
  };

  const updateArrayItem = (array: string[], setArray: Function, index: number, value: string) => {
    const updated = [...array];
    updated[index] = value;
    setArray(updated);
  };

  const addArrayItem = (array: string[], setArray: Function) => {
    setArray([...array, '']);
  };

  const removeArrayItem = (array: string[], setArray: Function, index: number) => {
    if (array.length > 1) {
      setArray(array.filter((_, i) => i !== index));
    }
  };

  const getStockColor = () => {
    const stock = parseInt(productData.stockQuantity) || 0;
    if (stock > 10) return 'text-[#4CAF50]';
    if (stock >= 1) return 'text-[#FF9800]';
    return 'text-[#E53935]';
  };

  const getStockLabel = () => {
    const stock = parseInt(productData.stockQuantity) || 0;
    if (stock > 10) return '>10';
    if (stock >= 1) return '1-10';
    return '0';
  };

  const getDiscountPercentage = () => {
    const price = parseFloat(productData.price);
    const mrp = parseFloat(productData.mrp);
    if (price && mrp && mrp > price) {
      return Math.round(((mrp - price) / mrp) * 100);
    }
    return 0;
  };

  const handleSave = () => {
    // Validation
    if (!productData.name.trim()) {
      alert('Please enter product name');
      return;
    }
    if (!productData.price || parseFloat(productData.price) <= 0) {
      alert('Please enter a valid price');
      return;
    }
    if (!productData.mrp || parseFloat(productData.mrp) <= 0) {
      alert('Please enter a valid MRP');
      return;
    }
    if (parseFloat(productData.price) > parseFloat(productData.mrp)) {
      alert('Price cannot be greater than MRP');
      return;
    }
    if (!productData.stockQuantity || parseInt(productData.stockQuantity) < 0) {
      alert('Please enter valid stock quantity');
      return;
    }
    if (images.length === 0) {
      alert('Please upload at least one product image');
      return;
    }

    // Save logic here
    const productPayload = {
      ...productData,
      discount: getDiscountPercentage(),
      badges,
      features: features.filter(f => f.trim()),
      offers: offers.filter(o => o.trim()),
      howToUse: howToUse.filter(h => h.trim()),
      safetyTips: safetyTips.filter(s => s.trim()),
      specifications,
      images
    };
    console.log('Product Payload:', productPayload);
    alert('Product added successfully!');
    router.push('/shopkeeper/products');
  };

  return (
    <>
      <ShopkeeperNavbar />
      <div className="min-h-screen bg-[#F5F7FA] py-8 px-4 lg:px-8 pb-24 lg:pb-8">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0C0C0C]">Add New Product</h1>
          <p className="text-sm md:text-base text-[#555555] mt-2">Fill in the details to add a new product to your inventory</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E0E0] p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          {/* Section 1: Basic Product Information */}
          <section>
            <h2 className="text-base md:text-lg font-semibold text-[#0C0C0C] mb-4 md:mb-6 pb-2 border-b border-[#E0E0E0]">Basic Product Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Product Name */}
              <div>
                <label className="flex items-center space-x-2 text-xs md:text-sm font-medium text-[#0C0C0C] mb-2">
                  <span>Product Name</span>
                  <div className="relative group">
                    <HelpCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#555555] cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 md:w-64 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 z-10">
                      Name customers search and recognize
                    </div>
                  </div>
                </label>
                <input
                  type="text"
                  placeholder="Enter product name e.g., Copper Wire 10m 🔌"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  className="w-full px-3  text-gray-700 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-2 block">Category</label>
                <div className="relative">
                  <select
                    value={productData.category}
                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                    className="w-full px-3  text-gray-700 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent bg-white transition appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-[#555555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Brand Name */}
              <div>
                <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-2 block">Brand Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Philips, Anchor, Polycab"
                  value={productData.brand}
                  onChange={(e) => setProductData({ ...productData, brand: e.target.value })}
                  className="w-full px-3  text-gray-700 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                />
                <p className="text-xs text-[#555555] mt-1">Leave empty if unbranded</p>
              </div>

              {/* Model Number */}
              <div>
                <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-2 block">Model Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., PHL-LED-9W-CDL"
                  value={productData.model}
                  onChange={(e) => setProductData({ ...productData, model: e.target.value })}
                  className="w-full px-3  text-gray-700 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                />
                <p className="text-xs text-[#555555] mt-1">Product model/SKU</p>
              </div>

              {/* Warranty */}
              <div>
                <label className="flex items-center space-x-2 text-xs md:text-sm font-medium text-[#0C0C0C] mb-2">
                  <span>Warranty</span>
                </label>
                <div className="relative">
                  <select
                    value={productData.warranty}
                    onChange={(e) => setProductData({ ...productData, warranty: e.target.value })}
                    className="w-full px-3  text-gray-700 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent bg-white transition appearance-none cursor-pointer"
                  >
                    {warrantyOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-[#00C897]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Pricing & Stock Information */}
          <section>
            <h2 className="text-base md:text-lg font-semibold text-[#0C0C0C] mb-4 md:mb-6 pb-2 border-b border-[#E0E0E0]">Pricing & Stock Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* MRP */}
              <div>
                <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-2 block">MRP (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#555555] font-semibold text-sm md:text-base">₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={productData.mrp}
                    onChange={(e) => setProductData({ ...productData, mrp: e.target.value })}
                    className="w-full pl-7  text-gray-700 md:pl-8 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                  />
                </div>
                <p className="text-xs text-[#555555] mt-1">Maximum Retail Price</p>
              </div>

              {/* Selling Price */}
              <div>
                <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-2 block">Selling Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#555555] font-semibold text-sm md:text-base">₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={productData.price}
                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    className="w-full pl-7  text-gray-700 md:pl-8 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                  />
                </div>
                <p className="text-xs text-[#555555] mt-1">Your selling price</p>
              </div>

              {/* Discount Display */}
              <div>
                <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-2 block">Discount</label>
                <div className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg bg-gray-50 flex items-center justify-center">
                  {getDiscountPercentage() > 0 ? (
                    <span className="text-2xl font-bold text-[#FF9F43]">{getDiscountPercentage()}% OFF</span>
                  ) : (
                    <span className="text-gray-400">No discount</span>
                  )}
                </div>
                <p className="text-xs text-[#555555] mt-1">Auto-calculated</p>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="flex items-center space-x-2 text-xs md:text-sm font-medium text-[#0C0C0C] mb-2">
                  <span>Stock Quantity</span>
                  <div className="relative group">
                    <HelpCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#555555] cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 md:w-64 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 z-10">
                      Professionals cannot buy if stock is 0
                    </div>
                  </div>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={productData.stockQuantity}
                  onChange={(e) => setProductData({ ...productData, stockQuantity: e.target.value })}
                  className="w-full px-3  text-gray-700 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                />
                {productData.stockQuantity && (
                  <div className="flex items-center space-x-2 md:space-x-3 mt-2">
                    <div className={`flex items-center space-x-1 text-xs font-semibold ${getStockColor()}`}>
                      <div className={`w-2 h-2 rounded-full ${parseInt(productData.stockQuantity) > 10 ? 'bg-[#4CAF50]' : parseInt(productData.stockQuantity) >= 1 ? 'bg-[#FF9800]' : 'bg-[#E53935]'}`}></div>
                      <span>{getStockLabel()}</span>
                    </div>
                    <span className="text-xs text-[#555555]">
                      {parseInt(productData.stockQuantity) > 10 ? 'Good Stock' : parseInt(productData.stockQuantity) >= 1 ? 'Low Stock' : 'Tooltip we carve a tooltip'}
                    </span>
                  </div>
                )}
              </div>

              {/* Minimum Reorder Level */}
              <div>
                <label className="flex items-center space-x-2 text-xs md:text-sm font-medium text-[#0C0C0C] mb-2">
                  <span>Minimum Reorder Level</span>
                  <div className="relative group">
                    <HelpCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#555555] cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 md:w-64 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 z-10">
                      Alert when stock reaches this level
                    </div>
                  </div>
                </label>
                <input
                  type="number"
                  placeholder="Minimum Reorder Levell"
                  value={productData.minReorderLevel}
                  onChange={(e) => setProductData({ ...productData, minReorderLevel: e.target.value })}
                  className="w-full px-3  text-gray-700 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Product Photos */}
          <section>
            <h2 className="text-base md:text-lg font-semibold text-[#0C0C0C] mb-4 md:mb-6 pb-2 border-b border-[#E0E0E0]">Product Photos</h2>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-[#1A73E8] rounded-lg p-6 md:p-12 text-center bg-blue-50/30 hover:bg-blue-50/50 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 md:w-16 md:h-16 text-[#1A73E8] mb-3 md:mb-4" />
                  <p className="text-[#0C0C0C] font-semibold text-base md:text-lg mb-2">Drag-and-drop image upload</p>
                  <p className="text-xs md:text-sm text-[#555555] mb-1">Drag and drop image upload/browse and instructions.</p>
                  <p className="text-xs text-[#555555]">Upload limit: 180 KB+ upload</p>
                </div>
              </label>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mt-4 md:mt-6">
                {images.map((img, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover rounded-lg md:rounded-xl border-2 border-[#E0E0E0]" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-[#E53935] text-white rounded-full p-1 md:p-1.5 opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-[#D32F2F]"
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section 4: Badges & Highlights */}
          <section>
            <h2 className="text-base md:text-lg font-semibold text-[#0C0C0C] mb-4 md:mb-6 pb-2 border-b border-[#E0E0E0]">Badges & Highlights</h2>
            
            <div>
              <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-2 block">Product Badges (Optional)</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g., 🔥 Best Seller, ⚡ Fast Delivery"
                  value={badgeInput}
                  onChange={(e) => setBadgeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                  className="flex-1 px-3 text-gray-700 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                />
                <button
                  onClick={addBadge}
                  type="button"
                  className="bg-[#00C897] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg hover:bg-[#00B184] transition shadow-sm font-semibold text-sm"
                >
                  Add
                </button>
              </div>
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <div key={index} className="px-3 py-1.5 bg-[#FF9F43] text-white text-sm font-semibold rounded-full flex items-center gap-2">
                      <span>{badge}</span>
                      <button
                        onClick={() => removeBadge(index)}
                        type="button"
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-[#555555] mt-2">Max 5 badges. Use emojis for better visibility.</p>
            </div>
          </section>

          {/* Section 5: Description & Features */}
          <section>
            <h2 className="text-base md:text-lg font-semibold text-[#0C0C0C] mb-4 md:mb-6 pb-2 border-b border-[#E0E0E0]">Description & Features</h2>
            
            {/* Description */}
            <div className="mb-6">
              <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-2 block">Product Description</label>
              <textarea
                placeholder="Detailed product description for customers..."
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                rows={4}
                className="w-full px-3  text-gray-700 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition resize-none"
              />
            </div>

            {/* Features */}
            <div className="mb-6">
              <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-3 block">Key Features</label>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., Energy-efficient LED technology saves up to 85% electricity"
                      value={feature}
                      onChange={(e) => updateArrayItem(features, setFeatures, index, e.target.value)}
                      className="flex-1 px-3 text-gray-700 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                    />
                    <button
                      onClick={() => addArrayItem(features, setFeatures)}
                      type="button"
                      className="bg-[#00C897] text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-[#00B184] transition shadow-sm flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    {features.length > 1 && (
                      <button
                        onClick={() => removeArrayItem(features, setFeatures, index)}
                        type="button"
                        className="bg-[#E53935] text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-[#D32F2F] transition shadow-sm flex items-center justify-center"
                      >
                        <X className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-3 block">Technical Specifications</label>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-2 md:gap-3">
                    <input
                      type="text"
                      placeholder="Field:"
                      value={spec.field}
                      onChange={(e) => updateSpecification(index, 'field', e.target.value)}
                      className="flex-1 px-3  text-gray-700 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Attribute"
                        value={spec.attribute}
                        onChange={(e) => updateSpecification(index, 'attribute', e.target.value)}
                        className="flex-1 px-3  text-gray-700 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                      />
                      <button
                        onClick={() => addSpecification()}
                        className="bg-[#00C897] text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-[#00B184] transition shadow-sm flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      {specifications.length > 1 && (
                        <button
                          onClick={() => removeSpecification(index)}
                          className="bg-[#E53935] text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-[#D32F2F] transition shadow-sm flex items-center justify-center"
                        >
                          <X className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 6: Offers & Promotions */}
          <section>
            <h2 className="text-base md:text-lg font-semibold text-[#0C0C0C] mb-4 md:mb-6 pb-2 border-b border-[#E0E0E0]">Offers & Promotions (Optional)</h2>
            <div className="space-y-2">
              {offers.map((offer, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., 💳 10% instant discount on HDFC Credit Cards"
                    value={offer}
                    onChange={(e) => updateArrayItem(offers, setOffers, index, e.target.value)}
                    className="flex-1 px-3 text-gray-700 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                  />
                  <button
                    onClick={() => addArrayItem(offers, setOffers)}
                    type="button"
                    className="bg-[#00C897] text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-[#00B184] transition shadow-sm flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  {offers.length > 1 && (
                    <button
                      onClick={() => removeArrayItem(offers, setOffers, index)}
                      type="button"
                      className="bg-[#E53935] text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-[#D32F2F] transition shadow-sm flex items-center justify-center"
                    >
                      <X className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 7: How to Use Instructions */}
          <section>
            <h2 className="text-base md:text-lg font-semibold text-[#0C0C0C] mb-4 md:mb-6 pb-2 border-b border-[#E0E0E0]">How to Use (Optional)</h2>
            <div className="space-y-2">
              {howToUse.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex items-center justify-center w-8 h-10 bg-[#00C897] text-white rounded-lg font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Turn off the power supply before installation"
                    value={step}
                    onChange={(e) => updateArrayItem(howToUse, setHowToUse, index, e.target.value)}
                    className="flex-1 px-3 text-gray-700 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                  />
                  <button
                    onClick={() => addArrayItem(howToUse, setHowToUse)}
                    type="button"
                    className="bg-[#00C897] text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-[#00B184] transition shadow-sm flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  {howToUse.length > 1 && (
                    <button
                      onClick={() => removeArrayItem(howToUse, setHowToUse, index)}
                      type="button"
                      className="bg-[#E53935] text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-[#D32F2F] transition shadow-sm flex items-center justify-center"
                    >
                      <X className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 8: Safety Tips */}
          <section>
            <h2 className="text-base md:text-lg font-semibold text-[#0C0C0C] mb-4 md:mb-6 pb-2 border-b border-[#E0E0E0]">Safety Tips (Optional)</h2>
            <div className="space-y-2">
              {safetyTips.map((tip, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex items-center justify-center w-8 h-10 bg-[#FF9F43] text-white rounded-lg flex-shrink-0">
                    ⚠️
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Always switch off power before handling"
                    value={tip}
                    onChange={(e) => updateArrayItem(safetyTips, setSafetyTips, index, e.target.value)}
                    className="flex-1 px-3 text-gray-700 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                  />
                  <button
                    onClick={() => addArrayItem(safetyTips, setSafetyTips)}
                    type="button"
                    className="bg-[#00C897] text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-[#00B184] transition shadow-sm flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  {safetyTips.length > 1 && (
                    <button
                      onClick={() => removeArrayItem(safetyTips, setSafetyTips, index)}
                      type="button"
                      className="bg-[#E53935] text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-[#D32F2F] transition shadow-sm flex items-center justify-center"
                    >
                      <X className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-[#E0E0E0]">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#00C897] text-white py-3 md:py-4 px-6 rounded-lg font-semibold hover:bg-[#00B184] transition shadow-md hover:shadow-lg text-sm md:text-base"
            >
              Save Product
            </button>
            <button
              onClick={() => router.back()}
              className="sm:w-auto px-6 md:px-8 bg-[#E0E0E0] text-[#0C0C0C] py-3 md:py-4 rounded-lg font-semibold hover:bg-[#D0D0D0] transition text-sm md:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
