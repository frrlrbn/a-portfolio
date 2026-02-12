import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import '@/models/User';
import { getSession } from '@/lib/auth';

// GET - List user's drafts
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();

    const drafts = await Post.find({ 
      author: session.userId, 
      published: false 
    })
      .populate('author', 'displayName username profilePicture')
      .sort({ updatedAt: -1 })
      .select('-content')
      .lean();

    return NextResponse.json({ drafts });
  } catch (error) {
    console.error('Drafts list error:', error);
    return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 });
  }
}
