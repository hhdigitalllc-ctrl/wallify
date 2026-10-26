"use client";

import { useRef, useState } from "react";

type Props = {
  src: string;
  seconds: number;
  play: string;
  pause: string;
  /** For the dark widget theme */
  dark?: boolean;
};

const format = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function VoicePlayer({ src, seconds, play, pause, dark = false }: Props) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  function toggle() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  }

  const track = dark ? "bg-white/15" : "bg-[#e4e4db]";
  const fill = dark ? "bg-white" : "bg-[#111111]";
  const button = dark ? "bg-white text-[#111111]" : "bg-[#111111] text-white";
  const time = dark ? "text-white/60" : "text-[#6f6f68]";

  return (
    <div className="mt-3 flex items-center gap-3" dir="ltr">
      <audio
        ref={audio}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setProgress(el.duration ? el.currentTime / el.duration : 0);
        }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? pause : play}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:opacity-85 ${button}`}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <rect x="1.5" y="1" width="3" height="10" rx="1" />
            <rect x="7.5" y="1" width="3" height="10" rx="1" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <path d="M3 1.2v9.6a.6.6 0 0 0 .9.5l7.7-4.8a.6.6 0 0 0 0-1L3.9.7A.6.6 0 0 0 3 1.2z" />
          </svg>
        )}
      </button>
      <div className={`h-1.5 flex-1 overflow-hidden rounded-full ${track}`}>
        <div className={`h-full rounded-full ${fill}`} style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
      <span className={`w-9 text-end text-xs tabular-nums ${time}`}>{format(seconds)}</span>
    </div>
  );
}
