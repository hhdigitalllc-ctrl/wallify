import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Wallify: turn happy customers into your best marketing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BUBBLE =
  "M18 4h28a14 14 0 0 1 14 14v18a14 14 0 0 1-14 14H31L17.5 60.5a1.6 1.6 0 0 1-2.7-1.2V50H18A14 14 0 0 1 4 36V18A14 14 0 0 1 18 4z";
const STAR =
  "32,14 35.47,22.73 44.84,23.33 37.61,29.32 39.94,38.42 32,33.4 24.06,38.42 26.39,29.32 19.16,23.33 28.53,22.73";

const INK = "#111111";
const PAPER = "#F6F6F0";
const SAND = "#EFEFE6";
const LINE = "#E4E4DB";
const MUTE = "#6F6F68";
const STAR_COLOR = "#F5A524";

function Mark({ size: s, bubble, star }: { size: number; bubble: string; star: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 64 64">
      <path d={BUBBLE} fill={bubble} />
      <polygon points={STAR} fill={star} />
    </svg>
  );
}

function Stars({ n, dim }: { n: number; dim: string }) {
  const pts = "12,2 14.9,8.9 22,9.4 16.6,14 18.3,21 12,17.3 5.7,21 7.4,14 2,9.4 9.1,8.9";
  return (
    <div style={{ display: "flex" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="26" height="26" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
          <polygon points={pts} fill={i < n ? STAR_COLOR : dim} />
        </svg>
      ))}
    </div>
  );
}

// Placeholder lines instead of invented quotes
function Lines({ color, widths }: { color: string; widths: number[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: 14 }}>
      {widths.map((w, i) => (
        <div key={i} style={{ width: `${w}%`, height: 12, borderRadius: 6, background: color, marginTop: i ? 10 : 0 }} />
      ))}
    </div>
  );
}

function Card({ dark, n, widths }: { dark?: boolean; n: number; widths: number[] }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 24,
        borderRadius: 24,
        marginTop: 16,
        background: dark ? INK : "#FFFFFF",
        border: `2px solid ${dark ? INK : LINE}`,
      }}
    >
      <Stars n={n} dim={dark ? "#3a3a36" : LINE} />
      <Lines color={dark ? "#3a3a36" : LINE} widths={widths} />
      <div style={{ display: "flex", alignItems: "center", marginTop: 18 }}>
        <div style={{ width: 34, height: 34, borderRadius: 17, background: dark ? PAPER : INK }} />
        <div style={{ width: 120, height: 12, borderRadius: 6, marginLeft: 12, background: dark ? "#3a3a36" : LINE }} />
      </div>
    </div>
  );
}

export default async function Image() {
  const [semibold, regular] = await Promise.all([
    readFile(join(process.cwd(), "src/app/_fonts/Geist-SemiBold.ttf")),
    readFile(join(process.cwd(), "src/app/_fonts/Geist-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          padding: 64,
          fontFamily: "Geist",
          color: INK,
        }}
      >
        {/* Left: brand + headline */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 650 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Mark size={56} bubble={INK} star={PAPER} />
            <div style={{ display: "flex", fontSize: 44, fontWeight: 600, letterSpacing: -2, marginLeft: 16 }}>wallify</div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 64,
              fontWeight: 600,
              letterSpacing: -3,
              lineHeight: 1.08,
            }}
          >
            <div style={{ display: "flex" }}>Turn happy customers</div>
            <div style={{ display: "flex" }}>into your</div>
            <div style={{ display: "flex", color: MUTE }}>best marketing.</div>
          </div>

          <div style={{ display: "flex", fontSize: 28, color: MUTE }}>
            Collect testimonials. Show them anywhere.
          </div>
        </div>

        {/* Right: stylised dashboard cards */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 48, justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "8px 22px 24px",
              borderRadius: 36,
              background: SAND,
            }}
          >
            <Card n={5} widths={[100, 82]} />
            <Card dark n={5} widths={[100, 64]} />
            <Card n={4} widths={[92, 70]} />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
