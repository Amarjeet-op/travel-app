'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in Next.js
const defaultIcon = L.icon({
  iconUrl: '/images/markers/marker-icon.png',
  iconRetinaUrl: '/images/markers/marker-icon-2x.png',
  shadowUrl: '/images/markers/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface ReportMapProps {
  location: { lat: number; lng: number } | null;
  height?: string;
}

export default function ReportMap({ location, height = 'h-48' }: ReportMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!location || !containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = L.map(containerRef.current).setView([location.lat, location.lng], 14);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    L.marker([location.lat, location.lng])
      .addTo(map)
      .bindPopup('Report Location')
      .openPopup();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [location]);

  if (!location) {
    return <div className={`${height} bg-muted rounded-lg flex items-center justify-center text-muted-foreground`}>No location data</div>;
  }

  return <div ref={containerRef} className={`${height} rounded-lg`} />;
}
