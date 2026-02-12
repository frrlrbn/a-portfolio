import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createToken, setSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await user.comparePassword(password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await createToken({
      userId: user._id.toString(),
      username: user.username,
      displayName: user.displayName,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
