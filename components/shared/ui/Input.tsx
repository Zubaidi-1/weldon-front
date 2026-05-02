import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  placeholder: string;
  title: string;
  type?: string;
  register?: UseFormRegisterReturn;
  disabled: boolean;
};

export default function Input({
  placeholder,
  title,
  type = "text",
  register,
  disabled,
}: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{title}</label>
      <input
        className="border border-gray-200 focus:border-[#0089d3] focus:ring-2 focus:ring-[#0089d3]/20 outline-none transition-all px-3 py-2 rounded-lg text-gray-800 placeholder-gray-400"
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        {...register}
      />
    </div>
  );
}
