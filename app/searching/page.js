'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { colors, pageShell, headingFont } from '../../lib/theme';
import { SEARCHING } from '../../lib/content';
import Header from '../../components/Header';
import CountdownRing from '../../components/CountdownRing';
import PrimaryButton from '../../components/PrimaryButton';
import { XIcon } from '../../components/icons';
import { toQueryString } from '../../lib/queryParams';

function SearchingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get('userId') || '';

  const [secondsLeft, setSecondsLeft] = useState(SEARCHING.totalSeconds);
  const pollRef = useRef(null);
  const timerRef = useRef(null);
  const navigatedRef = useRef(false);

  function clearTimers() {
    clearInterval(pollRef.current);
    clearInterval(timerRef.current);
  }

  function goToResult(match) {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    clearTimers();
    router.push(
      '/result' +
        toQueryString({
          userId,
          matchNumber: match.matchNumber,
          partnerName: match.partnerName,
          partnerNationality: match.partnerNationality,
          location: match.location,
          matchedAt: match.matchedAt,
        })
    );
  }

  function goToCanceled(reason) {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    clearTimers();
    router.push('/canceled' + toQueryString({ reason }));
  }

  async function cancelAndLeave(reason) {
    try {
      await fetch('/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
    } catch (e) {
      console.error(e);
    }
    goToCanceled(reason);
  }

  useEffect(() => {
    if (!userId) {
      router.replace('/');
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          cancelAndLeave('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/status?userId=${userId}`);
        const data = await res.json();
        if (data.status === 'matched' && data.match) {
          goToResult(data.match);
        } else if (data.status === 'canceled') {
          goToCanceled('timeout');
        }
      } catch (e) {
        console.error(e);
      }
    }, 1500);

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <main style={pageShell}>
      <Header />
      <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <h1 style={{ ...headingFont, fontSize: 24, fontWeight: 800, color: colors.navy, margin: '4px 0 4px' }}>
          {SEARCHING.heading}
        </h1>
        <p style={{ color: colors.textMuted, fontSize: 14, margin: '0 0 24px' }}>{SEARCHING.subtext}</p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <CountdownRing secondsLeft={secondsLeft} totalSeconds={SEARCHING.totalSeconds} />
        </div>

        <PrimaryButton variant="danger" icon={<XIcon size={16} />} onClick={() => cancelAndLeave('canceled')}>
          {SEARCHING.cancelCta}
        </PrimaryButton>

        <p style={{ textAlign: 'center', color: colors.textMuted, fontSize: 12, marginTop: 14 }}>{SEARCHING.footer}</p>
      </div>
    </main>
  );
}

export default function SearchingPage() {
  return (
    <Suspense fallback={null}>
      <SearchingContent />
    </Suspense>
  );
}
