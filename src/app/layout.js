import { Rubik } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-rubik',
});

export const metadata = {
  title: 'Azelin | Portfolio',
  description: 'Portfolio website showcasing my work and skills',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${rubik.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
