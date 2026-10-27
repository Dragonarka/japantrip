// Carga la agenda compartida (../schedule-data.js) y la prepara para la simulación.

export function loadScheduleData() {
  if (window.SCHEDULE) return Promise.resolve();
  const src = import.meta.env.DEV ? __SCHEDULE_DEV_PATH__ : new URL('../schedule-data.js', location.href).href;
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('No se pudo cargar schedule-data.js'));
    document.head.appendChild(s);
  });
}

export const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
export const fmt = min => {
  const m = Math.round(min);
  return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MON = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export function dayLabel(dateIso) {
  const [y, mo, d] = dateIso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return `${DOW[dt.getUTCDay()]} ${d} ${MON[mo - 1]}`;
}

// Normaliza un día: minutos absolutos y huecos ≥ 5 min convertidos en «libre para explorar».
export function buildDay(idx) {
  const raw = window.SCHEDULE[idx];
  const segs = [];
  let prev = null;
  for (const r of raw.segs) {
    const seg = { ...r, sMin: toMin(r.s), eMin: toMin(r.e) };
    if (prev && seg.sMin - prev.eMin >= 5) {
      const at = prev.k === 'move' ? prev.to : prev.p;
      segs.push({ k: 'free', p: at, t: 'Libre para explorar', sMin: prev.eMin, eMin: seg.sMin, auto: true });
    }
    segs.push(seg);
    prev = seg;
  }
  const places = new Set();
  segs.forEach(s => [s.p, s.from, s.to].forEach(p => p && places.add(p)));
  return { idx: Number(idx), date: raw.date, segs, places: [...places], start: segs[0].sMin, end: segs[segs.length - 1].eMin };
}

export function segAt(day, min) {
  const { segs } = day;
  for (let i = 0; i < segs.length; i++) if (min >= segs[i].sMin && min < segs[i].eMin) return i;
  return min < day.start ? 0 : segs.length - 1;
}

// Paso activo dentro de un trayecto (proporcional a los minutos de cada paso).
export function stepAt(seg, min) {
  const total = seg.steps.reduce((a, s) => a + (s[4] || 10), 0);
  const f = Math.min(1, Math.max(0, (min - seg.sMin) / (seg.eMin - seg.sMin)));
  let acc = 0;
  for (let i = 0; i < seg.steps.length; i++) {
    const w = (seg.steps[i][4] || 10) / total;
    if (f <= acc + w || i === seg.steps.length - 1) return { i, a: acc, b: acc + w, f };
    acc += w;
  }
  return { i: 0, a: 0, b: 1, f };
}

export function freeWindows(day) {
  return day.segs.filter(s => s.k === 'free' && s.eMin - s.sMin >= 20);
}

// Distancia aproximada por vía: línea recta × 1,2 (los rieles no van derecho).
export function railKm(fromId, toId) {
  const a = window.PLACES[fromId], b = window.PLACES[toId], R = 6371, r = x => (x * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h)) * 1.2;
}

export const dur = m => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${Math.round(m % 60)} min` : ''}` : `${Math.round(m)} min`);

export function dayTransit(day) {
  let min = 0, km = 0;
  day.segs.forEach(s => { if (s.k === 'move') { min += s.eMin - s.sMin; km += railKm(s.from, s.to); } });
  return { min, km };
}
