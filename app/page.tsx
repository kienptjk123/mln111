"use client";

import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import Gallery from "@/components/Gallery";
import FirstPersonControls from "@/components/FirstPersonControls";
import Crosshair from "@/components/Crosshair";

interface PaintingData {
  title: string;
  imageUrl: string;
  description: string;
}

function PaintingModal({
  painting,
  onClose,
}: {
  painting: PaintingData | null;
  onClose: () => void;
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
        <div className="flex-1 flex items-center justify-center p-8">
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
          <div className="text-gray-200 leading-relaxed space-y-4 text-sm">
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
        <Gallery onPaintingClick={handlePaintingClick} />
        <FirstPersonControls onPaintingClick={handlePaintingClick} />
      </Canvas>

      <Crosshair />

      <div className="absolute top-4 left-4 text-white z-10">
        <h1 className="text-2xl font-bold mb-2">Phòng Triển Lãm 3D</h1>
        <div className="text-sm opacity-80 space-y-1">
          <p>WASD: Di chuyển</p>
          <p>Chuột: Nhìn xung quanh</p>
          <p>Click để khóa chuột</p>
          <p>Ngắm vào tranh và click để xem chi tiết</p>
        </div>
      </div>

      <PaintingModal painting={selectedPainting} onClose={handleCloseModal} />
    </div>
  );
}
