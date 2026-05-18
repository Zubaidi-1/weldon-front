type DashboardCardProps = {
  title: string;
  value: string;
  tag: string;
  period: string;
  changeValue: string;
  changeText: string;
  buttonText: string;
};

export default function DashboardCard({
  title,
  value,
  tag,
  period,
  changeValue,
  changeText,
  buttonText,
}: DashboardCardProps) {
  return (
    <div className="w-112.5 min-h-80 rounded-2xl border border-[#0089D3]/25 bg-white p-6 shadow-[0_8px_30px_rgba(0,137,211,0.12)]">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#64748B]">{title}</p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#0F172A]">
            {value}
          </h1>
        </div>

        <div className="rounded-xl bg-[#E6F6FD] px-3 py-2 text-sm font-semibold text-[#0089D3]">
          {tag}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-10 rounded-2xl bg-[#F8FBFD] p-5">
        <p className="text-sm font-medium text-[#64748B]">{period}</p>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-[#16A34A]">
            {changeValue}
          </span>

          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
            ↑
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
          <span className="font-semibold text-[#16A34A]">{changeText}</span>
        </p>
      </div>

      {/* Action */}
      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0089D3] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0077B8]">
        {buttonText}
        <span>→</span>
      </button>
    </div>
  );
}
