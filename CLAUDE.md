# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PRD Builder is a public web application that generates professional Product Requirements Documents (PRDs) from user inputs and uploaded files. It uses the Anthropic Claude API for AI-powered generation with streaming responses and exports to professionally styled PDFs.

**Key Characteristics:**
- No authentication - fully public, stateless tool
- File support - PDF, DOCX, and image uploads
- Dark-themed UI with custom blue color palette
- Streaming responses with real-time progress tracking
- Professional PDF export with cover page and formatting

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run lint     # Lint code with ESLint
npm start        # Start production server
```

## Environment Variables

Required in `.env.local`:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Architecture

### Application State Machine

The main page (`app/page.tsx`) uses a three-state machine pattern:
- `landing` → User input form and marketing content
- `generating` → Streaming PRD generation with progress
- `complete` → Output display with download options

State transitions: `landing` → `generating` → `complete` → `landing`

### Streaming Flow

1. **Client** (`app/page.tsx`): Submits `FormData` to `/api/generate`, reads SSE stream
2. **API Route** (`app/api/generate/route.ts`): Processes files, calls Claude API with streaming
3. **Claude API**: Returns content in chunks via `anthropic.messages.stream()`
4. **Response**: SSE format - `data: {"text": "chunk"}` and `data: [DONE]`

### Key Files

- `lib/prdTemplate.ts` - PRD section structure and system prompt for Claude
- `lib/promptBuilder.ts` - Constructs user prompt from form data and files
- `lib/pdfGenerator.tsx` - Client-side PDF generation with `@react-pdf/renderer`
- `lib/fileProcessors/` - PDF (`pdf-parse`), DOCX (`mammoth`), and image processing

### File Processing Notes

**PDF Processing** - Uses CommonJS import due to pdf-parse compatibility:
```typescript
const pdfParse = require("pdf-parse");
```

**DOCX Processing** - Uses mammoth for text extraction:
```typescript
import mammoth from "mammoth";
const result = await mammoth.extractRawText({ buffer });
```

**Images** - Converted to base64 with metadata (vision support in prompt builder)

## API Route Details

### POST /api/generate

- Runtime: `nodejs` with 5-minute timeout (`maxDuration = 300`)
- Model: `claude-haiku-4-5-20251001`
- Max tokens: 8192

**Request** (`multipart/form-data`):
- `productName` (required), `description` (required)
- `goals`, `targetAudience`, `features` (JSON array), `files` (multiple)

**Response** (SSE stream):
- `data: {"text": "chunk"}` - Content chunks
- `data: [DONE]` - Completion signal
- `data: {"error": "message"}` - Error messages

## Color Palette

```typescript
colors: {
  background: "#191919",
  "prussian-blue": "#021A2E",  // deep backgrounds
  "yale-blue": "#014379",      // cards/containers
  "dodger-blue": "#0d91fd",    // primary accent (buttons/links)
  "cool-sky": "#5db5fe",       // hover states
  "icy-blue": "#c2e3fe",       // highlights/borders
}
```

## Deployment

Configured for Netlify with `netlify.toml`. Set `ANTHROPIC_API_KEY` in Netlify environment variables.

## Known Limitations

- **Netlify function timeout**: Streaming helps mitigate the 26-second limit
- **Client-side PDF generation**: Requires browser environment, cannot generate server-side
- **Generation timeout**: 3-minute client timeout, 5-minute server timeout
