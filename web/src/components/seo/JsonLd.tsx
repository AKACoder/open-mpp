import { Helmet } from "react-helmet-async";
import { SITE_NAME, SITE_URL } from "../../config/site";

const DESCRIPTION =
  "Read-only explorer for on-chain MPP Session funding and TempoStreamChannel lifecycle on Tempo: escrow, settlement, finality, indexer sync, and analytics—no wallet, no off-chain HTTP payment UI.";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description: DESCRIPTION,
    inLanguage: ["en", "zh-Hans"],
    url: SITE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <Helmet>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Helmet>
  );
}
