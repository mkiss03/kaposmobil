'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, LogOut, MapPin, Plus, X } from 'lucide-react';
import ParkingStore, { ParkingSession } from '@/lib/parkingStore';

// ==================== TYPES ====================
interface Car {
  id: string;
  name: string;
  plate: string;
}

interface Zone {
  id: string;
  name: string;
  description: string;
  hourlyRate: number;
}

interface UserSession {
  isLoggedIn: boolean;
  userId?: string;
  userName?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
}

// ==================== CONSTANTS ====================
const zones: Zone[] = [
  { id: 'zone-1', name: 'I. Zóna', description: 'Belváros', hourlyRate: 480 },
  { id: 'zone-2', name: 'II. Zóna', description: 'Piac', hourlyRate: 450 },
  { id: 'zone-3', name: 'III. Zóna', description: 'Vasútállomás', hourlyRate: 420 },
  { id: 'zone-4', name: 'IV. Zóna', description: 'Park', hourlyRate: 380 },
  { id: 'zone-5', name: 'V. Zóna', description: 'Kórház', hourlyRate: 480 },
];

// ==================== UTILITIES ====================
const CARS_STORAGE_KEY = 'parking_cars';
const USER_SESSION_KEY = 'userSession';
const PARKING_START_KEY = 'parkingStartTime';
const SELECTED_CAR_KEY = 'selectedCarId';
const SELECTED_ZONE_KEY = 'selectedZoneId';
const LOCATION_DATA_KEY = 'locationData';

function loadCarsFromStorage(): Car[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CARS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCarsToStorage(cars: Car[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(cars));
  } catch {
    console.error('Failed to save cars to storage');
  }
}

// ==================== ADD CAR MODAL ====================
interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (car: Car) => void;
}

function AddCarModal({ isOpen, onClose, onSave }: AddCarModalProps) {
  const [plate, setPlate] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');

    // Validation
    if (!plate.trim()) {
      setError('Kérlek add meg a rendszámot');
      return;
    }
    if (!name.trim()) {
      setError('Kérlek add meg az autó nevét');
      return;
    }

    // Validate plate format (basic Hungarian format)
    if (plate.trim().length < 3) {
      setError('Rendszám túl rövid');
      return;
    }

    const newCar: Car = {
      id: 'car_' + Date.now(),
      plate: plate.trim().toUpperCase(),
      name: name.trim(),
    };

    onSave(newCar);
    setPlate('');
    setName('');
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Új autó hozzáadása</h2>
              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-slate-100 rounded-full"
              >
                <X size={20} className="text-slate-600" />
              </motion.button>
            </div>

            {/* Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                  Rendszám
                </label>
                <input
                  type="text"
                  placeholder="pl. ABC-1234"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-mono text-lg uppercase focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                  Autó elnevezése
                </label>
                <input
                  type="text"
                  placeholder="pl. Céges Skoda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm font-semibold"
              >
                {error}
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl"
              >
                Mégse
              </motion.button>
              <motion.button
                onClick={handleSave}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
              >
                Hozzáadás
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ==================== LOGIN SCREEN ====================
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white flex flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
          <Car size={40} className="text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-slate-900 mb-3" style={{ fontWeight: 800 }}>
          Kaposvár+
        </h1>
        <p className="text-lg text-slate-600">A városi szuperapplikáció</p>
      </motion.div>

      <motion.button
        onClick={onLogin}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.95 }}
        className="w-full max-w-sm py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transition-all uppercase tracking-wide"
      >
        Bejelentkezés
      </motion.button>
    </motion.div>
  );
}

// ==================== SLIDE TO START BUTTON ====================
interface SlideToStartProps {
  onStart: () => void;
  disabled: boolean;
}

function SlideToStartButton({ onStart, disabled }: SlideToStartProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragProgress(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || disabled) return;

    const rect = containerRef.current.getBoundingClientRect();
    const progress = Math.min((e.clientX - rect.left) / rect.width, 1);
    setDragProgress(progress);

    if (progress >= 0.95) {
      handleMouseUp();
      onStart();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-16 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {/* Background track */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl border-2 border-blue-300" />

      {/* Progress fill */}
      <motion.div
        animate={{ width: `${dragProgress * 100}%` }}
        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl"
      />

      {/* Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className={`font-bold text-sm transition-colors ${
          dragProgress > 0.5 ? 'text-white' : 'text-blue-600'
        }`}>
          {dragProgress > 0.9 ? 'Elkészülve!' : 'Húzz a Parkoláshoz →'}
        </p>
      </div>

      {/* Draggable handle */}
      <motion.div
        drag="x"
        dragConstraints={containerRef}
        onDragStart={handleMouseDown}
        onDragEnd={() => {
          setIsDragging(false);
          setDragProgress(0);
        }}
        onDrag={(event, info) => {
          if (!containerRef.current) return;
          const progress = info.x / (containerRef.current.offsetWidth - 60);
          setDragProgress(Math.min(Math.max(progress, 0), 1));

          if (progress >= 0.95) {
            onStart();
          }
        }}
        className="absolute top-1 left-1 w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg font-bold">▶</span>
        </div>
      </motion.div>
    </div>
  );
}

// ==================== HOLD TO STOP BUTTON ====================
interface HoldToStopProps {
  onStop: () => void;
}

function HoldToStopButton({ onStop }: HoldToStopProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    setIsHolding(true);
    let startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = (elapsed / 2000) * 100;
      setProgress(Math.min(percent, 100));

      if (percent >= 100) {
        clearInterval(interval);
        onStop();
        setIsHolding(false);
        setProgress(0);
      }
    }, 50);

    timeoutRef.current = interval as any;
  };

  const handleMouseUp = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current as any);
    }
    setIsHolding(false);
    setProgress(0);
  };

  return (
    <motion.button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      whileTap={{ scale: 0.95 }}
      className="relative w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all uppercase tracking-wide overflow-hidden"
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: isHolding ? 0.3 : 0 }}
      >
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="rgba(255, 255, 255, 0.2)"
          strokeDasharray={`${progress * 2.83} 283`}
        />
      </svg>

      <span className="relative z-10">
        {progress < 100 ? `Tartsd lenyomva a leállításhoz (${Math.round(progress)}%)` : 'Leállítás...'}
      </span>
    </motion.button>
  );
}

// ==================== PARKING SCREEN ====================
function ParkingScreen({ onLogout }: { onLogout: () => void }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [isParking, setIsParking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [colonVisible, setColonVisible] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [zoneLoading, setZoneLoading] = useState(false);

  const selectedCar = cars.find((c) => c.id === selectedCarId);
  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  // Initialize on mount
  useEffect(() => {
    // Load cars from storage
    const savedCars = loadCarsFromStorage();
    setCars(savedCars);

    // Load selected car
    const savedCarId = localStorage.getItem(SELECTED_CAR_KEY);
    if (savedCarId && savedCars.some((c) => c.id === savedCarId)) {
      setSelectedCarId(savedCarId);
    }

    // Load selected zone
    const savedZoneId = localStorage.getItem(SELECTED_ZONE_KEY);
    if (savedZoneId) {
      setSelectedZoneId(savedZoneId);
    }

    // Load parking session if active
    const savedStartTime = localStorage.getItem(PARKING_START_KEY);
    if (savedStartTime) {
      const startTime = parseInt(savedStartTime, 10);
      setIsParking(true);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
    }

    // Get location
    requestGeolocation();

    setIsHydrated(true);
  }, []);

  // Request geolocation
  const requestGeolocation = () => {
    setLocationLoading(true);
    setLocationError(null);

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolokáció nem támogatott');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const locData: LocationData = { latitude, longitude, accuracy };
        setLocationData(locData);

        // Auto-select first zone if not already selected
        if (!selectedZoneId) {
          setSelectedZoneId(zones[0].id);
          localStorage.setItem(SELECTED_ZONE_KEY, zones[0].id);
        }

        setLocationLoading(false);
      },
      (error) => {
        console.log('Geolocation error:', error);
        setLocationError('Helyzet nem elérhető - Kérlek válassz zónát manuálisan');
        setLocationLoading(false);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
      }
    );
  };

  // Blinking colon effect
  useEffect(() => {
    if (!isParking) return;
    const interval = setInterval(() => {
      setColonVisible((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, [isParking]);

  // Timer update every second
  useEffect(() => {
    if (!isParking) {
      setElapsedTime(0);
      return;
    }

    const startTime = localStorage.getItem(PARKING_START_KEY);
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - parseInt(startTime, 10)) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isParking]);

  // Handle add car
  const handleAddCar = (newCar: Car) => {
    const updatedCars = [...cars, newCar];
    setCars(updatedCars);
    saveCarsToStorage(updatedCars);
    setIsAddCarModalOpen(false);
    // Auto-select the new car
    setSelectedCarId(newCar.id);
    localStorage.setItem(SELECTED_CAR_KEY, newCar.id);
  };

  // Handle car selection
  const handleSelectCar = (carId: string) => {
    if (isParking) return;
    setSelectedCarId(carId);
    localStorage.setItem(SELECTED_CAR_KEY, carId);
  };

  // Handle zone selection
  const handleZoneChange = () => {
    setZoneLoading(true);
    setTimeout(() => {
      setZoneLoading(false);
    }, 1500);
  };

  // Handle start parking
  const handleStartParking = () => {
    if (!selectedCarId || !selectedZoneId) return;

    const now = Date.now();
    localStorage.setItem(PARKING_START_KEY, now.toString());
    setIsParking(true);
    setElapsedTime(0);
  };

  // Handle stop parking
  const handleStopParking = () => {
    localStorage.removeItem(PARKING_START_KEY);
    setIsParking(false);
    setElapsedTime(0);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: String(hrs).padStart(2, '0'),
      minutes: String(mins).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0'),
    };
  };

  // Calculate cost
  const calculateCost = (seconds: number, hourlyRate: number) => {
    if (seconds === 0) return 0;
    const hours = seconds / 3600;
    return Math.round(hours * hourlyRate);
  };

  const { hours, minutes, seconds } = formatTime(elapsedTime);
  const currentCost = selectedZone ? calculateCost(elapsedTime, selectedZone.hourlyRate) : 0;
  const isStartDisabled = !selectedCarId || !selectedZoneId;

  if (!isHydrated) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 pt-6 pb-24 px-4 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">
            Üdvözöljük
          </p>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontWeight: 800 }}>
            Parkolás
          </h1>
        </div>
        <motion.button
          onClick={onLogout}
          whileTap={{ scale: 0.9 }}
          className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          title="Kijelentkezés"
        >
          <LogOut size={20} className="text-slate-600" />
        </motion.button>
      </div>

      {/* Garage Section */}
      <div className="mb-6">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
          Járműved
        </p>

        {cars.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center mb-3 bg-slate-100/50"
          >
            <p className="text-slate-600 font-semibold mb-4">Adj hozzá autót a kezdéshez</p>
            <motion.button
              onClick={() => setIsAddCarModalOpen(true)}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={18} />
              Új autó
            </motion.button>
          </motion.div>
        ) : (
          // Car List
          <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 scrollbar-hide">
            {cars.map((car) => {
              const isActive = selectedCarId === car.id && !isParking;
              return (
                <motion.button
                  key={car.id}
                  onClick={() => handleSelectCar(car.id)}
                  disabled={isParking}
                  whileTap={{ scale: isParking ? 1 : 0.98 }}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : isParking
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-left">
                    <p className="text-sm font-bold">{car.name}</p>
                    <p className="text-xs opacity-75 font-mono">{car.plate}</p>
                  </div>
                </motion.button>
              );
            })}

            {/* Add Vehicle Button */}
            <motion.button
              onClick={() => setIsAddCarModalOpen(true)}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 px-4 py-3 rounded-xl bg-blue-50 border-2 border-blue-300 text-blue-600 font-semibold hover:bg-blue-100 transition-all flex items-center justify-center min-w-14"
            >
              <Plus size={20} />
            </motion.button>
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="mb-6">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
          Helyzeted
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 mb-3 transition-all ${
            locationLoading
              ? 'bg-blue-100 border-2 border-blue-300'
              : locationError
                ? 'bg-orange-100 border-2 border-orange-300'
                : 'bg-white border border-slate-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: locationLoading ? 360 : 0 }}
              transition={{ duration: locationLoading ? 1 : 0.3, repeat: locationLoading ? Infinity : 0 }}
            >
              <MapPin
                size={24}
                className={
                  locationLoading
                    ? 'text-blue-500'
                    : locationError
                      ? 'text-orange-500'
                      : 'text-slate-600'
                }
              />
            </motion.div>
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {locationLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-slate-600 font-semibold">GPS jel keresése...</p>
                  </motion.div>
                ) : locationError ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-orange-700 font-semibold">{locationError}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-slate-600 text-sm">
                      📍 Érzékelt pozíció: Kaposvár{locationData && (
                        <>
                          <br />
                          <span className="font-mono text-xs">
                            GPS: {locationData.latitude.toFixed(4)}°, {locationData.longitude.toFixed(4)}°
                          </span>
                        </>
                      )}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Zone Selector */}
        <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 scrollbar-hide mb-3">
          {zones.map((zone) => (
            <motion.button
              key={zone.id}
              onClick={() => {
                if (!isParking) {
                  setSelectedZoneId(zone.id);
                  localStorage.setItem(SELECTED_ZONE_KEY, zone.id);
                  handleZoneChange();
                }
              }}
              disabled={isParking}
              whileTap={{ scale: isParking ? 1 : 0.98 }}
              className={`flex-shrink-0 px-4 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                selectedZoneId === zone.id
                  ? 'border-2 border-blue-500 bg-white text-blue-600 shadow-md'
                  : isParking
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <p className="font-bold">{zone.name}</p>
              <p className="text-xs opacity-75">{zone.description}</p>
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={handleZoneChange}
          disabled={isParking}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Nem itt vagyok? Zóna módosítása
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {isParking && selectedCar && selectedZone ? (
            // ACTIVE PARKING
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl shadow-slate-200"
            >
              {/* License Plate */}
              <div
                className="bg-white border-4 border-black rounded-lg p-4 mb-8 text-center font-mono"
                style={{
                  background: 'linear-gradient(to bottom, #f0f0f0, white)',
                  boxShadow: '0 4px 0 rgba(0, 0, 0, 0.2)',
                }}
              >
                <p className="text-xs font-bold text-blue-600 mb-1">HUNGARY</p>
                <p className="text-4xl font-bold text-black tracking-widest">{selectedCar.plate}</p>
              </div>

              {/* Car Info */}
              <div className="bg-slate-100 rounded-2xl p-4 mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-1">
                  Autó
                </p>
                <p className="text-lg font-bold text-slate-900">{selectedCar.name}</p>
              </div>

              {/* Status */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                    Aktív parkolás
                  </p>
                  <p className="text-2xl font-bold text-slate-900">{selectedZone.name}</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Folyamatban
                </div>
              </div>

              {/* Timer */}
              <div className="bg-slate-50 rounded-2xl p-8 mb-8 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                  Eltelt idő
                </p>
                <div
                  className="font-mono text-6xl font-bold text-slate-900 tracking-tight"
                  style={{ tabularNums: 'tabular-nums' } as any}
                >
                  <span>{hours}</span>
                  <motion.span
                    animate={{ opacity: colonVisible ? 1 : 0.4 }}
                    transition={{ duration: 0 }}
                  >
                    :
                  </motion.span>
                  <span>{minutes}</span>
                  <motion.span
                    animate={{ opacity: colonVisible ? 1 : 0.4 }}
                    transition={{ duration: 0 }}
                  >
                    :
                  </motion.span>
                  <span>{seconds}</span>
                </div>
              </div>

              {/* Cost */}
              <div className="bg-slate-100 rounded-2xl p-6 mb-8 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">
                  Jelenlegi díj
                </p>
                <p className="text-5xl font-bold text-slate-900">
                  {currentCost}
                  <span className="text-2xl text-slate-600 ml-2">Ft</span>
                </p>
              </div>

              {/* Hold to Stop */}
              <HoldToStopButton onStop={handleStopParking} />
            </motion.div>
          ) : (
            // IDLE STATE
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-full max-w-sm"
            >
              {!selectedCar ? (
                // No car selected
                <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200 text-center">
                  <p className="text-lg font-bold text-slate-700 mb-4">
                    Válassz egy autót a parkolás megkezdéséhez
                  </p>
                  <p className="text-sm text-slate-500">
                    Add hozzá az autódat vagy válassz a felsoroltakból
                  </p>
                </div>
              ) : !selectedZone ? (
                // No zone selected
                <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200 text-center">
                  <p className="text-lg font-bold text-slate-700 mb-4">
                    Válassz egy zónát a parkolás megkezdéséhez
                  </p>
                  <p className="text-sm text-slate-500">
                    Válaszd ki a parkolási zónádat
                  </p>
                </div>
              ) : (
                // Ready to park
                <>
                  <div className="bg-white rounded-3xl p-8 mb-6 shadow-lg shadow-slate-200">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                      Készen állsz?
                    </p>

                    {/* License Plate Preview */}
                    <div
                      className="bg-white border-4 border-black rounded-lg p-4 mb-6 text-center font-mono"
                      style={{
                        background: 'linear-gradient(to bottom, #f0f0f0, white)',
                        boxShadow: '0 4px 0 rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <p className="text-xs font-bold text-blue-600 mb-1">HUNGARY</p>
                      <p className="text-3xl font-bold text-black tracking-widest">
                        {selectedCar.plate}
                      </p>
                    </div>

                    {/* Car & Zone Info */}
                    <div className="space-y-3">
                      <div className="bg-slate-100 rounded-xl p-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
                          Autó
                        </p>
                        <p className="text-lg font-bold text-slate-900">{selectedCar.name}</p>
                      </div>

                      <div className="bg-slate-100 rounded-xl p-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
                          Zóna
                        </p>
                        <p className="text-lg font-bold text-slate-900">{selectedZone.name}</p>
                        <p className="text-sm text-slate-600">{selectedZone.description}</p>
                        <p className="text-xl font-bold text-blue-600 mt-2">
                          {selectedZone.hourlyRate} Ft/óra
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slide to Start */}
                  <SlideToStartButton onStart={handleStartParking} disabled={isStartDisabled} />

                  <p className="text-xs text-slate-500 text-center mt-4">
                    Húzd a gombot a parkolás megkezdéséhez
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Car Modal */}
      <AddCarModal
        isOpen={isAddCarModalOpen}
        onClose={() => setIsAddCarModalOpen(false)}
        onSave={handleAddCar}
      />
    </motion.div>
  );
}

// ==================== MAIN PAGE ====================
export default function HomePage() {
  const [userSession, setUserSession] = useState<UserSession>({
    isLoggedIn: false,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession) as UserSession;
        setUserSession(session);
      } catch (e) {
        console.error('Failed to parse user session:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('userSession', JSON.stringify(userSession));
  }, [userSession]);

  const handleLogin = () => {
    setUserSession({
      isLoggedIn: true,
      userId: 'user_' + Date.now(),
      userName: 'Felhasználó',
    });
  };

  const handleLogout = () => {
    setUserSession({
      isLoggedIn: false,
    });
    localStorage.removeItem('parkingStartTime');
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {userSession.isLoggedIn ? (
        <ParkingScreen key="parking" onLogout={handleLogout} />
      ) : (
        <LoginScreen key="login" onLogin={handleLogin} />
      )}
    </AnimatePresence>
  );
}
