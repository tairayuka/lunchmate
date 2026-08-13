'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors, pageShell, headingFont, card, border } from '../../lib/theme';
import { RESULT } from '../../lib/content';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import { CheckCircleIcon, XIcon } from '../../components/icons';
import { toQueryString } from '../../lib/queryParams';

function ResultContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [canceling, setCanceling] = useState(false);
  const [partnerCanceled, setPartnerCanceled] = useState(false);
  const pollRef = useRef(null);

  const userId = params.get('userId') || '';
  const matchNumber = params.get('matchNumber') || '';
  const partnerName = params.get('partnerName') || '';
  const partnerNationality = params.get('partnerNationality') || '';
  const location = params.get('location') || '';

  // 相手が先にこのマッチをキャンセルしていないか、定期的に確認する。
  // 自分からキャンセルした場合は/canceledへ遷移するので、この画面に残っている
  // ということは「まだ自分からはキャンセルしていない」状態のはず。
  useEffect(() => {
    if (!userId) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/status?userId=${userId}`);
        const data = await res.json();
        if (data.status === 'canceled') {
          setPartnerCanceled(true);
          clearInterval(pollRef.current);
        }
      } catch (e) {
        console.error(e);
      }
    }, 3000);

    return () => clearInterval(pollRef.current);
  }, [userId]);

  async function handleCancelMatch() {
    if (canceling || partnerCanceled) return;
    setCanceling(true);
    clearInterval(pollRef.current);
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

        {partnerCanceled && (
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              textAlign: 'left',
              background: colors.red,
              border: border(3),
              borderRadius: 16,
              boxShadow: `4px 4px 0px ${colors.navy}`,
              padding: '16px 16px',
              margin: '0 auto 24px',
              maxWidth: 320,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: colors.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <XIcon size={16} color={colors.red} />
            </span>
            <div>
              <p style={{ ...headingFont, margin: 0, fontSize: 15, fontWeight: 800, color: colors.white }}>
                {RESULT.partnerCanceledHeading}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: colors.white, lineHeight: 1.5, fontWeight: 600 }}>
                {RESULT.partnerCanceledNotice}
              </p>
            </div>
          </div>
        )}

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

        {!partnerCanceled && (
          <>
            <div style={{ height: 12 }} />
            <PrimaryButton variant="danger" disabled={canceling} icon={<XIcon size={16} />} onClick={handleCancelMatch}>
              {RESULT.cancelCta}
            </PrimaryButton>
          </>
        )}
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
