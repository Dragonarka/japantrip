import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene, { avatarState, sunElevation } from './scene/Scene';
import Panel from './ui/Panel';
import Timeline from './ui/Timeline';
import { buildDay, segAt, fmt, dayLabel, toMin } from './lib/schedule';
import { layoutPlaces } from './lib/layout';

const SPEEDS = [1, 2, 5, 10, 20]; // minutos del viaje por segundo real

// Día y hora iniciales: ?day=N&t=HH:MM, o «ahora» en Japón si el viaje está en curso, o el día 0.
function initialState(days) {
  const q = new URLSearchParams(location.search);
  if (q.has('day')) {
    const d = Math.min(days.length - 1, Math.max(0, Number(q.get('day')) || 0));
    return { day: d, min: q.has('t') ? toMin(q.get('t')) : days[d].start };
  }
  const jst = new Date(Date.now() + 9 * 3600e3);
  const iso = jst.toISOString().slice(0, 10), now = jst.getUTCHours() * 60 + jst.getUTCMinutes();
  const d = days.findIndex(x => x.date === iso);
  if (d >= 0) return { day: d, min: Math.max(days[d].start, now), live: true };
  return { day: 0, min: days[0].start };
}

function bubbleFor(seg, ui) {
  if (seg.k === 'sleep') return '';
  if (seg.k === 'free') return '🧭 Explorando';
  if (seg.k === 'move') {
    const step = seg.steps.find(s => window.LINES[s[0]].mode === ui.vehicle) || seg.steps[0];
    return `${window.LINES[step[0]].code} → ${step[2]}`;
  }
  return seg.t.length > 30 ? seg.t.slice(0, 29) + '…' : seg.t;
}

export default function App() {
  const days = useMemo(() => Object.keys(window.SCHEDULE).map(buildDay), []);
  const init = useMemo(() => initialState(days), [days]);
  const [dayIdx, setDayIdx] = useState(init.day);
  const [tick, setTick] = useState(init.min);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(5);
  const [auto, setAuto] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const clock = useRef({ min: init.min });
  const live = useRef({ playing, speed, auto, dayIdx });
  live.current = { playing, speed, auto, dayIdx };

  const day = days[dayIdx];
  const pos = useMemo(() => layoutPlaces(day.places, window.PLACES), [day]);

  // Reloj: corre con requestAnimationFrame; la interfaz se refresca ~8 veces por segundo.
  useEffect(() => {
    let raf, last = performance.now(), lastUi = 0;
    const loop = now => {
      const dt = Math.min(0.25, (now - last) / 1000); last = now;
      const c = clock.current, L = live.current, d = days[L.dayIdx];
      if (L.playing) {
        c.min += dt * L.speed;
        if (c.min >= d.end) {
          if (L.auto && L.dayIdx + 1 < days.length) { c.min = days[L.dayIdx + 1].start; setDayIdx(L.dayIdx + 1); }
          else { c.min = d.end - 0.01; setPlaying(false); }
        }
      }
      if (now - lastUi > 120) { lastUi = now; setTick(c.min); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [days]);

  useEffect(() => {
    const q = new URLSearchParams(location.search); q.set('day', dayIdx); q.delete('t');
    history.replaceState(null, '', `?${q}`);
  }, [dayIdx]);

  useEffect(() => {
    const k = e => { if (e.code === 'Space') { e.preventDefault(); setPlaying(p => !p); } };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, []);

  const goDay = i => { const d = days[i]; clock.current.min = d.start; setTick(d.start); setDayIdx(i); };
  const seek = m => { clock.current.min = m; setTick(m); };

  const segIdx = segAt(day, tick);
  const seg = day.segs[segIdx];
  const st = avatarState(day, pos, tick);
  const night = sunElevation(tick) < -0.05;
  const ui = { pose: st.pose, vehicle: st.vehicle, color: st.color, night, seg, next: day.segs.slice(segIdx + 1).find(s => s.k !== 'free') };
  ui.bubble = bubbleFor(seg, ui);

  return (
    <div className="app">
      <Canvas shadows camera={{ position: [14, 13, 18], fov: 50 }} dpr={[1, 1.75]}>
        <Scene day={day} pos={pos} clockRef={clock} ui={ui} />
      </Canvas>

      <header className="topbar">
        <div className="day-nav">
          <button onClick={() => goDay(Math.max(0, dayIdx - 1))} disabled={dayIdx === 0} aria-label="Día anterior">◀</button>
          <select value={dayIdx} onChange={e => goDay(Number(e.target.value))}>
            {days.map(d => <option key={d.idx} value={d.idx}>D{d.idx} · {dayLabel(d.date)}</option>)}
          </select>
          <button onClick={() => goDay(Math.min(days.length - 1, dayIdx + 1))} disabled={dayIdx === days.length - 1} aria-label="Día siguiente">▶</button>
        </div>
        <div className={`clock ${night ? 'night' : ''}`}>{night ? '🌙' : '☀️'} {fmt(tick)}</div>
        <div className="controls">
          <button className="play" onClick={() => setPlaying(p => !p)}>{playing ? '⏸' : '▶'}</button>
          <div className="speeds">
            {SPEEDS.map(s => <button key={s} className={s === speed ? 'on' : ''} onClick={() => setSpeed(s)}>{s}×</button>)}
          </div>
          <label className="auto"><input type="checkbox" checked={auto} onChange={e => setAuto(e.target.checked)} /> seguir al otro día</label>
          {init.live && <button onClick={() => { const s = initialState(days); goDay(s.day); seek(s.min); }}>Ahora</button>}
        </div>
      </header>

      <button className="panel-toggle" onClick={() => setPanelOpen(o => !o)}>{panelOpen ? '✕' : 'ℹ️ Qué hacer'}</button>
      {panelOpen && <Panel day={day} min={tick} segIdx={segIdx} />}

      <Timeline day={day} min={tick} onSeek={seek} />
    </div>
  );
}
