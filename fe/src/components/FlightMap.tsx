import L from 'leaflet';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { TILE_URL } from '../config';
import { usePlanes } from '../hooks/usePlanes';
import { PlaneMarker } from './PlaneMarker.tsx';
import { StatusBar } from './StatusBar';
import { FitToPlanesOnce } from './FitToPlanesOnce.tsx';
import { MapClickHandler } from './MapClickHandler.ts';

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDeselect: () => void;
};

// on BE side (this.latitude < 35 || this.latitude > 65) &&  (this.longitude < -120 || this.longitude > -60)
// (35 + 65) / 2 | (-120 -60) / 2
const INITIAL_CENTER: L.LatLngTuple = [50, -90];
const INITIAL_ZOOM = 4;

export function FlightMap({ selectedId, onSelect, onDeselect }: Props) {
  const { planes, status } = usePlanes();

  return (
    <>
      <MapContainer
        className="flight-map"
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        minZoom={2}
        worldCopyJump
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={TILE_URL}
          maxZoom={19}
        />
        {/** Plane markers */}
        {planes.map(plane => (
          <PlaneMarker
            key={plane.id}
            plane={plane}
            selected={plane.id === selectedId}
            onSelect={onSelect}
          />
        ))}
        {/** deselect plane on map click. Must be inside MapContainer. */}
        <MapClickHandler onClick={onDeselect} />
        {/** fitBounds all planes */}
        <FitToPlanesOnce planes={planes} />
        {/* zoom of the map */}
        <ZoomControl position="bottomleft" />
      </MapContainer>

      <StatusBar status={status} planeCount={planes.length} />
    </>
  );
}
