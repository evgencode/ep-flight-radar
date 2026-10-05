import type { PlaneBasic } from '../types/plane.ts';
import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';

type FitToPlanesOnceProps = { planes: PlaneBasic[] };

/** Fits the view to all planes once */
export function FitToPlanesOnce({ planes }: FitToPlanesOnceProps) {
  const map = useMap();
  const doneRef = useRef(false);

  useEffect(() => {
    // only once
    if (doneRef.current || planes.length === 0) {
      return;
    }
    doneRef.current = true;
    const bounds = L.latLngBounds(planes.map(p => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 6, animate: false });
  }, [planes, map]);

  return null;
}
