'use client';

import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Plus, X, Shield, Eye, EyeOff, Trash2, RefreshCw } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import ShopkeeperNavbar from '../../../components/ShopkeeperNavbar';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [productData, setProductData] = useState({
    name: 'Copper Wire Cable',
    category: 'Electrical',
    brand: 'Havells',
    model: 'HVL-CW-10MM',
    warranty: '12 Months',
    price: '1000',
    mrp: '1299',
    stockQuantity: '10',
    minReorderLevel: '5',
    description: 'High quality copper wire suitable for electrical installations.',
    hidden: false,
  });

  const [images, setImages] = useState<string[]>([
    '/placeholder1.jpg',
    '/placeholder2.jpg',
    '/placeholder3.jpg',
  ]);

  const [specifications, setSpecifications] = useState([
    { field: 'Size', attribute: '10mm' },
    { field: 'Material', attribute: 'Copper' },
    { field: 'Insulation', attribute: 'PVC Insulated' },
  ]);

  const [badges, setBadges] = useState<string[]>(['🔥 Best Seller', '🟢 In Stock']);
  const [badgeInput, setBadgeInput] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'High-grade electrolytic copper conductor',
    'HRPVC insulation for durability',
    'Suitable for concealed and surface wiring',
    'Temperature rating: 70°C'
  ]);
  const [offers, setOffers] = useState<string[]>([
    '💳 10% instant discount on HDFC Credit Cards',
    '🎁 Buy 10 or more, get 15% bulk discount'
  ]);
  const [howToUse, setHowToUse] = useState<string[]>([
    'Calculate wire length required for circuit',
    'Turn off main power supply',
    'Lay wire through conduit or surface',
    'Strip insulation at connection points',
    'Connect to MCB and outlets securely'
  ]);
  const [safetyTips, setSafetyTips] = useState<string[]>([
    'Must be installed by licensed electrician',
    'Use appropriate conductor size for load',
    'Ensure proper earthing throughout',
    'Protect from sharp edges and heat sources'
  ]);

  const categories = [
    'Electrical',
    'Plumbing',
    'AC Repair',
    'Hardware',
    'Carpentry',
    'House Appliance Parts',
    'Tools',
    'Fittings',
    'Others',
  ];

  const warrantyOptions = [
    'No Warranty',
    '3 Months',
    '6 Months',
    '12 Months',
    '24 Months',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - images.length).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    if (confirm('Are you sure you want to remove this image?')) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const replaceImage = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      const updated = [...images];
      updated[index] = newImage;
      setImages(updated);
    }
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

  const getDiscountPercentage = () => {
    const price = parseFloat(productData.price);
    const mrp = parseFloat(productData.mrp);
    if (price && mrp && mrp > price) {
      return Math.round(((mrp - price) / mrp) * 100);
    }
    return 0;
  };

  const getStockColor = () => {
    const stock = parseInt(productData.stockQuantity) || 0;
    if (stock > 10) return 'text-[#4CAF50]';
    if (stock >= 1) return 'text-[#FF9800]';
    return 'text-[#E53935]';
  };

  const quickAddStock = (amount: number) => {
    const current = parseInt(productData.stockQuantity) || 0;
    setProductData({ ...productData, stockQuantity: String(current + amount) });
  };

  const handleUpdate = () => {
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
    console.log('Updated Product Payload:', productPayload);
    alert('Product updated successfully!');
    router.push('/shopkeeper/products');
  };

  const handleDelete = () => {
    console.log('Deleting product...');
    router.push('/shopkeeper/products');
  };

  const isLowStock = parseInt(productData.stockQuantity) <= parseInt(productData.minReorderLevel);

  return (
    <>
      <ShopkeeperNavbar />
      <div className="min-h-screen bg-[#F5F7FA] py-8 px-4 lg:px-8 pb-24 lg:pb-8">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-[#555555]" />
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#0C0C0C]">Edit Product</h1>
          </div>

          {/* Hide/Unhide Toggle */}
          <button
            onClick={() => setProductData({ ...productData, hidden: !productData.hidden })}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
              productData.hidden
                ? 'bg-[#4CAF50] text-white hover:bg-[#43A047]'
                : 'bg-[#E0E0E0] text-[#555555] hover:bg-[#D0D0D0]'
            }`}
          >
            {productData.hidden ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            <span>{productData.hidden ? 'Show Product' : 'Hide Product'}</span>
          </button>
        </div>

        {/* Hidden Badge */}
        {productData.hidden && (
          <div className="mb-4 bg-[#FFF3E0] border border-[#FF9800] rounded-lg p-3 flex items-center space-x-2">
            <EyeOff className="w-5 h-5 text-[#FF9800]" />
            <span className="text-[#FF9800] font-medium">This product is currently hidden from professionals</span>
          </div>
        )}

        {/* Low Stock Warning */}
        {isLowStock && parseInt(productData.stockQuantity) > 0 && (
          <div className="mb-4 bg-[#FFEBEE] border border-[#E53935] rounded-lg p-3 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-[#E53935]" />
            <span className="text-[#E53935] font-medium">⚠️ Warning: Going Out of Stock - Current stock is below minimum reorder level!</span>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 space-y-8">
          {/* Section 1: Basic Product Information */}
          <section>
            <h2 className="text-lg font-semibold text-[#0C0C0C] mb-4">Basic Product Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-[#0C0C0C] mb-2">
                  <span>Product Name</span>
                  <HelpCircle className="w-4 h-4 text-[#555555]" title="Name customers search and recognize." />
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  className="w-full px-4 py-3 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium text-[#0C0C0C] mb-2 block">Category</label>
                <select
                  value={productData.category}
                  onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                  className="w-full px-4 py-3 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] bg-white transition"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Brand Name */}
              <div>
                <label className="text-sm font-medium text-[#0C0C0C] mb-2 block">Brand Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Philips, Anchor, Polycab"
                  value={productData.brand}
                  onChange={(e) => setProductData({ ...productData, brand: e.target.value })}
                  className="w-full px-4 py-3 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                />
              </div>

              {/* Model Number */}
              <div>
                <label className="text-sm font-medium text-[#0C0C0C] mb-2 block">Model Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., PHL-LED-9W-CDL"
                  value={productData.model}
                  onChange={(e) => setProductData({ ...productData, model: e.target.value })}
                  className="w-full px-4 py-3 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                />
              </div>

              {/* Warranty */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-[#0C0C0C] mb-2">
                  <Shield className="w-4 h-4 text-[#1A73E8]" />
                  <span>Warranty</span>
                </label>
                <select
                  value={productData.warranty}
                  onChange={(e) => setProductData({ ...productData, warranty: e.target.value })}
                  className="w-full px-4 py-3 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] bg-white transition"
                >
                  {warrantyOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Pricing & Stock Information */}
          <section>
            <h2 className="text-lg font-semibold text-[#0C0C0C] mb-4">Pricing & Stock Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* MRP */}
              <div>
                <label className="text-sm font-medium text-[#0C0C0C] mb-2 block">MRP (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555555]">₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={productData.mrp}
                    onChange={(e) => setProductData({ ...productData, mrp: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                  />
                </div>
                <p className="text-xs text-[#555555] mt-1">Maximum Retail Price</p>
              </div>

              {/* Selling Price */}
              <div>
                <label className="text-sm font-medium text-[#0C0C0C] mb-2 block">Selling Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555555]">₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={productData.price}
                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                  />
                </div>
                <p className="text-xs text-[#555555] mt-1">Your selling price</p>
              </div>

              {/* Discount Display */}
              <div>
                <label className="text-sm font-medium text-[#0C0C0C] mb-2 block">Discount</label>
                <div className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg bg-gray-50 flex items-center justify-center">
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
                <label className="flex items-center space-x-2 text-sm font-medium text-[#0C0C0C] mb-2">
                  <span>Stock Quantity</span>
                  <HelpCircle className="w-4 h-4 text-[#555555]" title="Professionals cannot buy if stock is 0." />
                </label>
                <input
                  type="number"
                  placeholder="10"
                  value={productData.stockQuantity}
                  onChange={(e) => setProductData({ ...productData, stockQuantity: e.target.value })}
                  className="w-full px-4 py-3 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                />
                {productData.stockQuantity && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className={`flex items-center space-x-1 text-xs font-medium ${getStockColor()}`}>
                      <div className={`w-2 h-2 rounded-full ${parseInt(productData.stockQuantity) > 10 ? 'bg-[#4CAF50]' : parseInt(productData.stockQuantity) >= 1 ? 'bg-[#FF9800]' : 'bg-[#E53935]'}`}></div>
                      <span>
                        {parseInt(productData.stockQuantity) > 10 ? '>10' : parseInt(productData.stockQuantity) >= 1 ? '1-10' : '0'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Minimum Reorder Level */}
              <div>
                <label className="text-sm font-medium text-[#0C0C0C] mb-2 block">Minimum Reorder Level</label>
                <input
                  type="number"
                  placeholder="Minimum Reorder optional"
                  value={productData.minReorderLevel}
                  onChange={(e) => setProductData({ ...productData, minReorderLevel: e.target.value })}
                  className="w-full px-4 py-3 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                />
              </div>
            </div>

            {/* Quick Stock Update Buttons */}
            <div className="mt-4 flex items-center space-x-3">
              <span className="text-sm font-medium text-[#555555]">Quick Add:</span>
              <button
                onClick={() => quickAddStock(5)}
                className="bg-[#00C897] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00B184] transition"
              >
                +5
              </button>
              <button
                onClick={() => quickAddStock(10)}
                className="bg-[#00C897] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00B184] transition"
              >
                +10
              </button>
            </div>
          </section>

          {/* Section 3: Product Photos */}
          <section>
            <h2 className="text-lg font-semibold text-[#0C0C0C] mb-4">Product Photos</h2>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-[#1A73E8] rounded-lg p-8 text-center bg-blue-50/30 mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className="cursor-pointer">
                <div className="text-[#1A73E8] mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-[#0C0C0C] font-medium mb-1">Drag-and-drop image upload</p>
                <p className="text-sm text-[#555555] mb-1">Drag and drop image upload/browse and instructions.</p>
                <p className="text-xs text-[#555555]">Upload limit: 180 KB+ upload</p>
              </label>
            </div>

            {/* Image Previews with Replace/Remove */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded-lg border border-[#E0E0E0]" />
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => replaceImage(index, e)}
                        className="hidden"
                        id={`replace-${index}`}
                      />
                      <label
                        htmlFor={`replace-${index}`}
                        className="cursor-pointer bg-[#1A73E8] text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Replace Image</span>
                      </label>
                      <button
                        onClick={() => removeImage(index)}
                        className="bg-[#E53935] text-white px-2 py-1 rounded text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section 4: Badges & Highlights */}
          <section>
            <h2 className="text-lg font-semibold text-[#0C0C0C] mb-4">Badges & Highlights</h2>
            
            <div>
              <label className="text-sm font-medium text-[#0C0C0C] mb-2 block">Product Badges (Optional)</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g., 🔥 Best Seller, ⚡ Fast Delivery"
                  value={badgeInput}
                  onChange={(e) => setBadgeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                  className="flex-1 px-4 py-2 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                />
                <button
                  onClick={addBadge}
                  type="button"
                  className="bg-[#00C897] text-white px-6 py-2 rounded-lg hover:bg-[#00B184] transition shadow-sm font-semibold"
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
            <h2 className="text-lg font-semibold text-[#0C0C0C] mb-4">Description & Features</h2>
            
            {/* Description */}
            <div className="mb-6">
              <label className="text-sm font-medium text-[#0C0C0C] mb-2 block">Product Description</label>
              <textarea
                placeholder="Detailed product description for customers..."
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition resize-none"
              />
            </div>

            {/* Features */}
            <div className="mb-6">
              <label className="text-sm font-medium text-[#0C0C0C] mb-3 block">Key Features</label>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., Energy-efficient LED technology saves up to 85% electricity"
                      value={feature}
                      onChange={(e) => updateArrayItem(features, setFeatures, index, e.target.value)}
                      className="flex-1 px-4 py-2 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                    />
                    <button
                      onClick={() => addArrayItem(features, setFeatures)}
                      type="button"
                      className="bg-[#00C897] text-white px-3 py-2 rounded-lg hover:bg-[#00B184] transition shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    {features.length > 1 && (
                      <button
                        onClick={() => removeArrayItem(features, setFeatures, index)}
                        type="button"
                        className="bg-[#E53935] text-white px-3 py-2 rounded-lg hover:bg-[#D32F2F] transition shadow-sm"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="text-sm font-medium text-[#0C0C0C] mb-3 block">Technical Specifications</label>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Field:"
                      value={spec.field}
                      onChange={(e) => updateSpecification(index, 'field', e.target.value)}
                      className="px-4 py-2 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={spec.attribute}
                        onChange={(e) => updateSpecification(index, 'attribute', e.target.value)}
                        className="flex-1 px-4 py-2 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                      />
                      <button
                        onClick={() => addSpecification()}
                        className="bg-[#00C897] text-white px-3 py-2 rounded-lg hover:bg-[#00B184] transition"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => removeSpecification(index)}
                        className="bg-[#E53935] text-white px-3 py-2 rounded-lg hover:bg-[#D32F2F] transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 6: Offers & Promotions */}
          <section>
            <h2 className="text-lg font-semibold text-[#0C0C0C] mb-4">Offers & Promotions (Optional)</h2>
            <div className="space-y-2">
              {offers.map((offer, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., 💳 10% instant discount on HDFC Credit Cards"
                    value={offer}
                    onChange={(e) => updateArrayItem(offers, setOffers, index, e.target.value)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                  />
                  <button
                    onClick={() => addArrayItem(offers, setOffers)}
                    type="button"
                    className="bg-[#00C897] text-white px-3 py-2 rounded-lg hover:bg-[#00B184] transition shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  {offers.length > 1 && (
                    <button
                      onClick={() => removeArrayItem(offers, setOffers, index)}
                      type="button"
                      className="bg-[#E53935] text-white px-3 py-2 rounded-lg hover:bg-[#D32F2F] transition shadow-sm"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 7: How to Use Instructions */}
          <section>
            <h2 className="text-lg font-semibold text-[#0C0C0C] mb-4">How to Use (Optional)</h2>
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
                    className="flex-1 px-4 py-2 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                  />
                  <button
                    onClick={() => addArrayItem(howToUse, setHowToUse)}
                    type="button"
                    className="bg-[#00C897] text-white px-3 py-2 rounded-lg hover:bg-[#00B184] transition shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  {howToUse.length > 1 && (
                    <button
                      onClick={() => removeArrayItem(howToUse, setHowToUse, index)}
                      type="button"
                      className="bg-[#E53935] text-white px-3 py-2 rounded-lg hover:bg-[#D32F2F] transition shadow-sm"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 8: Safety Tips */}
          <section>
            <h2 className="text-lg font-semibold text-[#0C0C0C] mb-4">Safety Tips (Optional)</h2>
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
                    className="flex-1 px-4 text-gray-700 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#00C897] transition"
                  />
                  <button
                    onClick={() => addArrayItem(safetyTips, setSafetyTips)}
                    type="button"
                    className="bg-[#00C897] text-white px-3 py-2 rounded-lg hover:bg-[#00B184] transition shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  {safetyTips.length > 1 && (
                    <button
                      onClick={() => removeArrayItem(safetyTips, setSafetyTips, index)}
                      type="button"
                      className="bg-[#E53935] text-white px-3 py-2 rounded-lg hover:bg-[#D32F2F] transition shadow-sm"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#E0E0E0]">
            <button
              onClick={handleUpdate}
              className="flex-1 bg-[#00C897] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#00B184] transition flex items-center justify-center space-x-2"
            >
              <span>Save Product</span>
              <span className="text-lg">✓</span>
            </button>
            <button
              onClick={() => router.back()}
              className="flex-1 bg-[#E0E0E0] text-[#0C0C0C] py-3 px-6 rounded-lg font-medium hover:bg-[#D0D0D0] transition"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-[#E53935] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#D32F2F] transition flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#0C0C0C] mb-4">Delete Product?</h3>
            <p className="text-[#555555] mb-6">
              Are you sure you want to permanently delete this product? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDelete}
                className="flex-1 bg-[#E53935] text-white py-3 rounded-lg font-medium hover:bg-[#D32F2F] transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-[#E0E0E0] text-[#0C0C0C] py-3 rounded-lg font-medium hover:bg-[#D0D0D0] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
          )}
          </div>
        </>
      );
    }
