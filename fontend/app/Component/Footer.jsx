'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 md:py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wMyIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-16">
          {/* Company */}
          <div>
            <h3 className="text-lg font-black mb-6 text-blue-400">Company</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-gray-400 hover:text-white transition-all font-semibold hover:translate-x-1 inline-block">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all font-semibold hover:translate-x-1 inline-block">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all font-semibold hover:translate-x-1 inline-block">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all font-semibold hover:translate-x-1 inline-block">Press</a></li>
            </ul>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="text-lg font-bold mb-4">For Customers</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          {/* For Service Partners */}
          <div>
            <h3 className="text-lg font-bold mb-4">For Service Partners</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Become a Provider</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partner Login</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partner Guidelines</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Licensing</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-16 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-3xl p-8 border border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-black mb-3">Stay Updated</h3>
            <p className="text-gray-400 mb-6 font-medium">Subscribe to get exclusive offers and updates</p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 font-medium"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold hover:scale-105 transition-all shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-10 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
              <span className="text-white font-black text-sm">HE</span>
            </div>
            <div>
              <span className="font-black text-lg">HomeExpert</span>
              <div className="text-xs text-gray-400 font-medium">Professional Home Services</div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="#" className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110 shadow-lg">
              <span className="font-bold">f</span>
            </a>
            <a href="#" className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-110 shadow-lg">
              <span>📷</span>
            </a>
            <a href="#" className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-110 shadow-lg">
              <span className="font-bold text-sm">in</span>
            </a>
            <a href="#" className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all hover:scale-110 shadow-lg">
              <span>🐦</span>
            </a>
          </div>
        </div>

        <div className="text-center mt-10 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm font-medium">© 2025 HomeExpert. All rights reserved.</p>
          <p className="text-gray-600 text-xs mt-2 font-medium">Making home services simple, fast, and reliable.</p>
        </div>
      </div>
    </footer>
  );
}
