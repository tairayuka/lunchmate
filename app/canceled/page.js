'use client';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors, pageShell, headingFont, card } from '../../lib/theme';
import { CANCELED } from '../../lib/content';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import { CheckCircleIcon } from '../../components/icons';

function CanceledContent() {
  const router = useRouter();
  const params = useSearchParams();
  const reason = params.get('reason') === 'canceled' ? 'canceled' : 'timeout';

  const heading = reason === 'canceled' ? CANCELED.headingCanceled : CANCELED.headingTimeout;
  const subtext = reason === 'canceled' ? CANCELED.subtextCanceled : CANCELED.subtextTimeout;

  return (
    <main style={pageShell}>
      <Header />
      <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <div style={{ ...card, maxWidth: 320, margin: '24px auto 24px' }}>
          <h1 style={{ ...headingFont, fontSize: 22, fontWeight: 800, color: colors.navy, margin: '0 0 10px' }}>
            {heading}
          </h1>
          <p style={{ color: colors.textMuted, fontSize: 14, margin: 0, lineHeight: 1.6 }}>{subtext}</p>
        </div>

        <PrimaryButton variant="primary" icon={<CheckCircleIcon size={16} />} onClick={() => router.push('/')}>
          {CANCELED.cta}
        </PrimaryButton>
      </div>
    </main>
  );
}

export default function CanceledPage() {
  return (
    <Suspense fallback={null}>
      <CanceledContent />
    </Suspense>
  );
}
