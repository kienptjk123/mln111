"use client";

import { useRef, useEffect, useState } from "react";
import type { Mesh, SpotLight } from "three";
import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";
import ProximityAudioTrigger from "./ProximityAudioTrigger";
import { useVoicePlayer } from "@/hooks/useVoicePlayer";

// Component khung tranh ornate
function OrnateFrame({
  position,
  rotation = [0, 0, 0],
  title,
  imageUrl,
  size = [2, 1.5],
  isCircular = false,
  paintingData,
  onPaintingClick,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  imageUrl: string;
  size?: [number, number];
  isCircular?: boolean;
  paintingData: any;
  onPaintingClick: (paintingData: any) => void;
}) {
  const texture = useTexture(imageUrl);

  return (
    <group position={position} rotation={rotation}>
      {/* Outer ornate frame */}
      <mesh>
        <boxGeometry args={[size[0] + 0.4, size[1] + 0.4, 0.15]} />
        <meshStandardMaterial color="#d4af37" />
      </mesh>

      {/* Inner frame */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[size[0] + 0.2, size[1] + 0.2, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Painting */}
      <mesh
        position={[0, 0, 0.16]}
        onClick={() => onPaintingClick(paintingData)}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e: any) => {
          e.stopPropagation();
          document.body.style.cursor = "auto";
        }}
        userData={{ paintingData }}
      >
        <planeGeometry args={size} />
        <meshStandardMaterial map={texture} color="white" />
      </mesh>

      {/* Classical nameplate */}
      <mesh position={[0, -size[1] / 2 - 0.4, 0.1]}>
        <boxGeometry args={[size[0] * 0.8, 0.3, 0.05]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>

      {/* Title text */}
      <Text
        position={[0, -size[1] / 2 - 0.4, 0.13]}
        fontSize={0.1}
        color="#d4af37"
        anchorX="center"
        anchorY="middle"
        maxWidth={size[0] * 0.7}
        textAlign="center"
        fontWeight="bold"
      >
        {title}
      </Text>
    </group>
  );
}

interface PaintingData {
  title: string;
  imageUrl: string;
  description: string;
  audioKey: string;
}

const paintingDescriptions: Record<string, PaintingData> = {
  "abstract-art-1": {
    title: "Abstract Art 1",
    imageUrl: "/abstract-art.png",
    description:
      "A vibrant abstract composition exploring the interplay of colors and forms, representing the chaos and beauty of modern life.",
    audioKey: "abstract-art-1",
  },
  "portrait-1": {
    title: "Portrait 1",
    imageUrl: "/portrait-painting.png",
    description:
      "An intimate portrait capturing the essence of human emotion through masterful brushwork and subtle lighting.",
    audioKey: "portrait-1",
  },
  "landscape-1": {
    title: "Landscape 1",
    imageUrl: "/beautiful-landscape-painting.jpg",
    description:
      "A serene landscape painting depicting the tranquil beauty of nature with rolling hills and golden sunlight.",
    audioKey: "landscape-1",
  },
  "modern-art": {
    title: "Modern Art",
    imageUrl: "/modern-abstract-art.png",
    description:
      "A contemporary piece that challenges traditional artistic boundaries with bold geometric shapes and striking color contrasts.",
    audioKey: "modern-art",
  },
  "classical-portrait": {
    title: "Classical Portrait",
    imageUrl: "/classical-portrait.jpg",
    description:
      "A timeless portrait in the classical tradition, showcasing refined technique and dignified subject matter.",
    audioKey: "classical-portrait",
  },
  "mountain-landscape": {
    title: "Mountain Landscape",
    imageUrl: "/mountain-landscape-painting.png",
    description:
      "Majestic mountain peaks rise against a dramatic sky, capturing the raw power and beauty of untamed wilderness.",
    audioKey: "mountain-landscape",
  },
  "circular-art-1": {
    title: "Circular Art 1",
    imageUrl: "/abstract-art.png",
    description:
      "A circular composition that draws the viewer's eye inward, exploring themes of unity and infinite possibility.",
    audioKey: "circular-art-1",
  },
  masterpiece: {
    title: "Masterpiece",
    imageUrl: "/masterpiece-painting-gallery-centerpiece.jpg",
    description:
      "The crown jewel of our collection - a masterwork that represents the pinnacle of artistic achievement and cultural significance.",
    audioKey: "masterpiece",
  },
  "circular-art-2": {
    title: "Circular Art 2",
    imageUrl: "/portrait-painting.png",
    description:
      "An innovative circular portrait that breaks conventional framing, creating an intimate and focused viewing experience.",
    audioKey: "circular-art-2",
  },
};

export default function Gallery({
  onPaintingClick,
  voiceState,
  voiceControls,
  currentAudioKey,
  setCurrentAudioKey,
}: {
  onPaintingClick: (paintingData: any) => void;
  voiceState?: any;
  voiceControls?: any;
  currentAudioKey?: string | null;
  setCurrentAudioKey?: (key: string | null) => void;
}) {
  const galleryRef = useRef<Mesh>(null);
  const [fallbackAudioState, fallbackAudioControls] = useVoicePlayer();

  // Use passed props or fallback to local state
  const audioState = voiceState || fallbackAudioState;
  const audioControls = voiceControls || fallbackAudioControls;
  const currentKey = currentAudioKey !== undefined ? currentAudioKey : null;
  const setCurrentKey = setCurrentAudioKey || (() => {});

  // Handle proximity-based audio for paintings in 3D space
  const handleProximityEnter = (
    paintingKey: string,
    paintingData: PaintingData
  ) => {
    // Stop current audio if different painting
    if (currentKey && currentKey !== paintingKey && audioState.isPlaying) {
      audioControls.stop();
    }

    // Load and play new audio
    const audioPath = `/audio/${paintingData.audioKey}.mp3`;
    audioControls.loadAudio(audioPath);
    setCurrentKey(paintingKey);
    setTimeout(() => {
      audioControls.play();
    }, 300);
  };

  const handleProximityExit = (paintingKey: string) => {
    // Stop audio when moving away from painting
    if (currentKey === paintingKey && audioState.isPlaying) {
      audioControls.stop();
      setCurrentKey(null);
    }
  };

  return (
    <group ref={galleryRef}>
      {/* Extended Room - 24x18 instead of 16x12 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[24, 12]} />
        <meshStandardMaterial color="#404040" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Left wall */}
      <mesh
        position={[-12, 3.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[18, 7]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      {/* Right wall */}
      <mesh
        position={[12, 3.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[18, 7]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      {/* Back wall (far) */}
      <mesh
        position={[0, 3.5, -9]}
        rotation={[0, 0, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[24, 7]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      {/* Front wall (entrance) */}
      <mesh
        position={[0, 3.5, 9]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[24, 7]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]} receiveShadow>
        <planeGeometry args={[24, 18]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.1}
          metalness={0.05}
          emissive="#f8f8ff"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Center bench remains black */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.5, 0.8]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* Enhanced Lighting for larger room */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={30}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />

      <directionalLight
        position={[-3, 8, -3]}
        intensity={0.6}
        color="#f8f8ff"
        castShadow={false}
      />

      <pointLight
        position={[-8, 4.8, -2]}
        intensity={2}
        color="#ffffff"
        distance={8}
        decay={0.5}
      />
      <pointLight
        position={[8, 4.8, -2]}
        intensity={2}
        color="#ffffff"
        distance={8}
        decay={0.5}
      />
      <pointLight
        position={[-8, 4.8, 2]}
        intensity={2}
        color="#ffffff"
        distance={8}
        decay={0.5}
      />
      <pointLight
        position={[8, 4.8, 2]}
        intensity={2}
        color="#ffffff"
        distance={8}
        decay={0.5}
      />
      <pointLight
        position={[0, 4.8, 0]}
        intensity={2.5}
        color="#ffffff"
        distance={10}
        decay={0.5}
      />

      <ambientLight intensity={0.4} color="#f8f8ff" />

      {/* Left wall paintings - moved to -11.8 */}
      <OrnateFrame
        position={[-11.8, 2.5, -5]}
        rotation={[0, Math.PI / 2, 0]}
        title="Abstract Art 1"
        imageUrl="/abstract-art.png"
        size={[1.8, 1.4]}
        paintingData={paintingDescriptions["abstract-art-1"]}
        onPaintingClick={onPaintingClick}
      />
      <ProximityAudioTrigger
        position={[-11.8, 2.5, -5]}
        paintingKey="abstract-art-1"
        paintingData={paintingDescriptions["abstract-art-1"]}
        triggerDistance={7.5}
        onProximityEnter={handleProximityEnter}
        onProximityExit={handleProximityExit}
        isCurrentlyPlaying={
          currentKey === "abstract-art-1" && audioState.isPlaying
        }
      />

      <OrnateFrame
        position={[-11.8, 2.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        title="Portrait 1"
        imageUrl="/portrait-painting.png"
        size={[1.6, 2]}
        paintingData={paintingDescriptions["portrait-1"]}
        onPaintingClick={onPaintingClick}
      />
      <ProximityAudioTrigger
        position={[-11.8, 2.5, 0]}
        paintingKey="portrait-1"
        paintingData={paintingDescriptions["portrait-1"]}
        triggerDistance={7.5}
        onProximityEnter={handleProximityEnter}
        onProximityExit={handleProximityExit}
        isCurrentlyPlaying={currentKey === "portrait-1" && audioState.isPlaying}
      />

      <OrnateFrame
        position={[-11.8, 2.5, 5]}
        rotation={[0, Math.PI / 2, 0]}
        title="Landscape 1"
        imageUrl="/beautiful-landscape-painting.jpg"
        size={[2.2, 1.6]}
        paintingData={paintingDescriptions["landscape-1"]}
        onPaintingClick={onPaintingClick}
      />
      <ProximityAudioTrigger
        position={[-11.8, 2.5, 5]}
        paintingKey="landscape-1"
        paintingData={paintingDescriptions["landscape-1"]}
        triggerDistance={7.5}
        onProximityEnter={handleProximityEnter}
        onProximityExit={handleProximityExit}
        isCurrentlyPlaying={
          currentKey === "landscape-1" && audioState.isPlaying
        }
      />

      {/* Right wall paintings - moved to 11.8 */}
      <OrnateFrame
        position={[11.8, 2.5, -5]}
        rotation={[0, -Math.PI / 2, 0]}
        title="Modern Art"
        imageUrl="/modern-abstract-art.png"
        size={[1.8, 1.8]}
        paintingData={paintingDescriptions["modern-art"]}
        onPaintingClick={onPaintingClick}
      />
      <ProximityAudioTrigger
        position={[11.8, 2.5, -5]}
        paintingKey="modern-art"
        paintingData={paintingDescriptions["modern-art"]}
        triggerDistance={7.5}
        onProximityEnter={handleProximityEnter}
        onProximityExit={handleProximityExit}
        isCurrentlyPlaying={currentKey === "modern-art" && audioState.isPlaying}
      />

      <OrnateFrame
        position={[11.8, 2.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        title="Classical Portrait"
        imageUrl="/classical-portrait.jpg"
        size={[1.6, 2]}
        paintingData={paintingDescriptions["classical-portrait"]}
        onPaintingClick={onPaintingClick}
      />
      <ProximityAudioTrigger
        position={[11.8, 2.5, 0]}
        paintingKey="classical-portrait"
        paintingData={paintingDescriptions["classical-portrait"]}
        triggerDistance={7.5}
        onProximityEnter={handleProximityEnter}
        onProximityExit={handleProximityExit}
        isCurrentlyPlaying={
          currentKey === "classical-portrait" && audioState.isPlaying
        }
      />

      <OrnateFrame
        position={[11.8, 2.5, 5]}
        rotation={[0, -Math.PI / 2, 0]}
        title="Mountain Landscape"
        imageUrl="/mountain-landscape-painting.png"
        size={[2.2, 1.6]}
        paintingData={paintingDescriptions["mountain-landscape"]}
        onPaintingClick={onPaintingClick}
      />
      <ProximityAudioTrigger
        position={[11.8, 2.5, 5]}
        paintingKey="mountain-landscape"
        paintingData={paintingDescriptions["mountain-landscape"]}
        triggerDistance={7.5}
        onProximityEnter={handleProximityEnter}
        onProximityExit={handleProximityExit}
        isCurrentlyPlaying={
          currentKey === "mountain-landscape" && audioState.isPlaying
        }
      />

      {/* Main masterpiece - moved to back wall at -8.9 */}
      <OrnateFrame
        position={[0, 2.5, -8.9]}
        rotation={[0, 0, 0]}
        title="Masterpiece"
        imageUrl="/masterpiece-painting-gallery-centerpiece.jpg"
        size={[2.5, 2]}
        paintingData={paintingDescriptions["masterpiece"]}
        onPaintingClick={onPaintingClick}
      />
      <ProximityAudioTrigger
        position={[0, 2.5, -8.9]}
        paintingKey="masterpiece"
        paintingData={paintingDescriptions["masterpiece"]}
        triggerDistance={9.0}
        onProximityEnter={handleProximityEnter}
        onProximityExit={handleProximityExit}
        isCurrentlyPlaying={
          currentKey === "masterpiece" && audioState.isPlaying
        }
      />
    </group>
  );
}
