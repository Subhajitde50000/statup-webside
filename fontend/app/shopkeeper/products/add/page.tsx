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
    warranty: 'Options',
    price: '',
    stockQuantity: '',
    minReorderLevel: '',
    description: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState([
    { field: 'Size', attribute: '' },
    { field: 'Material', attribute: '' },
    { field: 'Material', attribute: '' },
  ]);

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
    if (!productData.stockQuantity || parseInt(productData.stockQuantity) < 0) {
      alert('Please enter valid stock quantity');
      return;
    }
    if (images.length === 0) {
      alert('Please upload at least one product image');
      return;
    }

    // Save logic here
    console.log('Product Data:', productData);
    console.log('Images:', images);
    console.log('Specifications:', specifications);
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
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-2 block">Category</label>
                <div className="relative">
                  <select
                    value={productData.category}
                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent bg-white transition appearance-none cursor-pointer"
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
                  placeholder="Brand Name (Optional)"
                  value={productData.brand}
                  onChange={(e) => setProductData({ ...productData, brand: e.target.value })}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                />
                <p className="text-xs text-[#555555] mt-1">Leave empty if unbranded</p>
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
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent bg-white transition appearance-none cursor-pointer"
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
              {/* Price */}
              <div>
                <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-2 block">Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#555555] font-semibold text-sm md:text-base">₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={productData.price}
                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    className="w-full pl-7 md:pl-8 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                  />
                </div>
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
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
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
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
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

          {/* Section 4: Description & Specification */}
          <section>
            <h2 className="text-base md:text-lg font-semibold text-[#0C0C0C] mb-4 md:mb-6 pb-2 border-b border-[#E0E0E0]">Description & Specification</h2>
            
            {/* Description */}
            <div className="mb-6">
              <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-2 block">Product Description</label>
              <textarea
                placeholder="Product Description"
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                rows={4}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition resize-none"
              />
            </div>

            {/* Specifications */}
            <div>
              <label className="text-xs md:text-sm font-medium text-[#0C0C0C] mb-3 block">Specifications</label>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-2 md:gap-3">
                    <input
                      type="text"
                      placeholder="Field:"
                      value={spec.field}
                      onChange={(e) => updateSpecification(index, 'field', e.target.value)}
                      className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Attribute"
                        value={spec.attribute}
                        onChange={(e) => updateSpecification(index, 'attribute', e.target.value)}
                        className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
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
