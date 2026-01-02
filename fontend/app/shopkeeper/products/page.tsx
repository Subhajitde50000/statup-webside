'use client';

import React, { useState } from 'react';
import { Search, Plus, ChevronDown, Edit2, Trash2, Eye, EyeOff, AlertTriangle, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ShopkeeperNavbar from '../components/ShopkeeperNavbar';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  warranty: boolean;
  hidden: boolean;
}

export default function ProductListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Recently Added');

  const categories = ['All', 'Electrical', 'Plumbing', 'Cleaning', 'Resources', 'Elements', 'Tubing tools', 'Wires'];

  const sortOptions = [
    'All options',
    'All rewis',
    'Sort by name',
    'Sort by elesment',
    'Sort by same',
    'New value',
  ];

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Product Wire 10m',
      brand: 'Brand Name',
      category: 'Category',
      price: 125.00,
      stock: 15,
      image: '/product1.jpg',
      warranty: true,
      hidden: false,
    },
    {
      id: '2',
      name: 'Product Plumbing',
      brand: 'Brand Name',
      category: 'Category',
      price: 150.00,
      stock: 8,
      image: '/product2.jpg',
      warranty: true,
      hidden: false,
    },
    {
      id: '3',
      name: 'Product Plumbing',
      brand: 'Brand Name',
      category: 'Category',
      price: 130.00,
      stock: 2,
      image: '/product3.jpg',
      warranty: true,
      hidden: false,
    },
    {
      id: '4',
      name: 'Product Name',
      brand: 'Brand Name',
      category: 'Category',
      price: 125.00,
      stock: 0,
      image: '/product4.jpg',
      warranty: true,
      hidden: false,
    },
  ]);

  const getStockBadge = (stock: number) => {
    if (stock > 10) {
      return { label: 'In Stock', color: 'bg-[#4CAF50] text-white' };
    } else if (stock > 0) {
      return { label: 'Low Stock', color: 'bg-[#FF9800] text-white' };
    } else {
      return { label: 'Out of Stock', color: 'bg-[#E53935] text-white' };
    }
  };

  const toggleProductVisibility = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, hidden: !p.hidden } : p));
  };

  const updateStock = (id: string, change: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + change) } : p));
  };

  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;

  return (
    <>
      <ShopkeeperNavbar />
      <div className="min-h-screen bg-[#F5F7FA] py-8 px-4 lg:px-8 pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0C0C0C] mb-2">Product List / Inventory Dashboard</h1>
            <p className="text-[#555555]">Manage your products, track inventory, and update stock levels</p>
          </div>
          <button
            onClick={() => router.push('/shopkeeper/products/add')}
            className="bg-[#00C897] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00B184] transition shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E0E0] p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A73E8]" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-gray-700 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent transition"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative lg:w-48">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="w-full px-6 py-3 border border-[#E0E0E0] rounded-lg bg-white flex items-center justify-between hover:border-[#00C897] transition"
              >
                <span className="text-[#0C0C0C] font-medium">Sort</span>
                <ChevronDown className={`w-5 h-5 text-[#555555] transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>

              {sortOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-[#E0E0E0] py-2 z-10">
                  <div className="px-4 py-2 text-xs font-semibold text-[#555555] uppercase">Sort Options</div>
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setSortOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left transition ${
                        sortBy === option
                          ? 'bg-[#00C897] text-white font-medium'
                          : 'text-[#555555] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-[#0C0C0C] mr-2">Categories</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${
                  selectedCategory === cat
                    ? 'bg-[#00C897] text-white shadow-md'
                    : 'bg-white border border-[#E0E0E0] text-[#555555] hover:border-[#00C897] hover:text-[#00C897]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Low Stock Warning */}
        {lowStockCount > 0 && (
          <div className="bg-gradient-to-r from-[#FFF3E0] to-[#FFE0B2] border-l-4 border-[#FF9800] rounded-lg p-5 mb-6 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-[#FF9800] rounded-full p-2 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#FF9800] font-bold text-lg mb-1">Low Stock Warning Section</h3>
                <p className="text-sm text-[#555555]">
                  ⚠️ <span className="font-semibold">{lowStockCount} item{lowStockCount > 1 ? 's' : ''}</span> currently have low stock. Please restock soon to avoid stockouts and maintain customer satisfaction.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {products.map((product) => {
            const stockBadge = getStockBadge(product.stock);
            return (
              <div
                key={product.id}
                className={`bg-white rounded-xl shadow-sm border border-[#E0E0E0] overflow-hidden hover:shadow-lg transition-all duration-300 ${
                  product.hidden ? 'opacity-50' : ''
                }`}
              >
                {/* Product Image */}
                <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg"></div>
                  </div>
                  <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${stockBadge.color}`}>
                    {stockBadge.label}
                  </div>
                  {product.hidden && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                        <span className="text-[#0C0C0C] font-bold">Hidden Product</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-[#0C0C0C] mb-1.5 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-[#555555] mb-3">{product.brand}</p>
                  <div className="flex items-center flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-[#E3F2FD] text-[#1A73E8] px-3 py-1 rounded-full font-medium">
                      {product.category}
                    </span>
                    {product.warranty && (
                      <span className="text-xs bg-[#E8F5E9] text-[#4CAF50] px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Warranty
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mb-5">
                    <p className="text-2xl font-bold text-[#00C897]">₹{product.price.toFixed(2)}</p>
                    <span className="text-xs text-[#555555]">Stock: {product.stock}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/shopkeeper/products/edit/${product.id}`)}
                        className="flex-1 bg-[#1A73E8] text-white py-2.5 px-3 rounded-lg text-sm font-semibold hover:bg-[#1565C0] transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit Product</span>
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="bg-[#E53935] text-white py-2.5 px-4 rounded-lg hover:bg-[#D32F2F] transition shadow-sm hover:shadow-md"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E0E0E0]">
                      <button
                        onClick={() => toggleProductVisibility(product.id)}
                        className="text-sm text-[#555555] hover:text-[#00C897] transition flex items-center gap-1.5 font-medium"
                      >
                        {product.hidden ? (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>Show</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span>Hide</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateStock(product.id, -1)}
                          className="bg-[#E53935] text-white w-8 h-8 rounded-lg hover:bg-[#D32F2F] transition flex items-center justify-center text-lg font-bold shadow-sm"
                        >
                          −
                        </button>
                        <button
                          onClick={() => updateStock(product.id, 1)}
                          className="bg-[#00C897] text-white w-8 h-8 rounded-lg hover:bg-[#00B184] transition flex items-center justify-center text-lg font-bold shadow-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E0E0] p-4 flex items-center justify-center gap-2">
          <button className="px-4 py-2 text-[#555555] hover:text-[#00C897] hover:bg-[#F5F7FA] rounded-lg transition font-medium">«</button>
          <button className="px-4 py-2 text-[#555555] hover:text-[#00C897] hover:bg-[#F5F7FA] rounded-lg transition font-medium">‹</button>
          <button className="px-4 py-2 bg-[#00C897] text-white rounded-lg font-semibold shadow-sm">1</button>
          <button className="px-4 py-2 text-[#555555] hover:text-[#00C897] hover:bg-[#F5F7FA] rounded-lg transition font-medium">›</button>
          <button className="px-4 py-2 text-[#555555] hover:text-[#00C897] hover:bg-[#F5F7FA] rounded-lg transition font-medium">»</button>
        </div>
      </div>
      </div>
    </>
  );
}
