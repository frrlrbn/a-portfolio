'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Typography from '@tiptap/extension-typography';
import { common, createLowlight } from 'lowlight';
import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBold, FiItalic, FiUnderline, FiCode, FiList, FiAlignLeft, FiAlignCenter,
  FiAlignRight, FiImage, FiLink, FiType, FiMinus, FiCornerDownLeft, FiChevronDown,
  FiX, FiCheck
} from 'react-icons/fi';
import { LuHeading1, LuHeading2, LuHeading3, LuListOrdered, LuQuote, LuHighlighter, LuStrikethrough, LuUndo2, LuRedo2 } from 'react-icons/lu';

const lowlight = createLowlight(common);

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing your story...' }) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full mx-auto block',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#1c1c84] underline decoration-2 hover:text-[#151560]',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 rounded-xl p-4 text-sm font-mono',
        },
      }),
      TextStyle,
      Color,
      Typography,
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'blog-editor-content outline-none min-h-[400px] max-w-none prose prose-lg',
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/blog/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url && editor) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  }, [editor]);

  const addLink = useCallback(() => {
    if (linkUrl) {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  if (!editor) return null;

  const ToolbarButton = ({ onClick, active, disabled, children, title }) => (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={title}
      className={`p-2 rounded-lg transition-all duration-200 ${
        active
          ? 'bg-[#1c1c84] text-white shadow-sm'
          : disabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-100 hover:text-[#1c1c84]'
      }`}
    >
      {children}
    </motion.button>
  );

  const ToolbarDivider = () => <div className="w-px h-6 bg-gray-200 mx-1" />;

  return (
    <div className="blog-editor">
      {/* Main Toolbar */}
      <div className="cartoon-outline bg-white rounded-xl p-2 mb-4 sticky top-20 z-30">
        <div className="flex flex-wrap items-center gap-0.5">
          {/* Text Format */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <LuHeading1 size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <LuHeading2 size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <LuHeading3 size={18} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <FiBold size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <FiItalic size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline"
          >
            <FiUnderline size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          >
            <LuStrikethrough size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#FEF08A' }).run()}
            active={editor.isActive('highlight')}
            title="Highlight"
          >
            <LuHighlighter size={16} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <FiList size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Ordered List"
          >
            <LuListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <LuQuote size={16} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <FiAlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <FiAlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <FiAlignRight size={16} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Code & Media */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title="Inline Code"
          >
            <FiCode size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <span className="text-xs font-mono font-bold">{'{}'}</span>
          </ToolbarButton>

          <ToolbarDivider />

          {/* Link */}
          <ToolbarButton
            onClick={() => {
              setLinkUrl(editor.getAttributes('link').href || '');
              setShowLinkInput(true);
            }}
            active={editor.isActive('link')}
            title="Add Link"
          >
            <FiLink size={16} />
          </ToolbarButton>

          {/* Image */}
          <ToolbarButton
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title="Upload Image"
          >
            {uploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-[#1c1c84] border-t-transparent rounded-full"
              />
            ) : (
              <FiImage size={16} />
            )}
          </ToolbarButton>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files?.[0])}
            className="hidden"
          />

          <ToolbarDivider />

          {/* Horizontal Rule */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <FiMinus size={16} />
          </ToolbarButton>

          {/* Hard Break */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setHardBreak().run()}
            title="Line Break"
          >
            <FiCornerDownLeft size={16} />
          </ToolbarButton>

          <div className="flex-1" />

          {/* Undo/Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <LuUndo2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <LuRedo2 size={16} />
          </ToolbarButton>
        </div>
      </div>

      {/* Link Input Popup */}
      <AnimatePresence>
        {showLinkInput && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={() => setShowLinkInput(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="cartoon-outline bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-lg text-[#333333] mb-4">Insert Link</h3>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
                className="w-full px-4 py-3 rounded-xl border-2 border-black bg-gray-50 focus:bg-white focus:border-[#1c1c84] outline-none transition-all font-medium placeholder:text-gray-400"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { setShowLinkInput(false); setLinkUrl(''); }}
                  className="flex-1 cartoon-outline bg-white py-2.5 rounded-full font-semibold text-sm flex items-center justify-center gap-1 hover:bg-gray-50"
                >
                  <FiX size={16} /> Cancel
                </button>
                <button
                  onClick={addLink}
                  className="flex-1 cartoon-outline bg-[#1c1c84] text-white py-2.5 rounded-full font-semibold text-sm flex items-center justify-center gap-1 hover:bg-[#151560]"
                >
                  <FiCheck size={16} /> Apply
                </button>
              </div>
              {editor.isActive('link') && (
                <button
                  onClick={() => { editor.chain().focus().unsetLink().run(); setShowLinkInput(false); }}
                  className="w-full mt-2 py-2 text-sm text-red-500 font-semibold hover:text-red-600"
                >
                  Remove Link
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
