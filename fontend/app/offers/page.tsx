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
  Trash2
} from 'lucide-react';
import { getMyOffers, cancelOffer, PriceOffer } from '@/utils/offers';
import Navbar from '../Component/Navbar';
import { useOfferSocket } from '@/utils/OfferSocketContext';

export default function MyOffersPage() {
  const router = useRouter();
  const { acceptedOffers, rejectedOffers, revokedOffers, isConnected, joinOffersRoom, leaveOffersRoom, clearOfferEvent } = useOfferSocket();
  const [offers, setOffers] = useState<PriceOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    fetchOffers();
    // Join offers room for real-time updates
    joinOffersRoom();
    
    return () => {
      leaveOffersRoom();
    };
  }, [filterStatus, joinOffersRoom, leaveOffersRoom]);

  // Listen for accepted offers in real-time
  useEffect(() => {
    if (acceptedOffers.length > 0) {
      const latestAccepted = acceptedOffers[acceptedOffers.length - 1];
      // Update the offer status in the list
      setOffers(prev => prev.map(o => 
        o.id === latestAccepted.offer.id ? latestAccepted.offer : o
      ));
      console.log('Offer accepted:', latestAccepted);
      clearOfferEvent(latestAccepted.offer.id);
    }
  }, [acceptedOffers, clearOfferEvent]);

  // Listen for rejected offers in real-time
  useEffect(() => {
    if (rejectedOffers.length > 0) {
      const latestRejected = rejectedOffers[rejectedOffers.length - 1];
      // Update the offer status in the list
      setOffers(prev => prev.map(o => 
        o.id === latestRejected.offer.id ? latestRejected.offer : o
      ));
      console.log('Offer rejected:', latestRejected);
      clearOfferEvent(latestRejected.offer.id);
    }
  }, [rejectedOffers, clearOfferEvent]);

  // Listen for revoked offers in real-time
  useEffect(() => {
    if (revokedOffers.length > 0) {
      const latestRevoked = revokedOffers[revokedOffers.length - 1];
      // Update the offer status in the list (status becomes 'expired')
      setOffers(prev => prev.map(o => 
        o.id === latestRevoked.offer.id ? latestRevoked.offer : o
      ));
      console.log('Offer revoked:', latestRevoked);
      alert('The professional has revoked an accepted offer.');
      clearOfferEvent(latestRevoked.offer.id);
    }
  }, [revokedOffers, clearOfferEvent]);

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/auth');
        return;
      }

      setLoading(true);
      const data = await getMyOffers(filterStatus || undefined);
      setOffers(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to cancel this offer?')) return;

    try {
      setCancelingId(offerId);
      await cancelOffer(offerId);
      await fetchOffers(); // Refresh list
    } catch (err: any) {
      alert(err.message || 'Failed to cancel offer');
    } finally {
      setCancelingId(null);
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
      <Navbar 
        onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        isNotificationsOpen={isNotificationsOpen}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Price Offers</h1>
          <p className="text-gray-600 mt-2">Track all your price offers to professionals</p>
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
                : "You haven't sent any price offers yet."}
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
                    
                    {/* Professional Details */}
                    {offer.professional_name && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <User className="w-4 h-4" />
                        <span>{offer.professional_name}</span>
                      </div>
                    )}

                    <p className="text-gray-700 mb-3">{offer.description}</p>

                    {/* Response Message */}
                    {offer.response_message && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700">
                          <strong>Response:</strong> {offer.response_message}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-gray-900">₹{offer.offered_price}</span>
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
                    </div>
                  </div>

                  {/* Actions */}
                  {offer.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOffer(offer.id)}
                      disabled={cancelingId === offer.id}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Cancel offer"
                    >
                      {cancelingId === offer.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Booking Link */}
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
    </div>
  );
}
