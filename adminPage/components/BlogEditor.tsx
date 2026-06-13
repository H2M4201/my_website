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

  // Update which formatting buttons are active (DOM inspection, no queryCommandState)
  const updateActiveCommands = useCallback(() => {
    const active = new Set<string>()
    const sel = window.getSelection()
    if (!sel || !sel.anchorNode) {
      setActiveCommands(active)
      return
    }

    const hasAncestor = (node: Node | null, tags: string[]) => {
      let n = node
      while (n && n !== editorRef.current) {
        if (n.nodeType === Node.ELEMENT_NODE) {
          const el = n as HTMLElement
          if (tags.includes(el.tagName.toLowerCase())) return true
        }
        n = n.parentNode
      }
      return false
    }

    if (hasAncestor(sel.anchorNode, ['strong', 'b'])) active.add('bold')
    if (hasAncestor(sel.anchorNode, ['em', 'i'])) active.add('italic')
    if (hasAncestor(sel.anchorNode, ['u'])) active.add('underline')
    if (hasAncestor(sel.anchorNode, ['ul'])) active.add('insertUnorderedList')
    if (hasAncestor(sel.anchorNode, ['ol'])) active.add('insertOrderedList')

    console.debug('[BlogEditor] updateActiveCommands', { active: Array.from(active) })
    setActiveCommands(active)
  }, [])

  // Execute a formatting command
  // Fallback: insert a DOM list built from selected plain-text lines
  const fallbackInsertList = useCallback((isOrdered: boolean, selText?: string) => {
    try {
      const lines = (selText || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean)
      if (lines.length === 0) return false

      const list = document.createElement(isOrdered ? 'ol' : 'ul')
      for (const l of lines) {
        const li = document.createElement('li')
        li.textContent = l
        list.appendChild(li)
      }

      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return false
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(list)

      // place caret after inserted list
      const afterRange = document.createRange()
      afterRange.setStartAfter(list)
      afterRange.collapse(true)
      selection.removeAllRanges()
      selection.addRange(afterRange)

      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
        updateActiveCommands()
      }

      console.log('[BlogEditor] fallbackInsertList DOM inserted', { isOrdered, listPreview: list.outerHTML.slice(0,200) })
      return true
    } catch (err) {
      console.warn('[BlogEditor] fallbackInsertList error', err)
      return false
    }
  }, [onChange, updateActiveCommands])

  // Fallback for formatBlock: replace nearest block element tag
  const fallbackFormatBlock = useCallback((rawValue?: string) => {
    try {
      if (!editorRef.current) return false
      const tag = (rawValue || '').replace(/[<>]/g, '') || 'p'
      const selection = window.getSelection()
      if (!selection || !selection.anchorNode) return false

      // find nearest block-level ancestor
      let node: Node | null = selection.anchorNode
      while (node && node !== editorRef.current && node.nodeType !== Node.ELEMENT_NODE) node = node.parentNode
      let el = node as HTMLElement | null
      while (el && el !== editorRef.current && !['P','DIV','LI','H1','H2','BLOCKQUOTE','PRE','SECTION','ARTICLE'].includes(el.tagName)) {
        el = el.parentElement
      }
      if (!el || el === editorRef.current) return false

      const newEl = document.createElement(tag)
      while (el.firstChild) newEl.appendChild(el.firstChild)
      el.parentNode?.replaceChild(newEl, el)

      onChange(editorRef.current.innerHTML)
      updateActiveCommands()
      console.log('[BlogEditor] fallbackFormatBlock applied', { tag })
      return true
    } catch (err) {
      console.warn('[BlogEditor] fallbackFormatBlock error', err)
      return false
    }
  }, [onChange, updateActiveCommands])

  // Helpers for DOM-based operations (replace deprecated execCommand)
  const getSelectionRange = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null
    return sel.getRangeAt(0)
  }, [])

  const insertFragmentAtRange = useCallback((html: string) => {
    const range = getSelectionRange()
    if (!range) return false
    const frag = range.createContextualFragment(html)
    range.deleteContents()
    range.insertNode(frag)
    return true
  }, [getSelectionRange])

  const wrapSelectionWith = useCallback((tag: string) => {
    const range = getSelectionRange()
    if (!range) return false
    const sel = window.getSelection()
    if (!sel) return false

    if (sel.isCollapsed) {
      const el = document.createElement(tag)
      el.appendChild(document.createTextNode('\u200B'))
      range.insertNode(el)
      const after = document.createRange()
      after.setStart(el.firstChild as Node, 1)
      after.collapse(true)
      sel.removeAllRanges()
      sel.addRange(after)
      return true
    }

    const content = range.extractContents()
    const wrapper = document.createElement(tag)
    wrapper.appendChild(content)
    range.insertNode(wrapper)
    const newRange = document.createRange()
    newRange.selectNodeContents(wrapper)
    sel.removeAllRanges()
    sel.addRange(newRange)
    return true
  }, [getSelectionRange])

  const unwrapAncestorTag = useCallback((tagNames: string[]) => {
    const sel = window.getSelection()
    if (!sel || !sel.anchorNode) return false
    let node: Node | null = sel.anchorNode
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement
        if (tagNames.includes(el.tagName.toLowerCase())) {
          const parent = el.parentNode
          if (!parent) return false
          while (el.firstChild) parent.insertBefore(el.firstChild, el)
          parent.removeChild(el)
          return true
        }
      }
      node = node.parentNode
    }
    return false
  }, [])

  const applyAlignment = useCallback((align: 'left' | 'center' | 'right') => {
    const sel = window.getSelection()
    if (!sel || !sel.anchorNode) return false
    let node: Node | null = sel.anchorNode
    while (node && node !== editorRef.current && node.nodeType !== Node.ELEMENT_NODE) node = node.parentNode
    let el = node as HTMLElement | null
    while (el && el !== editorRef.current && !['P','DIV','LI','H1','H2','BLOCKQUOTE','PRE','SECTION','ARTICLE','TD','TH'].includes(el.tagName)) {
      el = el.parentElement
    }
    if (!el || el === editorRef.current) return false
    el.style.textAlign = align
    if (editorRef.current) onChange(editorRef.current.innerHTML)
    return true
  }, [onChange])

  const execCommand = useCallback((command: string, value?: string) => {
    const selection = window.getSelection()
    const activeElement = document.activeElement
    const focusedBefore = editorRef.current
      ? editorRef.current === activeElement || editorRef.current.contains(activeElement)
      : false

    // capture more selection details for debugging
    let selText: string | null = null
    let anchorOffset: number | null = null
    let focusOffset: number | null = null
    let rangeCount = 0
    let rangeHtml = ''
    try {
      if (selection) {
        selText = selection.toString() || null
        anchorOffset = selection.anchorOffset ?? null
        focusOffset = selection.focusOffset ?? null
        rangeCount = selection.rangeCount
        if (selection.rangeCount > 0) {
          const r = selection.getRangeAt(0)
          const container = document.createElement('div')
          container.appendChild(r.cloneContents())
          rangeHtml = container.innerHTML
        }
      }
    } catch (err) {
      console.warn('[BlogEditor] execCommand - selection capture failed', err)
    }

    const editorHtmlBefore = editorRef.current?.innerHTML
    console.log('[BlogEditor] execCommand start', {
      command,
      value,
      focusedBefore,
      activeElement: activeElement?.nodeName,
      selectionAnchor: selection?.anchorNode?.nodeName,
      selectionCollapsed: selection?.isCollapsed,
      selText,
      anchorOffset,
      focusOffset,
      rangeCount,
      rangeHtmlPreview: rangeHtml ? rangeHtml.slice(0, 200) : '',
      editorHtmlBeforeLength: editorHtmlBefore?.length ?? 0,
    })

    if (editorRef.current && !focusedBefore) editorRef.current.focus()

    // perform command using DOM operations
    let success = false
    try {
      switch (command) {
        case 'bold':
          if (!unwrapAncestorTag(['strong','b'])) success = wrapSelectionWith('strong')
          else success = true
          break
        case 'italic':
          if (!unwrapAncestorTag(['em','i'])) success = wrapSelectionWith('em')
          else success = true
          break
        case 'underline':
          if (!unwrapAncestorTag(['u'])) success = wrapSelectionWith('u')
          else success = true
          break
        case 'insertUnorderedList':
          success = fallbackInsertList(false, selText ?? '')
          break
        case 'insertOrderedList':
          success = fallbackInsertList(true, selText ?? '')
          break
        case 'formatBlock':
          success = !!fallbackFormatBlock(value)
          break
        case 'createLink':
          if (value) {
            const range = getSelectionRange()
            if (range) {
              const a = document.createElement('a')
              a.href = value
              a.target = '_blank'
              a.rel = 'noopener'
              const content = range.extractContents()
              a.appendChild(content)
              range.insertNode(a)
              success = true
            }
          }
          break
        case 'insertImage':
          if (value) {
            const img = document.createElement('img')
            img.src = value
            img.alt = ''
            const range = getSelectionRange()
            if (range) {
              range.deleteContents()
              range.insertNode(img)
              success = true
            }
          }
          break
        case 'insertHTML':
          if (value) success = insertFragmentAtRange(value)
          break
        case 'justifyLeft':
          success = applyAlignment('left')
          break
        case 'justifyCenter':
          success = applyAlignment('center')
          break
        case 'justifyRight':
          success = applyAlignment('right')
          break
        default:
          if (value) success = insertFragmentAtRange(value)
      }
    } catch (err) {
      console.warn('[BlogEditor] execCommand DOM error', err)
      success = false
    }

    const editorHtmlAfter = editorRef.current?.innerHTML
    console.log('[BlogEditor] execCommand result', {
      command,
      value,
      success,
      editorHtmlAfterLength: editorHtmlAfter?.length ?? 0,
    })
    console.debug('[BlogEditor] execCommand htmlPreview', {
      before: editorHtmlBefore ? editorHtmlBefore.slice(0, 200) : '',
      after: editorHtmlAfter ? editorHtmlAfter.slice(0, 200) : '',
    })

    // If list commands didn't change the HTML, try DOM fallback using captured selection text
    if ((command === 'insertUnorderedList' || command === 'insertOrderedList')) {
      const unchanged = editorHtmlBefore === editorHtmlAfter
      if (!success || unchanged) {
        const usedSelText = selText ?? ''
        const fallbackOk = fallbackInsertList(command === 'insertOrderedList', usedSelText)
        console.log('[BlogEditor] execCommand list fallback', { command, success, unchanged, fallbackOk })
      }
    }

    // If formatBlock failed or didn't change HTML, try DOM fallback
    if (command === 'formatBlock') {
      const unchanged = editorHtmlBefore === editorHtmlAfter
      if (!success || unchanged) {
        const raw = value || ''
        const fallbackOk = fallbackFormatBlock(raw)
        console.log('[BlogEditor] execCommand formatBlock fallback', { command, value, success, unchanged, fallbackOk })
      }
    }

    if (editorRef.current) {
      editorRef.current.focus()
      onChange(editorRef.current.innerHTML)
      updateActiveCommands()
    }
  }, [onChange, updateActiveCommands, fallbackInsertList, fallbackFormatBlock, getSelectionRange, insertFragmentAtRange, wrapSelectionWith, unwrapAncestorTag, applyAlignment])

  // Determine the current block-level element at the cursor position
  // Uses DOM traversal instead of deprecated queryCommandValue
  const getCurrentBlock = useCallback((): BlockFormat => {
    const sel = window.getSelection()
    if (!sel || !sel.anchorNode) {
      console.debug('[BlogEditor] getCurrentBlock - no selection', { selection: sel })
      return 'p'
    }

    let node: Node | null = sel.anchorNode
    // Walk up the DOM tree to find the closest block-level parent
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement
        const tagName = el.tagName.toLowerCase()
        if (tagName === 'h1') {
          console.debug('[BlogEditor] getCurrentBlock', { block: 'h1' })
          return 'h1'
        }
        if (tagName === 'h2') {
          console.debug('[BlogEditor] getCurrentBlock', { block: 'h2' })
          return 'h2'
        }
        if (tagName === 'blockquote') {
          console.debug('[BlogEditor] getCurrentBlock', { block: 'blockquote' })
          return 'blockquote'
        }
        if (tagName === 'pre') {
          console.debug('[BlogEditor] getCurrentBlock', { block: 'pre' })
          return 'pre'
        }
        // Stop at common block elements, default to 'p'
        if (['p', 'div', 'li', 'ul', 'ol', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav'].includes(tagName)) {
          console.debug('[BlogEditor] getCurrentBlock', { block: 'p', foundTag: tagName })
          return 'p'
        }
      }
      node = node.parentNode
    }

    console.debug('[BlogEditor] getCurrentBlock', { block: 'p', fallback: true })
    return 'p'
  }, [])

  // Toggle a block-level format (heading, blockquote, pre)
  const toggleBlock = useCallback((tag: BlockFormat) => {
    const current = getCurrentBlock()
    console.log('[BlogEditor] toggleBlock', { requestedTag: tag, currentBlock: current })

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