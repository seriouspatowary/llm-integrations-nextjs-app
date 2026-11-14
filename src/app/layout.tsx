import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from './providers';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'Track-Amount – Personal Expense & Income Tracker',
  description: 'A modern, premium, mobile-first fintech personal expense and income tracker with AI insights.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Track-Amount',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#4F46E5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-500 selection:text-white bg-slate-900">
       <Providers>
          <AppProvider>
            {children}
          </AppProvider>
        </Providers>

      </body>
    </html>
  );
}

