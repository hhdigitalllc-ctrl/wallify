"use client";

import { useEffect, useRef, useState } from "react";
import { VOICE_MAX_SECONDS } from "@/lib/voice";

type Labels = {
  record: string;
  recording: string;
  stop: string;
  remove: string;
  denied: string;
  hint: string;
};

type Props = { labels: Labels; onChange: (hasAudio: boolean) => void };

const TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Records a short clip in the browser and hands it to the surrounding <form> as a file input,
// so it is submitted with the rest of the fields.
export function VoiceRecorder({ labels, onChange }: Props) {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<"idle" | "recording" | "done">("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  const fileInput = useRef<HTMLInputElement>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsed = useRef(0);

  useEffect(() => {
    setSupported(typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices?.getUserMedia);
    return () => {
      if (timer.current) clearInterval(timer.current);
      stream.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function setFile(file: File | null) {
    const input = fileInput.current;
    if (!input) return;
    const data = new DataTransfer();
    if (file) data.items.add(file);
    input.files = data.files;
  }

  async function start() {
    setError("");
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = media;
      const mimeType = TYPES.find((t) => MediaRecorder.isTypeSupported(t));
      const rec = new MediaRecorder(media, { ...(mimeType ? { mimeType } : {}), audioBitsPerSecond: 32000 });
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = () => {
        media.getTracks().forEach((t) => t.stop());
        const type = (rec.mimeType || "audio/webm").split(";")[0];
        const blob = new Blob(chunks, { type });
        const ext = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm";
        setFile(new File([blob], `voice.${ext}`, { type }));
        setUrl(URL.createObjectURL(blob));
        setSeconds(Math.max(1, elapsed.current));
        setState("done");
        onChange(true);
      };
      recorder.current = rec;
      elapsed.current = 0;
      setSeconds(0);
      rec.start();
      setState("recording");
      timer.current = setInterval(() => {
        elapsed.current += 1;
        setSeconds(elapsed.current);
        if (elapsed.current >= VOICE_MAX_SECONDS) stop();
      }, 1000);
    } catch {
      setError(labels.denied);
    }
  }

  function stop() {
    if (timer.current) clearInterval(timer.current);
    if (recorder.current?.state === "recording") recorder.current.stop();
  }

  function remove() {
    if (url) URL.revokeObjectURL(url);
    setUrl("");
    setFile(null);
    setSeconds(0);
    setState("idle");
    onChange(false);
  }

  if (!supported) return null;

  return (
    <div className="rounded-xl border border-dashed border-line bg-surface-2/60 p-4">
      <input ref={fileInput} type="file" name="audio" className="hidden" tabIndex={-1} aria-hidden="true" />
      <input type="hidden" name="audio_seconds" value={state === "done" ? seconds : ""} />

      {state === "idle" && (
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={start} className="btn-ghost btn-sm">
            <span aria-hidden="true">🎙</span> {labels.record}
          </button>
          <span className="text-xs text-muted">{labels.hint}</span>
        </div>
      )}

      {state === "recording" && (
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-danger" aria-hidden="true" />
          <span className="text-sm font-medium tabular-nums" dir="ltr">
            {clock(seconds)} / {clock(VOICE_MAX_SECONDS)}
          </span>
          <span className="sr-only">{labels.recording}</span>
          <button type="button" onClick={stop} className="btn-primary btn-sm ms-auto">
            {labels.stop}
          </button>
        </div>
      )}

      {state === "done" && (
        <div className="flex flex-wrap items-center gap-3">
          <audio src={url} controls className="h-9 min-w-0 flex-1" />
          <button type="button" onClick={remove} className="btn-ghost btn-sm">
            {labels.remove}
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
