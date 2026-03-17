export function ScoutIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="11" r="8" cy="11" stroke="#3F73BB" strokeWidth="2" strokeLinecap="round" />
      <path d="M17.5 17.5L22 22" stroke="#3F73BB" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 8V11L13 12" stroke="#80B343" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11" cy="11" r="2" fill="#80B343" />
    </svg>
  );
}
