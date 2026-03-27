import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
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
  /** When omitted, uses `DEFAULT_KEYWORDS` (en) or i18n `geo.keywords` (zh). */
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
  keywords: keywordsProp,
  appendSiteSuffix = true,
}: Props) {
  const { i18n, t } = useTranslation();
  const isZh = i18n.language.startsWith("zh");
  const htmlLang = isZh ? "zh-Hans" : "en";
  const ogLocale = isZh ? "zh_CN" : "en_US";
  const ogLocaleAlternate = isZh ? "en_US" : "zh_CN";
  const keywords =
    keywordsProp ?? (isZh ? t("geo.keywords") : DEFAULT_KEYWORDS);

  const pathname = normalizePath(path);
  const canonical = `${SITE_URL}${pathname === "/" ? "" : pathname}`;
  const imageUrl = `${SITE_URL}${OG_IMAGE_PATH}`;
  const fullTitle =
    appendSiteSuffix && !title.includes(SITE_NAME)
      ? `${title} | ${SITE_NAME}`
      : title;

  return (
    <Helmet>
      <html lang={htmlLang} />
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
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={ogLocaleAlternate} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
