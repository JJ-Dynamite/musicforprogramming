import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Focus music for coding',
  description: 'Focus music for coding - Built with Rust + Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
