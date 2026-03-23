import { Helmet } from "react-helmet-async";
import {
  DEFAULT_KEYWORDS,
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_URL,
} from "../../config/site";

interface Props {
  title: string;
  description: string;
  /** Pathname only, e.g. `/guide` */
  path: string;
  keywords?: string;
  /** If false, omit duplicate brand suffix when title already includes site name */
  appendSiteSuffix?: boolean;
}

function normalizePath(path: string) {
  if (!path || path === "") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export default function SeoHead({
  title,
  description,
  path,
  keywords = DEFAULT_KEYWORDS,
  appendSiteSuffix = true,
}: Props) {
  const pathname = normalizePath(path);
  const canonical = `${SITE_URL}${pathname === "/" ? "" : pathname}`;
  const imageUrl = `${SITE_URL}${OG_IMAGE_PATH}`;
  const fullTitle =
    appendSiteSuffix && !title.includes(SITE_NAME)
      ? `${title} | ${SITE_NAME}`
      : title;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={`${SITE_NAME} preview`} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
