import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Car Wash Management System',
  description: 'A comprehensive car wash management solution',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="carwash">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}