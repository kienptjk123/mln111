"use client";

import { useState, useEffect } from "react";

export interface CaptionSegment {
  text: string;
  startTime: number;
  endTime: number;
}

interface LiveCaptionProps {
  currentTime: number;
  isPlaying: boolean;
  captions: CaptionSegment[];
  className?: string;
}

export default function LiveCaption({
  currentTime,
  isPlaying,
  captions,
  className = "",
}: LiveCaptionProps) {
  const [currentCaption, setCurrentCaption] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying || captions.length === 0) {
      setCurrentCaption("");
      setIsVisible(false);
      return;
    }

    // Find the caption that should be displayed at current time
    const activeCaption = captions.find(
      (caption) =>
        currentTime >= caption.startTime && currentTime <= caption.endTime
    );

    if (activeCaption) {
      setCurrentCaption(activeCaption.text);
      setIsVisible(true);
    } else {
      setCurrentCaption("");
      setIsVisible(false);
    }
  }, [currentTime, isPlaying, captions]);

  if (!currentCaption) {
    return null;
  }

  return (
    <div
      className={`
        fixed bottom-4 left-4 z-50
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        ${className}
      `}
    >
      <div
        className="
        bg-black bg-opacity-80 
        text-white 
        px-4 py-3 
        rounded-lg 
        shadow-lg 
        border border-gray-600
        backdrop-blur-sm
        max-w-sm
        min-w-64
      "
      >
        <p className="text-sm leading-relaxed text-left">{currentCaption}</p>
      </div>
    </div>
  );
}

// Utility function to generate captions from description
export function generateCaptionsFromDescription(
  description: string,
  duration: number
): CaptionSegment[] {
  // Split description into sentences
  const sentences = description
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length === 0) return [];

  // Calculate time per sentence
  const timePerSentence = duration / sentences.length;

  return sentences.map((sentence, index) => ({
    text: sentence + (index < sentences.length - 1 ? "." : ""),
    startTime: index * timePerSentence,
    endTime: (index + 1) * timePerSentence,
  }));
}

// Sample captions data for each painting
export const paintingCaptions: Record<string, CaptionSegment[]> = {
  "abstract-art-1": [
    {
      text: "Một tác phẩm trừu tượng đầy màu sắc",
      startTime: 0,
      endTime: 3,
    },
    {
      text: "khám phá sự tương tác giữa màu sắc và hình khối",
      startTime: 3,
      endTime: 7,
    },
    {
      text: "thể hiện sự hỗn loạn và vẻ đẹp của cuộc sống hiện đại.",
      startTime: 7,
      endTime: 12,
    },
  ],
  "portrait-1": [
    {
      text: "Một chân dung thân mật",
      startTime: 0,
      endTime: 2.5,
    },
    {
      text: "nắm bắt được bản chất của cảm xúc con người",
      startTime: 2.5,
      endTime: 6,
    },
    {
      text: "thông qua nét vẽ tinh tế và ánh sáng khéo léo.",
      startTime: 6,
      endTime: 10,
    },
  ],
  "landscape-1": [
    {
      text: "Một bức tranh phong cảnh thanh bình",
      startTime: 0,
      endTime: 3,
    },
    {
      text: "mô tả vẻ đẹp yên tĩnh của thiên nhiên",
      startTime: 3,
      endTime: 6.5,
    },
    {
      text: "với những ngọn đồi thoai thoải và ánh nắng vàng.",
      startTime: 6.5,
      endTime: 11,
    },
  ],
  "modern-art": [
    {
      text: "Một tác phẩm đương đại",
      startTime: 0,
      endTime: 2,
    },
    {
      text: "thách thức những ranh giới nghệ thuật truyền thống",
      startTime: 2,
      endTime: 6,
    },
    {
      text: "với những hình khối hình học táo bạo và màu sắc tương phản mạnh mẽ.",
      startTime: 6,
      endTime: 12,
    },
  ],
  "classical-portrait": [
    {
      text: "Một chân dung vượt thời gian",
      startTime: 0,
      endTime: 2.5,
    },
    {
      text: "theo truyền thống cổ điển",
      startTime: 2.5,
      endTime: 4.5,
    },
    {
      text: "thể hiện kỹ thuật tinh tế và chủ đề trang nghiêm.",
      startTime: 4.5,
      endTime: 9,
    },
  ],
  "mountain-landscape": [
    {
      text: "Những đỉnh núi hùng vĩ",
      startTime: 0,
      endTime: 2.5,
    },
    {
      text: "vươn lên trên bầu trời kịch tính",
      startTime: 2.5,
      endTime: 5,
    },
    {
      text: "nắm bắt sức mạnh nguyên sơ và vẻ đẹp của thiên nhiên hoang dã.",
      startTime: 5,
      endTime: 11,
    },
  ],
  masterpiece: [
    {
      text: "Báu vật của bộ sưu tập chúng tôi",
      startTime: 0,
      endTime: 3,
    },
    {
      text: "một kiệt tác",
      startTime: 3,
      endTime: 4.5,
    },
    {
      text: "đại diện cho đỉnh cao của thành tựu nghệ thuật và ý nghĩa văn hóa.",
      startTime: 4.5,
      endTime: 10,
    },
  ],
};
