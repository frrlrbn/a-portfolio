import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Fetch latest user data including profile picture
    let profilePicture = '';
    try {
      const connectDB = (await import('@/lib/mongodb')).default;
      const User = (await import('@/models/User')).default;
      await connectDB();
      const dbUser = await User.findById(session.userId).select('profilePicture displayName').lean();
      if (dbUser) {
        profilePicture = dbUser.profilePicture || '';
      }
    } catch {}

    return NextResponse.json({
      user: {
        userId: session.userId,
        username: session.username,
        displayName: session.displayName,
        profilePicture,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
