import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { JOINTS, poses, type Joint } from './poses';

const BONES: { from: Joint; to: Joint; radius: number }[] = [
  { from: 'neck', to: 'pelvis', radius: 0.105 },
  { from: 'head', to: 'neck', radius: 0.042 },
  { from: 'lShoulder', to: 'rShoulder', radius: 0.058 },
  { from: 'lHip', to: 'rHip', radius: 0.085 },
  { from: 'lShoulder', to: 'lElbow', radius: 0.042 },
  { from: 'lElbow', to: 'lHand', radius: 0.034 },
  { from: 'rShoulder', to: 'rElbow', radius: 0.042 },
  { from: 'rElbow', to: 'rHand', radius: 0.034 },
  { from: 'lHip', to: 'lKnee', radius: 0.066 },
  { from: 'lKnee', to: 'lFoot', radius: 0.048 },
  { from: 'rHip', to: 'rKnee', radius: 0.066 },
  { from: 'rKnee', to: 'rFoot', radius: 0.048 },
];

const JOINT_RADIUS: Record<Joint, number> = {
  head: 0.115, neck: 0.058, pelvis: 0.105,
  lShoulder: 0.058, rShoulder: 0.058, lElbow: 0.04, rElbow: 0.04, lHand: 0.04, rHand: 0.04,
  lHip: 0.085, rHip: 0.085, lKnee: 0.054, rKnee: 0.054, lFoot: 0.055, rFoot: 0.055,
};

const FIGURE_COLOR = '#b9623a';
const FOCUS: [number, number, number] = [0, 0.98, 0];
const UP = new THREE.Vector3(0, 1, 0);
const scratch = new THREE.Vector3();

function Figure({ poseIndex }: { poseIndex: number }) {
  const group = useRef<THREE.Group>(null);
  const jointRefs = useRef<Partial<Record<Joint, THREE.Mesh>>>({});
  const boneRefs = useRef<(THREE.Mesh | null)[]>([]);
  const current = useMemo(() => {
    const start = {} as Record<Joint, THREE.Vector3>;
    JOINTS.forEach((j) => { start[j] = new THREE.Vector3(...poses[0].joints[j]); });
    return start;
  }, []);

  useFrame((state, delta) => {
    const target = poses[poseIndex].joints;
    const breath = Math.sin(state.clock.elapsedTime * 0.8) * 0.006;
    JOINTS.forEach((j) => {
      const [x, y, z] = target[j];
      const lift = j === 'head' || j === 'neck' || j.endsWith('Shoulder') ? breath : 0;
      current[j].x = THREE.MathUtils.damp(current[j].x, x, 3.2, delta);
      current[j].y = THREE.MathUtils.damp(current[j].y, y + lift, 3.2, delta);
      current[j].z = THREE.MathUtils.damp(current[j].z, z, 3.2, delta);
      jointRefs.current[j]?.position.copy(current[j]);
    });
    BONES.forEach((bone, i) => {
      const mesh = boneRefs.current[i];
      if (!mesh) return;
      const a = current[bone.from];
      const b = current[bone.to];
      mesh.position.copy(a).add(b).multiplyScalar(0.5);
      scratch.copy(b).sub(a);
      mesh.scale.y = scratch.length();
      mesh.quaternion.setFromUnitVectors(UP, scratch.normalize());
    });
    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.22;
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.012, 0]}>
        <boxGeometry args={[2.3, 0.024, 0.8]} />
        <meshStandardMaterial color="#c9a678" roughness={0.95} />
      </mesh>
      {JOINTS.map((j) => (
        <mesh key={j} ref={(el) => { if (el) jointRefs.current[j] = el; }}>
          <sphereGeometry args={[JOINT_RADIUS[j], 24, 24]} />
          <meshStandardMaterial color={FIGURE_COLOR} roughness={0.55} />
        </mesh>
      ))}
      {BONES.map((bone, i) => (
        <mesh key={`${bone.from}-${bone.to}`} ref={(el) => { boneRefs.current[i] = el; }}>
          <cylinderGeometry args={[bone.radius, bone.radius, 1, 20]} />
          <meshStandardMaterial color={FIGURE_COLOR} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

export default function PoseScene({ poseIndex, active }: { poseIndex: number; active: boolean }) {
  // Dragging would trap vertical swipes on touch screens, so only mice can orbit.
  const canOrbit = useMemo(() => window.matchMedia('(pointer: fine)').matches, []);

  return (
    <Canvas
      camera={{ position: [0, 1.15, 4.6], fov: 34 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      frameloop={active ? 'always' : 'never'}
      style={{ touchAction: 'pan-y' }}
      onCreated={({ camera }) => camera.lookAt(...FOCUS)}
    >
      <hemisphereLight args={['#fff4e0', '#8c6a4a', 1.5]} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} color="#ffe2b8" />
      <directionalLight position={[-4, 2, 2]} intensity={0.5} color="#a3c2ad" />
      <Figure poseIndex={poseIndex} />
      <ContactShadows position={[0, 0.03, 0]} opacity={0.4} scale={5} blur={2.4} far={2.2} />
      {canOrbit && (
        <OrbitControls enablePan={false} enableZoom={false} target={FOCUS} minPolarAngle={0.9} maxPolarAngle={1.75} />
      )}
    </Canvas>
  );
}
