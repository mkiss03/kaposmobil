'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { motion } from 'framer-motion';

interface ParkingSpot {
  id: string;
  name: string;
  zone: string;
  lat: number;
  lng: number;
}

interface Zone {
  id: string;
  name: string;
  color: string;
  coordinates: [number, number][];
}

export default function MapLeafContainer({
  ZONES,
  PARKING_SPOTS,
}: {
  ZONES: Zone[];
  PARKING_SPOTS: ParkingSpot[];
}) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showOccupancy, setShowOccupancy] = useState(false);
  const [occupancy, setOccupancy] = useState<Record<string, boolean>>({});

  // Initialize map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    // Setup Leaflet icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    // Create map
    const map = L.map(containerRef.current).setView([46.36, 17.79], 15);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add zones
    ZONES.forEach((zone) => {
      L.polygon(zone.coordinates as any, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.2,
        weight: 2,
      })
        .bindPopup(`<b>${zone.name}</b><br>${zone.id}`)
        .addTo(map);
    });

    mapRef.current = map;
  }, []);

  // Generate mock occupancy
  const generateOccupancy = () => {
    const newOccupancy: Record<string, boolean> = {};
    PARKING_SPOTS.forEach((spot) => {
      newOccupancy[spot.id] = Math.random() < 0.6;
    });
    return newOccupancy;
  };

  // Update occupancy
  useEffect(() => {
    setOccupancy(generateOccupancy());
    const interval = setInterval(() => {
      setOccupancy(generateOccupancy());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getOccupancyStatus = (spotId: string) => {
    if (!showOccupancy) return null;
    const isOccupied = occupancy[spotId];
    const availableCount = Object.values(occupancy).filter((o) => !o).length;

    if (isOccupied) return { color: '#ef4444', status: 'Foglalt' };
    if (availableCount > 2) return { color: '#22c55e', status: 'Szabad' };
    return { color: '#eab308', status: 'Kevés hely' };
  };

  const availableSpots = Object.values(occupancy).filter((o) => !o).length;
  const totalSpots = PARKING_SPOTS.length;

  // Add/remove markers when occupancy changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current!.removeLayer(layer);
      }
    });

    // Add new markers
    if (showOccupancy) {
      PARKING_SPOTS.forEach((spot) => {
        const statusInfo = getOccupancyStatus(spot.id);
        if (!statusInfo) return;

        const icon = L.icon({
          iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(statusInfo.color)}'%3E%3Ccircle cx='12' cy='12' r='8'/%3E%3C/svg%3E`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker([spot.lat, spot.lng], { icon })
          .bindPopup(`<b>${spot.name}</b><br>${spot.zone}<br><span style="color:${statusInfo.color}">${statusInfo.status}</span>`)
          .addTo(mapRef.current!);
      });
    }
  }, [showOccupancy, occupancy]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-3">Kaposvár Parkolási Térkép</h1>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative inline-block w-12 h-6 bg-gray-300 rounded-full">
              <motion.div
                animate={{ x: showOccupancy ? 24 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
              />
            </div>
            <input
              type="checkbox"
              checked={showOccupancy}
              onChange={(e) => setShowOccupancy(e.target.checked)}
              className="hidden"
            />
            <span className="font-semibold text-gray-700">Szabad férőhelyek (demo)</span>
          </label>

          {showOccupancy && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
            >
              {availableSpots}/{totalSpots} szabad
            </motion.div>
          )}
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 relative" ref={containerRef} />

      {/* Legend */}
      {showOccupancy && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-t border-gray-200 p-4 shadow-lg"
        >
          <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Jelmagyarázat</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#22c55e' }} />
              <span className="text-sm text-gray-700">Szabad</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#eab308' }} />
              <span className="text-sm text-gray-700">Kevés hely</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ef4444' }} />
              <span className="text-sm text-gray-700">Foglalt</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              💡 Az adatok <strong>5 másodpercenként</strong> frissülnek
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
