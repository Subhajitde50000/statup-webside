'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Tag,
  Calendar,
  Check,
  X,
  MessageSquare
} from 'lucide-react';
import { getReceivedOffers, acceptOffer, rejectOffer, revokeOffer, PriceOffer } from '@/utils/offers';
import ProfessionalNavbar from '../components/ProfessionalNavbar';
import { useOfferSocket } from '@/utils/OfferSocketContext';

export default function ProfessionalOffersPage() {
  const router = useRouter();
  const { newOffers, isConnected, joinOffersRoom, leaveOffersRoom, clearOfferEvent } = useOfferSocket();
  const [offers, setOffers] = useState<PriceOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [rejectMessage, setRejectMessage] = useState('');
  
  // Accept modal state
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [acceptOffer_, setAcceptOffer_] = useState<PriceOffer | null>(null);
  const [finalPrice, setFinalPrice] = useState('');
  const [validityDays, setValidityDays] = useState('7');
  const [acceptMessage, setAcceptMessage] = useState('');

  // Revoke modal state
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revokeOfferId, setRevokeOfferId] = useState<string | null>(null);
  const [revokeMessage, setRevokeMessage] = useState('');

  useEffect(() => {
    fetchOffers();
    // Join offers room for real-time updates
    joinOffersRoom();
    
    return () => {
      leaveOffersRoom();
    };
  }, [filterStatus, joinOffersRoom, leaveOffersRoom]);

  // Listen for new offers in real-time
  useEffect(() => {
    if (newOffers.length > 0) {
      // Add new offers to the list
      const latestOffer = newOffers[newOffers.length - 1];
      setOffers(prev => [latestOffer.offer, ...prev]);
      
      // Show success message
      console.log('New offer received:', latestOffer);
      
      // Clear the event after processing
      clearOfferEvent(latestOffer.offer.id);
    }
  }, [newOffers, clearOfferEvent]);

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/auth');
        return;
      }

      setLoading(true);
      const data = await getReceivedOffers(filterStatus || undefined);
      setOffers(data);
      setError('');
    } catch (err: any) {
      if (err.message.includes('Not authorized') || err.message.includes('Only professionals')) {
        alert('This page is only accessible to professionals.');
        router.push('/');
      } else {
        setError(err.message || 'Failed to load offers');
      }
    } finally {
      setLoading(false);
    }
  };

  const openAcceptModal = (offer: PriceOffer) => {
    setAcceptOffer_(offer);
    setFinalPrice(offer.offered_price.toString());
    setValidityDays('7');
    setAcceptMessage('');
    setAcceptModalOpen(true);
  };

  const handleAcceptOffer = async () => {
    if (!acceptOffer_) return;

    try {
      setProcessingId(acceptOffer_.id);
      // Convert days to hours
      const validityHours = parseInt(validityDays) * 24;
      await acceptOffer(acceptOffer_.id, {
        validity_hours: validityHours,
        response_message: acceptMessage || undefined
      });
      alert('Offer accepted! The customer can now book at your set price.');
      setAcceptModalOpen(false);
      setAcceptOffer_(null);
      await fetchOffers();
    } catch (err: any) {
      alert(err.message || 'Failed to accept offer');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectOffer = async () => {
    if (!selectedOfferId) return;

    try {
      setProcessingId(selectedOfferId);
      await rejectOffer(selectedOfferId, rejectMessage);
      alert('Offer rejected.');
      setRejectModalOpen(false);
      setRejectMessage('');
      setSelectedOfferId(null);
      await fetchOffers();
    } catch (err: any) {
      alert(err.message || 'Failed to reject offer');
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (offerId: string) => {
    setSelectedOfferId(offerId);
    setRejectModalOpen(true);
  };

  const openRevokeModal = (offerId: string) => {
    setRevokeOfferId(offerId);
    setRevokeMessage('');
    setRevokeModalOpen(true);
  };

  const handleRevokeOffer = async () => {
    if (!revokeOfferId) return;

    try {
      setProcessingId(revokeOfferId);
      await revokeOffer(revokeOfferId, revokeMessage);
      alert('Offer revoked successfully. The customer will be notified.');
      setRevokeModalOpen(false);
      setRevokeMessage('');
      setRevokeOfferId(null);
      await fetchOffers();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke offer');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalNavbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Price Offers</h1>
          <p className="text-gray-600 mt-2">Manage price offers from customers</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === '' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('accepted')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'accepted' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilterStatus('expired')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'expired' 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expired
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No offers found</h3>
            <p className="text-gray-600">
              {filterStatus 
                ? `You don't have any ${filterStatus} offers yet.` 
                : "You haven't received any price offers yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{offer.service_type}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(offer.status)}`}>
                        {getStatusIcon(offer.status)}
                        {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                      </span>
                    </div>
                    
                    {/* User Details */}
                    {offer.user_name && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <User className="w-4 h-4" />
                        <span>{offer.user_name}</span>
                      </div>
                    )}

                    <p className="text-gray-700 mb-3">{offer.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-green-600 text-lg">₹{offer.offered_price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(offer.created_at).toLocaleDateString()}</span>
                      </div>
                      {offer.status === 'pending' && (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Clock className="w-4 h-4" />
                          <span>Expires: {new Date(offer.expires_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      {offer.status === 'accepted' && offer.accepted_price_valid_until && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="w-4 h-4" />
                          <span>Valid until: {new Date(offer.accepted_price_valid_until).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions for Pending Offers */}
                {offer.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => openAcceptModal(offer)}
                      disabled={processingId === offer.id}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processingId === offer.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Accept
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openRejectModal(offer.id)}
                      disabled={processingId === offer.id}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}

                {/* Status for Accepted - waiting for user to book */}
                {offer.status === 'accepted' && !offer.booking_id && (
                  <div className="pt-3 border-t border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg flex-1">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          Accepted at ₹{offer.offered_price} - Waiting for customer to book
                        </span>
                      </div>
                      <button
                        onClick={() => openRevokeModal(offer.id)}
                        disabled={processingId === offer.id}
                        className="ml-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        Revoke Offer
                      </button>
                    </div>
                    {offer.accepted_price_valid_until && (
                      <p className="text-xs text-gray-500">
                        Valid until: {new Date(offer.accepted_price_valid_until).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Booking Link for Accepted with booking */}
                {offer.status === 'accepted' && offer.booking_id && (
                  <div className="pt-3 border-t border-gray-200">
                    <button
                      onClick={() => router.push(`/bookings`)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      View Booking →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">Reject Offer</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                You can optionally provide a reason for rejecting this offer:
              </p>

              <textarea
                value={rejectMessage}
                onChange={(e) => setRejectMessage(e.target.value)}
                placeholder="e.g., Price is too low, Not available at this time..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setRejectModalOpen(false);
                    setRejectMessage('');
                    setSelectedOfferId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={processingId !== null}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectOffer}
                  disabled={processingId !== null}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {processingId ? 'Rejecting...' : 'Reject Offer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal with Price & Validity */}
      {acceptModalOpen && acceptOffer_ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Accept Offer</h2>
              </div>
              
              {/* Offer Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">Service</p>
                <p className="font-semibold text-gray-900">{acceptOffer_.service_type}</p>
                <p className="text-sm text-gray-600 mt-2">Customer's Offer</p>
                <p className="font-semibold text-green-600 text-lg">₹{acceptOffer_.offered_price}</p>
              </div>

              {/* Final Price */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Final Price (₹)
                </label>
                <input
                  type="number"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can accept at the offered price or set a counter price
                </p>
              </div>

              {/* Validity Period */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validity Period (Days)
                </label>
                <select
                  value={validityDays}
                  onChange={(e) => setValidityDays(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Customer must book within this period
                </p>
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Customer (Optional)
                </label>
                <textarea
                  value={acceptMessage}
                  onChange={(e) => setAcceptMessage(e.target.value)}
                  placeholder="e.g., Looking forward to working with you..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setAcceptModalOpen(false);
                    setAcceptOffer_(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={processingId !== null}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptOffer}
                  disabled={processingId !== null || !finalPrice}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {processingId ? 'Accepting...' : `Accept at ₹${finalPrice}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Modal */}
      {revokeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">Revoke Accepted Offer</h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to revoke this accepted offer? The customer will be notified and will no longer be able to book at this price.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={revokeMessage}
                  onChange={(e) => setRevokeMessage(e.target.value)}
                  placeholder="e.g., Schedule conflict, price adjustment needed..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setRevokeModalOpen(false);
                    setRevokeMessage('');
                    setRevokeOfferId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={processingId !== null}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevokeOffer}
                  disabled={processingId !== null}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {processingId ? 'Revoking...' : 'Revoke Offer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
