'use client'

import { useEffect, useRef, useCallback, memo, useState } from 'react'
import EditorJS, { type OutputData, type API } from '@editorjs/editorjs'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Table,
  Image,
  AlertTriangle,
  CheckSquare,
  FileCode,
  ChevronDown,
  Undo2,
  Redo2,
  Link,
  Highlighter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Re-export OutputData type for convenience
export type { OutputData } from '@editorjs/editorjs'

interface BlockEditorProps {
  data?: OutputData | string
  onChange?: (data: OutputData) => void
  placeholder?: string
  className?: string
  readOnly?: boolean
  holderId?: string
  minHeight?: number
  /** Show the fixed toolbar at top */
  showToolbar?: boolean
}

// Toolbar button component
function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ElementType
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='h-8 w-8 p-0'
          onClick={onClick}
          disabled={disabled}
        >
          <Icon className='h-4 w-4' />
        </Button>
      </TooltipTrigger>
      <TooltipContent side='bottom'>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Block-style editor component using Editor.js with a fixed toolbar
 */
export const BlockEditor = memo(function BlockEditor({
  data,
  onChange,
  placeholder = 'Bắt đầu viết nội dung...',
  className,
  readOnly = false,
  holderId = 'editorjs',
  minHeight = 200,
  showToolbar = true,
}: BlockEditorProps) {
  const editorRef = useRef<EditorJS | null>(null)
  const holderRef = useRef<HTMLDivElement>(null)
  const isReady = useRef(false)
  const onChangeRef = useRef(onChange)
  const [isEditorReady, setIsEditorReady] = useState(false)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const getInitialData = useCallback((): OutputData | undefined => {
    if (!data) return undefined
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data)
        if (parsed.blocks) return parsed as OutputData
      } catch {
        if (data.trim()) {
          return {
            time: Date.now(),
            blocks: [
              {
                id: crypto.randomUUID().slice(0, 10),
                type: 'paragraph',
                data: { text: data },
              },
            ],
            version: '2.28.0',
          }
        }
      }
    } else if (typeof data === 'object' && data.blocks) {
      return data
    }
    return undefined
  }, [data])

  // Toolbar actions - insert blocks
  const insertBlock = useCallback(
    async (type: string, blockData?: any) => {
      if (!editorRef.current || !isEditorReady) return
      try {
        const currentIndex =
          await editorRef.current.blocks.getCurrentBlockIndex()
        await editorRef.current.blocks.insert(
          type,
          blockData || {},
          {},
          currentIndex + 1,
          true
        )
      } catch (e) {
        console.error('Insert block error:', e)
      }
    },
    [isEditorReady]
  )

  // Format actions using document.execCommand for inline formatting
  const formatText = useCallback((command: string) => {
    document.execCommand(command, false)
  }, [])

  useEffect(() => {
    if (!holderRef.current) return

    // Abort flag for React StrictMode double-mount
    let isAborted = false

    // Destroy existing editor if any (React StrictMode protection)
    if (editorRef.current) {
      editorRef.current.destroy()
      editorRef.current = null
    }

    // Clear container to prevent duplicates
    holderRef.current.innerHTML = ''
    isReady.current = false

    const initEditor = async () => {
      if (isAborted || !holderRef.current) return

      const [
        Header,
        NestedList,
        Checklist,
        Quote,
        Warning,
        Code,
        Delimiter,
        Table,
        Image,
        Embed,
        Marker,
        InlineCode,
        Raw,
      ] = await Promise.all([
        import('@editorjs/header').then((m) => m.default),
        import('@editorjs/nested-list').then((m) => m.default),
        import('@editorjs/checklist').then((m) => m.default),
        import('@editorjs/quote').then((m) => m.default),
        import('@editorjs/warning').then((m) => m.default),
        import('@editorjs/code').then((m) => m.default),
        import('@editorjs/delimiter').then((m) => m.default),
        import('@editorjs/table').then((m) => m.default),
        import('@editorjs/image').then((m) => m.default),
        import('@editorjs/embed').then((m) => m.default),
        import('@editorjs/marker').then((m) => m.default),
        import('@editorjs/inline-code').then((m) => m.default),
        import('@editorjs/raw').then((m) => m.default),
      ])

      // Check again after async imports
      if (isAborted || !holderRef.current) return

      const initialData = getInitialData()

      // Ensure we start with exactly one block
      const editorData = initialData || {
        time: Date.now(),
        blocks: [
          {
            id: crypto.randomUUID().slice(0, 10),
            type: 'paragraph',
            data: { text: '' },
          },
        ],
        version: '2.28.0',
      }

      const editor = new EditorJS({
        holder: holderRef.current,
        placeholder,
        readOnly,
        data: editorData,
        minHeight,
        autofocus: false,
        inlineToolbar: ['bold', 'italic', 'link', 'marker', 'inlineCode'],
        tools: {
          header: {
            class: Header as any,
            inlineToolbar: true,
            config: { levels: [1, 2, 3, 4, 5, 6], defaultLevel: 2 },
          },
          list: { class: NestedList as any, inlineToolbar: true },
          checklist: { class: Checklist as any, inlineToolbar: true },
          quote: { class: Quote as any, inlineToolbar: true },
          warning: { class: Warning as any, inlineToolbar: true },
          code: { class: Code as any },
          delimiter: { class: Delimiter as any },
          table: {
            class: Table as any,
            inlineToolbar: true,
            config: { rows: 2, cols: 3 },
          },
          image: {
            class: Image as any,
            config: {
              uploader: {
                uploadByFile: async (file: File) => ({
                  success: 1,
                  file: { url: URL.createObjectURL(file) },
                }),
                uploadByUrl: async (url: string) => ({
                  success: 1,
                  file: { url },
                }),
              },
            },
          },
          embed: {
            class: Embed as any,
            config: {
              services: {
                youtube: true,
                vimeo: true,
                facebook: true,
                instagram: true,
                twitter: true,
              },
            },
          },
          raw: { class: Raw as any },
          marker: { class: Marker as any },
          inlineCode: { class: InlineCode as any },
        },
        onChange: async (api: API) => {
          if (!onChangeRef.current || isAborted) return
          try {
            const outputData = await api.saver.save()
            onChangeRef.current(outputData)
          } catch (error) {
            console.error('EditorJS save error:', error)
          }
        },
        onReady: () => {
          if (isAborted) return
          isReady.current = true
          setIsEditorReady(true)
        },
        i18n: {
          messages: {
            ui: {
              blockTunes: { toggler: { 'Click to tune': 'Nhấn để tùy chỉnh' } },
              toolbar: { toolbox: { Add: 'Thêm' } },
            },
            toolNames: {
              Text: 'Văn bản',
              Heading: 'Tiêu đề',
              List: 'Danh sách',
              Checklist: 'Checklist',
              Quote: 'Trích dẫn',
              Warning: 'Cảnh báo',
              Code: 'Code',
              Delimiter: 'Đường kẻ',
              Table: 'Bảng',
              Image: 'Ảnh',
              Embed: 'Nhúng',
              Raw: 'HTML',
            },
          },
        },
      })

      if (!isAborted) {
        editorRef.current = editor
      } else {
        // If aborted, destroy the editor we just created
        editor.destroy()
      }
    }

    initEditor()

    return () => {
      isAborted = true
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = null
        isReady.current = false
        setIsEditorReady(false)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          'overflow-hidden rounded-lg border border-input bg-background',
          className
        )}
      >
        {/* Fixed Toolbar */}
        {showToolbar && !readOnly && (
          <div className='flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5'>
            {/* Text Formatting */}
            <ToolbarButton
              icon={Bold}
              label='In đậm (Ctrl+B)'
              onClick={() => formatText('bold')}
            />
            <ToolbarButton
              icon={Italic}
              label='In nghiêng (Ctrl+I)'
              onClick={() => formatText('italic')}
            />
            <ToolbarButton
              icon={Highlighter}
              label='Đánh dấu'
              onClick={() => formatText('backColor')}
            />
            <ToolbarButton
              icon={Link}
              label='Chèn link'
              onClick={() => {
                const url = prompt('Nhập URL:')
                if (url) document.execCommand('createLink', false, url)
              }}
            />

            <Separator orientation='vertical' className='mx-1 h-6' />

            {/* Headings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='h-8 gap-1 px-2'>
                  <Heading2 className='h-4 w-4' />
                  <ChevronDown className='h-3 w-3' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                <DropdownMenuItem
                  onClick={() => insertBlock('header', { level: 1, text: '' })}
                >
                  <Heading1 className='mr-2 h-4 w-4' /> Tiêu đề 1
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => insertBlock('header', { level: 2, text: '' })}
                >
                  <Heading2 className='mr-2 h-4 w-4' /> Tiêu đề 2
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => insertBlock('header', { level: 3, text: '' })}
                >
                  <Heading3 className='mr-2 h-4 w-4' /> Tiêu đề 3
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation='vertical' className='mx-1 h-6' />

            {/* Lists */}
            <ToolbarButton
              icon={List}
              label='Danh sách'
              onClick={() =>
                insertBlock('list', { style: 'unordered', items: [''] })
              }
            />
            <ToolbarButton
              icon={ListOrdered}
              label='Danh sách số'
              onClick={() =>
                insertBlock('list', { style: 'ordered', items: [''] })
              }
            />
            <ToolbarButton
              icon={CheckSquare}
              label='Checklist'
              onClick={() =>
                insertBlock('checklist', {
                  items: [{ text: '', checked: false }],
                })
              }
            />

            <Separator orientation='vertical' className='mx-1 h-6' />

            {/* Blocks */}
            <ToolbarButton
              icon={Quote}
              label='Trích dẫn'
              onClick={() => insertBlock('quote', { text: '', caption: '' })}
            />
            <ToolbarButton
              icon={Code}
              label='Code block'
              onClick={() => insertBlock('code', { code: '' })}
            />
            <ToolbarButton
              icon={AlertTriangle}
              label='Cảnh báo'
              onClick={() => insertBlock('warning', { title: '', message: '' })}
            />
            <ToolbarButton
              icon={Minus}
              label='Đường kẻ'
              onClick={() => insertBlock('delimiter')}
            />

            <Separator orientation='vertical' className='mx-1 h-6' />

            {/* Media */}
            <ToolbarButton
              icon={Table}
              label='Bảng'
              onClick={() =>
                insertBlock('table', {
                  withHeadings: true,
                  content: [
                    ['', '', ''],
                    ['', '', ''],
                  ],
                })
              }
            />
            <ToolbarButton
              icon={Image}
              label='Hình ảnh'
              onClick={() => insertBlock('image')}
            />
            <ToolbarButton
              icon={FileCode}
              label='HTML'
              onClick={() => insertBlock('raw', { html: '' })}
            />

            <div className='flex-1' />

            {/* Undo/Redo (if browser supports) */}
            <ToolbarButton
              icon={Undo2}
              label='Hoàn tác (Ctrl+Z)'
              onClick={() => document.execCommand('undo')}
            />
            <ToolbarButton
              icon={Redo2}
              label='Làm lại (Ctrl+Y)'
              onClick={() => document.execCommand('redo')}
            />
          </div>
        )}

        {/* Editor Content */}
        <div
          className={cn(
            'px-4 py-3',
            // Editor.js overrides
            '[&_.codex-editor]:min-h-[150px]',
            '[&_.codex-editor__redactor]:!pb-4',
            '[&_.ce-block]:my-2',
            '[&_.ce-block__content]:max-w-full',
            // Hide default toolbar since we have our own
            '[&_.ce-toolbar]:!opacity-100',
            '[&_.ce-toolbar__content]:!max-w-full',
            // Text styling
            '[&_.ce-paragraph]:text-sm [&_.ce-paragraph]:leading-relaxed',
            '[&_.ce-header]:font-bold',
            // Inline toolbar (still useful for quick edits)
            '[&_.ce-inline-toolbar]:rounded-lg [&_.ce-inline-toolbar]:border [&_.ce-inline-toolbar]:border-border [&_.ce-inline-toolbar]:bg-popover [&_.ce-inline-toolbar]:shadow-lg',
            '[&_.ce-inline-tool]:text-popover-foreground [&_.ce-inline-tool:hover]:bg-accent',
            // Toolbox
            '[&_.ce-toolbox]:rounded-lg [&_.ce-toolbox]:border [&_.ce-toolbox]:border-border [&_.ce-toolbox]:bg-popover [&_.ce-toolbox]:shadow-lg',
            // Block styling
            '[&_.cdx-quote]:rounded-lg [&_.cdx-quote]:border-l-4 [&_.cdx-quote]:border-l-primary [&_.cdx-quote]:bg-muted/30 [&_.cdx-quote]:py-3 [&_.cdx-quote]:pl-4',
            '[&_.ce-code__textarea]:rounded-lg [&_.ce-code__textarea]:border [&_.ce-code__textarea]:border-border [&_.ce-code__textarea]:bg-muted [&_.ce-code__textarea]:font-mono [&_.ce-code__textarea]:text-sm',
            '[&_.cdx-warning]:rounded-lg [&_.cdx-warning]:border [&_.cdx-warning]:border-yellow-500/50 [&_.cdx-warning]:bg-yellow-50 [&_.cdx-warning]:p-4 [&_.cdx-warning]:dark:bg-yellow-950/20',
            '[&_.tc-cell]:border [&_.tc-cell]:border-border [&_.tc-cell]:p-2 [&_.tc-table]:w-full [&_.tc-table]:border-collapse',
            '[&_.cdx-checklist__item-checkbox]:rounded [&_.cdx-checklist__item-checkbox]:border-2 [&_.cdx-checklist__item-checkbox]:border-primary',
            '[&_.cdx-checklist__item--checked_.cdx-checklist__item-checkbox]:bg-primary',
            '[&_mark.cdx-marker]:rounded-sm [&_mark.cdx-marker]:bg-yellow-200 [&_mark.cdx-marker]:dark:bg-yellow-800',
            '[&_code.inline-code]:rounded [&_code.inline-code]:bg-muted [&_code.inline-code]:px-1.5 [&_code.inline-code]:py-0.5 [&_code.inline-code]:font-mono [&_code.inline-code]:text-sm',
            '[&_.image-tool__image]:rounded-lg [&_.image-tool__image]:border [&_.image-tool__image]:border-border',
            // Only show placeholder on the first empty block
            '[&_.ce-paragraph[data-placeholder]:empty::before]:text-muted-foreground',
            '[&_.ce-block:not(:first-child)_.ce-paragraph[data-placeholder]:empty::before]:!content-none'
          )}
          style={{ minHeight }}
        >
          <div ref={holderRef} id={holderId} />
        </div>
      </div>
    </TooltipProvider>
  )
})

/**
 * Convert EditorJS OutputData to HTML string
 */
export function editorDataToHtml(data: OutputData): string {
  if (!data?.blocks?.length) return ''

  return data.blocks
    .map((block) => {
      switch (block.type) {
        case 'header': {
          const level = block.data.level || 2
          return `<h${level}>${block.data.text}</h${level}>`
        }
        case 'paragraph':
          return `<p>${block.data.text}</p>`
        case 'list': {
          const tag = block.data.style === 'ordered' ? 'ol' : 'ul'
          const renderItems = (items: any[]): string => {
            return items
              .map((item) => {
                if (typeof item === 'string') return `<li>${item}</li>`
                const content = item.content || item.text || ''
                const nested = item.items?.length
                  ? `<${tag}>${renderItems(item.items)}</${tag}>`
                  : ''
                return `<li>${content}${nested}</li>`
              })
              .join('')
          }
          return `<${tag}>${renderItems(block.data.items || [])}</${tag}>`
        }
        case 'checklist':
          return `<ul class="checklist">${(block.data.items || []).map((item: any) => `<li><input type="checkbox" ${item.checked ? 'checked' : ''} disabled> ${item.text}</li>`).join('')}</ul>`
        case 'quote':
          return `<blockquote><p>${block.data.text}</p>${block.data.caption ? `<cite>${block.data.caption}</cite>` : ''}</blockquote>`
        case 'warning':
          return `<div class="warning"><strong>${block.data.title}</strong><p>${block.data.message}</p></div>`
        case 'code':
          return `<pre><code>${block.data.code}</code></pre>`
        case 'delimiter':
          return '<hr />'
        case 'table':
          return `<table>${(block.data.content || []).map((row: string[], i: number) => `<tr>${row.map((cell) => `<${block.data.withHeadings && i === 0 ? 'th' : 'td'}>${cell}</${block.data.withHeadings && i === 0 ? 'th' : 'td'}>`).join('')}</tr>`).join('')}</table>`
        case 'image':
          return `<figure><img src="${block.data.file?.url}" alt="${block.data.caption || ''}"/>${block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : ''}</figure>`
        case 'embed':
          return `<div class="embed"><iframe src="${block.data.embed}" width="100%" height="320" frameborder="0"></iframe></div>`
        case 'raw':
          return block.data.html || ''
        default:
          return ''
      }
    })
    .join('\n')
}

/**
 * Convert HTML string to EditorJS OutputData
 */
export function htmlToEditorData(html: string): OutputData {
  if (!html?.trim()) {
    return { time: Date.now(), blocks: [], version: '2.28.0' }
  }
  return {
    time: Date.now(),
    blocks: [
      {
        id: crypto.randomUUID().slice(0, 10),
        type: 'paragraph',
        data: { text: html },
      },
    ],
    version: '2.28.0',
  }
}

/**
 * Parse Editor.js data from string or object
 */
function parseEditorData(
  data: string | OutputData | null | undefined
): OutputData | null {
  if (!data) return null

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      if (parsed.blocks && Array.isArray(parsed.blocks)) {
        return parsed as OutputData
      }
    } catch {
      // If not valid JSON, treat as HTML/plain text - wrap in paragraph
      if (data.trim()) {
        return {
          time: Date.now(),
          blocks: [{ id: '1', type: 'paragraph', data: { text: data } }],
          version: '2.28.0',
        }
      }
    }
    return null
  }

  if (typeof data === 'object' && data.blocks) {
    return data
  }

  return null
}

interface EditorJsRendererProps {
  data: string | OutputData | null | undefined
  className?: string
}

/**
 * Render Editor.js OutputData as formatted content
 */
export function EditorJsRenderer({ data, className }: EditorJsRendererProps) {
  const parsedData = parseEditorData(data)

  if (!parsedData?.blocks?.length) {
    return null
  }

  const renderListItems = (
    items: any[],
    style: 'ordered' | 'unordered'
  ): React.ReactNode => {
    const Tag = style === 'ordered' ? 'ol' : 'ul'
    return (
      <Tag
        className={cn(
          style === 'ordered' ? 'list-decimal' : 'list-disc',
          'ml-4 space-y-1'
        )}
      >
        {items.map((item, idx) => {
          const content =
            typeof item === 'string' ? item : item.content || item.text || ''
          const nestedItems = item.items
          return (
            <li key={idx} className='text-sm'>
              <span dangerouslySetInnerHTML={{ __html: content }} />
              {nestedItems?.length > 0 && renderListItems(nestedItems, style)}
            </li>
          )
        })}
      </Tag>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {parsedData.blocks.map((block) => {
        switch (block.type) {
          case 'header': {
            const level = block.data.level || 2
            const headingClasses = cn(
              'font-bold',
              level === 1 && 'text-2xl',
              level === 2 && 'text-xl',
              level === 3 && 'text-lg',
              level >= 4 && 'text-base'
            )
            // Render heading based on level
            if (level === 1) {
              return (
                <h1
                  key={block.id}
                  className={headingClasses}
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                />
              )
            }
            if (level === 2) {
              return (
                <h2
                  key={block.id}
                  className={headingClasses}
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                />
              )
            }
            if (level === 3) {
              return (
                <h3
                  key={block.id}
                  className={headingClasses}
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                />
              )
            }
            if (level === 4) {
              return (
                <h4
                  key={block.id}
                  className={headingClasses}
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                />
              )
            }
            return (
              <h5
                key={block.id}
                className={headingClasses}
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            )
          }

          case 'paragraph':
            return (
              <p
                key={block.id}
                className='text-sm leading-relaxed'
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            )

          case 'list':
            return (
              <div key={block.id}>
                {renderListItems(
                  block.data.items || [],
                  block.data.style || 'unordered'
                )}
              </div>
            )

          case 'checklist':
            return (
              <ul key={block.id} className='space-y-1.5'>
                {(block.data.items || []).map((item: any, idx: number) => (
                  <li key={idx} className='flex items-start gap-2 text-sm'>
                    <input
                      type='checkbox'
                      checked={item.checked}
                      disabled
                      className='mt-0.5 h-4 w-4 rounded border-primary'
                    />
                    <span
                      className={cn(
                        item.checked && 'text-muted-foreground line-through'
                      )}
                      dangerouslySetInnerHTML={{ __html: item.text }}
                    />
                  </li>
                ))}
              </ul>
            )

          case 'quote':
            return (
              <blockquote
                key={block.id}
                className='border-l-4 border-l-primary bg-muted/30 py-2 pl-4 italic'
              >
                <p
                  className='text-sm'
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                />
                {block.data.caption && (
                  <cite className='mt-1 block text-xs text-muted-foreground not-italic'>
                    — {block.data.caption}
                  </cite>
                )}
              </blockquote>
            )

          case 'warning':
            return (
              <div
                key={block.id}
                className='rounded-lg border border-yellow-500/50 bg-yellow-50 p-3 dark:bg-yellow-950/20'
              >
                {block.data.title && (
                  <p className='mb-1 text-sm font-semibold text-yellow-700 dark:text-yellow-400'>
                    ⚠️ {block.data.title}
                  </p>
                )}
                <p
                  className='text-sm text-yellow-700 dark:text-yellow-300'
                  dangerouslySetInnerHTML={{ __html: block.data.message }}
                />
              </div>
            )

          case 'code':
            return (
              <pre
                key={block.id}
                className='overflow-x-auto rounded-lg border bg-muted p-3 font-mono text-sm'
              >
                <code>{block.data.code}</code>
              </pre>
            )

          case 'delimiter':
            return <hr key={block.id} className='my-4 border-border' />

          case 'table':
            return (
              <div key={block.id} className='overflow-x-auto'>
                <table className='w-full border-collapse text-sm'>
                  <tbody>
                    {(block.data.content || []).map(
                      (row: string[], rowIdx: number) => (
                        <tr key={rowIdx}>
                          {row.map((cell, cellIdx) => {
                            const CellTag =
                              block.data.withHeadings && rowIdx === 0
                                ? 'th'
                                : 'td'
                            return (
                              <CellTag
                                key={cellIdx}
                                className={cn(
                                  'border border-border p-2',
                                  block.data.withHeadings &&
                                    rowIdx === 0 &&
                                    'bg-muted font-medium'
                                )}
                                dangerouslySetInnerHTML={{ __html: cell }}
                              />
                            )
                          })}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )

          case 'image':
            return (
              <figure key={block.id} className='space-y-2'>
                <img
                  src={block.data.file?.url}
                  alt={block.data.caption || ''}
                  className='max-w-full rounded-lg border'
                />
                {block.data.caption && (
                  <figcaption className='text-center text-xs text-muted-foreground'>
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            )

          case 'embed':
            return (
              <div key={block.id} className='overflow-hidden rounded-lg border'>
                <iframe
                  src={block.data.embed}
                  width='100%'
                  height='320'
                  frameBorder='0'
                  allowFullScreen
                  className='w-full'
                />
              </div>
            )

          case 'raw':
            return (
              <div
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.data.html || '' }}
              />
            )

          default:
            return null
        }
      })}
    </div>
  )
}

export default BlockEditor
