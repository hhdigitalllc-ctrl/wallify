import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Public routes (/collect, /widget, /embed.js) skip auth entirely.
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
