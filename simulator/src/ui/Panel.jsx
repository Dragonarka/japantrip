import { fmt, stepAt, freeWindows } from '../lib/schedule';

// Letrero estilo estación japonesa: insignia de línea + dirección + dónde bajar + salida.
export function StepSign({ step, active }) {
  const [id, dir, off, exit, min] = step;
  const L = window.LINES[id];
  const walk = L.mode === 'walk', taxi = L.mode === 'taxi', bus = L.mode === 'bus';
  return (
    <div className={`sign ${active ? 'active' : ''}`}>
      <span className="badge" style={{ background: L.c, color: id === 'JB' || id === 'TAXI' ? '#111' : '#fff' }}>{L.code}</span>
      <div className="sign-body">
        <div className="sign-line">{L.n}{min ? <span className="sign-min"> · {min} min</span> : null}</div>
        {walk ? <div>🚶 Caminar hacia <b>{off}</b></div>
          : taxi ? <div>🚕 Hasta <b>{off}</b></div>
          : <div>{bus ? '🚌' : '➡️'} Dirección <b>{dir}</b> · bajar en <b>{off}</b></div>}
        {exit ? <div className="exit">{exit}</div> : null}
      </div>
    </div>
  );
}

const KIND = { act: '📍', move: '🚆', free: '🧭', sleep: '😴' };

function Title({ seg }) {
  if (seg.k === 'move') return <>{KIND.move} {window.PLACES[seg.from].n} → {window.PLACES[seg.to].n}</>;
  if (seg.k === 'free') return <>{KIND.free} Libre para explorar{seg.t && seg.t !== 'Libre para explorar' ? `: ${seg.t.replace(/^Libre:\s*/, '')}` : ''}</>;
  return <>{KIND[seg.k]} {seg.t}</>;
}

export default function Panel({ day, min, segIdx }) {
  const seg = day.segs[segIdx];
  const next = day.segs.slice(segIdx + 1).find(s => s.k !== 'free');
  const st = seg.k === 'move' ? stepAt(seg, min) : null;
  const left = Math.max(0, Math.round(seg.eMin - min));
  const windows = freeWindows(day);
  const place = seg.p && window.PLACES[seg.p];

  return (
    <div className="panel">
      <div className={`now k-${seg.k}`}>
        <div className="now-head"><span className="tag">AHORA</span><span className="range">{fmt(seg.sMin)}–{fmt(seg.eMin)} · quedan {left} min</span></div>
        <div className="now-title"><Title seg={seg} /></div>
        {place && seg.k !== 'sleep' && <div className="now-place">{place.n}</div>}
        {seg.k === 'free' && <div className="explore">🧭 Tienes <b>{left} min</b> libres para explorar alrededor de {place?.n}.</div>}
        {seg.tip && <div className="tip">💡 {seg.tip}</div>}
        {seg.k === 'move' && (
          <div className="steps">
            {seg.note && <div className="note">{seg.note}</div>}
            {seg.steps.map((s, i) => <StepSign key={i} step={s} active={st && st.i === i} />)}
          </div>
        )}
      </div>
      {next && (
        <div className="next">
          <span className="tag next-tag">SIGUE</span> en {Math.max(0, Math.round(next.sMin - min))} min · {fmt(next.sMin)} · <Title seg={next} />
        </div>
      )}
      {windows.length > 0 && (
        <div className="windows">
          <div className="windows-title">🧭 Ventanas libres hoy</div>
          {windows.map((w, i) => (
            <span key={i} className={`win ${min >= w.sMin && min < w.eMin ? 'on' : ''}`}>{fmt(w.sMin)}–{fmt(w.eMin)}</span>
          ))}
        </div>
      )}
    </div>
  );
}
