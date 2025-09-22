"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useEffect } from "react";
import Gallery, { paintingDescriptions } from "@/components/Gallery";
import FirstPersonControls from "@/components/FirstPersonControls";
import Crosshair from "@/components/Crosshair";
import LiveCaption from "@/components/LiveCaption";
import { useVoicePlayer } from "@/hooks/useVoicePlayer";

interface PaintingData {
  title: string;
  imageUrl: string;
  description: string;
  audioKey?: string;
}

function PaintingModal({
  painting,
  onClose,
}: {
  painting: PaintingData | null;
  onClose: () => void;
  voiceState: any;
  voiceControls: any;
}) {
  if (!painting) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main image area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <img
            src={painting.imageUrl || "/placeholder.svg"}
            alt={painting.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Description overlay panel */}
        <div className="w-96 h-full bg-black bg-opacity-80 text-white p-8 flex flex-col justify-start overflow-y-auto">
          {/* Top controls */}
          <div className="flex justify-end items-center mb-8 space-x-4">
            {/* Zoom icon */}
            <button className="text-white hover:text-gray-300 text-xl">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m21 21-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M11 8v6" stroke="currentColor" strokeWidth="2" />
                <path d="M8 11h6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-2xl font-light leading-none"
            >
              ×
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-light mb-6 text-green-400 leading-tight">
            {painting.title}
          </h2>

          {/* Description content */}
          <div className="text-gray-200 leading-relaxed space-y-4 text-sm flex-1">
            <p className="font-light text-base">{painting.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedPainting, setSelectedPainting] = useState<PaintingData | null>(
    null
  );
  const [galleryVoiceState, galleryVoiceControls] = useVoicePlayer();
  const [currentAudioKey, setCurrentAudioKey] = useState<string | null>(null);

  // Get painting data for current audio
  const getCurrentPaintingData = () => {
    if (currentAudioKey) {
      return paintingDescriptions[currentAudioKey];
    }
    return null;
  };

  const handlePaintingClick = (paintingData: PaintingData) => {
    setSelectedPainting(paintingData);
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  };

  const handleCloseModal = () => {
    setSelectedPainting(null);
    setTimeout(() => {
      document.body.requestPointerLock();
    }, 100);
  };

  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        camera={{
          position: [0, 1.6, 4],
          fov: 75,
          near: 0.1,
          far: 100,
        }}
        shadows
      >
        <Gallery
          onPaintingClick={handlePaintingClick}
          voiceState={galleryVoiceState}
          voiceControls={galleryVoiceControls}
          currentAudioKey={currentAudioKey}
          setCurrentAudioKey={setCurrentAudioKey}
        />
        <FirstPersonControls onPaintingClick={handlePaintingClick} />
      </Canvas>

      <Crosshair />

      {/* Live Caption for proximity-triggered audio */}
      <LiveCaption
        currentTime={galleryVoiceState.currentTime}
        isPlaying={galleryVoiceState.isPlaying}
        audioId={currentAudioKey || undefined}
        description={getCurrentPaintingData()?.description}
        duration={galleryVoiceState.duration}
      />

      <div className="absolute top-4 left-4 text-white z-10">
        <h1 className="text-2xl font-bold mb-2">Phòng Triển Lãm 3D</h1>
        <div className="text-sm opacity-80 space-y-1">
          <p>WASD: Di chuyển</p>
          <p>Chuột: Nhìn xung quanh</p>
          <p>Click để khóa chuột</p>
          <p>Ngắm vào tranh và click để xem chi tiết</p>
          <p>Đến gần tranh để nghe mô tả tự động</p>
        </div>
      </div>

      <PaintingModal
        painting={selectedPainting}
        onClose={handleCloseModal}
        voiceState={galleryVoiceState}
        voiceControls={galleryVoiceControls}
      />
    </div>
  );
}
