'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface FlipCardProps {
  onAddToWallet: () => void;
}

export default function FlipCard({ onAddToWallet }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* 3D Flip Card */}
      <motion.div
        className="w-80 h-48 cursor-pointer perspective"
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            transformStyle: 'preserve-3d',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Front Side */}
          <motion.div
            style={{
              backfaceVisibility: 'hidden',
              width: '100%',
              height: '100%',
            }}
            className="bg-gradient-to-br from-blue-500 via-blue-600 to-teal-500 rounded-2xl p-6 flex flex-col justify-between shadow-xl text-white"
          >
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Kaposvár</h2>
                <p className="text-sm font-light text-blue-100">Kártya</p>
              </div>
              {/* Pulsing Valid Badge */}
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs font-semibold text-green-200">Valid</span>
              </div>
            </div>

            {/* Middle Section */}
            <div>
              <p className="text-xs text-blue-100 mb-2">CARDHOLDER</p>
              <p className="text-xl font-semibold">Dr. Teszt Elek</p>
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-blue-100 mb-1">CARD ID</p>
                <p className="text-lg font-mono font-bold tracking-wider">KAP-8821</p>
              </div>
              <p className="text-xs text-blue-100">Click to flip</p>
            </div>
          </motion.div>

          {/* Back Side */}
          <motion.div
            style={{
              backfaceVisibility: 'hidden',
              rotateY: 180,
              width: '100%',
              height: '100%',
            }}
            className="bg-white rounded-2xl p-6 flex flex-col justify-between items-center shadow-xl"
          >
            {/* QR Code Placeholder */}
            <div className="flex-1 flex items-center justify-center">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                className="bg-gray-50 p-2 rounded"
              >
                {/* QR Code placeholder SVG */}
                <rect x="10" y="10" width="100" height="100" fill="white" stroke="#000" strokeWidth="1" />
                {/* Timing patterns and modules - simplified QR representation */}
                {[...Array(10)].map((_, i) => (
                  <g key={`row-${i}`}>
                    {[...Array(10)].map((_, j) => (
                      <rect
                        key={`cell-${i}-${j}`}
                        x={15 + j * 8}
                        y={15 + i * 8}
                        width="6"
                        height="6"
                        fill={Math.random() > 0.5 ? '#000' : '#fff'}
                        stroke="#e5e7eb"
                        strokeWidth="0.5"
                      />
                    ))}
                  </g>
                ))}
              </svg>
            </div>

            {/* Text */}
            <p className="text-center text-sm font-medium text-gray-700">Mutassa fel az ellenőrnek</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Add to Wallet Button */}
      <motion.button
        onClick={onAddToWallet}
        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors active:scale-95"
        whileTap={{ scale: 0.95 }}
      >
        Hozzáadás a Wallethez
      </motion.button>

      {/* Hint Text */}
      <p className="text-xs text-gray-500 text-center">
        {isFlipped ? 'Kattints a kártyára az előoldal megtekintéséhez' : 'Kattints a kártyára a kódhoz'}
      </p>
    </div>
  );
}
