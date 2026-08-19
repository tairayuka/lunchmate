'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { colors, border, hardShadow, headingFont } from '../../lib/theme';
import { PROFILE } from '../../lib/content';
import { ForkKnifeIcon, InfoIcon, ArrowRightIcon } from '../../components/icons';
import PrimaryButton from '../../components/PrimaryButton';
import StepIndicator from '../../components/StepIndicator';
import { toQueryString } from '../../lib/queryParams';

const labelStyle = { display: 'block', fontSize: 13.5, fontWeight: 700, color: colors.navy, marginBottom: 6 };
const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '14px 16px',
  borderRadius: 999,
  border: border(2),
  fontSize: 16,
  background: colors.white,
  outline: 'none',
};

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nationalityCode, setNationalityCode] = useState('');
  const [nationalities, setNationalities] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    fetch('/api/nationalities')
      .then((res) => res.json())
      .then((data) => {
        if (data.nationalities) {
          const sorted = [...data.nationalities].sort(
            (a, b) => (a.code === 'XX') - (b.code === 'XX')
          );
          setNationalities(sorted);
        } else setLoadError(data.error || '国籍一覧の取得に失敗しました');
      })
      .catch(() => setLoadError('国籍一覧の取得に失敗しました'));
  }, []);

  const canSubmit = name.trim().length > 0 && nationalityCode;

  function handleNext() {
    if (!canSubmit) return;
    router.push('/guideline' + toQueryString({ name: name.trim(), nationalityCode }));
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${colors.gradientTop} 0%, ${colors.cream} 45%)`,
      }}
    >
      <div style={{ maxWidth: 360, margin: '0 auto', padding: '40px 20px 48px', boxSizing: 'border-box' }}>
        <StepIndicator current={1} total={3} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28, textAlign: 'center' }}>
          <span
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: colors.orange,
              border: border(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: hardShadow(4),
            }}
          >
            <ForkKnifeIcon size={26} color={colors.navy} />
          </span>
          <h1 style={{ ...headingFont, fontSize: 24, fontWeight: 800, color: colors.navy, margin: '16px 0 4px' }}>
            {PROFILE.heading}
          </h1>
          <p style={{ color: colors.textMuted, fontSize: 14, margin: 0 }}>{PROFILE.subtext}</p>
        </div>

        <label style={labelStyle}>{PROFILE.nameLabel}</label>
        <input
          style={inputStyle}
          value={name}
          maxLength={20}
          placeholder={PROFILE.namePlaceholder}
          onChange={(e) => setName(e.target.value.replace(/[^A-Za-z ]/g, ''))}
        />

        <label style={{ ...labelStyle, marginTop: 18 }}>{PROFILE.nationalityLabel}</label>
        <select style={inputStyle} value={nationalityCode} onChange={(e) => setNationalityCode(e.target.value)}>
          <option value="" disabled>
            {PROFILE.nationalityPlaceholder}
          </option>
          {nationalities.map((n) => (
            <option key={n.code} value={n.code}>
              {n.name}
            </option>
          ))}
        </select>
        {loadError && <p style={{ color: colors.red, fontSize: 13 }}>{loadError}</p>}

        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            background: colors.disabledBg,
            border: border(2),
            borderRadius: 14,
            padding: '12px 14px',
            margin: '18px 0',
          }}
        >
          <InfoIcon size={18} color={colors.navy} />
          <p style={{ margin: 0, fontSize: 12.5, color: colors.navy, lineHeight: 1.5 }}>{PROFILE.hint}</p>
        </div>

        <PrimaryButton
          variant="primary"
          disabled={!canSubmit}
          onClick={handleNext}
          icon={<ArrowRightIcon size={18} />}
          iconPosition="right"
        >
          {PROFILE.cta}
        </PrimaryButton>

        <p style={{ textAlign: 'center', color: colors.textMuted, fontSize: 12, marginTop: 14 }}>{PROFILE.step}</p>
      </div>
    </main>
  );
}
