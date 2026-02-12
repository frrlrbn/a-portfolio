import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// GET - Get profile of a user
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { username } = await params;
    
    const user = await User.findOne({ username })
      .select('username displayName profilePicture bio createdAt')
      .lean();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT - Update own profile
export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const { username } = await params;

    // Can only edit own profile
    if (session.username !== username) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { displayName, profilePicture, bio } = await request.json();

    const updateData = {};
    if (displayName?.trim()) updateData.displayName = displayName.trim();
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    if (bio !== undefined) updateData.bio = bio.substring(0, 300);

    const user = await User.findOneAndUpdate(
      { username },
      { $set: updateData },
      { new: true, select: 'username displayName profilePicture bio' }
    ).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
