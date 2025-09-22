import { useState, useRef, useEffect, useCallback } from "react";

export interface VoicePlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  isLoading: boolean;
  error: string | null;
}

export interface VoicePlayerControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  loadAudio: (audioUrl: string) => void;
}

export const useVoicePlayer = (): [VoicePlayerState, VoicePlayerControls] => {
  const [state, setState] = useState<VoicePlayerState>({
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
    isLoading: false,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update current time and progress
  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 0;
      const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

      setState((prev) => ({
        ...prev,
        currentTime,
        duration,
        progress,
      }));
    }
  }, []);

  // Start progress tracking
  const startProgressTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(updateProgress, 100);
  }, [updateProgress]);

  // Stop progress tracking
  const stopProgressTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Load audio file
  const loadAudio = useCallback(
    (audioUrl: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }

      const audio = new Audio();
      audio.preload = "metadata";
      audio.src = audioUrl;

      audio.addEventListener("loadedmetadata", () => {
        setState((prev) => ({
          ...prev,
          duration: audio.duration,
          isLoading: false,
        }));
      });

      audio.addEventListener("loadeddata", () => {
        setState((prev) => ({ ...prev, isLoading: false }));
      });

      audio.addEventListener("error", (e) => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Không thể tải file audio",
        }));
      });

      audio.addEventListener("ended", () => {
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentTime: 0,
          progress: 0,
        }));
        stopProgressTracking();
      });

      audio.addEventListener("play", () => {
        setState((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
        startProgressTracking();
      });

      audio.addEventListener("pause", () => {
        setState((prev) => ({ ...prev, isPlaying: false, isPaused: true }));
        stopProgressTracking();
      });

      audioRef.current = audio;
    },
    [startProgressTracking, stopProgressTracking]
  );

  // Play audio
  const play = useCallback(() => {
    if (audioRef.current && !state.isLoading) {
      audioRef.current.play().catch((error) => {
        setState((prev) => ({ ...prev, error: "Không thể phát audio" }));
      });
    }
  }, [state.isLoading]);

  // Pause audio
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  // Stop audio
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentTime: 0,
        progress: 0,
      }));
      stopProgressTracking();
    }
  }, [stopProgressTracking]);

  // Seek to specific time
  const seek = useCallback(
    (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        updateProgress();
      }
    },
    [updateProgress]
  );

  // Set volume
  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProgressTracking();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [stopProgressTracking]);

  const controls: VoicePlayerControls = {
    play,
    pause,
    stop,
    seek,
    setVolume,
    loadAudio,
  };

  return [state, controls];
};
