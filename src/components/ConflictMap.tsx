'use client';

import { useEffect, useState } from 'react';
import { ConflictWithNews, SEVERITY_COLORS, Severity } from '@/lib/types';

interface ConflictMapProps {
  conflicts: ConflictWithNews[];
  onSelectConflict: (conflict: ConflictWithNews | null) => void;
  selectedConflict: ConflictWithNews | null;
}

export default function ConflictMap({
  conflicts,
  onSelectConflict,
  selectedConflict,
}: ConflictMapProps) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-900">
        <div className="text-gray-400">Loading map…</div>
      </div>
    );
  }

  return <MapInner conflicts={conflicts} onSelectConflict={onSelectConflict} selectedConflict={selectedConflict} />;
}

function MapInner({
  conflicts,
  onSelectConflict,
  selectedConflict,
}: ConflictMapProps) {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const L = require('leaflet');
  const { MapContainer, TileLayer, CircleMarker, Tooltip } = require('react-leaflet');
  /* eslint-enable @typescript-eslint/no-require-imports */

  const severityRadius: Record<Severity, number> = {
    critical: 10,
    high: 8,
    medium: 6,
    low: 5,
  };

  return (
    <MapContainer
      center={[20, 15]}
      zoom={2.5}
      minZoom={2}
      maxZoom={8}
      style={{ height: '100%', width: '100%', background: '#0d1117' }}
      zoomControl={true}
      scrollWheelZoom={true}
      worldCopyJump={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {conflicts.map((conflict) => (
        <CircleMarker
          key={conflict.id}
          center={[conflict.lat, conflict.lng] as L.LatLngExpression}
          radius={severityRadius[conflict.severity]}
          pathOptions={{
            color:
              selectedConflict?.id === conflict.id
                ? '#ffffff'
                : SEVERITY_COLORS[conflict.severity],
            fillColor: SEVERITY_COLORS[conflict.severity],
            fillOpacity: selectedConflict?.id === conflict.id ? 0.9 : 0.6,
            weight: selectedConflict?.id === conflict.id ? 3 : 1.5,
          }}
          eventHandlers={{
            click: () => {
              onSelectConflict(
                selectedConflict?.id === conflict.id ? null : conflict,
              );
            },
          }}
        >
          <Tooltip
            direction="top"
            offset={[0, -8]}
            className="conflict-tooltip"
          >
            <div className="text-sm font-semibold">{conflict.name}</div>
            <div className="text-xs text-gray-300">{conflict.type}</div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
