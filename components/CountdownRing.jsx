import { colors, headingFont } from '../lib/theme';

// 検索中画面の円形カウントダウン表示。secondsLeft/totalSecondsの割合で
// リングを減らしていく。
export default function CountdownRing({ secondsLeft, totalSeconds, size = 180 }) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.max(0, Math.min(1, secondsLeft / totalSeconds));
  const offset = circumference * (1 - fraction);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.disabledBg} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.orange}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ ...headingFont, fontSize: 40, fontWeight: 800, color: colors.navy, lineHeight: 1 }}>
          {secondsLeft}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: colors.orangeMuted, letterSpacing: 1 }}>
          SECONDS
        </span>
      </div>
    </div>
  );
}
