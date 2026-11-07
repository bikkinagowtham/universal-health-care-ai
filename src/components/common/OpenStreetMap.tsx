import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ExternalLink, Navigation } from 'lucide-react';

interface MarkerItem {
  id: string;
  name: string;
  type: 'doctor' | 'hospital';
  specializationOrDept: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone: string;
}

interface Props {
  markers: MarkerItem[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export const OpenStreetMap: React.FC<Props> = ({
  markers,
  center = [16.5062, 80.6480], // Default: Vijayawada
  zoom = 13,
  height = '420px',
  selectedId,
  onSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map already initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView(center, zoom);

      // OpenStreetMap standard tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when list or selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    if (markers.length === 0) return;

    const bounds = L.latLngBounds([]);

    markers.forEach((item) => {
      if (!item.latitude || !item.longitude) return;

      const isSelected = item.id === selectedId;
      const isHospital = item.type === 'hospital';

      // Custom icon using clean SVG markup
      const iconHtml = `
        <div style="
          background-color: ${isHospital ? '#0284c7' : '#0d9488'};
          width: ${isSelected ? '38px' : '32px'};
          height: ${isSelected ? '38px' : '32px'};
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: bold;
          font-size: ${isSelected ? '14px' : '12px'};
          transition: all 0.2s ease;
          transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
        ">
          ${isHospital ? 'H' : 'Dr'}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-pin',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([item.latitude, item.longitude], { icon: customIcon });

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 200px; padding: 4px;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: ${isHospital ? '#0284c7' : '#0d9488'};">
            ${isHospital ? 'Verified Hospital' : 'Verified Doctor'}
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin: 2px 0;">
            ${item.name}
          </div>
          <div style="font-size: 12px; color: #64748b; margin-bottom: 6px;">
            ${item.specializationOrDept}
          </div>
          <div style="font-size: 12px; color: #334155; margin-bottom: 8px;">
            📍 ${item.address}, ${item.city}
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #0284c7; margin-bottom: 8px;">
            📞 ${item.phone}
          </div>
          <a
            href="https://www.openstreetmap.org/directions?to=${item.latitude},${item.longitude}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              display: inline-block;
              background-color: #0284c7;
              color: #ffffff;
              padding: 5px 10px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              text-decoration: none;
            "
          >
            Get Directions ↗
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelect) onSelect(item.id);
      });

      markersGroupRef.current?.addLayer(marker);
      bounds.extend([item.latitude, item.longitude]);
    });

    // Fit map bounds if multiple markers, or pan to selected
    if (markers.length > 0) {
      if (selectedId) {
        const sel = markers.find(m => m.id === selectedId);
        if (sel) {
          mapInstanceRef.current.setView([sel.latitude, sel.longitude], 14, { animate: true });
        }
      } else {
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
  }, [markers, selectedId]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
      <div ref={mapContainerRef} style={{ height, width: '100%', zIndex: 10 }} />
      <div className="absolute bottom-2 left-2 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-3 shadow-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" /> Hospital
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" /> Doctor Clinic
        </span>
        <span className="text-slate-400">|</span>
        <span className="flex items-center gap-1 text-slate-500">
          <Navigation className="w-3 h-3 text-sky-600" /> Powered by OpenStreetMap
        </span>
      </div>
    </div>
  );
};
