import { Baloo_2, Nunito } from 'next/font/google';

const headingFont = Baloo_2({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-heading' });
const bodyFont = Nunito({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-body' });

export const metadata = {
  title: 'Lunch Mate',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body style={{ margin: 0, background: '#F7F3EA', fontFamily: 'var(--font-body)' }}>
        {children}
      </body>
    </html>
  );
}
