// Coloca los lugares de un día sobre un plano. La distancia se comprime (logarítmica) para que
// el mismo mapa sirva para un barrio de Tokio y para un traslado de 400 km.

const K = 13;      // escala de la compresión
const R0 = 450;    // metros: a partir de aquí la distancia se va comprimiendo
const MIN_GAP = 6; // separación mínima entre lugares, en unidades de escena

export function layoutPlaces(ids, places) {
  const pts = ids.map(id => places[id]);
  const lat0 = pts.reduce((a, p) => a + p.lat, 0) / pts.length;
  const lng0 = pts.reduce((a, p) => a + p.lng, 0) / pts.length;
  const cos = Math.cos((lat0 * Math.PI) / 180);
  const pos = {};
  ids.forEach(id => {
    const p = places[id];
    const x = (p.lng - lng0) * cos * 111320;
    const z = -(p.lat - lat0) * 110540;
    const r = Math.hypot(x, z) || 1;
    const rr = K * Math.log1p(r / R0);
    pos[id] = [(x / r) * rr, 0, (z / r) * rr];
  });
  // Separa lugares que quedaron encimados (unas pocas pasadas bastan).
  for (let it = 0; it < 40; it++) {
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      const a = pos[ids[i]], b = pos[ids[j]];
      const dx = b[0] - a[0], dz = b[2] - a[2], d = Math.hypot(dx, dz);
      if (d < MIN_GAP) {
        const push = (MIN_GAP - d) / 2, ux = d ? dx / d : 1, uz = d ? dz / d : 0;
        a[0] -= ux * push; a[2] -= uz * push; b[0] += ux * push; b[2] += uz * push;
      }
    }
  }
  return pos;
}

export const lerp3 = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];

// Pseudoaleatorio estable por semilla (para decorados que no «bailen» entre renders).
export function seeded(seed) {
  let s = 0;
  for (const c of String(seed)) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
