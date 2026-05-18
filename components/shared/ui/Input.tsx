import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  placeholder: string;
  title: string;
  type?: string;
  register?: UseFormRegisterReturn;
  disabled?: boolean;
  step?: string;
};

export default function Input({
  placeholder,
  title,
  type = "text",
  register,
  disabled,
  step,
}: Props) {
  return (
    <div className="flex flex-col ">
      <label className="mb-2 block text-sm font-medium text-[#334155]">
        {title}
      </label>
      <input
        step={step ?? undefined}
        className="w-full rounded-xl  border border-[#CBD5E1] px-4 py-3 text-sm outline-none transition focus:border-[#0089D3] focus:ring-4 focus:ring-[#0089D3]/10 text-gray-700"
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        {...register}
      />
    </div>
  );
}
