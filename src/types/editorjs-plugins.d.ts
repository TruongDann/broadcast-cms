// Type declarations for Editor.js plugins that don't have built-in types

declare module '@editorjs/checklist' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Checklist: BlockToolConstructable
  export default Checklist
}

declare module '@editorjs/warning' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Warning: BlockToolConstructable
  export default Warning
}

declare module '@editorjs/marker' {
  import { InlineToolConstructable } from '@editorjs/editorjs'
  const Marker: InlineToolConstructable
  export default Marker
}

declare module '@editorjs/inline-code' {
  import { InlineToolConstructable } from '@editorjs/editorjs'
  const InlineCode: InlineToolConstructable
  export default InlineCode
}

declare module '@editorjs/raw' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Raw: BlockToolConstructable
  export default Raw
}

declare module '@editorjs/embed' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Embed: BlockToolConstructable
  export default Embed
}

declare module '@editorjs/nested-list' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const NestedList: BlockToolConstructable
  export default NestedList
}

declare module '@editorjs/attaches' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  const Attaches: BlockToolConstructable
  export default Attaches
}
