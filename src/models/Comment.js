import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  // For Google OAuth users
  googleId: {
    type: String,
    default: null,
  },
  // For blog authors (existing User model)
  blogAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  // Display info (from Google or blog author)
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  // For replies
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ googleId: 1 });

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);
