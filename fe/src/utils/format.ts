const M_TO_FT = 3.280839895; // with extreme precision
const MS_TO_KMH = 3.6; // multiply the speed value by 3,6
const MS_TO_KT = 1.943844; // In aviation, speed is measured in knots.
const MS_TO_FPM = 196.8504;

// only integer | undefined = current locale
const int = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

export const formatInt = (value: number) => int.format(value);

// In international civil aviation, altitude measurements are made in feet.
export const formatAltitude = (meters: number) => ({
  primary: `${int.format(meters)} m`,
  secondary: `${int.format(meters * M_TO_FT)} ft`,
});

// In civil aviation, speed is measured in knots. Easy to read in km/h
export const formatSpeed = (ms: number) => ({
  primary: `${int.format(ms * MS_TO_KMH)} km/h`,
  secondary: `${int.format(ms * MS_TO_KT)} kt`,
});

export const formatVerticalSpeed = (ms: number) => {
  const rounded = Number(ms.toFixed(1)) || 0; // turns -0 into 0
  const sign = rounded > 0 ? '+' : ''; // add + sign for positive numbers
  return {
    primary: `${sign}${rounded.toFixed(1)} m/s`,
    secondary: `${sign}${int.format(rounded * MS_TO_FPM)} ft/min`,
  };
};

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']; // 360 / 8 = 45

export const formatHeading = (deg: number) => ({
  primary: `${Math.round(deg) % 360}°`, // Math.round(359.6) / 360 % 360
  secondary: COMPASS[Math.round(deg / 45) % COMPASS.length],
});

export const formatCoord = (value: number, pos: string, neg: string) =>
  `${Math.abs(value).toFixed(4)}° ${value >= 0 ? pos : neg}`;

/** 125 -> "2h 05m" */
export const formatMinutes = (totalMinutes: number) => {
  const minutes = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
};

export const formatClock = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
