import type { Metadata } from 'next';
import { Inter, Playfair_Display, Dancing_Script } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing' });

export const metadata: Metadata = {
  title: 'Abhayam - Travel Fearlessly. Together.',
  description: 'A modern travel safety and companion matching platform for India. Find verified travel companions, check area safety with AI, and travel with confidence.',
  keywords: ['travel', 'safety', 'companion', 'India', 'women safety', 'travel safety'],
  authors: [{ name: 'Abhayam Team' }],
  openGraph: {
    title: 'Abhayam - Travel Fearlessly. Together.',
    description: 'Find verified travel companions, check area safety with AI, and travel with confidence.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${dancingScript.variable} font-sans`}>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
