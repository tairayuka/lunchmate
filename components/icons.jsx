// Figmaのアイコンを模した、依存ライブラリなしの簡易SVGアイコン集。
// ピクセル完全一致は狙わず、雰囲気を揃えることを優先している。

export function ForkKnifeIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 2v8a2 2 0 0 0 4 0V2M9 10v12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 2c-1.5 0-2.5 1.5-2.5 3.5v3c0 1.2.8 2 1.5 2.3V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeartIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20s-7-4.4-9.5-8.8C.8 8 2 4.5 5.3 3.7c2-.5 3.8.4 5 2 1.2-1.6 3-2.5 5-2C18.6 4.5 19.8 8 17.5 11.2 15 15.6 12 20 12 20z"
        fill={color}
      />
    </svg>
  );
}

export function CalendarIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="3" stroke={color} strokeWidth="2" />
      <path d="M3 10h18M8 2v6M16 2v6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MugIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 8h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 9h2a3 3 0 0 1 0 6h-2" stroke={color} strokeWidth="2" />
      <path d="M7 2c-.5 1 0 1.5-1 2.5M11 2c-.5 1 0 1.5-1 2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 12.5l5 5L20 6" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function XIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 5l14 14M19 5L5 19" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function InfoIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <circle cx="12" cy="8" r="1" fill={color} />
      <path d="M12 11v6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const GUIDELINE_ICONS = {
  heart: HeartIcon,
  calendar: CalendarIcon,
  mug: MugIcon,
};
