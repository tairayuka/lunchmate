// Figmaデザイン（クリーム背景＋ティール/オレンジのアクセント、太縁＋オフセットの
// ハードシャドウが特徴のポップな配色）から抽出した共通デザイントークン。
// 正確な配色は今後Figmaの最終版に合わせて微調整してよい。

export const colors = {
  cream: '#F7F3EA',
  gradientTop: '#CFEBE3',
  teal: '#2CBFAA',
  tealDeep: '#1E9E8C',
  navy: '#132420',
  orange: '#F0A93E',
  orangeMuted: '#C98A2E',
  red: '#B8382A',
  white: '#FFFFFF',
  iconTealBg: '#9BE4D6',
  iconOrangeBg: '#F6CBA0',
  iconBlueBg: '#C9DEE0',
  disabledBg: '#DCD7CB',
  textMuted: '#5B6664',
};

export const radii = {
  card: 20,
  pill: 999,
};

// 太縁＋オフセットのハードシャドウ（ブラー無し）が全体のトーンの核。
export function hardShadow(size = 5) {
  return `${size}px ${size}px 0px ${colors.navy}`;
}

export function border(width = 3, color = colors.navy) {
  return `${width}px solid ${color}`;
}

export const pageShell = {
  minHeight: '100vh',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '32px 20px 48px',
  background: colors.cream,
};

export const card = {
  width: '100%',
  maxWidth: 360,
  boxSizing: 'border-box',
  background: colors.white,
  border: border(),
  borderRadius: radii.card,
  boxShadow: hardShadow(),
  padding: '18px 20px',
};

export function pillButton({ variant = 'primary', disabled = false } = {}) {
  const palette = {
    primary: { bg: colors.teal, fg: colors.navy },
    accent: { bg: colors.orange, fg: colors.navy },
    danger: { bg: colors.red, fg: colors.white },
    ghost: { bg: colors.white, fg: colors.navy },
  }[variant];

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    boxSizing: 'border-box',
    padding: '16px 24px',
    borderRadius: radii.pill,
    border: border(),
    background: disabled ? colors.disabledBg : palette.bg,
    color: disabled ? colors.orangeMuted : palette.fg,
    boxShadow: disabled ? 'none' : hardShadow(4),
    fontFamily: 'var(--font-heading)',
    fontWeight: 800,
    fontSize: 16,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}

export const headingFont = { fontFamily: 'var(--font-heading)' };
export const bodyFont = { fontFamily: 'var(--font-body)' };
