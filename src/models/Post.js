import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  content: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    default: '',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  published: {
    type: Boolean,
    default: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  readTime: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

// Indexes
postSchema.index({ slug: 1 });
postSchema.index({ published: 1, archived: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

export default mongoose.models.Post || mongoose.model('Post', postSchema);
