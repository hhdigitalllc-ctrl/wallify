import { createAdminClient } from "@/lib/supabase/admin";

export const VOICE_BUCKET = "voices";

// Containers browsers record to. The magic bytes are checked so a renamed file can't slip through.
const FORMATS = [
  { type: "audio/webm", ext: "webm", test: (b: Uint8Array) => b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3 },
  { type: "audio/ogg", ext: "ogg", test: (b: Uint8Array) => b[0] === 0x4f && b[1] === 0x67 && b[2] === 0x67 && b[3] === 0x53 },
  { type: "audio/mp4", ext: "m4a", test: (b: Uint8Array) => b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70 },
] as const;

export function detectAudioFormat(bytes: Uint8Array) {
  return FORMATS.find((f) => f.test(bytes)) ?? null;
}

// Private bucket: playback goes through short-lived signed URLs, created only for testimonials
// the caller is already allowed to see (approved ones on the public wall, all of them for the owner).
export async function signAudioUrls(paths: (string | null)[]): Promise<Map<string, string>> {
  const clean = [...new Set(paths.filter((p): p is string => !!p))];
  const urls = new Map<string, string>();
  if (clean.length === 0) return urls;

  const { data } = await createAdminClient().storage.from(VOICE_BUCKET).createSignedUrls(clean, 60 * 60);
  for (const item of data ?? []) {
    if (item.path && item.signedUrl) urls.set(item.path, item.signedUrl);
  }
  return urls;
}

export async function removeAudio(paths: (string | null)[]) {
  const clean = paths.filter((p): p is string => !!p);
  if (clean.length === 0) return;
  await createAdminClient().storage.from(VOICE_BUCKET).remove(clean);
}
