import MobileLink from "./Link";
import { useLanguage } from "@/Context/language/languageContext";

type Props = {
  onClose?: () => void;
  isClosing?: boolean;
};

export default function MobileSideBar({ onClose, isClosing }: Props) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 animate-fade-right">
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`absolute left-0 top-0  h-full w-72 bg-white shadow-xl px-6 py-6 flex flex-col transition-transform duration-300 ${
          isClosing ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-xl font-semibold">{t("nav.menu")}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl"
            aria-label={t("nav.close")}
          >
            ✕
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col">
          <MobileLink href="/" title={t("nav.home")} />
          <MobileLink href="/store" title={t("nav.store")} />
          <MobileLink href="/contact" title={t("nav.contact")} />
        </nav>
      </div>
    </div>
  );
}
