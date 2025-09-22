"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useEffect } from "react";
import Gallery from "@/components/Gallery";
import FirstPersonControls from "@/components/FirstPersonControls";
import Crosshair from "@/components/Crosshair";
import LiveCaption, {
  paintingCaptions,
  generateCaptionsFromDescription,
} from "@/components/LiveCaption";
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
}) {
  const [voiceState, voiceControls] = useVoicePlayer();
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  // Get audio key for this painting
  const audioKey =
    painting?.audioKey || painting?.title?.toLowerCase()?.replace(/\s+/g, "-");

  // Get captions for this painting
  const captions = audioKey
    ? paintingCaptions[audioKey] ||
      generateCaptionsFromDescription(painting?.description || "", 15)
    : [];

  useEffect(() => {
    if (painting && audioKey && !hasAutoPlayed) {
      // Try to load and auto-play audio when modal opens
      const audioPath = `/audio/${audioKey}.mp3`;
      voiceControls.loadAudio(audioPath);
      setHasAutoPlayed(true);

      // Auto-play after a short delay
      setTimeout(() => {
        voiceControls.play();
      }, 500);
    }

    return () => {
      // Stop audio when modal closes
      voiceControls.stop();
      setHasAutoPlayed(false);
    };
  }, [painting, audioKey, hasAutoPlayed]);

  if (!painting) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (voiceState.duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * voiceState.duration;
      voiceControls.seek(newTime);
    }
  };

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

          {/* Live Caption */}
          <div className="absolute bottom-20 left-8 right-96">
            <LiveCaption
              currentTime={voiceState.currentTime}
              isPlaying={voiceState.isPlaying}
              captions={captions}
            />
          </div>
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

          {/* Audio Controls */}
          <div className="mb-6 p-4 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-300">Audio Narration</span>
              <div className="text-xs text-gray-400">
                {formatTime(voiceState.currentTime)} /{" "}
                {formatTime(voiceState.duration)}
              </div>
            </div>

            {/* Progress Bar */}
            <div
              className="w-full h-2 bg-gray-700 rounded-full mb-3 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-green-400 rounded-full transition-all duration-150"
                style={{ width: `${voiceState.progress}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={voiceControls.stop}
                className="text-gray-300 hover:text-white transition-colors"
                disabled={voiceState.isLoading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
              </button>

              <button
                onClick={
                  voiceState.isPlaying
                    ? voiceControls.pause
                    : voiceControls.play
                }
                className="text-green-400 hover:text-green-300 transition-colors text-2xl"
                disabled={voiceState.isLoading}
              >
                {voiceState.isLoading ? (
                  <div className="animate-spin">⟳</div>
                ) : voiceState.isPlaying ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </button>

              <button
                onClick={() =>
                  voiceControls.seek(
                    Math.min(voiceState.currentTime + 10, voiceState.duration)
                  )
                }
                className="text-gray-300 hover:text-white transition-colors"
                disabled={voiceState.isLoading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="15,14 20,9 15,4" />
                  <path d="M4,20v-7a4,4 0 0 1 4,-4h12" />
                </svg>
              </button>
            </div>

            {voiceState.error && (
              <div className="mt-2 text-xs text-red-400 text-center">
                {voiceState.error}
              </div>
            )}
          </div>

          {/* Description content */}
          <div className="text-gray-200 leading-relaxed space-y-4 text-sm flex-1">
            <p className="font-light text-base">{painting.description}</p>

            <div className="pt-6 space-y-3 text-sm text-gray-300">
              <p>
                Kiến trúc thế kỷ 16, thời Mạc không lớn lắm. Các mảng chạm khắc
                trên kiến trúc rất mạch lạc, chỉ tiết trang trí được người thời
                châu chuốt nhưng cũng rất phóng khoáng.
              </p>

              <p>
                Sự xuất hiện hình ảnh con người trên vì nóc kiến trúc thường
                xuất hiện nhiều ở thời Mạc, sang đến các thế kỷ sau không còn
                được phổ biến.
              </p>

              <p className="pt-2 text-gray-400 text-xs">
                Ảnh: Nguyễn Đức Bình, Tạ Xuân Bắc, Nguyễn Văn Hùng.
              </p>
            </div>
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

  // Get captions for the currently playing audio
  const currentCaptions = currentAudioKey
    ? paintingCaptions[currentAudioKey] || []
    : [];

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
        captions={currentCaptions}
      />

      <div className="absolute top-4 left-4 text-white z-10">
        <h1 className="text-2xl font-bold mb-2">Phòng Triển Lãm 3D</h1>
        <div className="text-sm opacity-80 space-y-1">
          <p>WASD: Di chuyển</p>
          <p>Chuột: Nhìn xung quanh</p>
          <p>Click để khóa chuột</p>
          <p>Ngắm vào tranh và click để xem chi tiết</p>
          <p className="text-green-400">
            🎵 Đến gần tranh để nghe mô tả tự động
          </p>
        </div>
      </div>

      <PaintingModal painting={selectedPainting} onClose={handleCloseModal} />
    </div>
  );
}
