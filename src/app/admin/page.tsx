'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Wallet, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const [parkingVolume, setParkingVolume] = useState(1200);
  const [fee, setFee] = useState(90);
  const [isHydrated, setIsHydrated] = useState(false);

  // Calculate estimated additional annual revenue
  const estimatedAdditionalRevenue = parkingVolume * fee * 365;

  // Format currency in Hungarian format
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'HUF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format compact numbers for display
  const formatCompact = (value: number) => {
    return new Intl.NumberFormat('hu-HU', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-8 pb-24 px-4 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <TrendingUp className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white" style={{ fontWeight: 800 }}>
            Vezérlőpult
          </h1>
        </div>
        <p className="text-slate-400 text-sm">Bevétel szimulációs eszköz és analitika</p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Active Parking Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-3">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-xs font-bold text-green-400 uppercase">Aktív</span>
          </div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Aktív Parkolás
          </p>
          <p className="text-3xl font-bold text-white">248</p>
          <p className="text-xs text-slate-500 mt-1">+12% az elmúlt órában</p>
        </motion.div>

        {/* Daily Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-3">
            <Wallet className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-400 uppercase">Mai</span>
          </div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Mai Bevétel
          </p>
          <p className="text-3xl font-bold text-white">482 k</p>
          <p className="text-xs text-slate-500 mt-1">Ft</p>
        </motion.div>
      </div>

      {/* Revenue Simulator Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800 rounded-2xl p-8 border border-slate-700 mb-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Bevétel Szimulátor</h2>
            <p className="text-xs text-slate-400">Interaktív kalkuláció</p>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-8">
          {/* Napi Parkolás Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-slate-200">
                Napi Parkolás
              </label>
              <motion.span
                key={parkingVolume}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-cyan-400"
              >
                {parkingVolume.toLocaleString('hu-HU')}
              </motion.span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              value={parkingVolume}
              onChange={(e) => setParkingVolume(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              style={{
                background: `linear-gradient(to right, rgb(34, 211, 238) 0%, rgb(34, 211, 238) ${((parkingVolume - 100) / 4900) * 100}%, rgb(51, 65, 85) ${((parkingVolume - 100) / 4900) * 100}%, rgb(51, 65, 85) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>100</span>
              <span>5000</span>
            </div>
          </div>

          {/* Rendszerdíj Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-slate-200">
                Rendszerdíj (Ft)
              </label>
              <motion.span
                key={fee}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-green-400"
              >
                {fee} Ft
              </motion.span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-400"
              style={{
                background: `linear-gradient(to right, rgb(74, 222, 128) 0%, rgb(74, 222, 128) ${((fee - 20) / 180) * 100}%, rgb(51, 65, 85) ${((fee - 20) / 180) * 100}%, rgb(51, 65, 85) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>20 Ft</span>
              <span>200 Ft</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-cyan-500/30 mb-8"
      >
        <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Becsült Éves Többletbevétel
        </p>
        <motion.div
          key={estimatedAdditionalRevenue}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 mb-4"
          style={{ fontWeight: 900 }}
        >
          {formatCurrency(estimatedAdditionalRevenue)}
        </motion.div>

        {/* Calculation breakdown */}
        <div className="bg-slate-700/50 rounded-xl p-4 space-y-2 border border-slate-600/50">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Napi parkolás × Rendszerdíj × 365 nap</span>
            <span className="text-cyan-400 font-mono font-semibold">
              {parkingVolume} × {fee} × 365
            </span>
          </div>
          <div className="h-px bg-slate-600/50" />
          <div className="flex justify-between text-sm pt-2">
            <span className="text-slate-300 font-semibold">Eredmény</span>
            <motion.span
              key={estimatedAdditionalRevenue}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-green-400 font-bold text-lg"
            >
              {formatCompact(estimatedAdditionalRevenue)}
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-start gap-3"
        >
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-blue-400">💡</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-1">Szimulációs tipp</p>
            <p className="text-xs text-slate-400">
              Az éves bevétel kiszámítása: napi forgalom × napi díj × 365 nap
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-start gap-3"
        >
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-green-400">📊</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-1">Aktuális teljesítmény</p>
            <p className="text-xs text-slate-400">
              Valós idejű adatok a parkolási rendszerből
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
