/**
 * Generates web/public/sitemap.xml for static marketing routes.
 * Run: npm run sitemap
 * Optional: VITE_SITE_URL=https://your-domain npm run sitemap
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const site = (process.env.VITE_SITE_URL ?? "https://open-mpp.akacoder.net").replace(
  /\/$/,
  "",
);

const paths = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/channels", priority: "0.95", changefreq: "weekly" },
  { loc: "/analytics", priority: "0.9", changefreq: "weekly" },
  { loc: "/guide", priority: "0.9", changefreq: "monthly" },
  { loc: "/actionable", priority: "0.8", changefreq: "weekly" },
  { loc: "/finalized", priority: "0.8", changefreq: "weekly" },
];

const urlEntries = paths
  .map(
    (p) => `  <url>
    <loc>${site}${p.loc === "/" ? "" : p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

const out = join(__dirname, "..", "public", "sitemap.xml");
writeFileSync(out, xml, "utf8");
console.log(`Wrote ${out} (${paths.length} URLs, site=${site})`);
