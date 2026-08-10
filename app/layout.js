export const metadata = {
  title: 'Lunch Mate',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#f5f5f5' }}>
        {children}
      </body>
    </html>
  );
}
