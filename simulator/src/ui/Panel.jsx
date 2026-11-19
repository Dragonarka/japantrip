import { useState } from 'react';
import { fmt, stepAt, freeWindows, railKm, dur, dayTransit } from '../lib/schedule';

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

// Fotos del lugar: escena del anime y foto real, lado a lado. Si una no carga, queda un botón para buscarla.
export function Photos({ place, small }) {
  const [big, setBig] = useState(null);
  const pics = [...(place.ani || []).map(u => ['Anime', u]), ...(place.foto || []).map(u => ['Real', u])];
  if (!pics.length) return null;
  const q = encodeURIComponent(place.n + ' anime real');
  return (
    <>
      <div className={`photos ${small ? 'small' : ''}`}>
        {pics.map(([lbl, u], i) => (
          <figure key={i} className="photo">
            <img src={u} loading="lazy" alt="" onClick={() => setBig(u)}
              onError={e => { e.currentTarget.replaceWith(Object.assign(document.createElement('a'), { href: `https://www.google.com/search?tbm=isch&q=${q}`, target: '_blank', rel: 'noopener', className: 'photo-miss', textContent: '🔎 Ver escena' })); }} />
            <figcaption className={lbl === 'Anime' ? 'ani' : 'real'}>{lbl}</figcaption>
          </figure>
        ))}
      </div>
      {big && <div className="photo-big" onClick={() => setBig(null)}><img src={big} alt="" /></div>}
    </>
  );
}

function PlaceInfo({ place }) {
  if (!place.a) return null;
  return <div className="addr">📍 <a href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`} target="_blank" rel="noopener">{place.a}</a></div>;
}

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
  const transit = dayTransit(day);

  return (
    <div className="panel">
      <div className="day-stats">🚆 Hoy en transporte: <b>{dur(transit.min)}</b> · ~{Math.round(transit.km)} km</div>
      <div className={`now k-${seg.k}`}>
        <div className="now-head"><span className="tag">AHORA</span><span className="range">{fmt(seg.sMin)}–{fmt(seg.eMin)} · quedan {left} min</span></div>
        <div className="now-title"><Title seg={seg} /></div>
        {place && seg.k !== 'sleep' && <div className="now-place">{place.n}</div>}
        {place && seg.k !== 'sleep' && <PlaceInfo place={place} />}
        {place && seg.k !== 'sleep' && <Photos key={seg.p} place={place} />}
        {seg.k === 'free' && <div className="explore">🧭 Tienes <b>{left} min</b> libres para explorar alrededor de {place?.n}.</div>}
        {seg.tip && <div className="tip">💡 {seg.tip}</div>}
        {seg.k === 'move' && (
          <div className="trip">
            <div>🕒 Trayecto de <b>{dur(seg.eMin - seg.sMin)}</b> · ~{Math.round(railKm(seg.from, seg.to))} km</div>
            <div className="trip-bar"><div style={{ width: `${Math.min(100, ((min - seg.sMin) / (seg.eMin - seg.sMin)) * 100)}%` }} /></div>
          </div>
        )}
        {seg.k === 'move' && (
          <div className="steps">
            {seg.note && <div className="note">{seg.note}</div>}
            {seg.steps.map((s, i) => <StepSign key={i} step={s} active={st && st.i === i} />)}
          </div>
        )}
        {seg.k === 'move' && window.PLACES[seg.to].foto && (
          <div className="arriving">
            <div className="arriving-title">Llegando a: <b>{window.PLACES[seg.to].n}</b></div>
            <PlaceInfo place={window.PLACES[seg.to]} />
            <Photos key={seg.to} place={window.PLACES[seg.to]} small />
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
