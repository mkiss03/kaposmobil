'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle, RotateCcw } from 'lucide-react';
import ScanButton from '@/components/ScanButton';
import InspectorSnapshot, { ValidationState } from '@/lib/inspectorSnapshot';

type InspectorState = 'idle' | 'validating' | 'result';

interface ValidationResult {
  plate: string;
  state: ValidationState;
  zone?: string;
  validUntil?: number;
}

export default function InspectorPage() {
  const [inspectorState, setInspectorState] = useState<InspectorState>('idle');
  const [manualPlate, setManualPlate] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize snapshot on first load
  useEffect(() => {
    const snapshot = InspectorSnapshot.getSnapshot();
    if (snapshot.length === 0) {
      // Generate demo snapshot on first visit
      InspectorSnapshot.generateDemoSnapshot();
    }
    setIsHydrated(true);
  }, []);

  const handleScan = async (plate: string) => {
    validatePlate(plate);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualPlate.trim()) {
      validatePlate(manualPlate.trim().toUpperCase());
    }
  };

  const validatePlate = async (plate: string) => {
    setInspectorState('validating');

    // Simulate validation delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const state = InspectorSnapshot.validate(plate);
    const record = InspectorSnapshot.getRecord(plate);

    setResult({
      plate,
      state,
      zone: record?.zone,
      validUntil: record?.validUntil,
    });

    setManualPlate('');
    setInspectorState('result');

    // Auto-reset after 4 seconds if not ACTIVE
    if (state !== 'ACTIVE') {
      setTimeout(() => {
        setInspectorState('idle');
        setResult(null);
      }, 4000);
    }
  };

  const handleReset = () => {
    setInspectorState('idle');
    setResult(null);
    setManualPlate('');
  };

  const handleRefreshSnapshot = () => {
    InspectorSnapshot.generateDemoSnapshot();
    // Show brief confirmation
    alert('Snapshot frissítve: ABC-123 (aktív), ZZZ-999 (lejárt)');
  };

  const getStatusColor = (state: ValidationState) => {
    switch (state) {
      case 'ACTIVE':
        return { bg: 'from-green-400 to-green-600', icon: CheckCircle, text: 'ÉRVÉNYES', subtitle: '✓ Engedélyezett' };
      case 'EXPIRED':
        return { bg: 'from-orange-400 to-orange-600', icon: XCircle, text: 'LEJÁRT', subtitle: '✗ Érvényessége lejárt' };
      case 'NOT_FOUND':
        return { bg: 'from-red-400 to-red-600', icon: HelpCircle, text: 'NEM TALÁLT', subtitle: '? Nincs az adatbázisban' };
    }
  };

  if (!isHydrated) return null;

  return (
    <div className="min-h-screen bg-white pt-8 pb-24 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Idle & Validating States */}
        {inspectorState !== 'result' && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-sm flex flex-col items-center"
          >
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900">Ellenőrzés</h1>
              <p className="text-gray-500 mt-2">Rendszám ellenőrzése</p>
            </div>

            {/* Scan Button */}
            <div className="w-full mb-6">
              <ScanButton onScan={handleScan} disabled={inspectorState === 'validating'} />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 w-full mb-6">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-gray-500 text-sm font-semibold">VAGY</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Manual Input */}
            <form onSubmit={handleManualSubmit} className="w-full space-y-3 mb-6">
              <input
                type="text"
                placeholder="pl. ABC-123"
                value={manualPlate}
                onChange={(e) => setManualPlate(e.target.value.toUpperCase())}
                disabled={inspectorState === 'validating'}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-lg uppercase focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100"
              />
              <motion.button
                type="submit"
                disabled={inspectorState === 'validating' || !manualPlate.trim()}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 px-4 font-bold rounded-lg transition-colors ${
                  inspectorState === 'validating' || !manualPlate.trim()
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {inspectorState === 'validating' ? 'Ellenőrzés...' : 'Ellenőrzés'}
              </motion.button>
            </form>

            {/* Refresh Snapshot Button */}
            <motion.button
              onClick={handleRefreshSnapshot}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 mt-4"
            >
              <RotateCcw size={16} />
              Lista frissítése
            </motion.button>

            {/* Loading Indicator */}
            {inspectorState === 'validating' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center justify-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full"
                />
                <span className="text-gray-600 font-medium">Ellenőrzés...</span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Result State */}
        {inspectorState === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-sm"
          >
            {(() => {
              const { bg, icon: Icon, text, subtitle } = getStatusColor(result.state);
              const isActive = result.state === 'ACTIVE';

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gradient-to-br ${bg} rounded-3xl p-8 text-white text-center shadow-2xl`}
                >
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="mb-6 flex justify-center"
                  >
                    <Icon size={80} className="text-white" />
                  </motion.div>

                  {/* Status */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-4xl font-bold mb-2">{text}</p>
                    <p className="text-white/80 text-lg mb-6">{subtitle}</p>
                  </motion.div>

                  {/* License Plate */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/20 rounded-xl px-6 py-4 mb-6 backdrop-blur"
                  >
                    <p className="text-white/70 text-xs uppercase tracking-widest mb-2">Rendszám</p>
                    <p className="text-white font-mono text-3xl font-bold tracking-wider">{result.plate}</p>
                  </motion.div>

                  {/* Details */}
                  {result.zone && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/80 text-sm mb-6"
                    >
                      <p>Zóna: <span className="font-bold">{result.zone}</span></p>
                      {result.validUntil && (
                        <p className="mt-2">
                          Érvényes: {new Date(result.validUntil).toLocaleDateString('hu-HU')}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Action Button */}
                  <motion.button
                    onClick={handleReset}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 px-6 font-bold rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white text-green-600 hover:bg-green-50'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {isActive ? 'Újra szkenneléhez' : 'Vissza'}
                  </motion.button>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

