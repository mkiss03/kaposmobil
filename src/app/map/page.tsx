'use client';

import dynamic from 'next/dynamic';

const MapLeafContainer = dynamic(() => import('@/components/MapLeafContainer'), { 
  ssr: false,
});

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

// Zone definitions
const ZONES: Zone[] = [
  {
    id: 'Z1',
    name: 'I. Zóna',
    color: '#3b82f6',
    coordinates: [
      [46.365, 17.785],
      [46.365, 17.795],
      [46.355, 17.795],
      [46.355, 17.785],
    ],
  },
  {
    id: 'Z2',
    name: 'II. Zóna',
    color: '#f59e0b',
    coordinates: [
      [46.375, 17.785],
      [46.375, 17.795],
      [46.365, 17.795],
      [46.365, 17.785],
    ],
  },
  {
    id: 'Z3',
    name: 'III. Zóna',
    color: '#8b5cf6',
    coordinates: [
      [46.365, 17.775],
      [46.365, 17.785],
      [46.355, 17.785],
      [46.355, 17.775],
    ],
  },
];

// Parking spot definitions
const PARKING_SPOTS: ParkingSpot[] = [
  { id: 'P1', name: 'P1 Parkoló', zone: 'Z1', lat: 46.3617, lng: 17.7875 },
  { id: 'P2', name: 'P2 Parkoló', zone: 'Z1', lat: 46.3607, lng: 17.7885 },
  { id: 'P3', name: 'P3 Parkoló', zone: 'Z2', lat: 46.3717, lng: 17.7885 },
  { id: 'P4', name: 'P4 Parkoló', zone: 'Z2', lat: 46.3727, lng: 17.7875 },
  { id: 'P5', name: 'P5 Parkoló', zone: 'Z3', lat: 46.3607, lng: 17.7775 },
  { id: 'P6', name: 'P6 Parkoló', zone: 'Z3', lat: 46.3617, lng: 17.7785 },
];

export default function MapPage() {
  return (
    <div className="h-screen flex flex-col">
      <MapLeafContainer ZONES={ZONES} PARKING_SPOTS={PARKING_SPOTS} />
    </div>
  );
}
