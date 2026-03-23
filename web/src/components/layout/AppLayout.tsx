import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Twitter } from "lucide-react";
import Header from "./Header";
import SeoRouteHead from "../seo/SeoRouteHead";
import JsonLd from "../seo/JsonLd";

const SOCIAL_X = "https://x.com/0xLucasStable";
const SOCIAL_GITHUB = "https://github.com/AKACoder/open-mpp";

export default function AppLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const year = new Date().getFullYear();

  return (
    <>
      <SeoRouteHead />
      <JsonLd />
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="border-t border-slate-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <a
              href={SOCIAL_X}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-600"
              aria-label={t("footer.linkX")}
            >
              <Twitter className="size-5" />
            </a>
            <a
              href={SOCIAL_GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:focus-visible:ring-zinc-600"
              aria-label={t("footer.linkGithub")}
            >
              <Github className="size-5" />
            </a>
          </div>
          <p className="text-center text-xs text-slate-500 dark:text-zinc-500">
            {t("footer.copyright", { year })}
          </p>
          <p className="text-center text-xs text-slate-400 dark:text-zinc-600">
            {t("footer.powered")}
          </p>
        </div>
      </footer>
    </>
  );
}
