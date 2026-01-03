'use client';

import React, { useState } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CompletedJobCard } from '../components';
import { ProfessionalNavbar } from '../../../professional/components';

export default function CompletedJobsPage() {
  const router = useRouter();
  const [filterOption, setFilterOption] = useState<'today' | 'week' | 'month' | 'all'>('all');

  const completedJobs = [
    {
      id: '1',
      customerName: 'Subhajit De',
      customerPhoto: 'https://i.pravatar.cc/150?img=33',
      service: 'Switchboard Repair',
      date: 'Today, 2:00 PM',
      time: '2:00 PM',
      earnings: 450,
      customerRating: 5,
      category: 'today'
    },
    {
      id: '2',
      customerName: 'Priya Sharma',
      customerPhoto: 'https://i.pravatar.cc/150?img=5',
      service: 'Fan Repair',
      date: 'Yesterday',
      time: '4:30 PM',
      earnings: 300,
      customerRating: 4,
      category: 'week'
    },
    {
      id: '3',
      customerName: 'Ananya Das',
      customerPhoto: 'https://i.pravatar.cc/150?img=10',
      service: 'Light Fitting',
      date: '10 Dec 2025',
      time: '10:00 AM',
      earnings: 250,
      customerRating: 5,
      category: 'week'
    },
    {
      id: '4',
      customerName: 'Rajesh Kumar',
      customerPhoto: 'https://i.pravatar.cc/150?img=12',
      service: 'MCB Replacement',
      date: '5 Dec 2025',
      time: '2:30 PM',
      earnings: 400,
      customerRating: 4,
      category: 'week'
    },
    {
      id: '5',
      customerName: 'Vikram Singh',
      customerPhoto: 'https://i.pravatar.cc/150?img=15',
      service: 'Wiring Check',
      date: '1 Dec 2025',
      time: '11:00 AM',
      earnings: 550,
      customerRating: 5,
      category: 'month'
    }
  ];

  const filteredJobs = completedJobs.filter(job => {
    if (filterOption === 'today') return job.category === 'today';
    if (filterOption === 'week') return job.category === 'week' || job.category === 'today';
    if (filterOption === 'month') return true; // Show all for this example
    return true; // 'all'
  });

  const totalEarnings = filteredJobs.reduce((sum, job) => sum + job.earnings, 0);
  const avgRating = filteredJobs.reduce((sum, job) => sum + (job.customerRating || 0), 0) / filteredJobs.length;

  const handleViewSummary = (id: string) => {
    router.push(`/bookings/completed/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Navbar */}
      <ProfessionalNavbar
        activeTab="bookings"
        notificationCount={0}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 shadow-lg mb-6 text-white">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-green-100 text-sm mb-1">Total Jobs</p>
              <p className="text-4xl font-black">{filteredJobs.length}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm mb-1">Total Earnings</p>
              <p className="text-4xl font-black">₹{totalEarnings}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm mb-1">Avg Rating</p>
              <p className="text-4xl font-black">{avgRating.toFixed(1)} ⭐</p>
            </div>
            <div>
              <p className="text-green-100 text-sm mb-1">Filter</p>
              <p className="text-lg font-bold capitalize">{filterOption}</p>
            </div>
          </div>
        </div>

        {/* Filter Options */}
        <div className="bg-white rounded-2xl p-2 shadow-md mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500 ml-2" />
            <div className="flex-1 flex gap-2 overflow-x-auto">
              <button
                onClick={() => setFilterOption('today')}
                className={`py-2 px-4 rounded-lg font-bold whitespace-nowrap transition-all ${
                  filterOption === 'today'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setFilterOption('week')}
                className={`py-2 px-4 rounded-lg font-bold whitespace-nowrap transition-all ${
                  filterOption === 'week'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setFilterOption('month')}
                className={`py-2 px-4 rounded-lg font-bold whitespace-nowrap transition-all ${
                  filterOption === 'month'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setFilterOption('all')}
                className={`py-2 px-4 rounded-lg font-bold whitespace-nowrap transition-all ${
                  filterOption === 'all'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>

        {/* Completed Job Cards */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <CompletedJobCard
              key={job.id}
              job={job}
              onViewSummary={handleViewSummary}
            />
          ))}

          {filteredJobs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Completed Jobs</h3>
              <p className="text-gray-600">No jobs found for the selected filter.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
