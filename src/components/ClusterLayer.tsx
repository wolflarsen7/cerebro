'use client';

import { useEffect, useRef } from 'react';
import { ConflictWithNews, SEVERITY_COLORS, Severity } from '@/lib/types';

interface ClusterLayerProps {
  conflicts: ConflictWithNews[];
  selectedConflict: ConflictWithNews | null;
  onSelectConflict: (conflict: ConflictWithNews | null) => void;
  map: L.Map;
}

const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const SEVERITY_RADIUS: Record<Severity, number> = {
  critical: 12,
  high: 10,
  medium: 8,
  low: 6,
};

export default function ClusterLayer({
  conflicts,
  selectedConflict,
  onSelectConflict,
  map,
}: ClusterLayerProps) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const clusterGroupRef = useRef<any>(null);
  const markerMapRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const L = require('leaflet');
    require('leaflet.markercluster');
    /* eslint-enable @typescript-eslint/no-require-imports */

    // Clean up previous cluster group
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
    }

    const markerMap = new Map<string, L.Marker>();

    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 45,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster: any) => {
        const childMarkers = cluster.getAllChildMarkers();
        const count = childMarkers.length;

        // Find highest severity in cluster
        let highestSeverity: Severity = 'low';
        for (const m of childMarkers) {
          const sev = (m as any)._severity as Severity;
          if (SEVERITY_ORDER[sev] > SEVERITY_ORDER[highestSeverity]) {
            highestSeverity = sev;
          }
        }

        const color = SEVERITY_COLORS[highestSeverity];
        const size = count < 5 ? 36 : count < 15 ? 44 : 52;

        return L.divIcon({
          html: `<div style="
            background: ${color}aa;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
            color: #fff;
            border: 2px solid ${color};
            box-shadow: 0 0 8px ${color}66;
          ">${count}</div>`,
          className: '',
          iconSize: L.point(size, size),
        });
      },
    });

    for (const conflict of conflicts) {
      const isSelected = selectedConflict?.id === conflict.id;
      const radius = SEVERITY_RADIUS[conflict.severity];
      const color = SEVERITY_COLORS[conflict.severity];
      const borderColor = isSelected ? '#ffffff' : color;
      const opacity = isSelected ? 0.9 : 0.6;
      const borderWidth = isSelected ? 3 : 1.5;
      const size = radius * 2;

      const icon = L.divIcon({
        html: `<div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${color};
          opacity: ${opacity};
          border: ${borderWidth}px solid ${borderColor};
          box-shadow: 0 0 6px ${color}44;
        "></div>`,
        className: '',
        iconSize: L.point(size, size),
        iconAnchor: L.point(size / 2, size / 2),
      });

      const marker = L.marker([conflict.lat, conflict.lng], { icon });

      // Store severity on marker for cluster icon coloring
      (marker as any)._severity = conflict.severity;

      marker.bindTooltip(
        `<div style="font-size:13px;font-weight:600">${conflict.name}</div><div style="font-size:11px;color:#9ca3af">${conflict.type}</div>`,
        {
          direction: 'top',
          offset: L.point(0, -radius),
          className: 'conflict-tooltip',
        },
      );

      marker.on('click', () => {
        onSelectConflict(
          selectedConflict?.id === conflict.id ? null : conflict,
        );
      });

      clusterGroup.addLayer(marker);
      markerMap.set(conflict.id, marker);
    }

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;
    markerMapRef.current = markerMap;

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [conflicts, selectedConflict, onSelectConflict, map]);

  return null;
}
