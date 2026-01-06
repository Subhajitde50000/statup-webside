'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import Notifications from '../Component/Notifications';

export default function AboutPage() {
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const services = [
    {
      icon: '💡',
      title: 'Electrical Services',
      description: 'From fixing short circuits to appliance repairs — we handle it all.',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      icon: '🔧',
      title: 'Plumbing Services',
      description: 'Leak fixing, pipe repairs, and bathroom fitting solutions.',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: '🧹',
      title: 'Housekeeping Services',
      description: 'Deep cleaning, sanitization, and daily home upkeep.',
      color: 'from-green-400 to-emerald-400'
    },
    {
      icon: '👨‍🍳',
      title: 'Cooking Services',
      description: 'Healthy, delicious meals prepared by experienced home cooks.',
      color: 'from-red-400 to-pink-400'
    },
    {
      icon: '🚗',
      title: 'Driving Services',
      description: 'Reliable chauffeurs for short trips or long-distance travel.',
      color: 'from-purple-400 to-indigo-400'
    }
  ];

  const values = [
    {
      icon: '🔒',
      title: 'Safety First',
      description: 'Every professional is vetted and trained.'
    },
    {
      icon: '⚡',
      title: 'Fast & Reliable',
      description: 'Book in minutes — get service quickly.'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'No hidden charges. Upfront quotes.'
    },
    {
      icon: '🌟',
      title: 'Quality Service',
      description: 'Best-rated professionals for every task.'
    }
  ];

  const statistics = [
    { icon: '👥', number: '10,000+', label: 'Happy Customers' },
    { icon: '🏆', number: '5,500+', label: 'Verified Professionals' },
    { icon: '🛠️', number: '25,000+', label: 'Services Completed' },
    { icon: '⭐', number: '4.8', label: 'Average Customer Rating' }
  ];

  const team = [
    {
      name: 'Subhajit De',
      role: 'CEO',
      description: 'Visionary leader with passion for innovation and excellence.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      name: 'Shreya Patra',
      role: 'CTO',
      description: 'Technology expert in the construction of service.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      name: 'indrani Das',
      role: 'Operations Head',
      description: 'Manages daily operations and ensures seamless service.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
    },
    {
      name: 'LOkesh Ghosse',
      role: 'Operations Head',
      description: 'Manages daily operations and ensures seamless service.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sen',
      rating: 5,
      review: 'The electrician came on time and fixed everything perfectly. Great experience!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    {
      name: 'Rahul Verma',
      rating: 5,
      review: 'The cook provided by them is amazing. Home-cooked meals daily recommended!',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    {
      name: 'Anjali Sharma',
      rating: 5,
      review: 'Best plumbing service! Quick response and professional work. Highly satisfied.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
    }
  ];

  const whyChooseUs = [
    'Trusted and Verified Professionals',
    'Quick Same-Day Service',
    '24/7 Customer Support',
    'Affordable & Transparent Pricing',
    'Real-Time Tracking',
    'Easy Cancellation & Refunds',
    '100% Service Guarantee'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        isNotificationsOpen={isNotificationsOpen}
      />

      {/* Hero Section */}
      <section className="mt-[70px] bg-gradient-to-br from-blue-500 to-blue-600 py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-300 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Making Home Services Simple, Safe & Reliable
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed">
                We connect you with trusted electricians, plumbers, cleaners, cooks, and drivers — whenever you need them.
              </p>
              <button
                onClick={() => router.push('/service')}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                [ Book a Professional ]
              </button>
            </div>

            {/* Right Illustration */}
            <div className="relative hidden md:block">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="text-6xl mb-3">⚡</div>
                  <p className="text-white font-bold">Electrician</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="text-5xl mb-3">🔧</div>
                  <p className="text-white font-bold text-sm">Plumber</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="text-5xl mb-3">🧹</div>
                  <p className="text-white font-bold text-sm">Cleaner</p>
                </div>
                <div className="col-span-2 bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="text-6xl mb-3">👨‍🍳</div>
                  <p className="text-white font-bold">Cook & Driver</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#1A73E8] mb-6">Our Mission</h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            To make everyday life easier by providing fast, trusted, and affordable home services at your doorstep. 
            We believe in quality, transparency, and convenience — powered by technology.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 md:py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Images */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&h=300&fit=crop"
                alt="Electrician working"
                className="rounded-2xl shadow-lg w-full h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=300&fit=crop"
                alt="Professional working"
                className="rounded-2xl shadow-lg w-full h-48 object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&h=300&fit=crop"
                alt="Cleaner working"
                className="rounded-2xl shadow-lg w-full h-48 object-cover -mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&h=300&fit=crop"
                alt="Cook preparing food"
                className="rounded-2xl shadow-lg w-full h-48 object-cover"
              />
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Who We Are</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We are a modern service marketplace designed to solve real-world home needs. 
                  Whether it's a sudden electrical issue, leaking tap, cleaning your home, preparing meals, 
                  or finding a reliable driver — we bring skilled professionals directly to your home.
                </p>
                <p>
                  Our platform ensures safety, quality and fair pricing by verifying every professional before they join.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Overview */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-12">Our Services Overview</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-white mb-12">Statistics Section</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-black mb-2">{stat.number}</div>
                <p className="text-blue-100 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-4">
            Meet the People Behind the Platform
          </h2>
          <p className="text-center text-gray-600 mb-12">Our Team Section</p>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#FFB800] shadow-xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-[#1A73E8] font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-[#F5F7FA]">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-800">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-12">Testimonials Slider</h2>
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full md:w-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg snap-center"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-[#FFB800]">⭐</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">"{testimonial.review}"</p>
                </div>
              ))}
            </div>
            
            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-64 h-64 bg-yellow-300 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Ready to Book a Professional?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get fast, reliable service at your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/service')}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:scale-105"
            >
              [ Book Now ]
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
              [ Download App ]
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Notifications Panel */}
      <Notifications 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
