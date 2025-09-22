import { useState, useEffect, useCallback, useMemo } from "react";
import { CaptionSegment } from "../components/LiveCaption";

export interface VoiceCaptionState {
  captions: CaptionSegment[];
  audioId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface VoiceCaptionControls {
  loadCaptions: (
    audioId: string,
    description: string,
    duration: number
  ) => void;
  clearCaptions: () => void;
  getCurrentCaption: (currentTime: number) => string;
}

// Function to parse SRT file content
function parseSRT(srtContent: string): CaptionSegment[] {
  const captions: CaptionSegment[] = [];
  const entries = srtContent.trim().split("\n\n");

  for (const entry of entries) {
    const lines = entry.trim().split("\n");
    if (lines.length < 3) continue;

    // Skip the sequence number (first line)
    const timecodeLine = lines[1];
    const textLines = lines.slice(2);

    // Parse timecode line (format: 00:00:00,000 --> 00:00:01,000)
    const timecodeMatch = timecodeLine.match(
      /(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/
    );

    if (timecodeMatch) {
      const [, startH, startM, startS, startMs, endH, endM, endS, endMs] =
        timecodeMatch;

      const startTime =
        parseInt(startH) * 3600 +
        parseInt(startM) * 60 +
        parseInt(startS) +
        parseInt(startMs) / 1000;
      const endTime =
        parseInt(endH) * 3600 +
        parseInt(endM) * 60 +
        parseInt(endS) +
        parseInt(endMs) / 1000;

      // Join text lines and clean up
      let text = textLines.join(" ").trim();

      // Remove common SRT artifacts and promotional text
      text = text.replace(/\(Được chép bởi TurboScribe\.ai.*?\)/g, "");
      text = text.replace(/^\s*[-–—]\s*/, ""); // Remove leading dashes
      text = text.trim();

      if (text) {
        captions.push({
          text,
          startTime,
          endTime,
        });
      }
    }
  }

  return captions;
}

// Function to load SRT file from the server
async function loadSRTFile(audioId: string): Promise<CaptionSegment[]> {
  try {
    const srtPath = `/audio/${audioId}.srt`;
    const response = await fetch(srtPath);

    if (!response.ok) {
      throw new Error(`Failed to load SRT file: ${response.status}`);
    }

    const srtContent = await response.text();
    return parseSRT(srtContent);
  } catch (error) {
    console.warn(`Could not load SRT file for ${audioId}:`, error);
    return [];
  }
}

// Utility function to generate captions from description (fallback)
export function generateCaptionsFromDescription(
  description: string,
  duration: number,
  wordsPerMinute: number = 120
): CaptionSegment[] {
  if (!description || duration <= 0) return [];

  // Split description into sentences
  const sentences = description
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length === 0) return [];

  const captions: CaptionSegment[] = [];
  let currentTime = 0;

  sentences.forEach((sentence, index) => {
    // Estimate reading time based on word count
    const wordCount = sentence.split(/\s+/).length;
    const readingTimeInSeconds = (wordCount / wordsPerMinute) * 60;

    // Add some padding between sentences (0.5 seconds)
    const sentenceDuration = Math.max(readingTimeInSeconds, 1.5);
    const endTime = Math.min(currentTime + sentenceDuration, duration);

    captions.push({
      text:
        sentence +
        (sentence.endsWith(".") ||
        sentence.endsWith("!") ||
        sentence.endsWith("?")
          ? ""
          : "."),
      startTime: currentTime,
      endTime: endTime,
    });

    currentTime = endTime + 0.3; // Small gap between sentences
  });

  // Ensure we don't exceed the audio duration
  return captions.map((caption, index) => ({
    ...caption,
    endTime: Math.min(caption.endTime, duration),
  }));
}

export const useVoiceCaption = (): [
  VoiceCaptionState,
  VoiceCaptionControls
] => {
  const [state, setState] = useState<VoiceCaptionState>({
    captions: [],
    audioId: null,
    isLoading: false,
    error: null,
  });

  // Load captions for a specific audio file
  const loadCaptions = useCallback(
    (audioId: string, description: string, duration: number) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        audioId,
        captions: [],
      }));

      // Use async IIFE to handle the async operation
      (async () => {
        try {
          // First try to load SRT file
          let captions = await loadSRTFile(audioId);

          // If no SRT file found, generate from description as fallback
          if (captions.length === 0) {
            console.log(
              `No SRT file found for ${audioId}, generating from description`
            );
            captions = generateCaptionsFromDescription(description, duration);
          }

          setState((prev) => ({
            ...prev,
            captions,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          console.error(`Error loading captions for ${audioId}:`, error);

          // Fallback to description-based captions
          const fallbackCaptions = generateCaptionsFromDescription(
            description,
            duration
          );

          setState((prev) => ({
            ...prev,
            captions: fallbackCaptions,
            isLoading: false,
            error: `Could not load SRT file, using fallback captions`,
          }));
        }
      })();
    },
    []
  );

  // Clear all captions
  const clearCaptions = useCallback(() => {
    setState({
      captions: [],
      audioId: null,
      isLoading: false,
      error: null,
    });
  }, []);

  // Get current caption based on time - now pure function without state updates
  const getCurrentCaption = useCallback(
    (currentTime: number): string => {
      if (state.captions.length === 0) return "";

      const activeCaption = state.captions.find(
        (caption) =>
          currentTime >= caption.startTime && currentTime <= caption.endTime
      );

      return activeCaption?.text || "";
    },
    [state.captions]
  );

  // Memoize controls to prevent unnecessary re-renders
  const controls = useMemo<VoiceCaptionControls>(
    () => ({
      loadCaptions,
      clearCaptions,
      getCurrentCaption,
    }),
    [loadCaptions, clearCaptions, getCurrentCaption]
  );

  return [state, controls];
};

export default useVoiceCaption;
