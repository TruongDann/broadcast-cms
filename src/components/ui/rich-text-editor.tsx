'use client'

import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Heading1,
  Heading2,
  Heading3,
  RemoveFormatting,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  editorClassName?: string
}

export function RichTextEditor({
  content = '',
  onChange,
  placeholder = 'Nhập nội dung...',
  className,
  editorClassName,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none min-h-[150px] w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm focus:outline-none',
          editorClassName
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={cn(
          'rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          className
        )}
      >
        {/* Toolbar */}
        <div className='flex flex-wrap items-center gap-0.5 border-b bg-muted/30 p-1'>
          {/* Undo/Redo */}
          <ToolbarButton
            tooltip='Hoàn tác (Ctrl+Z)'
            pressed={false}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            tooltip='Làm lại (Ctrl+Y)'
            pressed={false}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className='h-4 w-4' />
          </ToolbarButton>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Headings */}
          <ToolbarButton
            tooltip='Tiêu đề 1'
            pressed={editor.isActive('heading', { level: 1 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            tooltip='Tiêu đề 2'
            pressed={editor.isActive('heading', { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            tooltip='Tiêu đề 3'
            pressed={editor.isActive('heading', { level: 3 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 className='h-4 w-4' />
          </ToolbarButton>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Text formatting */}
          <ToolbarButton
            tooltip='In đậm (Ctrl+B)'
            pressed={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            tooltip='In nghiêng (Ctrl+I)'
            pressed={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            tooltip='Gạch chân (Ctrl+U)'
            pressed={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            tooltip='Gạch ngang'
            pressed={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            tooltip='Code'
            pressed={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code className='h-4 w-4' />
          </ToolbarButton>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Alignment */}
          <ToolbarButton
            tooltip='Căn trái'
            pressed={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            tooltip='Căn giữa'
            pressed={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            tooltip='Căn phải'
            pressed={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight className='h-4 w-4' />
          </ToolbarButton>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Lists */}
          <ToolbarButton
            tooltip='Danh sách'
            pressed={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            tooltip='Danh sách số'
            pressed={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            tooltip='Trích dẫn'
            pressed={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className='h-4 w-4' />
          </ToolbarButton>

          <Separator orientation='vertical' className='mx-1 h-6' />

          {/* Link */}
          <ToolbarButton
            tooltip='Chèn liên kết'
            pressed={editor.isActive('link')}
            onClick={setLink}
          >
            <LinkIcon className='h-4 w-4' />
          </ToolbarButton>

          {/* Clear formatting */}
          <ToolbarButton
            tooltip='Xóa định dạng'
            pressed={false}
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
          >
            <RemoveFormatting className='h-4 w-4' />
          </ToolbarButton>
        </div>

        {/* Editor Content */}
        <EditorContent editor={editor} />
      </div>
    </TooltipProvider>
  )
}

interface ToolbarButtonProps {
  children: React.ReactNode
  tooltip: string
  pressed: boolean
  onClick: () => void
  disabled?: boolean
}

function ToolbarButton({
  children,
  tooltip,
  pressed,
  onClick,
  disabled,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          size='sm'
          pressed={pressed}
          onPressedChange={onClick}
          disabled={disabled}
          className='h-8 w-8 p-0 data-[state=on]:bg-primary/20'
        >
          {children}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side='bottom' className='text-xs'>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

export default RichTextEditor
