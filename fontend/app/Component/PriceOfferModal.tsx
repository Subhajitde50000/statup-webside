'use client';

import React, { useState } from 'react';
import { X, DollarSign, FileText, Tag } from 'lucide-react';
import { createOffer } from '@/utils/offers';

interface PriceOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalId: string;
  professionalName: string;
}

export default function PriceOfferModal({
  isOpen,
  onClose,
  professionalId,
  professionalName,
}: PriceOfferModalProps) {
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [offeredPrice, setOfferedPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createOffer({
        professional_id: professionalId,
        service_type: serviceType,
        description: description,
        offered_price: parseFloat(offeredPrice),
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setServiceType('');
        setDescription('');
        setOfferedPrice('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to send offer');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Make Price Offer</h2>
            <p className="text-sm text-gray-600 mt-1">To {professionalName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Offer sent successfully! The professional will review it soon.
            </div>
          )}

          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline-block w-4 h-4 mr-2" />
              Service Type *
            </label>
            <input
              type="text"
              required
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder="e.g., Home Repair, Plumbing, Electrical"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline-block w-4 h-4 mr-2" />
              Description *
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the service you need..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Offered Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline-block w-4 h-4 mr-2" />
              Your Offer Price (₹) *
            </label>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(e.target.value)}
              placeholder="Enter your price offer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your offer will be valid for 7 days. The professional can accept or reject your offer.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : success ? 'Sent!' : 'Send Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
