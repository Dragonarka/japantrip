import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

// Samurái tipo minifigura: piezas simples, colores planos, animado según la «pose».
const RED = '#b3261e', DARK_RED = '#7a1712', GOLD = '#d4a017', SKIN = '#f6d23a', HAKAMA = '#1f2a5a', BLACK = '#1b1b1b';

function Leg({ side, legRef }) {
  return (
    <group ref={legRef} position={[side * 0.25, 0.95, 0]}>
      <mesh position={[0, -0.45, 0]} castShadow><boxGeometry args={[0.46, 0.9, 0.55]} /><meshStandardMaterial color={HAKAMA} /></mesh>
      <mesh position={[0, -0.88, 0.08]} castShadow><boxGeometry args={[0.46, 0.16, 0.7]} /><meshStandardMaterial color={BLACK} /></mesh>
    </group>
  );
}

function Arm({ side, armRef }) {
  return (
    <group ref={armRef} position={[side * 0.62, 2.05, 0]}>
      <mesh position={[0, -0.4, 0]} castShadow><cylinderGeometry args={[0.16, 0.18, 0.85, 12]} /><meshStandardMaterial color={RED} /></mesh>
      <mesh position={[0, -0.92, 0.04]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.06, 8, 16, Math.PI * 1.5]} /><meshStandardMaterial color={SKIN} /></mesh>
    </group>
  );
}

export default function Samurai({ pose = 'idle', label }) {
  const root = useRef(), body = useRef(), legL = useRef(), legR = useRef(), armL = useRef(), armR = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const b = body.current;
    if (!b) return;
    // Valores por defecto (de pie) y luego cada pose los ajusta.
    let y = 0, rx = 0, rz = 0, ry = 0, lL = 0, lR = 0, aL = 0, aR = 0, aLz = 0, aRz = 0;
    switch (pose) {
      case 'walk': lL = Math.sin(t * 9) * 0.6; lR = -lL; aL = -lL * 0.8; aR = lL * 0.8; y = Math.abs(Math.sin(t * 9)) * 0.08; break;
      case 'dance': y = Math.abs(Math.sin(t * 7)) * 0.35; ry = Math.sin(t * 3.5) * 0.8; aL = -2.6 + Math.sin(t * 7) * 0.5; aR = -2.6 - Math.sin(t * 7) * 0.5; lL = Math.sin(t * 7) * 0.4; lR = -lL; break;
      case 'cheer': y = Math.abs(Math.sin(t * 5)) * 0.25; aL = -2.8; aR = -2.8; aLz = 0.3; aRz = -0.3; break;
      case 'wave': aR = -2.6 + Math.sin(t * 8) * 0.4; aRz = -0.3; break;
      case 'fight': aR = -1.6 + Math.sin(t * 10) * 1.2; aL = -0.6; ry = Math.sin(t * 2) * 0.4; lL = 0.3; lR = -0.3; break;
      case 'sit': y = -0.55; lL = -1.5; lR = -1.5; aL = -0.5; aR = -0.5; break;
      case 'onsen': y = -1.1; aL = -0.3; aR = -0.3; aLz = 0.6; aRz = -0.6; break;
      case 'sleep': rx = -Math.PI / 2; y = 0.35; break;
      case 'fly': rx = -Math.PI / 2 + 0.2; y = 2.4 + Math.sin(t * 2) * 0.4; aLz = 1.4; aRz = -1.4; lL = Math.sin(t * 6) * 0.2; lR = -lL; break;
      case 'ride': y = -0.5; lL = -1.5; lR = -1.5; aL = -0.4; aR = -0.4; ry = Math.sin(t * 0.7) * 0.3; break;
      default: ry = Math.sin(t * 0.8) * 0.5; aR = Math.sin(t * 1.5) * 0.1; y = Math.sin(t * 2) * 0.02;
    }
    b.position.y = y; b.rotation.set(rx, ry, rz);
    legL.current.rotation.x = lL; legR.current.rotation.x = lR;
    armL.current.rotation.set(aL, 0, aLz); armR.current.rotation.set(aR, 0, aRz);
  });

  return (
    <group ref={root} scale={0.55}>
      <group ref={body}>
        <Leg side={-1} legRef={legL} />
        <Leg side={1} legRef={legR} />
        {/* Cadera y obi */}
        <mesh position={[0, 1.0, 0]} castShadow><boxGeometry args={[1.0, 0.22, 0.6]} /><meshStandardMaterial color={BLACK} /></mesh>
        {/* Torso con armadura */}
        <mesh position={[0, 1.6, 0]} castShadow><boxGeometry args={[1.05, 1.0, 0.6]} /><meshStandardMaterial color={RED} /></mesh>
        {[1.35, 1.6, 1.85].map(yy => (
          <mesh key={yy} position={[0, yy, 0.31]}><boxGeometry args={[0.95, 0.04, 0.02]} /><meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} /></mesh>
        ))}
        <mesh position={[0, 1.62, 0.32]}><circleGeometry args={[0.12, 20]} /><meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.3} /></mesh>
        {/* Hombreras (sode) */}
        {[-1, 1].map(s => (
          <mesh key={s} position={[s * 0.68, 1.95, 0]} rotation={[0, 0, s * -0.35]} castShadow><boxGeometry args={[0.38, 0.5, 0.64]} /><meshStandardMaterial color={DARK_RED} /></mesh>
        ))}
        <Arm side={-1} armRef={armL} />
        <Arm side={1} armRef={armR} />
        {/* Cuello y cabeza amarilla */}
        <mesh position={[0, 2.18, 0]}><cylinderGeometry args={[0.18, 0.18, 0.16, 16]} /><meshStandardMaterial color={SKIN} /></mesh>
        <mesh position={[0, 2.55, 0]} castShadow><cylinderGeometry args={[0.36, 0.36, 0.62, 24]} /><meshStandardMaterial color={SKIN} /></mesh>
        {[-0.12, 0.12].map(x => (
          <mesh key={x} position={[x, 2.62, 0.35]}><sphereGeometry args={[0.045, 8, 8]} /><meshStandardMaterial color={BLACK} /></mesh>
        ))}
        <mesh position={[0, 2.45, 0.34]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.1, 0.022, 6, 16, Math.PI]} /><meshStandardMaterial color={BLACK} /></mesh>
        {/* Kabuto (casco), protector de nuca y maedate dorado */}
        <mesh position={[0, 2.82, 0]} castShadow><sphereGeometry args={[0.42, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={BLACK} metalness={0.3} roughness={0.5} /></mesh>
        <mesh position={[0, 2.72, -0.02]}><cylinderGeometry args={[0.43, 0.66, 0.32, 24, 1, true]} /><meshStandardMaterial color={BLACK} side={2} /></mesh>
        <mesh position={[0, 2.68, -0.02]}><cylinderGeometry args={[0.6, 0.6, 0.05, 24, 1, true]} /><meshStandardMaterial color={RED} side={2} /></mesh>
        <mesh position={[0, 3.12, 0.3]} rotation={[0.2, 0, 0]}><torusGeometry args={[0.32, 0.045, 8, 24, Math.PI]} /><meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.2} /></mesh>
        {/* Katana en la cadera izquierda */}
        <group position={[-0.5, 1.05, 0.15]} rotation={[0.2, 0, 1.25]}>
          <mesh position={[0, -0.55, 0]}><cylinderGeometry args={[0.05, 0.05, 1.2, 8]} /><meshStandardMaterial color={BLACK} /></mesh>
          <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.13, 0.13, 0.04, 16]} /><meshStandardMaterial color={GOLD} metalness={0.7} /></mesh>
          <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.045, 0.045, 0.5, 8]} /><meshStandardMaterial color="#e8e2d0" /></mesh>
        </group>
        {/* Sashimono (estandarte) a la espalda */}
        <mesh position={[0.2, 2.6, -0.4]}><cylinderGeometry args={[0.03, 0.03, 2.2, 6]} /><meshStandardMaterial color={BLACK} /></mesh>
        <mesh position={[0.48, 3.3, -0.4]}><planeGeometry args={[0.55, 0.85]} /><meshStandardMaterial color="#ffffff" side={2} /></mesh>
        <mesh position={[0.48, 3.3, -0.39]}><circleGeometry args={[0.16, 20]} /><meshStandardMaterial color={RED} side={2} /></mesh>
      </group>
      {pose === 'sleep' && (
        <Html position={[0, 2.2, 0]} center className="zzz">Z z z</Html>
      )}
      {label && pose !== 'sleep' && (
        <Html position={[0, 4.6, 0]} center className="bubble">{label}</Html>
      )}
    </group>
  );
}
