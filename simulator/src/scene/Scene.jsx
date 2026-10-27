import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import Samurai from './Samurai';
import Vehicle from './Vehicle';
import Landmark from './Landmark';
import { lerp3, seeded } from '../lib/layout';
import { stepAt, railKm, dur } from '../lib/schedule';

// Noviembre en Tokio/Osaka: amanece ~6:05 y anochece ~16:50.
const SUNRISE = 365, SUNSET = 1010;
export function sunElevation(min) {
  const m = ((min % 1440) + 1440) % 1440;
  const f = (m - SUNRISE) / (SUNSET - SUNRISE);
  return f >= 0 && f <= 1 ? Math.sin(Math.PI * f) : -Math.min(1, Math.min(Math.abs(m - SUNSET), Math.abs(m + 1440 - SUNSET), Math.abs(SUNRISE - m), Math.abs(SUNRISE + 1440 - m)) / 90);
}

// Altura del techo de cada vehículo: el samurái viaja sentado arriba (estilo juguete).
const VEH_TOP = { train: 1.1, metro: 1.1, tram: 1.1, shinkansen: 1.1, bus: 1.5, taxi: 1.05, drive: 0.9 };

const MOOD_POSE = { club: 'dance', party: 'dance', onsen: 'onsen', fight: 'fight', fly: 'fly', hike: 'walk', bike: 'walk', drive: 'ride', play: 'cheer', tea: 'sit', meet: 'wave', rest: 'sleep' };

// Dónde está el samurái (y qué hace) en el minuto dado.
export function avatarState(day, pos, min) {
  const seg = day.segs.find(s => min >= s.sMin && min < s.eMin) || (min < day.start ? day.segs[0] : day.segs[day.segs.length - 1]);
  if (seg.k === 'move') {
    const from = pos[seg.from], to = pos[seg.to];
    const st = stepAt(seg, min);
    const local = st.b > st.a ? (st.f - st.a) / (st.b - st.a) : 1;
    const p = lerp3(lerp3(from, to, st.a), lerp3(from, to, st.b), Math.min(1, Math.max(0, local)));
    const line = window.LINES[seg.steps[st.i][0]];
    const heading = Math.atan2(to[0] - from[0], to[2] - from[2]);
    return { p, heading, pose: line.mode === 'walk' ? 'walk' : 'ride', vehicle: line.mode, color: line.c, seg };
  }
  const base = pos[seg.p];
  if (seg.k === 'free') {
    const a = min * 0.09, r = 2.6;
    return { p: [base[0] + Math.cos(a) * r, 0, base[2] + 3 + Math.sin(a) * r], heading: a + Math.PI, pose: 'walk', seg };
  }
  if (seg.k === 'sleep') return { p: [base[0] + 1.2, 0, base[2] + 2.2], heading: 0, pose: 'sleep', seg };
  const pose = MOOD_POSE[seg.mood] || 'idle';
  return { p: [base[0], 0, base[2] + 2.4], heading: 0, pose, vehicle: seg.mood === 'drive' ? 'drive' : null, seg };
}

function Decor({ pos }) {
  // Cuadras y árboles alrededor de cada lugar para que se sienta ciudad.
  const items = useMemo(() => {
    const out = [];
    Object.entries(pos).forEach(([id, p]) => {
      const rnd = seeded(id + 'decor');
      for (let i = 0; i < 9; i++) {
        const a = rnd() * Math.PI * 2, r = 5 + rnd() * 6;
        out.push({ x: p[0] + Math.cos(a) * r, z: p[2] + Math.sin(a) * r, h: 0.4 + rnd() * 2.2, tree: rnd() < 0.4, c: ['#d8d2c4', '#b9c0c7', '#e6ded0', '#a7b0a0'][i % 4] });
      }
    });
    return out;
  }, [pos]);
  return items.map((d, i) => d.tree ? (
    <mesh key={i} position={[d.x, 0.7, d.z]} castShadow><coneGeometry args={[0.5, 1.4, 6]} /><meshStandardMaterial color="#5f8f4e" /></mesh>
  ) : (
    <mesh key={i} position={[d.x, d.h / 2, d.z]} castShadow receiveShadow><boxGeometry args={[1, d.h, 1]} /><meshStandardMaterial color={d.c} /></mesh>
  ));
}

function Routes({ day, pos }) {
  return day.segs.filter(s => s.k === 'move' && s.from !== s.to).map((s, i) => {
    const main = s.steps.map(st => window.LINES[st[0]]).find(l => l.mode !== 'walk') || window.LINES.WALK;
    const a = pos[s.from], b = pos[s.to], km = railKm(s.from, s.to);
    return (
      <group key={i}>
        <Line points={[[a[0], 0.12, a[2]], [b[0], 0.12, b[2]]]} color={main.c} lineWidth={main.mode === 'walk' ? 2 : 4}
          dashed={main.mode === 'walk'} dashSize={0.6} gapSize={0.4} />
        {/* Los trayectos largos llevan su duración real: el mapa comprime la distancia, el reloj no. */}
        {km >= 30 && (
          <Html position={[(a[0] + b[0]) / 2, 0.5, (a[2] + b[2]) / 2]} center className="rlabel" zIndexRange={[5, 0]}>
            {main.code} · {dur(s.eMin - s.sMin)} · ~{Math.round(km)} km
          </Html>
        )}
      </group>
    );
  });
}

export default function Scene({ day, pos, clockRef, ui }) {
  const avatar = useRef(), controls = useRef(), sky = useRef(), sun = useRef(), amb = useRef(), hemi = useRef();
  const { camera, scene } = useThree();
  const last = useRef(new THREE.Vector3());
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const dayCol = useMemo(() => new THREE.Color('#bfe3f5'), []), nightCol = useMemo(() => new THREE.Color('#16224a'), []);

  // Al cambiar de día, la cámara salta al samurái.
  useEffect(() => {
    const s = avatarState(day, pos, clockRef.current.min);
    last.current.set(s.p[0], 0, s.p[2]);
    camera.position.set(s.p[0] + 14, 13, s.p[2] + 18);
    if (controls.current) { controls.current.target.set(s.p[0], 1, s.p[2]); controls.current.update(); }
  }, [day.idx]);

  useFrame(() => {
    const s = avatarState(day, pos, clockRef.current.min);
    const g = avatar.current;
    if (g) {
      g.position.lerp(tmp.set(s.p[0], 0, s.p[2]), 0.25);
      g.rotation.y += (s.heading - g.rotation.y) * 0.15;
      // Cámara: acompaña al samurái sin quitarle al usuario el control de la órbita.
      if (controls.current) {
        const dx = g.position.x - last.current.x, dz = g.position.z - last.current.z;
        camera.position.x += dx; camera.position.z += dz;
        controls.current.target.set(g.position.x, 1, g.position.z);
        last.current.set(g.position.x, 0, g.position.z);
      }
    }
    // Sol, cielo y luces según la hora.
    const el = sunElevation(clockRef.current.min), light = Math.max(0, el);
    const az = ((clockRef.current.min % 1440) - SUNRISE) / (SUNSET - SUNRISE) * Math.PI;
    const sp = [Math.cos(az) * 100, el * 100, -40];
    if (sky.current) sky.current.material.uniforms.sunPosition.value.set(...sp);
    if (sun.current) { sun.current.position.set(sp[0] * 0.5, Math.max(8, sp[1] * 0.5), sp[2] * 0.5); sun.current.intensity = 0.15 + light * 2.2; }
    if (amb.current) amb.current.intensity = 0.45 + light * 0.3;
    if (hemi.current) hemi.current.intensity = 0.35 + light * 0.4;
    scene.background = scene.background || new THREE.Color();
    scene.background.copy(nightCol).lerp(dayCol, Math.min(1, Math.max(0, el + 0.25)));
    if (scene.fog) scene.fog.color.copy(scene.background);
  });

  const night = ui.night;
  const nowP = ui.seg && (ui.seg.p || ui.seg.to), nextP = ui.next && (ui.next.p || ui.next.to);

  return (
    <>
      <fog attach="fog" args={['#bfe3f5', 60, 190]} />
      <ambientLight ref={amb} intensity={0.5} />
      <hemisphereLight ref={hemi} args={['#ffffff', '#6b8e5a', 0.5]} />
      <directionalLight ref={sun} castShadow position={[30, 50, 20]} intensity={2} shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-60} shadow-camera-right={60} shadow-camera-top={60} shadow-camera-bottom={-60} />
      {!night && <Sky ref={sky} distance={4000} sunPosition={[50, 30, -40]} turbidity={6} rayleigh={1.2} />}
      {night && <Stars radius={150} depth={40} count={2500} factor={4} fade speed={0.5} />}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[220, 64]} />
        <meshStandardMaterial color={night ? '#46603d' : '#9cbf78'} />
      </mesh>
      <Decor pos={pos} />
      <Routes day={day} pos={pos} />
      {day.places.map(id => (
        <Landmark key={id} id={id} place={window.PLACES[id]} position={pos[id]} night={night}
          state={id === nowP ? 'now' : id === nextP ? 'next' : ''} />
      ))}
      <group ref={avatar}>
        {ui.vehicle && <Vehicle mode={ui.vehicle} color={ui.color} />}
        <group position={[0, ui.vehicle ? (VEH_TOP[ui.vehicle] || 0) : 0, 0]}>
          <Samurai pose={ui.pose} label={ui.bubble} />
        </group>
      </group>
      <OrbitControls ref={controls} makeDefault enablePan={false} minDistance={8} maxDistance={90} maxPolarAngle={Math.PI / 2.15} />
    </>
  );
}
