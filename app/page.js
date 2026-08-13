'use client';
import { useRouter } from 'next/navigation';
import { colors, pageShell, headingFont } from '../lib/theme';
import { WELCOME } from '../lib/content';
import FindMateButton from '../components/FindMateButton';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <main style={pageShell}>
      <div style={{ maxWidth: 320, textAlign: 'center', marginTop: 48 }}>
        <h1
          style={{
            ...headingFont,
            fontSize: 30,
            fontWeight: 800,
            color: colors.navy,
            whiteSpace: 'pre-line',
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {WELCOME.heading}
        </h1>
        <p style={{ color: colors.textMuted, fontSize: 15, marginTop: 14 }}>{WELCOME.subtext}</p>
      </div>

      <div style={{ flex: 1 }} />

      <FindMateButton label={WELCOME.cta} variant="solid" onClick={() => router.push('/profile')} />

      <div style={{ flex: 2 }} />
    </main>
  );
}
