import { useRef } from 'react';
import { fmt } from '../lib/schedule';

const COLOR = { act: '#c0392b', free: '#2e8b57', sleep: '#7a7f88' };

// Barra del día: cada bloque con su color; tocar o arrastrar mueve el reloj.
export default function Timeline({ day, min, onSeek }) {
  const bar = useRef();
  const span = day.end - day.start;
  const pct = m => ((m - day.start) / span) * 100;
  const seekFromEvent = e => {
    const r = bar.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    onSeek(day.start + Math.min(1, Math.max(0, x / r.width)) * span);
  };
  const hours = [];
  for (let h = Math.ceil((day.start + 30) / 60); h * 60 <= day.end - 30; h += 2) hours.push(h * 60);

  return (
    <div className="timeline">
      <div className="tl-bar" ref={bar} onMouseDown={seekFromEvent} onTouchStart={seekFromEvent}
        onMouseMove={e => e.buttons === 1 && seekFromEvent(e)} onTouchMove={seekFromEvent}>
        {day.segs.map((s, i) => {
          const c = s.k === 'move' ? (window.LINES[(s.steps.find(x => window.LINES[x[0]].mode !== 'walk') || s.steps[0])[0]].c) : COLOR[s.k];
          return <div key={i} className={`tl-seg k-${s.k}`} title={`${fmt(s.sMin)} ${s.t || ''}`}
            style={{ left: `${pct(s.sMin)}%`, width: `${Math.max(0.3, pct(s.eMin) - pct(s.sMin))}%`, background: c }} />;
        })}
        <div className="tl-head" style={{ left: `${pct(min)}%` }} />
      </div>
      <div className="tl-hours">
        {hours.map(h => <span key={h} style={{ left: `${pct(h)}%` }}>{fmt(h)}</span>)}
      </div>
      <div className="tl-legend">
        <span><i style={{ background: COLOR.act }} />actividad</span>
        <span><i style={{ background: '#1d4f91' }} />trayecto (color de la línea)</span>
        <span><i style={{ background: COLOR.free }} />libre para explorar</span>
        <span><i style={{ background: COLOR.sleep }} />dormir</span>
      </div>
    </div>
  );
}
