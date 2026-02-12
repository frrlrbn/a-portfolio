import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getImageKit, toFile } from '@/lib/imagekit';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, AVIF' },
        { status: 400 }
      );
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Max 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `blog-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    // Upload to ImageKit using v7 SDK
    const imagekit = getImageKit();
    const uploadFile = await toFile(buffer, filename);
    const uploadResponse = await imagekit.files.upload({
      file: uploadFile,
      fileName: filename,
      folder: '/blog',
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
