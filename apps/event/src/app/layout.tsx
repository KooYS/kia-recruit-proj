import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@repo/ui/globals.css';
import './event.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import MainTitleLogo from './_components/svg/MainTitleLogo';
import KiaLogo from './_components/svg/KiaLogo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kia Event',
  description: 'Kia Event',
};

import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full max-w-[640px] m-auto`}
      >
        <div className="absolute max-w-[640px] top-1/2 -translate-y-1/2 m-auto h-full ">
          <MainTitleLogo className="w-[90%] h-auto mx-auto my-10" />
          <NuqsAdapter>{children}</NuqsAdapter>
          <KiaLogo className="w-[70px] h-auto mx-auto py-10" />
        </div>
      </body>
    </html>
  );
}
