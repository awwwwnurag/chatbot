import React from "react";

// Converting SVGs to Data URLs (Base64) to ensure 100% reliable rendering without DOM ID conflicts
const svgToBase64 = (svgString) => {
  return `data:image/svg+xml;base64,${btoa(svgString.trim())}`;
};

export const AVATAR_RGB = {
  1: "255, 0, 91",
  2: "255, 125, 16",
  3: "137, 252, 179",
  4: "96, 165, 250",
  5: "168, 85, 247",
  6: "34, 211, 238",
};

export const avatarSVGs = [
  {
    id: 1,
    alt: "Blaze",
    url: svgToBase64(`
      <svg fill="none" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#ff005b" height="36" width="36" rx="18" />
        <rect fill="#ffb238" height="36" rx="6" transform="translate(9 -5) rotate(219 18 18) scale(1)" width="36" />
        <g transform="translate(4.5 -4) rotate(9 18 18)">
          <path d="M15 19c2 1 4 1 6 0" fill="none" stroke="#000" stroke-linecap="round" />
          <rect fill="#000" height="2" rx="1" width="1.5" x="10" y="14" />
          <rect fill="#000" height="2" rx="1" width="1.5" x="24" y="14" />
        </g>
      </svg>
    `)
  },
  {
    id: 2,
    alt: "Shadow",
    url: svgToBase64(`
      <svg fill="none" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#ff7d10" height="36" width="36" rx="18" />
        <rect fill="#0a0310" height="36" rx="6" transform="translate(5 -1) rotate(55 18 18) scale(1.1)" width="36" />
        <g transform="translate(7 -6) rotate(-5 18 18)">
          <path d="M15 20c2 1 4 1 6 0" fill="none" stroke="#fff" stroke-linecap="round" />
          <rect fill="#fff" height="2" rx="1" width="1.5" x="14" y="14" />
          <rect fill="#fff" height="2" rx="1" width="1.5" x="20" y="14" />
        </g>
      </svg>
    `)
  },
  {
    id: 3,
    alt: "Cosmos",
    url: svgToBase64(`
      <svg fill="none" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#0a0310" height="36" width="36" rx="18" />
        <rect fill="#ff005b" height="36" rx="36" transform="translate(-3 7) rotate(227 18 18) scale(1.2)" width="36" />
        <g transform="translate(-3 3.5) rotate(7 18 18)">
          <path d="M13,21 a1,0.75 0 0,0 10,0" fill="#fff" />
          <rect fill="#fff" height="2" rx="1" width="1.5" x="12" y="14" />
          <rect fill="#fff" height="2" rx="1" width="1.5" x="22" y="14" />
        </g>
      </svg>
    `)
  },
  {
    id: 4,
    alt: "Mint",
    url: svgToBase64(`
      <svg fill="none" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#d8fcb3" height="36" width="36" rx="18" />
        <rect fill="#89fcb3" height="36" rx="6" transform="translate(9 -5) rotate(219 18 18) scale(1)" width="36" />
        <g transform="translate(4.5 -4) rotate(9 18 18)">
          <path d="M15 19c2 1 4 1 6 0" fill="none" stroke="#000" stroke-linecap="round" />
          <rect fill="#000" height="2" rx="1" width="1.5" x="10" y="14" />
          <rect fill="#000" height="2" rx="1" width="1.5" x="24" y="14" />
        </g>
      </svg>
    `)
  },
  {
    id: 5,
    alt: "Nebula",
    url: svgToBase64(`
      <svg fill="none" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#a855f7" height="36" width="36" rx="18" />
        <rect fill="#1e0040" height="36" rx="6" transform="translate(6 -3) rotate(135 18 18) scale(1.1)" width="36" />
        <g transform="translate(2 -2) rotate(-5 18 18)">
          <path d="M14 20c1.5 1.5 6.5 1.5 8 0" fill="none" stroke="#fff" stroke-linecap="round" />
          <rect fill="#fff" height="2.5" rx="1" width="2" x="12" y="13" />
          <rect fill="#fff" height="2.5" rx="1" width="2" x="22" y="13" />
        </g>
      </svg>
    `)
  },
  {
    id: 6,
    alt: "Aurora",
    url: svgToBase64(`
      <svg fill="none" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#083344" height="36" width="36" rx="18" />
        <rect fill="#22d3ee" height="36" rx="20" transform="translate(0 8) rotate(160 18 18) scale(1.15)" width="36" />
        <g transform="translate(1 -2) rotate(3 18 18)">
          <path d="M13 20c2 2 8 2 10 0" fill="none" stroke="#083344" stroke-linecap="round" stroke-width="1.2" />
          <rect fill="#083344" height="2.5" rx="1.2" width="2" x="12" y="13" />
          <rect fill="#083344" height="2.5" rx="1.2" width="2" x="22" y="13" />
        </g>
      </svg>
    `)
  },
];
