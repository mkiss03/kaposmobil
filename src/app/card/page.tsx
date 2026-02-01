'use client';

import { useState } from 'react';
import FlipCard from '@/components/FlipCard';
import Toast from '@/components/Toast';

export default function CardPage() {
  const [showToast, setShowToast] = useState(false);

  const handleAddToWallet = () => {
    setShowToast(true);
  };

  return (
    <div className="min-h-screen bg-white pt-8 pb-24 px-4 flex flex-col items-center">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Kaposvár Kártya</h1>
        <p className="text-gray-500 text-center mt-2">Digitális város kártyája</p>
      </div>

      {/* Card */}
      <FlipCard onAddToWallet={handleAddToWallet} />

      {/* Toast Notification */}
      <Toast
        isVisible={showToast}
        message="Sikeresen hozzáadva"
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
