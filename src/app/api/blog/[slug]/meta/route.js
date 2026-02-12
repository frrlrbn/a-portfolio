import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import '@/models/User';

// GET - Get post metadata for SEO (server-side, no auth needed for published)
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { slug } = await params;

    const post = await Post.findOne({ slug, published: true })
      .populate('author', 'displayName username profilePicture')
      .select('title excerpt slug coverImage author tags readTime createdAt updatedAt')
      .lean();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Post meta error:', error);
    return NextResponse.json({ error: 'Failed to fetch post meta' }, { status: 500 });
  }
}
