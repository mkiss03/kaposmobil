'use client';

import { useRef, useState, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

interface ScanButtonProps {
  onScan: (data: string) => void;
  disabled?: boolean;
}

export default function ScanButton({ onScan, disabled = false }: ScanButtonProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const startScan = async () => {
    if (!videoRef.current) return;

    setError(null);
    setIsScanning(true);

    try {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result: any) => {
          try {
            const payload = JSON.parse(result.data);
            if (payload.plate) {
              onScan(payload.plate);
              stopScan();
            }
          } catch {
            // Try as plain plate string
            onScan(result.data);
            stopScan();
          }
        },
        {
          onDecodeError: () => {
            // Ignore decode errors
          },
          preferredCamera: 'environment',
          highlightCodeOutlineColor: 'rgb(59, 130, 246)',
        }
      );

      await scannerRef.current.start();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kamera indítása sikertelen';
      setError(message);
      setIsScanning(false);
    }
  };

  const stopScan = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full space-y-4">
      {isScanning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-blue-50 border border-blue-300 rounded-lg overflow-hidden"
        >
          <video
            ref={videoRef}
            className="w-full aspect-square object-cover"
            style={{ display: 'block' }}
          />
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold"
        >
          {error}
        </motion.div>
      )}

      <motion.button
        onClick={isScanning ? stopScan : startScan}
        disabled={disabled}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
          isScanning
            ? 'bg-red-500 text-white hover:bg-red-600'
            : disabled
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        <Camera size={20} />
        {isScanning ? 'Szkenneléés leállítása' : 'QR Kód Beolvasása'}
      </motion.button>
    </div>
  );
}
