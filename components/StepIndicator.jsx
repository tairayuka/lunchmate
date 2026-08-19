import { colors, border } from '../lib/theme';

// プロフィール／ガイドライン／ホームの3画面で使う、上部の進捗ドット。
// 3つとも同じ大きさの正円にし、現在地は色だけで区別する。
export default function StepIndicator({ current, total = 3 }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '0 0 22px' }}>
      {Array.from({ length: total }).map((_, i) => {
        const stepNumber = i + 1;
        const isDone = stepNumber <= current;
        return (
          <span
            key={stepNumber}
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: isDone ? colors.teal : colors.disabledBg,
              border: border(2),
            }}
          />
        );
      })}
    </div>
  );
}
