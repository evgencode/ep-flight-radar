export const WS_BASIC_URL = `ws://localhost:4000/ws/planes/basic`;
export const WS_DETAILS_URL = `ws://localhost:4000/ws/planes/details`;

export const TILE_URL =
  import.meta.env.VITE_TILE_URL ?? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
