'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Image,
  Link,
  Eye,
  Edit3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
} from 'lucide-react'

interface BlogEditorProps {
  value: string
  onChange: (html: string) => void
  minHeight?: number
  placeholder?: string
}

type BlockFormat = 'p' | 'h1' | 'h2' | 'blockquote' | 'pre'

export function BlogEditor({
  value,
  onChange,
  minHeight = 400,
  placeholder = 'Start writing your blog content...',
}: BlogEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPreview, setIsPreview] = useState(false)
  const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set())

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || ''
    }
  }, [])

  // Sync HTML changes to parent
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
      updateActiveCommands()
    }
  }, [onChange])

  // Update which formatting buttons are active
  const updateActiveCommands = useCallback(() => {
    const active = new Set<string>()
    if (document.queryCommandState('bold')) active.add('bold')
    if (document.queryCommandState('italic')) active.add('italic')
    if (document.queryCommandState('underline')) active.add('underline')
    if (document.queryCommandState('insertUnorderedList')) active.add('insertUnorderedList')
    if (document.queryCommandState('insertOrderedList')) active.add('insertOrderedList')
    setActiveCommands(active)
  }, [])

  // Execute a formatting command
  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value || undefined)
    if (editorRef.current) {
      editorRef.current.focus()
      onChange(editorRef.current.innerHTML)
      updateActiveCommands()
    }
  }, [onChange, updateActiveCommands])

  // Determine the current block-level element at the cursor position
  // Uses DOM traversal instead of deprecated queryCommandValue
  const getCurrentBlock = useCallback((): BlockFormat => {
    const sel = window.getSelection()
    if (!sel || !sel.anchorNode) return 'p'

    let node: Node | null = sel.anchorNode
    // Walk up the DOM tree to find the closest block-level parent
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement
        const tagName = el.tagName.toLowerCase()
        if (tagName === 'h1') return 'h1'
        if (tagName === 'h2') return 'h2'
        if (tagName === 'blockquote') return 'blockquote'
        if (tagName === 'pre') return 'pre'
        // Stop at common block elements, default to 'p'
        if (['p', 'div', 'li', 'ul', 'ol', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav'].includes(tagName)) {
          return 'p'
        }
      }
      node = node.parentNode
    }
    return 'p'
  }, [])

  // Toggle a block-level format (heading, blockquote, pre)
  const toggleBlock = useCallback((tag: BlockFormat) => {
    const current = getCurrentBlock()
    if (current === tag) {
      execCommand('formatBlock', '<p>')
    } else {
      execCommand('formatBlock', `<${tag}>`)
    }
  }, [getCurrentBlock, execCommand])

  // Handle paste event - intercept images
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (!file) continue

        const reader = new FileReader()
        reader.onload = (loadEvent) => {
          const dataUrl = loadEvent.target?.result as string
          if (editorRef.current && dataUrl) {
            execCommand('insertImage', dataUrl)
          }
        }
        reader.readAsDataURL(file)
        return
      }
    }
  }, [execCommand])

  // Handle image upload via file select
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string
      if (editorRef.current && dataUrl) {
        execCommand('insertImage', dataUrl)
      }
    }
    reader.readAsDataURL(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [execCommand])

  // Insert a link
  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:', 'https://')
    if (url && editorRef.current) {
      execCommand('createLink', url)
    }
  }, [execCommand])

  // Handle key events (Tab for indent)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;')
    }
  }, [execCommand])

  const inlineButtons = [
    { icon: <Bold size={18} />, title: 'Bold (Ctrl+B)', command: 'bold' },
    { icon: <Italic size={18} />, title: 'Italic (Ctrl+I)', command: 'italic' },
    { icon: <Underline size={18} />, title: 'Underline (Ctrl+U)', command: 'underline' },
  ]

  const blockActions = [
    { icon: <Heading1 size={18} />, title: 'Heading 1', action: () => toggleBlock('h1') },
    { icon: <Heading2 size={18} />, title: 'Heading 2', action: () => toggleBlock('h2') },
    { icon: <List size={18} />, title: 'Bullet List', action: () => execCommand('insertUnorderedList') },
    { icon: <ListOrdered size={18} />, title: 'Numbered List', action: () => execCommand('insertOrderedList') },
    { icon: <Quote size={18} />, title: 'Blockquote', action: () => toggleBlock('blockquote') },
    { icon: <Code size={18} />, title: 'Code Block', action: () => toggleBlock('pre') },
    { icon: <AlignLeft size={18} />, title: 'Align Left', action: () => execCommand('justifyLeft') },
    { icon: <AlignCenter size={18} />, title: 'Align Center', action: () => execCommand('justifyCenter') },
    { icon: <AlignRight size={18} />, title: 'Align Right', action: () => execCommand('justifyRight') },
    { icon: <Link size={18} />, title: 'Insert Link', action: insertLink },
    { icon: <Image size={18} />, title: 'Insert Image (upload)', action: () => fileInputRef.current?.click() },
  ]

  return (
    <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-700">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-600 bg-gray-800">
        {/* Inline formatting */}
        {inlineButtons.map((btn) => (
          <button
            key={btn.command}
            type="button"
            title={btn.title}
            onMouseDown={(e) => {
              e.preventDefault()
              execCommand(btn.command)
            }}
            className={`p-1.5 rounded transition-colors ${
              activeCommands.has(btn.command)
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {btn.icon}
          </button>
        ))}

        <div className="w-px h-6 bg-gray-600 mx-1" />

        {/* Block actions */}
        {blockActions.map((action, idx) => (
          <button
            key={idx}
            type="button"
            title={action.title}
            onMouseDown={(e) => {
              e.preventDefault()
              action.action()
            }}
            className="p-1.5 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            {action.icon}
          </button>
        ))}

        <div className="w-px h-6 bg-gray-600 mx-1" />

        {/* Preview toggle */}
        <button
          type="button"
          title={isPreview ? 'Edit' : 'Preview'}
          onClick={() => setIsPreview(!isPreview)}
          className={`p-1.5 rounded transition-colors ml-auto ${
            isPreview
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {isPreview ? <Edit3 size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Editor / Preview area */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight: 'calc(80vh - 120px)', minHeight: `${minHeight}px` }}
      >
        {isPreview ? (
          <div
            className="p-4 text-gray-200 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: value || '<p><em>No content yet...</em></p>' }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onMouseUp={updateActiveCommands}
            onKeyUp={updateActiveCommands}
            data-placeholder={placeholder}
            className="p-4 text-gray-200 outline-none min-h-[300px] focus:ring-0"
            style={{ minHeight: `${minHeight}px` }}
          />
        )}
      </div>

      {/* Character count */}
      <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-600 bg-gray-800 flex justify-between items-center">
        <span>
          {value ? `${value.replace(/<[^>]*>/g, '').length} characters` : '0 characters'}
        </span>
        <span className="text-gray-400 text-xs italic">
          Tip: You can paste images directly (Ctrl+V)
        </span>
      </div>
    </div>
  )
}