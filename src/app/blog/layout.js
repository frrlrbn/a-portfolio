import { Rubik } from 'next/font/google';
import BlogProviders from './components/BlogProviders';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-rubik',
});

export const metadata = {
  title: {
    default: 'Blog | Azelin Azzahra',
    template: '%s | Azelin Blog',
  },
  description: 'Read articles and insights by Azelin Azzahra about automation engineering, robotics, design, and creative innovation.',
  openGraph: {
    title: 'Azelin Blog - Stories & Insights',
    description: 'Read articles and insights by Azelin Azzahra about automation engineering, robotics, design, and creative innovation.',
    url: 'https://azelin.my.id/blog',
    siteName: 'Azelin Blog',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Azelin Blog - Stories & Insights',
    description: 'Articles and insights about automation, robotics, and design.',
  },
  alternates: {
    canonical: 'https://azelin.my.id/blog',
  },
};

export default function BlogLayout({ children }) {
  return (
    <div className={`${rubik.variable} min-h-screen`}>
      <BlogProviders>
        {children}
      </BlogProviders>
    </div>
  );
}
