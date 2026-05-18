import { useEffect, useRef, useState } from "react";

type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};

type CustomSelectProps<T extends string = string> = {
  label?: string;
  placeholder?: string;
  options: SelectOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  className?: string;
};
export default function CustomSelect<T extends string = string>({
  label,
  placeholder = "Select option",
  options,
  value,
  onChange,
  className = "",
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-[#334155]">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`group flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left text-gray-700 transition-all duration-200 ${
          open
            ? "border-[#0089D3] ring-4 ring-[#0089D3]/10"
            : "border-[#CBD5E1] hover:border-[#0089D3] hover:bg-[#F8FCFF]"
        }`}
      >
        <span
          className={`text-sm ${
            selectedOption ? "text-[#0F172A]" : "text-[#94A3B8]"
          }`}
        >
          {selectedOption?.label || placeholder}
        </span>

        <span
          className={`text-sm transition-all duration-200 ${
            open
              ? "rotate-180 text-[#0089D3]"
              : "text-[#64748B] group-hover:text-[#0089D3]"
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full animate-fade-in-down overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] animate-duration-200">
          {options.map((option) => {
            const isSelected = value === option.value;

            return (
              <button
                type="button"
                key={option.value}
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0089D3";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isSelected
                    ? "#E6F6FD"
                    : "#ffffff";

                  e.currentTarget.style.color = isSelected
                    ? "#0089D3"
                    : "#334155";
                }}
                className={`block w-full cursor-pointer px-4 py-3 text-left text-sm transition-all duration-150 ${
                  isSelected
                    ? "bg-[#E6F6FD] font-medium text-[#0089D3]"
                    : "bg-white text-[#334155]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
