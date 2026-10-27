// Vehículos simples que «cargan» al samurái durante un trayecto.

function Train({ color, white = false, nose = false }) {
  const body = white ? '#f4f4f2' : '#c9ccd1';
  return (
    <group position={[0, 0.55, 0]}>
      <mesh castShadow><boxGeometry args={[1.5, 1.1, 5.2]} /><meshStandardMaterial color={body} metalness={0.3} roughness={0.4} /></mesh>
      <mesh position={[0, -0.15, 0]}><boxGeometry args={[1.52, 0.18, 5.22]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.2, 0]}><boxGeometry args={[1.53, 0.32, 4.6]} /><meshStandardMaterial color="#20262e" /></mesh>
      {nose && (
        <mesh position={[0, -0.05, 3.3]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.75]}><coneGeometry args={[0.75, 1.6, 16]} /><meshStandardMaterial color={body} /></mesh>
      )}
    </group>
  );
}

function Bus({ color }) {
  return (
    <group position={[0, 0.75, 0]}>
      <mesh castShadow><boxGeometry args={[1.6, 1.5, 4]} /><meshStandardMaterial color="#f2f2f2" /></mesh>
      <mesh position={[0, -0.3, 0]}><boxGeometry args={[1.62, 0.3, 4.02]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.3, 0]}><boxGeometry args={[1.63, 0.45, 3.6]} /><meshStandardMaterial color="#20262e" /></mesh>
      {[-1.3, 1.3].map(z => [-0.8, 0.8].map(x => (
        <mesh key={`${x}${z}`} position={[x, -0.75, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.3, 0.3, 0.2, 12]} /><meshStandardMaterial color="#111" /></mesh>
      )))}
    </group>
  );
}

function Car({ color, sporty }) {
  return (
    <group position={[0, 0.4, 0]}>
      <mesh castShadow><boxGeometry args={[1.5, sporty ? 0.45 : 0.6, 3]} /><meshStandardMaterial color={color} metalness={0.5} roughness={0.3} /></mesh>
      <mesh position={[0, sporty ? 0.4 : 0.55, -0.2]}><boxGeometry args={[1.3, 0.45, 1.5]} /><meshStandardMaterial color="#20262e" /></mesh>
      {sporty && <mesh position={[0, 0.5, -1.4]}><boxGeometry args={[1.5, 0.08, 0.35]} /><meshStandardMaterial color="#111" /></mesh>}
      {[-1, 1].map(z => [-0.75, 0.75].map(x => (
        <mesh key={`${x}${z}`} position={[x, -0.2, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.28, 0.28, 0.2, 12]} /><meshStandardMaterial color="#111" /></mesh>
      )))}
    </group>
  );
}

export default function Vehicle({ mode, color }) {
  switch (mode) {
    case 'shinkansen': return <Train color={color} white nose />;
    case 'train': return <Train color={color} />;
    case 'metro': case 'tram': return <Train color={color} />;
    case 'bus': return <Bus color={color} />;
    case 'taxi': return <Car color="#f2c200" />;
    case 'drive': return <Car color="#ff6a00" sporty />;
    default: return null;
  }
}
