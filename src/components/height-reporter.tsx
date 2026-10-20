"use client";

import { useEffect } from "react";

// Tells the embed.js loader on the host page how tall the wall is.
export function HeightReporter({ spaceId }: { spaceId: string }) {
  useEffect(() => {
    if (window.parent === window) return;
    const send = () =>
      window.parent.postMessage(
        { wallify: "height", spaceId, height: document.documentElement.scrollHeight },
        "*",
      );
    const observer = new ResizeObserver(send);
    observer.observe(document.body);
    send();
    return () => observer.disconnect();
  }, [spaceId]);

  return null;
}
