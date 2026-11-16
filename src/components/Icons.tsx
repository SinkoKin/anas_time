type IconProps = {
  className?: string;
};

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function ArrowUp({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 14V2M3 7l5-5 5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowDown({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2v12M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowLeft({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M17 10H3M8 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10h14M12 5l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function Close({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function Menu({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 8h18M3 16h18" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Instagram({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function WhatsApp({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.2 11.7a8.1 8.1 0 0 1-11.9 7.1L3.6 20l1.3-4.5a8.1 8.1 0 1 1 15.3-3.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 7.6c.3-.6.6-.6 1-.6h.4c.2 0 .4 0 .5.5l.8 1.8c.1.2 0 .4-.1.6l-.6.7c-.1.2-.2.3 0 .6.5.8 1.3 1.7 2.4 2.3.3.2.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.7.9c.3.2.4.3.4.5v.4c0 .5-.4 1.2-.9 1.5-.5.3-1.1.4-1.8.2-1.2-.3-2.9-1-4.4-2.4-1.1-1.1-1.9-2.4-2.2-3.2-.3-.9-.1-1.7.3-2.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Check({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10.5 8 14.5 16 5.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Copy({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="7" y="7" width="9" height="9" stroke="currentColor" strokeWidth="1.3" />
      <path d="M13 7V4H4v9h3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function Loader({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" opacity=".25" />
      <path d="M10 3a7 7 0 0 1 7 7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
