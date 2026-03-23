import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function AddressView() {
  const { t } = useTranslation();
  const { type, address } = useParams<{ type: string; address: string }>();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("pages.addressView.title")}
      </h1>
      <p className="mt-2 font-mono text-sm text-slate-500 dark:text-zinc-500">
        {type} / {address}
      </p>
    </div>
  );
}
