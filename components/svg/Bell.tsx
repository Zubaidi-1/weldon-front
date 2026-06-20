type BellIconProps = {
  className?: string;
  size?: number;
};

export default function BellIcon({ className, size = 22 }: BellIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 17H9m10-2.5-1.4-1.4a2 2 0 0 1-.6-1.42V9a5 5 0 0 0-10 0v2.68a2 2 0 0 1-.6 1.42L5 14.5V16h14v-1.5ZM13.73 19a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
