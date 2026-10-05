import rhumbBearing from '@turf/rhumb-bearing';
import L from 'leaflet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Marker, Polyline } from 'react-leaflet';
import type { PlaneBasic } from '../types/plane';
import { PLANE_ICON } from '../utils/common.ts';

type PlaneMarkerProps = {
  plane: PlaneBasic;
  selected: boolean;
  onSelect: (id: string) => void;
};

const MAX_HISTORY = 100;

export const PlaneMarker = ({ plane, selected, onSelect }: PlaneMarkerProps) => {
  const markerRef = useRef<L.Marker>(null);
  const rotationRef = useRef(0);
  // fix the initial position for the Marker only once.
  const [initialPosition] = useState<L.LatLngTuple>(() => [plane.latitude, plane.longitude]);

  const [history, setHistory] = useState<L.LatLng[]>(() => [
    L.latLng(plane.latitude, plane.longitude),
  ]);

  // apply color, rotation and selection to the existing marker element
  const applyStyle = useCallback(() => {
    const el = markerRef.current?.getElement();
    if (!el) {
      return;
    }
    el.classList.toggle('is-selected', selected);
    const body = el.querySelector<HTMLElement>('.plane-marker__body');
    if (body) {
      body.style.color = plane.color;
      body.style.transform = `rotate(${rotationRef.current}deg)`;
    }
  }, [selected, plane.color]);

  // color / selection changes
  useEffect(applyStyle, [applyStyle]);

  // new coordinates from WebSocket
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) {
      return;
    }

    const from = marker.getLatLng();
    const target = L.latLng(plane.latitude, plane.longitude);

    if (from.equals(target)) {
      return;
    }

    rotationRef.current = rhumbBearing([from.lng, from.lat], [target.lng, target.lat]);
    marker.setLatLng(target);
    applyStyle();
    setHistory(prev => [...prev, target].slice(-MAX_HISTORY)); // use only last 100 points in history
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plane.latitude, plane.longitude]);

  const eventHandlers = useMemo(
    () => ({
      click: () => onSelect(plane.id),
      // Leaflet rebuilds the element from icon.html when the marker is re-added to the map
      add: applyStyle,
    }),
    [onSelect, plane.id, applyStyle],
  );

  return (
    <>
      <Marker
        ref={markerRef}
        position={initialPosition}
        icon={PLANE_ICON}
        title={plane.id}
        zIndexOffset={selected ? 1000 : 0}
        eventHandlers={eventHandlers}
      />
      {selected && (
        <Polyline
          positions={history}
          className="plane-trail"
          pathOptions={{ color: plane.color, weight: 2, opacity: 0.9 }}
          interactive={false}
        />
      )}
    </>
  );
};
