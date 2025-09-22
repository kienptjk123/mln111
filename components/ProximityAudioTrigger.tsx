"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ProximityAudioTriggerProps {
  position: [number, number, number];
  paintingKey: string;
  paintingData: any;
  triggerDistance: number;
  onProximityEnter: (paintingKey: string, paintingData: any) => void;
  onProximityExit: (paintingKey: string) => void;
  isCurrentlyPlaying: boolean;
}

export default function ProximityAudioTrigger({
  position,
  paintingKey,
  paintingData,
  triggerDistance = 3,
  onProximityEnter,
  onProximityExit,
  isCurrentlyPlaying,
}: ProximityAudioTriggerProps) {
  const triggerRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [isInRange, setIsInRange] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useFrame(() => {
    if (!triggerRef.current) return;

    // Calculate distance between camera and painting
    const paintingPosition = new THREE.Vector3(...position);
    const cameraPosition = camera.position.clone();
    const distance = cameraPosition.distanceTo(paintingPosition);

    const inRange = distance < triggerDistance;

    if (inRange && !hasTriggered) {
      // Entering proximity - trigger audio
      setIsInRange(true);
      setHasTriggered(true);
      onProximityEnter(paintingKey, paintingData);
    } else if (!inRange && hasTriggered) {
      // Exiting proximity - stop audio
      setIsInRange(false);
      setHasTriggered(false);
      onProximityExit(paintingKey);
    }
  });

  return (
    <group position={position}>
      {/* Invisible trigger zone */}
      <mesh ref={triggerRef} visible={false}>
        <sphereGeometry args={[triggerDistance]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Visual indicator when in range */}
      {isInRange && (
        <group>
          {/* Pulsing ring effect */}
          <mesh position={[0, 0, 0.1]}>
            <ringGeometry args={[0.8, 1.0]} />
            <meshBasicMaterial
              color={isCurrentlyPlaying ? "#22c55e" : "#3b82f6"}
              transparent
              opacity={0.3 + Math.sin(performance.now() * 0.005) * 0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0.1]}>
            <ringGeometry args={[1.2, 1.4]} />
            <meshBasicMaterial
              color={isCurrentlyPlaying ? "#22c55e" : "#3b82f6"}
              transparent
              opacity={0.2 + Math.sin(performance.now() * 0.003) * 0.15}
            />
          </mesh>

          {/* Audio wave effect */}
          {isCurrentlyPlaying && (
            <>
              <mesh position={[0, 0, 0.15]}>
                <ringGeometry args={[1.6, 1.8]} />
                <meshBasicMaterial
                  color="#22c55e"
                  transparent
                  opacity={0.25 + Math.sin(performance.now() * 0.004) * 0.1}
                />
              </mesh>
              <mesh position={[0, 0, 0.15]}>
                <ringGeometry args={[2.0, 2.2]} />
                <meshBasicMaterial
                  color="#22c55e"
                  transparent
                  opacity={0.15 + Math.sin(performance.now() * 0.006) * 0.08}
                />
              </mesh>
            </>
          )}
        </group>
      )}
    </group>
  );
}
