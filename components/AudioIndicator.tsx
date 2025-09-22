"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { Mesh } from "three";

interface AudioIndicatorProps {
  position: [number, number, number];
  isPlaying: boolean;
  paintingTitle: string;
  onPlayClick: () => void;
}

export default function AudioIndicator({
  position,
  isPlaying,
  paintingTitle,
  onPlayClick,
}: AudioIndicatorProps) {
  const indicatorRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animate the indicator
  useFrame((state) => {
    if (indicatorRef.current) {
      if (isPlaying) {
        // Pulsing effect when playing
        indicatorRef.current.scale.setScalar(
          1 + Math.sin(state.clock.elapsedTime * 3) * 0.1
        );
      } else if (hovered) {
        // Slight scale up when hovered
        indicatorRef.current.scale.setScalar(1.1);
      } else {
        indicatorRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={position}>
      {/* Audio Icon Background */}
      <mesh
        ref={indicatorRef}
        position={[0, 0, 0.1]}
        onClick={onPlayClick}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e: any) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <circleGeometry args={[0.15]} />
        <meshStandardMaterial
          color={isPlaying ? "#22c55e" : hovered ? "#3b82f6" : "#6b7280"}
          emissive={isPlaying ? "#166534" : "#000000"}
          emissiveIntensity={isPlaying ? 0.3 : 0}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Play/Pause Icon */}
      <mesh position={[0, 0, 0.12]}>
        {isPlaying ? (
          // Pause icon (two rectangles)
          <group>
            <mesh position={[-0.03, 0, 0]}>
              <boxGeometry args={[0.02, 0.08, 0.01]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.03, 0, 0]}>
              <boxGeometry args={[0.02, 0.08, 0.01]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        ) : (
          // Play icon (triangle)
          <mesh>
            <coneGeometry args={[0.05, 0.08, 3]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        )}
      </mesh>

      {/* Audio waves effect when playing */}
      {isPlaying && (
        <group>
          <mesh position={[0, 0, 0.08]}>
            <ringGeometry args={[0.2, 0.22]} />
            <meshStandardMaterial
              color="#22c55e"
              transparent
              opacity={0.3 + Math.sin(performance.now() * 0.003) * 0.2}
            />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <ringGeometry args={[0.25, 0.27]} />
            <meshStandardMaterial
              color="#22c55e"
              transparent
              opacity={0.2 + Math.sin(performance.now() * 0.005) * 0.15}
            />
          </mesh>
        </group>
      )}

      {/* Tooltip when hovered */}
      {hovered && (
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.06}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          textAlign="center"
        >
          {isPlaying
            ? `🔊 Đang phát: ${paintingTitle}`
            : `🎵 Nghe mô tả: ${paintingTitle}`}
        </Text>
      )}
    </group>
  );
}
