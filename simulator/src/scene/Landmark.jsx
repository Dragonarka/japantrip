import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { seeded } from '../lib/layout';

// Modelos low-poly por tipo de lugar (k en schedule-data.js). Estilizados, no réplicas.
const M = ({ color, emissive, e = 0, metal = 0, ...p }) => (
  <meshStandardMaterial color={color} emissive={emissive || color} emissiveIntensity={e} metalness={metal} roughness={0.7} {...p} />
);
const Box = ({ a, p = [0, 0, 0], r, c, e }) => (
  <mesh position={p} rotation={r} castShadow receiveShadow><boxGeometry args={a} /><M color={c} e={e} /></mesh>
);
const Cyl = ({ a, p = [0, 0, 0], r, c, e }) => (
  <mesh position={p} rotation={r} castShadow><cylinderGeometry args={a} /><M color={c} e={e} /></mesh>
);
const Roof = ({ w, h, p, c = '#2f3b33' }) => (
  <mesh position={p} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[w, h, 4]} /><M color={c} /></mesh>
);

function Torii({ c = '#d1361f' }) {
  return (<group>
    <Cyl a={[0.18, 0.2, 3, 10]} p={[-1, 1.5, 0]} c={c} />
    <Cyl a={[0.18, 0.2, 3, 10]} p={[1, 1.5, 0]} c={c} />
    <Box a={[3, 0.25, 0.35]} p={[0, 3.05, 0]} c="#1b1b1b" />
    <Box a={[2.6, 0.2, 0.25]} p={[0, 2.5, 0]} c={c} />
  </group>);
}
function Pagoda({ c = '#c0392b', roof = '#2f3b33', tiers = 3 }) {
  return (<group>
    <Box a={[2.6, 0.4, 2.6]} p={[0, 0.2, 0]} c="#bfb6a8" />
    {Array.from({ length: tiers }).map((_, i) => (
      <group key={i} position={[0, 0.4 + i * 1.25, 0]}>
        <Box a={[1.6 - i * 0.25, 0.9, 1.6 - i * 0.25]} p={[0, 0.45, 0]} c={c} />
        <Roof w={1.7 - i * 0.25} h={0.55} p={[0, 1.15, 0]} c={roof} />
      </group>
    ))}
    <Cyl a={[0.05, 0.05, 1, 6]} p={[0, 0.4 + tiers * 1.25 + 0.4, 0]} c="#d4a017" />
  </group>);
}
function Castle({ c = '#f4f1ea' }) {
  return (<group>
    <mesh position={[0, 0.7, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><cylinderGeometry args={[2, 2.6, 1.4, 4]} /><M color="#8b8578" /></mesh>
    {[0, 1, 2].map(i => (
      <group key={i} position={[0, 1.4 + i * 1.2, 0]}>
        <Box a={[2.4 - i * 0.6, 0.9, 1.9 - i * 0.45]} p={[0, 0.45, 0]} c={c} />
        <Roof w={1.9 - i * 0.45} h={0.6} p={[0, 1.1, 0]} c="#3d4a4f" />
      </group>
    ))}
  </group>);
}
function House({ c = '#e9dfcf', roof = '#8c3b2e', banner }) {
  return (<group>
    <Box a={[2.2, 1.4, 2]} p={[0, 0.7, 0]} c={c} />
    <Roof w={1.9} h={1} p={[0, 1.9, 0]} c={roof} />
    <Box a={[0.5, 0.8, 0.05]} p={[0, 0.4, 1.01]} c="#5b4636" />
    {banner && <Box a={[0.4, 1.2, 0.05]} p={[0.8, 1.6, 1.05]} c={banner} />}
  </group>);
}
function Station() {
  return (<group>
    <Box a={[4, 0.4, 1.6]} p={[0, 0.2, 0]} c="#9aa0a6" />
    <Box a={[4, 0.12, 1.8]} p={[0, 1.8, 0]} c="#3c4650" />
    {[-1.6, 1.6].map(x => <Cyl key={x} a={[0.07, 0.07, 1.4, 6]} p={[x, 1.1, 0]} c="#3c4650" />)}
    <Box a={[1.4, 0.4, 0.06]} p={[0, 1.45, 0.6]} c="#1d4f91" />
  </group>);
}
function Airport() {
  return (<group>
    <Box a={[1.6, 0.05, 8]} p={[0, 0.03, 0]} c="#4a4a4a" />
    <group position={[0, 0.6, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.35, 0.35, 3.4, 12]} /><M color="#f4f4f4" /></mesh>
      <Box a={[3.8, 0.08, 0.7]} p={[0, 0, 0.1]} c="#e0e0e0" />
      <Box a={[0.08, 0.8, 0.6]} p={[0, 0.5, -1.5]} c="#c8102e" />
    </group>
  </group>);
}
function Tower() {
  return (<group>
    <mesh position={[0, 4, 0]} castShadow><coneGeometry args={[1.4, 8, 4]} /><M color="#e8461f" /></mesh>
    {[2.5, 5].map(y => <Box key={y} a={[1.2 - y * 0.1, 0.35, 1.2 - y * 0.1]} p={[0, y, 0]} c="#f4f4f4" />)}
  </group>);
}
function Skytree() {
  return (<group>
    <mesh position={[0, 6, 0]} castShadow><cylinderGeometry args={[0.18, 0.7, 12, 8]} /><M color="#e6eef2" /></mesh>
    {[6.5, 8.6].map(y => <Cyl key={y} a={[0.55, 0.55, 0.35, 16]} p={[0, y, 0]} c="#9fb4c2" />)}
    <Cyl a={[0.03, 0.03, 2, 4]} p={[0, 13, 0]} c="#e6eef2" />
  </group>);
}
function Trees({ seed, n = 7, c = '#e4b82b', glow }) {
  const rnd = seeded(seed);
  return (<group>
    {Array.from({ length: n }).map((_, i) => {
      const x = (rnd() - 0.5) * 4, z = (rnd() - 0.5) * 4, s = 0.7 + rnd() * 0.5;
      return (<group key={i} position={[x, 0, z]} scale={s}>
        <Cyl a={[0.1, 0.12, 0.8, 6]} p={[0, 0.4, 0]} c="#6b4a2b" />
        <mesh position={[0, 1.5, 0]} castShadow><coneGeometry args={[0.7, 1.6, 7]} /><M color={c} e={glow ? 0.6 : 0} /></mesh>
      </group>);
    })}
  </group>);
}
function Glow({ seed, night }) {
  const rnd = seeded(seed), colors = ['#ff4fa1', '#4fd1ff', '#ffd23f', '#9b5cff', '#5cff9b'];
  return (<group>
    {Array.from({ length: 7 }).map((_, i) => {
      const x = (rnd() - 0.5) * 4, z = (rnd() - 0.5) * 4, h = 0.8 + rnd() * 2.5;
      return (<group key={i} position={[x, 0, z]}>
        <Box a={[0.8, h, 0.8]} p={[0, h / 2, 0]} c="#3a3f4a" />
        <mesh position={[0, h + 0.25, 0]}><sphereGeometry args={[0.25, 10, 10]} /><M color={colors[i % 5]} e={night ? 2.2 : 0.4} /></mesh>
      </group>);
    })}
  </group>);
}
function Club({ night }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.material.emissive.setHSL((clock.elapsedTime * 0.3) % 1, 1, 0.5);
  });
  return (<group>
    <Box a={[2.6, 1.8, 2.2]} p={[0, 0.9, 0]} c="#141418" />
    <mesh ref={ref} position={[0, 1.5, 1.11]}><boxGeometry args={[2.2, 0.25, 0.02]} /><meshStandardMaterial color="#222" emissiveIntensity={night ? 3 : 1} /></mesh>
    <mesh position={[0, 0.5, 1.11]}><boxGeometry args={[0.7, 1, 0.02]} /><M color="#ff2e88" e={night ? 1.5 : 0.3} /></mesh>
  </group>);
}
function Stall({ c = '#c0392b', seed }) {
  const rnd = seeded(seed);
  return (<group>
    {[-1.2, 0, 1.2].map((x, i) => (
      <group key={x} position={[x, 0, rnd() - 0.5]}>
        <Box a={[1, 0.9, 0.9]} p={[0, 0.45, 0]} c="#d9c7a7" />
        <Box a={[1.1, 0.12, 1.1]} p={[0, 1.4, 0.1]} r={[0.25, 0, 0]} c={i % 2 ? '#ffffff' : c} />
        <Cyl a={[0.03, 0.03, 0.6, 4]} p={[0, 1.05, 0.45]} c="#5b4636" />
        <mesh position={[0.35, 1.15, 0.5]}><sphereGeometry args={[0.13, 10, 10]} /><M color="#ff5a36" e={0.6} /></mesh>
      </group>
    ))}
  </group>);
}
function Onsen({ monkeys }) {
  const steam = useRef();
  useFrame(({ clock }) => {
    if (!steam.current) return;
    steam.current.children.forEach((s, i) => {
      const k = (clock.elapsedTime * 0.4 + i / 4) % 1;
      s.position.y = 0.4 + k * 2; s.material.opacity = 0.35 * (1 - k);
    });
  });
  return (<group>
    <Cyl a={[2, 2.1, 0.3, 20]} p={[0, 0.1, 0]} c="#7d7464" />
    <mesh position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.8, 24]} /><meshStandardMaterial color="#7fd3e0" roughness={0.1} /></mesh>
    <group ref={steam}>
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} position={[(i - 1.5) * 0.6, 0.5, (i % 2) * 0.5 - 0.25]}><sphereGeometry args={[0.35, 10, 10]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} /></mesh>
      ))}
    </group>
    {monkeys && [[-0.7, 0.3], [0.5, -0.4], [0.2, 0.7]].map(([x, z], i) => (
      <group key={i} position={[x, 0.35, z]}>
        <mesh><sphereGeometry args={[0.28, 12, 12]} /><M color="#8a6a4f" /></mesh>
        <mesh position={[0, 0.3, 0.12]}><sphereGeometry args={[0.13, 10, 10]} /><M color="#e8a3a3" /></mesh>
      </group>
    ))}
  </group>);
}
function Mountain({ snow = true, h = 7, c = '#5c6f5a' }) {
  return (<group position={[0, 0, -2]}>
    <mesh position={[0, h / 2, 0]} castShadow><coneGeometry args={[h * 0.75, h, 18]} /><M color={c} /></mesh>
    {snow && <mesh position={[0, h * 0.82, 0]}><coneGeometry args={[h * 0.27, h * 0.36, 18]} /><M color="#ffffff" /></mesh>}
  </group>);
}
function Bamboo({ seed }) {
  const rnd = seeded(seed);
  return (<group>
    {Array.from({ length: 22 }).map((_, i) => {
      const h = 3 + rnd() * 3;
      return <Cyl key={i} a={[0.07, 0.08, h, 6]} p={[(rnd() - 0.5) * 4, h / 2, (rnd() - 0.5) * 4]} c={rnd() > 0.5 ? '#5f9e3f' : '#78b04f'} />;
    })}
  </group>);
}
function Aquarium() {
  return (<group>
    <mesh position={[0, 0, 0]}><sphereGeometry args={[2.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#3fa7d6" transparent opacity={0.55} /></mesh>
    <mesh position={[0, 1, 0]} scale={[0.45, 0.35, 1.3]}><sphereGeometry args={[0.8, 16, 12]} /><M color="#3b4f63" /></mesh>
  </group>);
}
function Wheel({ night }) {
  const ref = useRef();
  useFrame((_, d) => { if (ref.current) ref.current.rotation.z += d * 0.15; });
  return (<group>
    <Box a={[0.3, 3.2, 0.3]} p={[-0.5, 1.6, 0]} r={[0, 0, -0.2]} c="#9aa0a6" />
    <Box a={[0.3, 3.2, 0.3]} p={[0.5, 1.6, 0]} r={[0, 0, 0.2]} c="#9aa0a6" />
    <group ref={ref} position={[0, 3.4, 0]}>
      <mesh><torusGeometry args={[2.4, 0.09, 8, 40]} /><M color="#e8e8e8" emissive="#ff4fa1" e={night ? 1.8 : 0} /></mesh>
      {Array.from({ length: 8 }).map((_, i) => <Box key={i} a={[0.06, 4.8, 0.06]} r={[0, 0, (i * Math.PI) / 8]} c="#cfcfcf" />)}
    </group>
  </group>);
}
function Ring() {
  return (<group>
    <Box a={[3.2, 0.5, 3.2]} p={[0, 0.25, 0]} c="#c8a96e" />
    <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[1.1, 0.08, 6, 30]} /><M color="#e8dcc0" /></mesh>
    <Roof w={2.4} h={0.6} p={[0, 3.2, 0]} c="#3d2b1f" />
  </group>);
}
function Buddha() {
  return (<group>
    <Box a={[2.4, 0.5, 2]} p={[0, 0.25, 0]} c="#9a9488" />
    <mesh position={[0, 1.3, 0]} scale={[1.2, 1, 0.9]} castShadow><sphereGeometry args={[1, 16, 12]} /><M color="#5d7a6a" metal={0.4} /></mesh>
    <mesh position={[0, 2.6, 0.1]} castShadow><sphereGeometry args={[0.55, 16, 12]} /><M color="#5d7a6a" metal={0.4} /></mesh>
  </group>);
}
function Flyer() {
  return (<group>
    <mesh position={[0, 3, 0]}><cylinderGeometry args={[1.3, 1.3, 6, 20, 1, true]} /><meshStandardMaterial color="#a9dcff" transparent opacity={0.3} side={2} /></mesh>
    <Cyl a={[1.4, 1.4, 0.4, 20]} p={[0, 0.2, 0]} c="#3c4650" />
  </group>);
}
function Stage({ night }) {
  return (<group>
    <Box a={[3.5, 0.25, 3]} p={[0, 0.12, 0]} c="#666" />
    {[-1.5, 1.5].map(x => <Box key={x} a={[0.6, 1.4, 0.6]} p={[x, 0.95, -1]} c="#111" />)}
    <mesh position={[0, 2.6, -1]}><sphereGeometry args={[0.3, 10, 10]} /><M color="#ffd23f" e={night ? 2.5 : 0.3} /></mesh>
  </group>);
}
function Theme() {
  return (<group>
    <Castle c="#7fb2ff" />
    <mesh position={[3, 1.2, 0]} castShadow><sphereGeometry args={[1.1, 18, 14]} /><M color="#3fa7d6" metal={0.5} /></mesh>
  </group>);
}
function Ninja() {
  return (<group>
    <Torii c="#ff7a1a" />
    <mesh position={[2.2, 1, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.35, 0.35, 1.6, 12]} /><M color="#f2e6c8" /></mesh>
    <House c="#c9a77c" roof="#3d2b1f" />
  </group>);
}
function Island() {
  return (<group>
    <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[4, 24]} /><meshStandardMaterial color="#4f9ac9" /></mesh>
    <mesh position={[0, 0.8, 0]}><sphereGeometry args={[2, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><M color="#5e8f4a" /></mesh>
    <Cyl a={[0.15, 0.25, 2, 8]} p={[0, 2.7, 0]} c="#f4f4f4" />
  </group>);
}

function Model({ k, seed, night }) {
  switch (k) {
    case 'home': return <House />;
    case 'station': return <Station />;
    case 'airport': return <Airport />;
    case 'torii': return <Torii />;
    case 'temple': return <Pagoda />;
    case 'golden': return <Pagoda c="#e0b232" roof="#3b3226" tiers={3} />;
    case 'castle': return <Castle />;
    case 'tower': return <Tower />;
    case 'skytree': return <Skytree />;
    case 'park': return <Trees seed={seed} glow={night} />;
    case 'lights': return <Glow seed={seed} night={night} />;
    case 'club': return <Club night={night} />;
    case 'market': case 'food': return <Stall seed={seed} c={k === 'food' ? '#1d4f91' : '#c0392b'} />;
    case 'shop': return <Glow seed={seed} night={night} />;
    case 'arcade': return <Glow seed={seed} night />;
    case 'onsen': return <Onsen />;
    case 'monkey': return <Onsen monkeys />;
    case 'fuji': return <Mountain h={9} />;
    case 'mountain': return <Mountain snow={false} h={6} c="#b5652b" />;
    case 'bamboo': return <Bamboo seed={seed} />;
    case 'tea': return <House c="#efe6d2" roof="#3d2b1f" banner="#7a9a4a" />;
    case 'dojo': return <House c="#e9dfcf" roof="#1b1b1b" banner="#b3261e" />;
    case 'buddha': return <Buddha />;
    case 'aquarium': return <Aquarium />;
    case 'wheel': return <Wheel night={night} />;
    case 'sumo': return <Ring />;
    case 'sport': return <Flyer />;
    case 'car': return <group><Box a={[5, 0.05, 1.6]} p={[0, 0.03, 0]} c="#333" /></group>;
    case 'theme': return <Theme />;
    case 'ninja': return <Ninja />;
    case 'island': return <Island />;
    case 'theater': return <House c="#7a1712" roof="#1b1b1b" banner="#d4a017" />;
    case 'dance': return <Stage night={night} />;
    default: return <Cyl a={[0.3, 0.3, 2, 8]} p={[0, 1, 0]} c="#c0392b" />;
  }
}

export default function Landmark({ id, place, position, night, state }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.2, 28]} />
        <meshStandardMaterial color={state === 'now' ? '#f3d27a' : state === 'next' ? '#cfe3b4' : '#c9c0a8'} />
      </mesh>
      <Model k={place.k} seed={id} night={night} />
      <Html position={[0, 0, 3.6]} center className={`plabel ${state || ''}`} zIndexRange={[10, 0]}>{place.n}</Html>
    </group>
  );
}
