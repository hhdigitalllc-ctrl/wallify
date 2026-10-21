import Link from "next/link";

const BUBBLE =
  "M18 4h28a14 14 0 0 1 14 14v18a14 14 0 0 1-14 14H31L17.5 60.5a1.6 1.6 0 0 1-2.7-1.2V50H18A14 14 0 0 1 4 36V18A14 14 0 0 1 18 4z";
const STAR =
  "32.00,14.00 35.47,22.73 44.84,23.33 37.61,29.32 39.94,38.42 32.00,33.40 24.06,38.42 26.39,29.32 19.16,23.33 28.53,22.73";

export function LogoMark({ size = 32, tone = "ink" }: { size?: number; tone?: "ink" | "paper" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d={BUBBLE} fill={tone === "paper" ? "#F6F6F0" : "#111111"} />
      <polygon points={STAR} fill={tone === "paper" ? "#111111" : "#F6F6F0"} />
    </svg>
  );
}

export function Logo({ href = "/", size = 30 }: { href?: string; size?: number }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label="Wallify home">
      <LogoMark size={size} />
      <span className="display text-[22px] leading-none tracking-[-0.05em]">wallify</span>
    </Link>
  );
}
