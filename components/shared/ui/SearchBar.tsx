type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
};

export default function SearchInput({
  value,
  onChange,
  onClear,
}: SearchInputProps) {
  return (
    <div className="relative w-full max-w-md">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#0089D3]">
        S
      </span>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search for products..."
        className="w-full rounded-2xl border border-[#0089D3]/20 bg-white py-3 pl-12 pr-12 text-sm font-medium text-[#0F172A] shadow-[0_4px_20px_rgba(0,137,211,0.08)] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear product search"
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-sm font-bold text-[#64748B] transition hover:bg-[#E6F6FD] hover:text-[#0089D3]"
        >
          x
        </button>
      )}
    </div>
  );
}
