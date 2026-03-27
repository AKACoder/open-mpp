import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function GuidePage() {
  const { t } = useTranslation();

  return (
    <article className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
        {t("guide.title")}
      </h1>
      <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-zinc-400">
        {t("guide.intro")}
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
          {t("guide.onchainTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          {t("guide.onchainLead")}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
          {t("guide.tempoTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          <a
            href="https://tempo.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            {t("guide.tempoP1a")}
          </a>{" "}
          {t("guide.tempoP1b")}{" "}
          <a
            href="https://mpp.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            {t("guide.tempoP2a")}
          </a>{" "}
          {t("guide.tempoP2b")}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          {t("guide.tempoP3")}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
          {t("guide.howTitle")}
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          <li>{t("guide.howOverview")}</li>
          <li>{t("guide.howChannels")}</li>
          <li>{t("guide.howAnalytics")}</li>
          <li>{t("guide.howSearch")}</li>
          <li>{t("guide.howDetail")}</li>
          <li>{t("guide.howActionable")}</li>
          <li>{t("guide.howFinalized")}</li>
        </ul>
        <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
          {t("guide.readOnly")}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
          {t("guide.settlementTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          {t("guide.settlementBody")}
        </p>
      </section>

      <p className="mt-10 text-sm text-slate-500 dark:text-zinc-500">
        <Link to="/channels" className="text-accent underline-offset-2 hover:underline">
          {t("guide.backChannels")}
        </Link>
        {" · "}
        <Link to="/" className="text-accent underline-offset-2 hover:underline">
          {t("nav.overview")}
        </Link>
      </p>
    </article>
  );
}
