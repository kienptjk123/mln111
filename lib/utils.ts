import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Caption utilities and types
export interface CaptionSegment {
  text: string;
  startTime: number;
  endTime: number;
}

function parseTimestampToSeconds(ts: string): number {
  const parts = ts.trim().split(":");
  let hours = 0,
    minutes = 0,
    seconds = 0;
  if (parts.length === 3) {
    hours = parseInt(parts[0], 10) || 0;
    minutes = parseInt(parts[1], 10) || 0;
    seconds = parseFloat(parts[2].replace(",", ".")) || 0;
  } else if (parts.length === 2) {
    minutes = parseInt(parts[0], 10) || 0;
    seconds = parseFloat(parts[1].replace(",", ".")) || 0;
  } else {
    seconds = parseFloat(ts.replace(",", ".")) || 0;
  }
  return hours * 3600 + minutes * 60 + seconds;
}

export function parseVTT(vttText: string): CaptionSegment[] {
  const lines = vttText.replace(/\r\n/g, "\n").split("\n");
  const segments: CaptionSegment[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.includes("-->") && /\d\d:\d\d/.test(line)) {
      const [start, end] = line.split("-->").map((s) => s.trim().split(" ")[0]);
      let textLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].trim()) {
        textLines.push(lines[j].trim());
        j++;
      }
      segments.push({
        text: textLines.join(" "),
        startTime: parseTimestampToSeconds(start),
        endTime: parseTimestampToSeconds(end),
      });
      i = j;
    }
  }
  return segments;
}

export function parseSRT(srtText: string): CaptionSegment[] {
  const blocks = srtText.replace(/\r\n/g, "\n").split(/\n\n+/);
  const segments: CaptionSegment[] = [];
  for (const block of blocks) {
    const lines = block.split("\n").filter(Boolean);
    if (lines.length < 2) continue;
    const timeLine = lines[0].includes("-->") ? lines[0] : lines[1];
    if (!timeLine || !timeLine.includes("-->")) continue;
    const [start, end] = timeLine.split("-->").map((s) => s.trim());
    const text = lines
      .slice(lines[0].includes("-->") ? 1 : 2)
      .join(" ")
      .trim();
    segments.push({
      text,
      startTime: parseTimestampToSeconds(start),
      endTime: parseTimestampToSeconds(end),
    });
  }
  return segments;
}

export async function fetchCaptionsForAudio(
  audioUrl: string
): Promise<CaptionSegment[]> {
  const tryUrls: string[] = [];
  if (audioUrl.toLowerCase().endsWith(".mp3")) {
    tryUrls.push(audioUrl.slice(0, -4) + ".vtt");
    tryUrls.push(audioUrl.slice(0, -4) + ".VTT");
    tryUrls.push(audioUrl.slice(0, -4) + ".srt");
    tryUrls.push(audioUrl.slice(0, -4) + ".SRT");
  } else {
    tryUrls.push(audioUrl + ".vtt");
    tryUrls.push(audioUrl + ".srt");
  }

  for (const url of tryUrls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const text = await res.text();
      if (url.toLowerCase().endsWith(".vtt")) {
        const segs = parseVTT(text);
        if (segs.length) return segs;
      } else {
        const segs = parseSRT(text);
        if (segs.length) return segs;
      }
    } catch (e) {
      // ignore and try next
    }
  }
  return [];
}
