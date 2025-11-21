# TemplateCraft – Creative Templates & Design Editor

A lightweight, fully client‑side creative template editor built with **Next.js**, **React**, and **TypeScript**.  
Implements canvas‑based editing, draggable layers, autosave, template management, design creation, and a clean UI.

This project was built as part of a coding challenge and intentionally focuses on **clarity**, **architecture**, and **editor usability**, while remaining easy to run locally.

---

## 1. 🚀 Running Locally

### **Prerequisites**
- Node.js 18+
- npm, yarn, or pnpm

### **Install dependencies**
```bash
npm install
```

### **Start the development server**
```bash
npm run dev
```

The app starts at:  
👉 **http://localhost:3000**

No additional environment variables are required for the local‑storage version.

---

## 2. 🗄️ Database Setup (Optional — Supabase)

The challenge version uses **localStorage** for persistence (templates + designs).  
However, the architecture supports upgrading to a real database.

If you choose Supabase:

### **Steps**
1. Create a Supabase project  
2. Add tables:
   - `templates`
   - `designs`
3. Configure environment variables in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=xxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
```
4. Replace LocalStorage operations in:
```
src/lib/domain/templates/store.ts
src/lib/domain/designs/store.ts
```

---

## 3. 🧩 Architecture Overview

```
src/
 ├─ app/
 │   ├─ templates/
 │   ├─ designs/
 │   └─ api/
 ├─ components/
 │   ├─ editor/
 │   ├─ canvas/
 │   └─ templates/
 ├─ lib/
 │   ├─ domain/
 │   ├─ editor/
 │   └─ utils/
 └─ tests/
```

### Highlights
- Canvas-based editor (drag, resize, rotate)
- Text + Image layers
- Layer panel & property sidebar
- Autosave with debouncing
- Template metadata editing
- Convert Template → Design
- Clean UI polish, Figma-style sidebar
- LocalStorage persistence

---

## 4. 🧪 Tests

The project includes:
- Template store tests
- Reducer/transform logic tests
- Jest + React Testing Library setup
- CI workflow runs lint + tests

### Run tests:
```bash
npm test
```

---

## 5. 🔧 CI Workflow (GitHub Actions)

Location:  
`.github/workflows/ci.yml`

The workflow:
- Installs dependencies
- Runs ESLint
- Runs tests
- Ensures stable PRs

---

## 6. ⚠️ Known Limitations

This implementation intentionally keeps certain things simple.

### Current Limitations
- No real backend (localStorage only)
- No undo/redo history stack
- Base64 image storage (large payloads)
- Thumbnail generation disabled due to dom-to-image inconsistencies
- No snapping/alignment guides
- Not optimized for mobile

### Future improvements
- Supabase or PostgreSQL backend
- Undo/Redo system
- Interactive snapping & smart guides
- SVG → PNG thumbnail pipeline
- Team collaboration mode
- Asset library (brands, icons, images)

---

## 7. 🤖 AI Tooling Usage (Optional)

AI tools such as ChatGPT were used for:
- Discussing architecture options
- UI/UX refinement ideas
- Accelerating test/setup boilerplate
- Bug debugging
- Documentation polish

All core logic, editor mechanisms, and structure were implemented manually.

---
