export function SwiftPathIcon({ className = "" }: { className?: string }) {
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
        d="M5 17H19M5 17C3.89543 17 3 16.1046 3 15V9C3 7.89543 3.89543 7 5 7H13L17 10H20C21.1046 10 22 10.8954 22 12V15C22 16.1046 21.1046 17 20 17H19M5 17C5 18.1046 5.89543 19 7 19C8.10457 19 9 18.1046 9 17M19 17C19 18.1046 19.8954 19 21 19C22.1046 19 23 18.1046 23 17"
        stroke="#3F73BB"
        strokeWidth="2"
      />
      <path
        d="M7 12L9 14L13 10"
        stroke="#80B343"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
