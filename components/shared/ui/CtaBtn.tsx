"use client";

import React from "react";

type ButtonProps = {
  isLoading?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`mt-2 bg-[#0089d3] hover:bg-[#007bbd] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200 text-white py-2.5 sm:py-3 rounded-lg font-medium shadow-sm hover:shadow-md text-sm sm:text-base ${className}`}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};
