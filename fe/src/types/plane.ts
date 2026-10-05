export type PlaneStatus = 'departed' | 'enroute' | 'cruising' | 'landing';

export type PlaneBasic = {
  id: string;
  latitude: number;
  longitude: number;
  /** meters */
  altitude: number;
  color: string;
};

export type Airport = {
  airport: string;
  city: string;
};

export type PlaneDetailed = {
  id: string;
  model: string;
  airline: string;
  flightNumber: string;
  registration: string;
  latitude: number;
  longitude: number;
  /** meters */
  altitude: number;
  /** meters per second */
  speed: number;
  /** degrees, 0 = north */
  heading: number;
  /** meters per second */
  verticalSpeed: number;
  origin: Airport;
  destination: Airport;
  /** minutes since departure */
  flightDuration: number;
  /** arrival timestamp (ms) */
  estimatedArrival: number;
  numberOfPassengers: number;
  maxPassengers: number;
  status: PlaneStatus;
  color: string;
};

export type PlanesMessage = { type: 'planes'; data: PlaneBasic[] };
export type PlaneDetailsMessage = { type: 'plane-details'; data: PlaneDetailed };
export type ErrorMessage = { type: 'error'; message: string };
export type SubscribeMessage = { type: 'subscribe'; planeId: string };

export type ServerMessage = PlanesMessage | PlaneDetailsMessage | ErrorMessage;

export function isServerMessage(value: unknown): value is ServerMessage {
  if (typeof value !== 'object' || value === null || !('type' in value)) {
    return false;
  }
  switch (value.type) {
    case 'planes':
      return 'data' in value && Array.isArray(value.data);
    case 'plane-details':
      return 'data' in value && typeof value.data === 'object' && value.data !== null;
    case 'error':
      return 'message' in value && typeof value.message === 'string';
    default:
      return false;
  }
}
