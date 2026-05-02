import MobileLink from "./Link";

type Props = {
  onClose?: () => void;
  isClosing?: boolean;
};

export default function MobileSideBar({ onClose, isClosing }: Props) {
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
          <span className="text-xl font-semibold">Menu</span>
          <button onClick={onClose} className="text-2xl">
            ✕
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col">
          <MobileLink href="/" title="Home" />
          <MobileLink href="/new-arrivals" title="New Arrivals" />
          <MobileLink href="/bundles" title="Bundles & Value Sets" />
          <MobileLink href="/shop" title="Shop" />
          <MobileLink href="/equipment" title="Equipment" />
          <MobileLink href="/contact" title="Contact" />
          <MobileLink href="/careers" title="Careers" />
          <MobileLink href="/blogs" title="Blogs" />
        </nav>
      </div>
    </div>
  );
}
