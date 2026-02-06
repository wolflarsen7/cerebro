'use client';

import { useEffect, useState } from 'react';
import { ConflictWithNews } from '@/lib/types';
import { Theme } from '@/lib/useTheme';

interface ConflictMapProps {
  conflicts: ConflictWithNews[];
  onSelectConflict: (conflict: ConflictWithNews | null) => void;
  selectedConflict: ConflictWithNews | null;
  theme?: Theme;
}

export default function ConflictMap({
  conflicts,
  onSelectConflict,
  selectedConflict,
  theme = 'dark',
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

  return <MapInner conflicts={conflicts} onSelectConflict={onSelectConflict} selectedConflict={selectedConflict} theme={theme} />;
}

const TILE_URLS: Record<Theme, string> = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
};

function MapInner({
  conflicts,
  onSelectConflict,
  selectedConflict,
  theme = 'dark',
}: ConflictMapProps) {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const { MapContainer, TileLayer, useMap } = require('react-leaflet');
  /* eslint-enable @typescript-eslint/no-require-imports */

  const bgColor = theme === 'dark' ? '#0d1117' : '#f0f0f0';

  return (
    <MapContainer
      center={[20, 15]}
      zoom={2.5}
      minZoom={2}
      maxZoom={8}
      style={{ height: '100%', width: '100%', background: bgColor }}
      zoomControl={true}
      scrollWheelZoom={true}
      worldCopyJump={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url={TILE_URLS[theme]}
        key={theme}
      />
      <ClusterManager
        conflicts={conflicts}
        onSelectConflict={onSelectConflict}
        selectedConflict={selectedConflict}
      />
    </MapContainer>
  );

  function ClusterManager({
    conflicts: c,
    onSelectConflict: onSelect,
    selectedConflict: selected,
  }: {
    conflicts: ConflictWithNews[];
    onSelectConflict: (conflict: ConflictWithNews | null) => void;
    selectedConflict: ConflictWithNews | null;
  }) {
    const map = useMap();
    const ClusterLayer = require('./ClusterLayer').default;
    return (
      <ClusterLayer
        conflicts={c}
        selectedConflict={selected}
        onSelectConflict={onSelect}
        map={map}
      />
    );
  }
}
