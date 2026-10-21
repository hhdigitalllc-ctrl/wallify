import type { MetadataRoute } from "next";
import { href, locales } from "@/i18n/config";
import { siteUrl } from "@/lib/billing";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/features", "/pricing", "/compare", "/faq", "/signup", "/login"];
  return pages.flatMap((p) =>
    locales.map((l) => ({
      url: `${siteUrl}${href(l, p)}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(locales.map((x) => [x, `${siteUrl}${href(x, p)}`])),
      },
    })),
  );
}
