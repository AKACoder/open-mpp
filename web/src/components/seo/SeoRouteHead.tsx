import { useLocation } from "react-router-dom";
import { getSeoForPath } from "../../config/seo";
import SeoHead from "./SeoHead";

/** Sets default document meta from the current route (English SEO). */
export default function SeoRouteHead() {
  const { pathname } = useLocation();
  const seo = getSeoForPath(pathname);

  return <SeoHead title={seo.title} description={seo.description} path={pathname} />;
}
