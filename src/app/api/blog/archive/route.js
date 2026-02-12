import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import '@/models/User';
import { getSession } from '@/lib/auth';

// GET - List archived posts (requires auth)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    const posts = await Post.find({ archived: true })
      .populate('author', 'displayName username profilePicture')
      .sort({ updatedAt: -1 })
      .select('-content')
      .lean();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Archive list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch archived posts' },
      { status: 500 }
    );
  }
}
