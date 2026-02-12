export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/', '/login', '/blog/create', '/blog/edit/', '/blog/drafts', '/blog/profile'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
    ],
    sitemap: 'https://azelin.my.id/sitemap.xml',
    host: 'https://azelin.my.id',
  };
}
