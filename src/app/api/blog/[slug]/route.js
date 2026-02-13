import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import '@/models/User';
import { getSession } from '@/lib/auth';
import slugify from 'slugify';

// GET - Get single post by slug
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { slug } = await params;
    
    const post = await Post.findOne({ slug })
      .populate('author', 'displayName username profilePicture')
      .lean();
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Draft and archived posts can only be accessed by the author
    if (!post.published || post.archived) {
      const session = await getSession();
      const isAuthor = session && session.userId === post.author._id.toString();
      
      // Drafts: only author can access (for editing)
      // Archived: only author can view
      if (!isAuthor) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT - Update post (requires auth)
export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { slug } = await params;
    const post = await Post.findOne({ slug });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    const { title, excerpt, content, coverImage, tags, published, archived } = await request.json();
    
    if (title) post.title = title;
    if (excerpt) post.excerpt = excerpt;
    if (content) post.content = content;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (tags) post.tags = tags;
    if (published !== undefined) post.published = published;
    if (archived !== undefined) post.archived = archived;
    
    // Update slug if title changed
    if (title && title !== post.title) {
      let newSlug = slugify(title, { lower: true, strict: true });
      const existing = await Post.findOne({ slug: newSlug, _id: { $ne: post._id } });
      if (existing) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      post.slug = newSlug;
    }
    
    await post.save();
    
    return NextResponse.json({ success: true, post: { slug: post.slug } });
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete post (requires auth)
export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { slug } = await params;
    const post = await Post.findOneAndDelete({ slug });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
