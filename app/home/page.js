'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors, pageShell, headingFont } from '../../lib/theme';
import { HOME } from '../../lib/content';
import Header from '../../components/Header';
import FindMateButton from '../../components/FindMateButton';
import { toQueryString } from '../../lib/queryParams';

function HomeContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const name = params.get('name') || '';
  const nationalityCode = params.get('nationalityCode') || '';

  async function handleFindMate() {
    if (submitting || !name || !nationalityCode) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, nationalityCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ? `${data.error}: ${data.detail}` : data.error || '登録に失敗しました');

      if (data.status === 'matched' && data.match) {
        router.push(
          '/result' +
            toQueryString({
              userId: data.userId,
              matchNumber: data.match.matchNumber,
              partnerName: data.match.partnerName,
              partnerNationality: data.match.partnerNationality,
              location: data.match.location,
              matchedAt: data.match.matchedAt,
            })
        );
      } else {
        router.push('/searching' + toQueryString({ userId: data.userId }));
      }
    } catch (e) {
      setErrorMsg(e.message);
      setSubmitting(false);
    }
  }

  return (
    <main style={pageShell}>
      <Header />
      <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <h1 style={{ ...headingFont, fontSize: 26, fontWeight: 800, color: colors.navy, margin: '8px 0 4px' }}>
          {HOME.heading}
        </h1>
        <p style={{ color: colors.textMuted, fontSize: 14, margin: 0 }}>{HOME.subtext}</p>
      </div>

      <div style={{ flex: 1, minHeight: 40 }} />

      <FindMateButton label={HOME.cta} variant="ringed" disabled={submitting} onClick={handleFindMate} />

      {errorMsg && <p style={{ color: colors.red, fontSize: 13, marginTop: 16, textAlign: 'center' }}>{errorMsg}</p>}

      <div style={{ flex: 2, minHeight: 40 }} />

      <p style={{ textAlign: 'center', color: colors.textMuted, fontSize: 12 }}>{HOME.step}</p>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
