# TemplateCraft — Creative Templates & Design Editor

Client-side template/design editor built with **Next.js (App Router)**, **React**, and **TypeScript**. Features include a canvas with draggable/resizable layers, autosave with thumbnail generation, and localStorage-backed templates/designs.

---

## Getting Started
**Prerequisites**
- Node.js 18+

**Install & Run**
```bash
npm install
npm run dev
```
App: http://localhost:3000

No environment variables are required for the localStorage build.

---

## Architecture & Key Paths
```
src/
  app/
    templates/               # templates listing/new/detail/edit
    designs/                 # designs listing/detail/edit
  components/
    canvas/                  # CanvasLayer, rendering helpers
    editor/                  # TemplateEditor, panels, AI helper
    templates/               # TemplateCard, DesignCard, PreviewThumb
  lib/
    domain/
      templates/             # store.ts (localStorage), types.ts
      designs/               # store.ts (localStorage)
      canvas/                # types for layers/canvas state
      shared/                # id generation, constants
    editor/
      useCanvasEditor.ts     # editor state & layer operations
      useAutosave.ts         # debounced save + thumbnail render
      renderThumbnail.ts     # canvas -> data URL thumbnail
```

**Data model**
- Templates/Designs share the same shape (`Template`): id, name, channel, status, updatedAt, `canvas` (layers), optional `thumbnail`.
- Persistence: localStorage (`src/lib/domain/templates/store.ts`, `src/lib/domain/designs/store.ts`).

**Editor**
- Canvas layers: text and image; drag/resize/rotate; z-index ordering.
- Panels: layer list, properties, AI copy helper (stub).
- Autosave: debounced; stamps status (draft/active), updates timestamps, and saves a thumbnail via `renderCanvasThumbnail`.

**Cards & previews**
- TemplateCard/DesignCard show saved `thumbnail`; fallback to in-memory layered preview (`PreviewThumb`) with capped height.

---

## Notes & Limitations
- LocalStorage only (no backend), Base64 image storage.
- Thumbnails are client-rendered; remote image optimization is disabled (`unoptimized`) unless you configure `next.config.js` images domains/loader.

## Known Limitations
This implementation intentionally keeps certain things simple.

**Current Limitations**
- No real backend (localStorage only)
- No undo/redo history stack
- Base64 image storage (large payloads)
- Thumbnail generation is client-side only and unoptimized unless configured
- No snapping/alignment guides
- Not optimized for mobile

**Future improvements**
- Supabase or PostgreSQL backend
- Undo/Redo system
- Interactive snapping & smart guides
- SVG → PNG thumbnail pipeline
- Team collaboration mode
- Asset library (brands, icons, images)

## AI Tooling Usage (Optional)
AI tools such as ChatGPT were used for:
- Discussing architecture options
- UI/UX refinement ideas
- Accelerating test/setup boilerplate
- Bug debugging
- Documentation polish

All core logic, editor mechanisms, and structure were implemented manually.

---

## Testing
Run:
```bash
npm test
```
