import { Rubik } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-rubik',
});

export const metadata = {
  title: 'Azelin Azzahra | Portfolio',
  description: 'Welcome to my portfolio — im a passionate student in Industrial Automation who loves robotics, design, and creative innovation.',
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
