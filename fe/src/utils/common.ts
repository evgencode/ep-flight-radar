import L from 'leaflet';

export const ANGRY_BIRD_SVG = `<svg xmlns="http://w3.org" viewBox="0 0 100 100" width="100%" height="100%">
  <!-- Dynamic part: The body and crest are colored via style="color: color" -->
  <g fill="currentColor">
    <<!-- Feathers / Crest -->
    <path d="M 40,22 C 38,12 48,10 48,10 C 53,15 50,22 50,22" />
    <path d="M 48,22 C 48,14 58,13 58,13 C 62,18 57,24 57,24" />
    <!-- Main Round Body -->
    <circle cx="50" cy="55" r="35" />
  </g>
  <!-- Belly -->
  <path d="M 21,70 C 25,48 75,48 79,70 C 72,85 28,85 21,70 Z" fill="#F5F5DC" />
   <!-- Tail -->
  <path d="M 16,52 L 4,50 L 8,56 L 3,60 L 16,58 Z" fill="#212121" />
  <!-- Eyes Background  -->
  <circle cx="40" cy="45" r="10" fill="#FFFFFF" />
  <circle cx="60" cy="45" r="10" fill="#FFFFFF" />
  <!-- Pupils -->
  <circle cx="43" cy="46" r="4.5" fill="#212121" />
  <circle cx="57" cy="46" r="4.5" fill="#212121" />
  <!-- Pupil Highlights -->
  <circle cx="44.5" cy="44.5" r="1.5" fill="#FFFFFF" />
  <circle cx="58.5" cy="44.5" r="1.5" fill="#FFFFFF" />
    <!-- Eyebrows -->
  <path d="M 28,33 L 50,43 L 72,33 L 68,30 L 50,38 L 32,30 Z" fill="#212121" />
  <!-- Beak -->
  <path d="M 36,50 C 44,50 46,45 50,45 C 54,45 56,50 64,50 C 60,59 40,59 36,50 Z" fill="#FFB300" stroke="#E65100" stroke-width="1" />
  <path d="M 39,52 C 45,52 50,53 50,53 C 50,53 55,52 61,52 C 57,61 43,61 39,52 Z" fill="#FFA000" stroke="#E65100" stroke-width="1" />
  <!-- Dark Red Spots (Cheeks) -->
  <circle cx="23" cy="52" r="3" fill="#000000" opacity="0.15" />
  <circle cx="27" cy="58" r="2.5" fill="#000000" opacity="0.15" />
  <circle cx="77" cy="52" r="3" fill="#000000" opacity="0.15" />
  <circle cx="73" cy="58" r="2.5" fill="#000000" opacity="0.15" />
</svg>`;

export const PLANE_SVG = `<svg viewBox="0 0 24 24"><path d="M12 1.5c.9 0 1.5 1.1 1.5 2.4v5.3l8 4.6v2.1l-8-2.4v4.6l2.3 1.7v1.7L12 20.6l-3.8.9v-1.7l2.3-1.7v-4.6l-8 2.4v-2.1l8-4.6V3.9c0-1.3.6-2.4 1.5-2.4z"/></svg>`;

// A single icon shared by all planes: color, rotation and selection
// are applied directly to the marker's DOM, so the icon is never recreated.
export const PLANE_ICON = L.divIcon({
  className: 'plane-marker',
  html: `<div class="plane-marker__body">${ANGRY_BIRD_SVG}</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});
