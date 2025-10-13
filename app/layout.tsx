// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from "@/components/SessionProvider"
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Live Sports Meet Scoreboard',
  description: 'Real-time scoreboard for sports meet events',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}