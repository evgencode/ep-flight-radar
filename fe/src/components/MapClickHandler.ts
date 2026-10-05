import { useMapEvents } from 'react-leaflet';
/** Clicking empty map space clears the selection. */
export function MapClickHandler({ onClick }: { onClick: () => void }) {
  useMapEvents({ click: onClick });
  return null;
}
