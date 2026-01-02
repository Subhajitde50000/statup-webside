'use client';

import React from 'react';
import { Store, ShoppingCart, User, MapPin, Search, Home, Package } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function StoreNavbar({
    location,
    searchQuery,
    setSearchQuery,
    cartItemCount,
    onCartClick
}) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Sticky Top Bar */}
            <div className="hidden md:block sticky top-0 z-50 bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: Logo & Location */}
                        <div className="flex items-center gap-3">
                            <div
                                className="text-2xl font-bold text-[#1E2A5E] cursor-pointer"
                                onClick={() => router.push('/')}
                            >
                                ElectroParts
                            </div>
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition">
                                <MapPin size={14} className="text-[#00BFA6]" />
                                <span className="text-gray-700">{location}</span>
                            </button>
                        </div>

                        <button
                            onClick={() => router.push('/store')}
                            className={`flex flex-col items-center justify-center gap-1 transition-all ${pathname === '/store' ? 'text-[#00BFA6]' : 'text-gray-600'
                                }`}
                        >
                            <Package className={`w-5 h-5 ${pathname === '/store' ? 'fill-[#00BFA6]' : ''}`} />
                            <span className="text-[10px] font-bold">Store</span>
                        </button>

                        <button
                            onClick={() => router.push('/shops')}
                            className={`flex flex-col items-center justify-center gap-1 transition-all ${pathname === '/shops' ? 'text-[#00BFA6]' : 'text-gray-600'
                                }`}

                        >
                            <Store className={`w-5 h-5 ${pathname === '/shops' ? 'fill-[#00BFA6]' : ''}`} />
                            {cartItemCount > 0 && (
                                <span className="absolute top-2 right-1/2 translate-x-3 bg-[#FF9F43] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {cartItemCount > 9 ? '9+' : cartItemCount}
                                </span>
                            )}
                            <span className="text-[10px] font-bold">Shop</span>
                        </button>

                        {/* Center: Search Bar */}
                        <div className="flex-1 max-w-2xl">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search bulbs, switches, wires, tools…"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00BFA6] focus:ring-2 focus:ring-[#00BFA6]/20"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Right: Cart & Profile */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onCartClick}
                                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <ShoppingCart size={24} className="text-[#1E2A5E]" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#FF9F43] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => router.push('/profile')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <User size={24} className="text-[#1E2A5E]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Top Bar - Simple */}
            <div className="md:hidden sticky top-0 z-50 bg-white shadow-md">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div
                            className="text-xl font-bold text-[#1E2A5E] cursor-pointer"
                            onClick={() => router.push('/')}
                        >
                            ElectroParts
                        </div>
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition">
                            <MapPin size={14} className="text-[#00BFA6]" />
                            <span className="text-gray-700">{location}</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onCartClick}
                                className="relative p-2"
                            >
                                <ShoppingCart size={22} className="text-[#1E2A5E]" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#FF9F43] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 pb-safe">
                <div className="grid grid-cols-5 h-16">
                    <button
                        onClick={() => router.push('/')}
                        className="flex flex-col items-center justify-center gap-1 transition-all text-gray-600"
                    >
                        <Home className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Home</span>
                    </button>

                    <button
                        onClick={() => router.push('/store')}
                        className={`flex flex-col items-center justify-center gap-1 transition-all ${pathname === '/store' ? 'text-[#00BFA6]' : 'text-gray-600'
                            }`}
                    >
                        <Package className={`w-5 h-5 ${pathname === '/store' ? 'fill-[#00BFA6]' : ''}`} />
                        <span className="text-[10px] font-bold">Store</span>
                    </button>

                    <div className="flex flex-col items-center justify-center gap-1 text-white relative">
                        <div className="absolute -top-4 w-14 h-14 bg-gradient-to-r from-[#1E2A5E] to-[#00BFA6] rounded-full flex items-center justify-center shadow-xl">
                            <Search className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-600 mt-6">Search</span>
                    </div>

                    <button
                        onClick={() => router.push('/shops')}
                        className={`flex flex-col items-center justify-center gap-1 transition-all ${pathname === '/shops' ? 'text-[#00BFA6]' : 'text-gray-600'
                            }`}
                    >
                        <Store className={`w-5 h-5 ${pathname === '/shops' ? 'fill-[#00BFA6]' : ''}`} />
                        {cartItemCount > 0 && (
                            <span className="absolute top-2 right-1/2 translate-x-3 bg-[#FF9F43] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {cartItemCount > 9 ? '9+' : cartItemCount}
                            </span>
                        )}
                        <span className="text-[10px] font-bold">Shop</span>
                    </button>

                    <button
                        onClick={() => router.push('/profile')}
                        className="flex flex-col items-center justify-center gap-1 text-gray-600"
                    >
                        <User className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Profile</span>
                    </button>
                </div>
            </div>
        </>
    );
}
