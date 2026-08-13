'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors, pageShell, headingFont, border } from '../../lib/theme';
import { GUIDELINES, GUIDELINE_PAGE } from '../../lib/content';
import { CheckIcon } from '../../components/icons';
import Header from '../../components/Header';
import GuidelineCard from '../../components/GuidelineCard';
import PrimaryButton from '../../components/PrimaryButton';
import { toQueryString } from '../../lib/queryParams';

function GuidelineContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [agreed, setAgreed] = useState(false);

  const name = params.get('name') || '';
  const nationalityCode = params.get('nationalityCode') || '';

  function handleAgree() {
    if (!agreed) return;
    router.push('/home' + toQueryString({ name, nationalityCode }));
  }

  return (
    <main style={pageShell}>
      <Header />
      <div style={{ width: '100%', maxWidth: 360 }}>
        <h1 style={{ ...headingFont, fontSize: 34, fontWeight: 800, color: colors.navy, textAlign: 'center', margin: '4px 0 24px' }}>
          Guideline
        </h1>

        {GUIDELINES.map((g) => (
          <GuidelineCard key={g.key} icon={g.icon} iconBg={g.iconBg} title={g.title} description={g.description} />
        ))}

        <label
          onClick={() => setAgreed((v) => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0 20px', cursor: 'pointer' }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              border: border(2),
              background: agreed ? colors.teal : colors.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {agreed && <CheckIcon size={14} color={colors.navy} />}
          </span>
          <span style={{ fontSize: 14, color: colors.navy, fontWeight: 600 }}>{GUIDELINE_PAGE.agreeLabel}</span>
        </label>

        <PrimaryButton variant="accent" disabled={!agreed} onClick={handleAgree}>
          {GUIDELINE_PAGE.cta}
        </PrimaryButton>

        <p style={{ textAlign: 'center', color: colors.textMuted, fontSize: 12, marginTop: 14 }}>{GUIDELINE_PAGE.step}</p>
      </div>
    </main>
  );
}

export default function GuidelinePage() {
  return (
    <Suspense fallback={null}>
      <GuidelineContent />
    </Suspense>
  );
}
