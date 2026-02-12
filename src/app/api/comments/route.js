import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import { getSession } from '@/lib/auth';
import { auth } from '@/lib/next-auth';

// GET - List comments for a post
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const slug = searchParams.get('slug');

    if (!postId && !slug) {
      return NextResponse.json({ error: 'postId or slug required' }, { status: 400 });
    }

    let targetPostId = postId;

    if (slug && !postId) {
      const post = await Post.findOne({ slug }).select('_id').lean();
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      targetPostId = post._id;
    }

    // Get all top-level comments (no parent)
    const comments = await Comment.find({ post: targetPostId, parentComment: null })
      .sort({ createdAt: -1 })
      .lean();

    // Get all replies
    const commentIds = comments.map(c => c._id);
    const replies = await Comment.find({ post: targetPostId, parentComment: { $in: commentIds } })
      .sort({ createdAt: 1 })
      .lean();

    // Build threaded structure (single level only - no nested replies)
    const replyMap = {};
    replies.forEach(r => {
      const parentId = r.parentComment.toString();
      if (!replyMap[parentId]) replyMap[parentId] = [];
      replyMap[parentId].push({ ...r, replies: [] });
    });

    // Attach replies to their parents (flat, no nesting)
    const buildReplies = (parentId) => {
      return replyMap[parentId] || [];
    };

    const threaded = comments.map(comment => ({
      ...comment,
      replies: buildReplies(comment._id.toString()),
    }));

    // Count total
    const total = await Comment.countDocuments({ post: targetPostId });

    return NextResponse.json({ comments: threaded, total });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST - Create a comment
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { slug, content, parentComment } = body;

    if (!slug || !content?.trim()) {
      return NextResponse.json({ error: 'Slug and content are required' }, { status: 400 });
    }

    if (content.trim().length > 2000) {
      return NextResponse.json({ error: 'Comment too long (max 2000 characters)' }, { status: 400 });
    }

    const post = await Post.findOne({ slug }).select('_id').lean();
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if user is a blog author (JWT session)
    const blogSession = await getSession();

    // Check if user is Google OAuth authenticated
    const googleSession = await auth();

    if (!blogSession && !googleSession) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Prevent replying to a reply (only allow replies to top-level comments)
    if (parentComment) {
      const parent = await Comment.findById(parentComment).select('parentComment').lean();
      if (!parent) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
      }
      if (parent.parentComment) {
        return NextResponse.json({ error: 'Cannot reply to a reply' }, { status: 400 });
      }
    }

    const commentData = {
      post: post._id,
      content: content.trim(),
      parentComment: parentComment || null,
    };

    if (blogSession) {
      // Blog author commenting
      const User = (await import('@/models/User')).default;
      const user = await User.findById(blogSession.userId).select('displayName username profilePicture').lean();
      commentData.blogAuthor = blogSession.userId;
      commentData.name = user?.displayName || blogSession.displayName;
      commentData.avatar = user?.profilePicture || '';
      commentData.email = '';
    } else if (googleSession) {
      // Google user commenting
      commentData.googleId = googleSession.user.googleId || googleSession.user.id;
      commentData.name = googleSession.user.name;
      commentData.email = googleSession.user.email;
      commentData.avatar = googleSession.user.image || '';
    }

    const comment = await Comment.create(commentData);
    const populatedComment = await Comment.findById(comment._id).lean();

    return NextResponse.json({ comment: { ...populatedComment, replies: [] } }, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

// DELETE - Delete a comment
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID required' }, { status: 400 });
    }

    const comment = await Comment.findById(commentId).lean();
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Check blog author session (can delete any comment)
    const blogSession = await getSession();
    if (blogSession) {
      // Blog authors can delete any comment
      await Comment.deleteMany({
        $or: [
          { _id: commentId },
          { parentComment: commentId },
        ],
      });
      return NextResponse.json({ success: true });
    }

    // Check Google session (can only delete own comments)
    const googleSession = await auth();
    if (googleSession) {
      const googleId = googleSession.user.googleId || googleSession.user.id;
      if (comment.googleId !== googleId) {
        return NextResponse.json({ error: 'You can only delete your own comments' }, { status: 403 });
      }
      await Comment.deleteMany({
        $or: [
          { _id: commentId },
          { parentComment: commentId },
        ],
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
