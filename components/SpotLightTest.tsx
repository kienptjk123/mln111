"use client";

import { useRef, useEffect } from "react";
import { SpotLight } from "three";
import * as THREE from "three";

// Test component để kiểm tra SpotLight
export function SpotLightTest() {
  const lightRef = useRef<SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
      targetRef.current.position.set(0, 0, 0);
      lightRef.current.target.updateMatrixWorld();
    }
  }, []);

  return (
    <group>
      <spotLight
        ref={lightRef}
        position={[2, 3, 2]}
        angle={0.4}
        penumbra={0.3}
        intensity={2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <object3D ref={targetRef} position={[0, 0, 0]} />

      {/* Test cube to see the light effect */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>

      {/* Ground plane */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}
