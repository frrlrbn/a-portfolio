import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import '@/models/User';
import { getSession } from '@/lib/auth';
import slugify from 'slugify';

// GET - List all published posts
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    
    const query = { published: true, archived: { $ne: true } };
    
    if (tag) {
      query.tags = tag;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'displayName username profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content')
        .lean(),
      Post.countDocuments(query),
    ]);
    
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Blog list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new post (requires auth)
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { title, excerpt, content, coverImage, tags, published } = await request.json();
    
    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Title, excerpt, and content are required' },
        { status: 400 }
      );
    }
    
    // Generate unique slug
    let slug = slugify(title, { lower: true, strict: true });
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }
    
    // Calculate read time
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    
    const post = await Post.create({
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || '',
      author: session.userId,
      tags: tags || [],
      published: published !== undefined ? published : true,
      readTime,
    });
    
    return NextResponse.json({ success: true, post: { slug: post.slug } }, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
