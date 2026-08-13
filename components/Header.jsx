import { colors, border, headingFont } from '../lib/theme';
import { ForkKnifeIcon } from './icons';

// ガイドライン／ホーム／検索中／結果画面で共通のヘッダー
// （丸いロゴアイコン＋"Lunch Mate"ロゴ文字＋下線）。
export default function Header() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 360,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 14,
        marginBottom: 24,
        borderBottom: border(2),
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: colors.teal,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <ForkKnifeIcon size={16} color={colors.white} />
      </span>
      <span style={{ ...headingFont, fontWeight: 800, fontSize: 20, color: colors.tealDeep }}>
        Lunch Mate
      </span>
    </div>
  );
}
