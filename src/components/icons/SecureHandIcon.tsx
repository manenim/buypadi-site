export function SecureHandIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2 18H22M2 18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18M2 18V11C2 9.89543 2.89543 9 4 9H20C21.1046 9 22 9.89543 22 11V18"
        stroke="#3F73BB"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="12"
        width="6"
        height="5"
        rx="1"
        fill="#80B343"
        opacity="0.2"
        stroke="#80B343"
        strokeWidth="1.5"
      />
      <path d="M17 11V12" stroke="#80B343" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
