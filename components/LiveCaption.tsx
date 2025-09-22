"use client";

import { useState, useEffect } from "react";
import useVoiceCaption from "../hooks/useVoiceCaption";

export interface CaptionSegment {
  text: string;
  startTime: number;
  endTime: number;
}

interface LiveCaptionProps {
  currentTime: number;
  isPlaying: boolean;
  audioId?: string;
  description?: string;
  duration?: number;
  // Legacy support for direct captions
  captions?: CaptionSegment[];
  className?: string;
}

export default function LiveCaption({
  currentTime,
  isPlaying,
  audioId,
  description,
  duration,
  captions: legacyCaptions,
  className = "",
}: LiveCaptionProps) {
  const [captionState, captionControls] = useVoiceCaption();
  const [currentCaption, setCurrentCaption] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Load captions when audioId, description, or duration changes
  useEffect(() => {
    if (audioId && description && duration) {
      captionControls.loadCaptions(audioId, description, duration);
    } else if (!audioId) {
      captionControls.clearCaptions();
    }
  }, [audioId, description, duration]); // Remove captionControls from dependencies

  useEffect(() => {
    if (!isPlaying) {
      setCurrentCaption("");
      setIsVisible(false);
      return;
    }

    let activeCaption = "";

    // Use new voice caption system if available
    if (captionState.captions.length > 0) {
      activeCaption = captionControls.getCurrentCaption(currentTime);
    }
    // Fallback to legacy captions prop
    else if (legacyCaptions && legacyCaptions.length > 0) {
      const legacyCaption = legacyCaptions.find(
        (caption) =>
          currentTime >= caption.startTime && currentTime <= caption.endTime
      );
      activeCaption = legacyCaption?.text || "";
    }

    setCurrentCaption(activeCaption);
    setIsVisible(!!activeCaption);
  }, [
    currentTime,
    isPlaying,
    captionState.captions,
    legacyCaptions,
    // Remove captionControls from dependencies to prevent infinite re-renders
  ]);

  // Show loading state
  if (captionState.isLoading) {
    return (
      <div
        className={`
          fixed bottom-4 left-4 z-50
          transition-all duration-300 ease-in-out
          opacity-100 translate-y-0
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
          <p className="text-sm leading-relaxed text-left text-gray-300">
            Đang tải phụ đề...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (captionState.error && !currentCaption) {
    return (
      <div
        className={`
          fixed bottom-4 left-4 z-50
          transition-all duration-300 ease-in-out
          opacity-100 translate-y-0
          ${className}
        `}
      >
        <div
          className="
          bg-red-900 bg-opacity-80 
          text-white 
          px-4 py-3 
          rounded-lg 
          shadow-lg 
          border border-red-600
          backdrop-blur-sm
          max-w-sm
          min-w-64
        "
        >
          <p className="text-sm leading-relaxed text-left">
            {captionState.error}
          </p>
        </div>
      </div>
    );
  }

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
        {captionState.error && (
          <p className="text-xs text-yellow-300 mt-1">
            (Sử dụng phụ đề dự phòng)
          </p>
        )}
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
