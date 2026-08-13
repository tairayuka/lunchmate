import { colors, border, hardShadow, headingFont } from '../lib/theme';
import { GUIDELINE_ICONS } from './icons';

export default function GuidelineCard({ icon, iconBg, title, description }) {
  const Icon = GUIDELINE_ICONS[icon];
  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        background: colors.white,
        border: border(),
        borderRadius: 16,
        boxShadow: hardShadow(4),
        padding: '14px 16px',
        marginBottom: 16,
      }}
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: colors[iconBg] || colors.iconTealBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {Icon && <Icon size={20} color={colors.navy} />}
      </span>
      <div>
        <p style={{ ...headingFont, margin: 0, fontSize: 16, fontWeight: 800, color: colors.navy }}>{title}</p>
        <p style={{ margin: '4px 0 0', fontSize: 13.5, color: colors.textMuted, lineHeight: 1.5 }}>{description}</p>
      </div>
    </div>
  );
}
