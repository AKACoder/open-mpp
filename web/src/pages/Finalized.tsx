import { useTranslation } from "react-i18next";

export default function Finalized() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("pages.finalized.title")}
      </h1>
    </div>
  );
}
