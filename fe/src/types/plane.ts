import type { PlaneBasic, PlaneDetailed as PlaneDetailedBe } from '@flr/shared';

export type Airport = {
  airport: string;
  city: string;
};

export type PlaneDetailed = Omit<PlaneDetailedBe, 'origin' | 'destination'> & {
  origin: Airport;
  destination: Airport;
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
