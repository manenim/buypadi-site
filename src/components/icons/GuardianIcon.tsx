export function GuardianIcon({ className = "" }: { className?: string }) {
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
        d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
        stroke="#3F73BB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2" stroke="#80B343" strokeWidth="2" />
      <path
        d="M9 14C9 14 10 12 12 12C14 12 15 14 15 14"
        stroke="#80B343"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
