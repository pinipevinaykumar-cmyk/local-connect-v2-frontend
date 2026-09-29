export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Pin body */}
      <path
        d="M20 2C10.6 2 3 9.6 3 18C3 27.8 11.5 36.5 17.8 42.2C19 43.3 21 43.3 22.2 42.2C28.5 36.5 37 27.8 37 18C37 9.6 29.4 2 20 2Z"
        fill="#1E7B3B"
      />
      {/* Outer discovery ring */}
      <circle cx="20" cy="18" r="9.5" stroke="white" strokeWidth="1" strokeOpacity="0.22" />
      {/* Middle ring */}
      <circle cx="20" cy="18" r="6.5" fill="white" fillOpacity="0.15" />
      {/* Inner ring */}
      <circle cx="20" cy="18" r="4" fill="white" fillOpacity="0.32" />
      {/* Center amber dot — the "you are here" point */}
      <circle cx="20" cy="18" r="2.2" fill="#F59E0B" />
    </svg>
  );
}
