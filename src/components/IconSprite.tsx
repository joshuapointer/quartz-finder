export default function IconSprite() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ppGold" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#F4D89A" />
          <stop offset="55%" stopColor="#E8B85A" />
          <stop offset="100%" stopColor="#B8852E" />
        </linearGradient>

        <symbol id="pp" viewBox="0 0 42 40">
          <rect
            x="2.6"
            y="3"
            width="9"
            height="34"
            rx="3.6"
            fill="none"
            stroke="url(#ppGold)"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <circle cx="26" cy="20" r="14.5" fill="none" stroke="url(#ppGold)" strokeWidth="2.4" />
          <circle cx="26" cy="20" r="4.6" fill="url(#ppGold)" />
        </symbol>

        <symbol id="i-search" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </symbol>
        <symbol id="i-bag" viewBox="0 0 24 24">
          <path d="M5 8h14l-1 12H6Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </symbol>
        <symbol id="i-user" viewBox="0 0 24 24">
          <circle cx="12" cy="9" r="4" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </symbol>
        <symbol id="i-heart" viewBox="0 0 24 24">
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </symbol>
        <symbol id="i-truck" viewBox="0 0 24 24">
          <path d="M3 7h11v9H3z" />
          <path d="M14 10h4l3 3v3h-7" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </symbol>
        <symbol id="i-return" viewBox="0 0 24 24">
          <path d="M9 14H4v-5" />
          <path d="M4 14a8 8 0 1 0 2-8" />
        </symbol>
        <symbol id="i-shield" viewBox="0 0 24 24">
          <path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6z" />
          <path d="m9 12 2 2 4-4" />
        </symbol>
        <symbol id="i-share" viewBox="0 0 24 24">
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <path d="m8 11 8-4M8 13l8 4" />
        </symbol>
        <symbol id="i-menu" viewBox="0 0 24 24">
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </symbol>
        <symbol id="i-x" viewBox="0 0 24 24">
          <path d="M6 6 18 18" />
          <path d="M18 6 6 18" />
        </symbol>
      </defs>
    </svg>
  );
}
