"use client";

import { useRef, useEffect } from "react";
import type { Mesh, SpotLight } from "three";
import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";

// Component SpotLight tùy chỉnh để xử lý target đúng cách
function CustomSpotLight({
  position,
  targetPosition,
  angle = 0.4,
  penumbra = 0.3,
  intensity = 4,
  color = "#ffffff",
  castShadow = true,
  shadowMapSize = [1024, 1024],
  shadowBias = -0.0001,
}: {
  position: [number, number, number];
  targetPosition: [number, number, number];
  angle?: number;
  penumbra?: number;
  intensity?: number;
  color?: string;
  castShadow?: boolean;
  shadowMapSize?: [number, number];
  shadowBias?: number;
}) {
  const lightRef = useRef<SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
      targetRef.current.position.set(...targetPosition);
      lightRef.current.target.updateMatrixWorld();
    }
  }, [targetPosition]);

  return (
    <group>
      <spotLight
        ref={lightRef}
        position={position}
        angle={angle}
        penumbra={penumbra}
        intensity={intensity}
        color={color}
        castShadow={castShadow}
        shadow-mapSize={shadowMapSize}
        shadow-bias={shadowBias}
      />
      <object3D ref={targetRef} position={targetPosition} />
    </group>
  );
}

// Component khung tranh
function PaintingFrame({
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
      {/* Khung tranh */}
      <mesh>
        <boxGeometry args={[size[0] + 0.2, size[1] + 0.2, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Tranh */}
      <mesh
        position={[0, 0, 0.06]}
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
        {isCircular ? (
          <planeGeometry args={[size[0], size[1]]} />
        ) : (
          <planeGeometry args={size} />
        )}
        <meshStandardMaterial map={texture} color="white" />
      </mesh>

      {/* Bảng tên tranh */}
      <mesh position={[0, -size[1] / 2 - 0.3, 0.05]}>
        <boxGeometry args={[size[0] * 0.8, 0.2, 0.03]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Tên tranh */}
      <Text
        position={[0, -size[1] / 2 - 0.3, 0.07]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={size[0] * 0.7}
        textAlign="center"
      >
        {title}
      </Text>
    </group>
  );
}

// Component dầm gỗ trần
function WoodenBeam({
  position,
  rotation,
  length,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  length: number;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[0.3, 0.4, length]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );
}

// Component bệ trưng bày tròn
function CircularPedestal({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Bệ đỏ */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.2]} />
        <meshStandardMaterial color="#cc3333" />
      </mesh>

      {/* Đĩa gỗ trên bệ */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Ánh sáng chiếu xuống bệ */}
      <CustomSpotLight
        position={[0, 3, 0]}
        targetPosition={[0, 0, 0]}
        angle={0.5}
        penumbra={0.3}
        intensity={3}
        color="#ffdd88"
        castShadow={false}
      />
    </group>
  );
}

function ClassicalColumn({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.6]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>

      {/* Column shaft */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 4]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>

      {/* Capital */}
      <mesh position={[0, 4.8, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 0.6]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
    </group>
  );
}

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
        {isCircular ? (
          <planeGeometry args={[size[0], size[1]]} />
        ) : (
          <planeGeometry args={size} />
        )}
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
}

const paintingDescriptions: Record<string, PaintingData> = {
  "abstract-art-1": {
    title: "Abstract Art 1",
    imageUrl: "/abstract-art.png",
    description:
      "A vibrant abstract composition exploring the interplay of colors and forms, representing the chaos and beauty of modern life.",
  },
  "portrait-1": {
    title: "Portrait 1",
    imageUrl: "/portrait-painting.png",
    description:
      "An intimate portrait capturing the essence of human emotion through masterful brushwork and subtle lighting.",
  },
  "landscape-1": {
    title: "Landscape 1",
    imageUrl: "/beautiful-landscape-painting.jpg",
    description:
      "A serene landscape painting depicting the tranquil beauty of nature with rolling hills and golden sunlight.",
  },
  "modern-art": {
    title: "Modern Art",
    imageUrl: "/modern-abstract-art.png",
    description:
      "A contemporary piece that challenges traditional artistic boundaries with bold geometric shapes and striking color contrasts.",
  },
  "classical-portrait": {
    title: "Classical Portrait",
    imageUrl: "/classical-portrait.jpg",
    description:
      "A timeless portrait in the classical tradition, showcasing refined technique and dignified subject matter.",
  },
  "mountain-landscape": {
    title: "Mountain Landscape",
    imageUrl: "/mountain-landscape-painting.png",
    description:
      "Majestic mountain peaks rise against a dramatic sky, capturing the raw power and beauty of untamed wilderness.",
  },
  "circular-art-1": {
    title: "Circular Art 1",
    imageUrl: "/abstract-art.png",
    description:
      "A circular composition that draws the viewer's eye inward, exploring themes of unity and infinite possibility.",
  },
  masterpiece: {
    title: "Masterpiece",
    imageUrl: "/masterpiece-painting-gallery-centerpiece.jpg",
    description:
      "The crown jewel of our collection - a masterwork that represents the pinnacle of artistic achievement and cultural significance.",
  },
  "circular-art-2": {
    title: "Circular Art 2",
    imageUrl: "/portrait-painting.png",
    description:
      "An innovative circular portrait that breaks conventional framing, creating an intimate and focused viewing experience.",
  },
};

export default function Gallery({
  onPaintingClick,
}: {
  onPaintingClick: (paintingData: any) => void;
}) {
  const galleryRef = useRef<Mesh>(null);

  return (
    <group ref={galleryRef}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#404040" roughness={0.1} metalness={0.1} />
      </mesh>

      <mesh
        position={[-8, 3.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[12, 7]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      <mesh
        position={[8, 3.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[12, 7]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      <mesh
        position={[0, 3.5, -6]}
        rotation={[0, 0, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      <mesh
        position={[0, 3.5, 6]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>

      {/* Ceiling remains white with better reflectivity */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
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

      {/* Main directional light - chiếu sáng tổng thể */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={30}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0005}
      />

      {/* Secondary directional light để cân bằng ánh sáng */}
      <directionalLight
        position={[-3, 8, -3]}
        intensity={0.6}
        color="#f8f8ff"
        castShadow={false}
      />

      {/* Ánh sáng trần phòng - mô phỏng đèn LED */}
      <pointLight
        position={[-4, 4.8, -2]}
        intensity={2}
        color="#ffffff"
        distance={8}
        decay={0.5}
      />
      <pointLight
        position={[4, 4.8, -2]}
        intensity={2}
        color="#ffffff"
        distance={8}
        decay={0.5}
      />
      <pointLight
        position={[-4, 4.8, 2]}
        intensity={2}
        color="#ffffff"
        distance={8}
        decay={0.5}
      />
      <pointLight
        position={[4, 4.8, 2]}
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

      {/* Ánh sáng phản chiếu từ tường */}
      <pointLight
        position={[-7.5, 2, 0]}
        intensity={1}
        color="#f0f0f0"
        distance={6}
        decay={1}
      />
      <pointLight
        position={[7.5, 2, 0]}
        intensity={1}
        color="#f0f0f0"
        distance={6}
        decay={1}
      />
      <pointLight
        position={[0, 2, -5.5]}
        intensity={1}
        color="#f0f0f0"
        distance={6}
        decay={1}
      />
      <pointLight
        position={[0, 2, 5.5]}
        intensity={1}
        color="#f0f0f0"
        distance={6}
        decay={1}
      />

      {/* Spotlight chiếu tranh bên trái */}
      <CustomSpotLight
        position={[-6.5, 4, -3]}
        targetPosition={[-7.8, 2.5, -3]}
        angle={0.4}
        penumbra={0.3}
        intensity={3}
        color="#ffffff"
        castShadow={true}
        shadowMapSize={[1024, 1024]}
        shadowBias={-0.0001}
      />
      <CustomSpotLight
        position={[-6.5, 4, 0]}
        targetPosition={[-7.8, 2.5, 0]}
        angle={0.4}
        penumbra={0.3}
        intensity={3}
        color="#ffffff"
        castShadow={true}
        shadowMapSize={[1024, 1024]}
        shadowBias={-0.0001}
      />
      <CustomSpotLight
        position={[-6.5, 4, 3]}
        targetPosition={[-7.8, 2.5, 3]}
        angle={0.4}
        penumbra={0.3}
        intensity={3}
        color="#ffffff"
        castShadow={true}
        shadowMapSize={[1024, 1024]}
        shadowBias={-0.0001}
      />

      {/* Spotlight chiếu tranh bên phải */}
      <CustomSpotLight
        position={[6.5, 4, -3]}
        targetPosition={[7.8, 2.5, -3]}
        angle={0.4}
        penumbra={0.3}
        intensity={3}
        color="#ffffff"
        castShadow={true}
        shadowMapSize={[1024, 1024]}
        shadowBias={-0.0001}
      />
      <CustomSpotLight
        position={[6.5, 4, 0]}
        targetPosition={[7.8, 2.5, 0]}
        angle={0.4}
        penumbra={0.3}
        intensity={3}
        color="#ffffff"
        castShadow={true}
        shadowMapSize={[1024, 1024]}
        shadowBias={-0.0001}
      />
      <CustomSpotLight
        position={[6.5, 4, 3]}
        targetPosition={[7.8, 2.5, 3]}
        angle={0.4}
        penumbra={0.3}
        intensity={3}
        color="#ffffff"
        castShadow={true}
        shadowMapSize={[1024, 1024]}
        shadowBias={-0.0001}
      />

      {/* Spotlight chiếu tranh chính */}
      <CustomSpotLight
        position={[0, 4.5, -4.5]}
        targetPosition={[0, 2.5, -5.9]}
        angle={0.5}
        penumbra={0.3}
        intensity={4}
        color="#ffffff"
        castShadow={true}
        shadowMapSize={[1024, 1024]}
        shadowBias={-0.0001}
      />

      {/* Ánh sáng môi trường tăng cường */}
      <ambientLight intensity={0.4} color="#f8f8ff" />

      <OrnateFrame
        position={[-7.8, 2.5, -3]}
        rotation={[0, Math.PI / 2, 0]}
        title="Abstract Art 1"
        imageUrl="/abstract-art.png"
        size={[1.8, 1.4]}
        paintingData={paintingDescriptions["abstract-art-1"]}
        onPaintingClick={onPaintingClick}
      />

      <OrnateFrame
        position={[-7.8, 2.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        title="Portrait 1"
        imageUrl="/portrait-painting.png"
        size={[1.6, 2]}
        paintingData={paintingDescriptions["portrait-1"]}
        onPaintingClick={onPaintingClick}
      />

      <OrnateFrame
        position={[-7.8, 2.5, 3]}
        rotation={[0, Math.PI / 2, 0]}
        title="Landscape 1"
        imageUrl="/beautiful-landscape-painting.jpg"
        size={[2.2, 1.6]}
        paintingData={paintingDescriptions["landscape-1"]}
        onPaintingClick={onPaintingClick}
      />

      <OrnateFrame
        position={[7.8, 2.5, -3]}
        rotation={[0, -Math.PI / 2, 0]}
        title="Modern Art"
        imageUrl="/modern-abstract-art.png"
        size={[1.8, 1.8]}
        paintingData={paintingDescriptions["modern-art"]}
        onPaintingClick={onPaintingClick}
      />

      <OrnateFrame
        position={[7.8, 2.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        title="Classical Portrait"
        imageUrl="/classical-portrait.jpg"
        size={[1.6, 2]}
        paintingData={paintingDescriptions["classical-portrait"]}
        onPaintingClick={onPaintingClick}
      />

      <OrnateFrame
        position={[7.8, 2.5, 3]}
        rotation={[0, -Math.PI / 2, 0]}
        title="Mountain Landscape"
        imageUrl="/mountain-landscape-painting.png"
        size={[2.2, 1.6]}
        paintingData={paintingDescriptions["mountain-landscape"]}
        onPaintingClick={onPaintingClick}
      />

      <OrnateFrame
        position={[0, 2.5, -5.9]}
        rotation={[0, 0, 0]}
        title="Masterpiece"
        imageUrl="/masterpiece-painting-gallery-centerpiece.jpg"
        size={[2.5, 2]}
        paintingData={paintingDescriptions["masterpiece"]}
        onPaintingClick={onPaintingClick}
      />
    </group>
  );
}
