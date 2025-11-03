import { Rubik } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-rubik',
});

export const metadata = {
  title: {
    default: 'Azelin Azzahra | Industrial Automation Engineer & Designer Portfolio',
    template: '%s | Azelin Azzahra Portfolio'
  },
  description: 'Azelin Azzahra - Industrial Automation Engineering student at SMK Negeri 2 Depok Sleman. Passionate about robotics, PLC programming, AutoCAD design, and creative innovation. Explore my projects, certificates, and skills in automation, electronics, and digital design.',
  keywords: [
    'Azelin Azzahra',
    'Industrial Automation',
    'Robotics',
    'PLC Programming',
    'AutoCAD',
    'Electronics Engineering',
    'SMK Negeri 2 Depok',
    'Microcontroller Programming',
    'C++ Programming',
    'Graphic Design',
    'Digital Content Creator',
    'Arduino Projects',
    'Pneumatic Systems',
    'Engineering Portfolio',
    'Student Engineer',
    'Indonesia Engineer',
    'ICT Business Development',
    'Line Follower Competition',
    'Electrical Competition'
  ],
  authors: [{ name: 'Azelin Azzahra', url: 'https://www.linkedin.com/in/azelin-azzahra-6bba45333/' }],
  creator: 'Azelin Azzahra',
  publisher: 'Azelin Azzahra',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://azelin.my.id'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Azelin Azzahra | Industrial Automation Engineer & Designer Portfolio',
    description: 'Industrial Automation Engineering student specializing in robotics, PLC programming, and creative design. View my projects, certificates, and technical skills.',
    url: 'https://azelin.my.id',
    siteName: 'Azelin Azzahra Portfolio',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Azelin Azzahra - Industrial Automation Engineer Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Azelin Azzahra | Industrial Automation Engineer Portfolio',
    description: 'Industrial Automation Engineering student specializing in robotics, PLC programming, and creative design.',
    images: ['/images/og-image.jpg'],
    creator: '@azelyneazz',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'technology',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1c1c84" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Azelin Portfolio" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${rubik.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
