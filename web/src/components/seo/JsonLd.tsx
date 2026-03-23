import { Helmet } from "react-helmet-async";
import { SITE_NAME, SITE_URL } from "../../config/site";

const DESCRIPTION =
  "Read-only web app to explore indexed TempoStreamChannel contracts on Tempo (payments-focused L1) for Machine Payments Protocol (MPP) Session flows: channel lifecycle, balances, and events for machine-to-machine and real-time payment scenarios.";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description: DESCRIPTION,
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
