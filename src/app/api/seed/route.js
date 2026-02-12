import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Seed initial users - run once then remove
export async function POST(request) {
  try {
    // Simple secret to prevent unauthorized seeding
    const { secret } = await request.json();
    if (secret !== 'seed-azelin-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Use raw collection to avoid any model middleware issues
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const users = [
      {
        username: 'azelyne',
        displayName: 'Azelyne',
        password: 'il0v3_allel5308',
      },
      {
        username: 'frrlrbn',
        displayName: 'Farrel',
        password: 'azelyne5308',
      },
    ];

    const results = [];
    for (const userData of users) {
      const existing = await usersCollection.findOne({ username: userData.username });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        await usersCollection.insertOne({
          username: userData.username,
          displayName: userData.displayName,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        results.push(`Created user: ${userData.username}`);
      } else {
        results.push(`User already exists: ${userData.username}`);
      }
    }

    return NextResponse.json({ success: true, message: 'Users seeded successfully', results });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed users', details: error.message },
      { status: 500 }
    );
  }
}
