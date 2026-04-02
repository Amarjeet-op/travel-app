'use client';

import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useMemo } from 'react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

interface TripMapProps {
  fromCoordinates: { lat: number; lng: number };
  toCoordinates: { lat: number; lng: number };
  fromCity: string;
  toCity: string;
}

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function TripMapInner({ fromCoordinates, toCoordinates, fromCity, toCity }: TripMapProps) {
  const bounds: [[number, number], [number, number]] = [
    [fromCoordinates.lat, fromCoordinates.lng],
    [toCoordinates.lat, toCoordinates.lng],
  ];

  const mapKey = useMemo(() => `map-${fromCoordinates.lat}-${fromCoordinates.lng}-${toCoordinates.lat}-${toCoordinates.lng}`, [fromCoordinates, toCoordinates]);

  return (
    <MapContainer key={mapKey} bounds={bounds} className="h-full w-full rounded-lg" scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[fromCoordinates.lat, fromCoordinates.lng]} icon={greenIcon}>
        <Popup>{fromCity}</Popup>
      </Marker>
      <Marker position={[toCoordinates.lat, toCoordinates.lng]} icon={redIcon}>
        <Popup>{toCity}</Popup>
      </Marker>
      <Polyline positions={bounds} color="#3b82f6" weight={3} dashArray="10, 10" />
    </MapContainer>
  );
}

export default function TripMap({ fromCoordinates, toCoordinates, fromCity, toCity }: TripMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !fromCoordinates || !toCoordinates) {
    return <div className="h-full w-full flex items-center justify-center text-muted-foreground">Loading map...</div>;
  }

  return <TripMapInner fromCoordinates={fromCoordinates} toCoordinates={toCoordinates} fromCity={fromCity} toCity={toCity} />;
}
