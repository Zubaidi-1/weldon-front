type ProductDashboardCardProps = {
  title: string;
  value: string | number;
  description: string;
  badgeText: string;
  footerText?: string;
  buttonText?: string;
  onClick?: () => void;
  variant?: "blue" | "green" | "red" | "yellow";
};

const variantStyles = {
  blue: {
    color: "#0089D3",
    bg: "#E6F6FD",
    valueColor: "#0F172A",
  },
  green: {
    color: "#16A34A",
    bg: "#DCFCE7",
    valueColor: "#16A34A",
  },
  red: {
    color: "#DC2626",
    bg: "#FEE2E2",
    valueColor: "#DC2626",
  },
  yellow: {
    color: "#D97706",
    bg: "#FEF3C7",
    valueColor: "#D97706",
  },
};

export default function ProductDashboardCard({
  title,
  value,
  description,
  badgeText,
  footerText,
  buttonText,
  onClick,
  variant = "blue",
}: ProductDashboardCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="flex min-h-56 w-full flex-col justify-between rounded-2xl border border-[#0089D3]/25 bg-white p-6 shadow-[0_8px_30px_rgba(0,137,211,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,137,211,0.16)]">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#475569]">{title}</p>

          <h1
            className="mt-3 text-4xl font-bold tracking-tight"
            style={{ color: styles.valueColor }}
          >
            {value}
          </h1>
        </div>

        <div
          className="rounded-full px-3 py-1 text-xs font-bold uppercase"
          style={{
            color: styles.color,
            backgroundColor: styles.bg,
          }}
        >
          {badgeText}
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-[#F8FBFD] p-5">
        <p className="text-sm leading-6 text-[#64748B]">{description}</p>
      </div>

      {footerText && (
        <div className="mt-5 border-t border-[#E2E8F0] pt-4 text-xs font-semibold uppercase text-[#94A3B8]">
          {footerText}
        </div>
      )}

      {buttonText && (
        <button
          type="button"
          onClick={onClick}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0089D3] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0077B8]"
        >
          {buttonText}
          <span aria-hidden="true">-&gt;</span>
        </button>
      )}
    </div>
  );
}
