import { colors, hardShadow } from '../lib/theme';
import { ForkKnifeIcon } from './icons';

// Welcome画面／ホーム画面で使う円形の「Find a Mate」ボタン。
// variant="solid": Welcome画面（塗りつぶし円のみ）
// variant="ringed": ホーム画面（外側の細いリング＋内側の塗りつぶし円）
export default function FindMateButton({ label = 'Find a Mate', variant = 'solid', onClick, disabled = false }) {
  const inner = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 150,
        height: 150,
        borderRadius: '50%',
        border: `3px solid ${colors.navy}`,
        background: colors.teal,
        boxShadow: disabled ? 'none' : hardShadow(6),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <ForkKnifeIcon size={28} color={colors.navy} />
      <span style={{ fontWeight: 800, fontSize: 15, color: colors.navy }}>{label}</span>
    </button>
  );

  if (variant !== 'ringed') return inner;

  return (
    <div
      style={{
        width: 210,
        height: 210,
        borderRadius: '50%',
        border: `3px solid ${colors.teal}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {inner}
    </div>
  );
}
