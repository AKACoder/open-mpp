import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { ChevronRight } from "lucide-react";

const LINK =
  "font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50";

function FaqItem({
  question,
  children,
  defaultOpen,
}: {
  question: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group rounded-xl border border-slate-200 bg-white open:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 [&_summary::-webkit-details-marker]:hidden"
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="flex cursor-pointer list-none items-start gap-2 px-4 py-3.5 text-left text-sm font-medium text-slate-900 dark:text-zinc-100">
        <ChevronRight
          className="mt-0.5 size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90 dark:text-zinc-500"
          aria-hidden
        />
        <span>{question}</span>
      </summary>
      <div className="border-t border-slate-100 px-4 pb-4 pt-3 text-sm leading-relaxed text-slate-600 dark:border-zinc-800/80 dark:text-zinc-400">
        {children}
      </div>
    </details>
  );
}

export default function GuidePage() {
  const { t } = useTranslation();

  return (
    <article className="mx-auto max-w-prose">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
        {t("guide.title")}
      </h1>
      <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-zinc-400">
        {t("guide.intro")}
      </p>

      <p
        id="faq-start"
        className="mt-8 text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500"
      >
        {t("guide.faq.kicker")}
      </p>

      <section
        className="mt-4 space-y-3 scroll-mt-20"
        aria-labelledby="faq-boundaries-heading"
      >
        <h2
          id="faq-boundaries-heading"
          className="text-base font-semibold text-slate-900 dark:text-zinc-100"
        >
          {t("guide.faq.groupBoundaries")}
        </h2>
        <div className="space-y-3">
          <FaqItem question={t("guide.faq.qScope")} defaultOpen>
            <p>{t("guide.onchainLead")}</p>
          </FaqItem>
        </div>
      </section>

      <section
        className="mt-10 space-y-3 scroll-mt-20"
        aria-labelledby="faq-protocol-heading"
      >
        <h2
          id="faq-protocol-heading"
          className="text-base font-semibold text-slate-900 dark:text-zinc-100"
        >
          {t("guide.faq.groupProtocol")}
        </h2>
        <div className="space-y-3">
          <FaqItem question={t("guide.faq.qTempoMpp")}>
            <p>
              <Trans
                i18nKey="guide.faq.aTempoMpp"
                components={{
                  tempo: (
                    <a
                      href="https://tempo.xyz/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK}
                    />
                  ),
                  mpp: (
                    <a
                      href="https://mpp.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK}
                    />
                  ),
                }}
              />
            </p>
          </FaqItem>
          <FaqItem question={t("guide.faq.qChannelModel")}>
            <p>{t("guide.tempoP3")}</p>
          </FaqItem>
        </div>
      </section>

      <section
        className="mt-10 space-y-3 scroll-mt-20"
        aria-labelledby="faq-using-heading"
      >
        <h2
          id="faq-using-heading"
          className="text-base font-semibold text-slate-900 dark:text-zinc-100"
        >
          {t("guide.faq.groupUsing")}
        </h2>
        <div className="space-y-3">
          <FaqItem question={t("guide.faq.qOverview")}>
            <p>{t("guide.howOverview")}</p>
          </FaqItem>
          <FaqItem question={t("guide.faq.qChannels")}>
            <p>{t("guide.howChannels")}</p>
          </FaqItem>
          <FaqItem question={t("guide.faq.qAnalytics")}>
            <p>{t("guide.howAnalytics")}</p>
          </FaqItem>
          <FaqItem question={t("guide.faq.qSearch")}>
            <p>{t("guide.howSearch")}</p>
          </FaqItem>
          <FaqItem question={t("guide.faq.qDetail")}>
            <p>{t("guide.howDetail")}</p>
          </FaqItem>
          <FaqItem question={t("guide.faq.qActionable")}>
            <p>{t("guide.howActionable")}</p>
          </FaqItem>
          <FaqItem question={t("guide.faq.qFinalized")}>
            <p>{t("guide.howFinalized")}</p>
          </FaqItem>
        </div>
      </section>

      <section
        className="mt-10 space-y-3 scroll-mt-20"
        aria-labelledby="faq-other-heading"
      >
        <h2
          id="faq-other-heading"
          className="text-base font-semibold text-slate-900 dark:text-zinc-100"
        >
          {t("guide.faq.groupOther")}
        </h2>
        <div className="space-y-3">
          <FaqItem question={t("guide.faq.qReadOnly")}>
            <p>{t("guide.readOnly")}</p>
          </FaqItem>
          <FaqItem question={t("guide.faq.qSettlement")}>
            <p>{t("guide.settlementBody")}</p>
          </FaqItem>
        </div>
      </section>

      <p className="mt-10 text-sm text-slate-500 dark:text-zinc-500">
        <Link to="/channels" className={LINK}>
          {t("guide.backChannels")}
        </Link>
        {" · "}
        <Link to="/" className={LINK}>
          {t("nav.overview")}
        </Link>
      </p>
    </article>
  );
}
