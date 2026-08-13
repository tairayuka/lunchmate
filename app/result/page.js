'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors, pageShell, headingFont, card } from '../../lib/theme';
import { RESULT } from '../../lib/content';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import { CheckCircleIcon, XIcon } from '../../components/icons';
import { toQueryString } from '../../lib/queryParams';

function ResultContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [canceling, setCanceling] = useState(false);

  const userId = params.get('userId') || '';
  const matchNumber = params.get('matchNumber') || '';
  const partnerName = params.get('partnerName') || '';
  const partnerNationality = params.get('partnerNationality') || '';
  const location = params.get('location') || '';

  async function handleCancelMatch() {
    if (canceling) return;
    setCanceling(true);
    try {
      await fetch('/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
    } catch (e) {
      console.error(e);
    }
    router.push('/canceled' + toQueryString({ reason: 'canceled' }));
  }

  return (
    <main style={pageShell}>
      <Header />
      <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <h1 style={{ ...headingFont, fontSize: 28, fontWeight: 800, color: colors.navy, margin: '4px 0 4px' }}>
          {RESULT.heading}
        </h1>
        <div style={{ width: 64, height: 4, background: colors.orange, borderRadius: 2, margin: '0 auto 24px' }} />

        <div style={{ ...card, maxWidth: 320, margin: '0 auto 20px' }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: colors.textMuted, letterSpacing: 0.5 }}>
            {RESULT.matchNumberLabel}
          </p>
          <div style={{ height: 1, background: colors.disabledBg, margin: '8px 0' }} />
          <p style={{ ...headingFont, margin: 0, fontSize: 44, fontWeight: 800, color: colors.navy, letterSpacing: 2 }}>
            {matchNumber}
          </p>
        </div>

        <p style={{ ...headingFont, fontSize: 18, fontWeight: 800, color: colors.navy, margin: '0 0 16px' }}>
          {RESULT.partnerPrefix} {partnerName}!
        </p>

        <div style={{ ...card, maxWidth: 320, margin: '0 auto 24px', textAlign: 'left' }}>
          <ResultRow label={RESULT.nationalityLabel} value={partnerNationality} />
          <div style={{ height: 1, background: colors.disabledBg, margin: '10px 0' }} />
          <ResultRow label={RESULT.locationLabel} value={location} />
        </div>

        <PrimaryButton variant="primary" icon={<CheckCircleIcon size={16} />} onClick={() => router.push('/')}>
          {RESULT.cta}
        </PrimaryButton>

        <div style={{ height: 12 }} />

        <PrimaryButton variant="danger" disabled={canceling} icon={<XIcon size={16} />} onClick={handleCancelMatch}>
          {RESULT.cancelCta}
        </PrimaryButton>
      </div>
    </main>
  );
}

function ResultRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ fontSize: 13, color: colors.textMuted, fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 14, color: colors.navy, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={null}>
      <ResultContent />
    </Suspense>
  );
}
