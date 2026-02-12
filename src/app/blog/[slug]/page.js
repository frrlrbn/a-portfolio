import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import '@/models/User';
import BlogPostClient from './BlogPostClient';

const BASE_URL = 'https://azelin.my.id';

export async function generateMetadata({ params }) {
  try {
    await connectDB();
    const { slug } = await params;

    const post = await Post.findOne({ slug, published: true })
      .populate('author', 'displayName username profilePicture')
      .select('title excerpt slug coverImage author tags readTime createdAt updatedAt')
      .lean();

    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The blog post you are looking for does not exist.',
      };
    }

    const title = post.title;
    const description = post.excerpt;
    const url = `${BASE_URL}/blog/${post.slug}`;
    const publishedTime = new Date(post.createdAt).toISOString();
    const modifiedTime = new Date(post.updatedAt || post.createdAt).toISOString();

    return {
      title,
      description,
      keywords: post.tags?.join(', '),
      authors: [{ name: post.author?.displayName }],
      openGraph: {
        title,
        description,
        url,
        siteName: 'Azelin Blog',
        type: 'article',
        publishedTime,
        modifiedTime,
        authors: [post.author?.displayName],
        tags: post.tags,
        ...(post.coverImage && {
          images: [
            {
              url: post.coverImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        }),
      },
      twitter: {
        card: post.coverImage ? 'summary_large_image' : 'summary',
        title,
        description,
        ...(post.coverImage && { images: [post.coverImage] }),
      },
      alternates: {
        canonical: url,
      },
      other: {
        'article:published_time': publishedTime,
        'article:modified_time': modifiedTime,
        'article:author': post.author?.displayName,
        'article:tag': post.tags?.join(','),
      },
    };
  } catch (error) {
    console.error('generateMetadata error:', error);
    return {
      title: 'Blog Post | Azelin Blog',
      description: 'Read articles and insights by Azelin.',
    };
  }
}

export default function BlogPostPage() {
  return <BlogPostClient />;
}
