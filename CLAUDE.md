# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PRD Builder is a public web application that generates professional Product Requirements Documents (PRDs) from user inputs and uploaded files. It uses Google Gemini API for AI-powered generation with streaming responses and exports to professionally styled PDFs.

### Key Characteristics
- **No authentication** - fully public, stateless tool
- **File support** - PDF, DOCX, and image uploads
- **Dark-themed UI** with custom blue color palette
- **Streaming responses** - real-time PRD generation
- **Professional PDF export** with cover page and formatting

## Tech Stack

- **Framework:** Next.js 15 with App Router and TypeScript
- **Styling:** Tailwind CSS with custom color palette
- **LLM Provider:** Anthropic API (`@anthropic-ai/sdk`)
- **Model:** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- **PDF Generation:** `@react-pdf/renderer`
- **File Processing:**
  - PDFs: `pdf-parse` (CommonJS import)
  - DOCX: `mammoth`
  - Images: Base64 encoding for Gemini Vision
- **Markdown Rendering:** `react-markdown`
- **Hosting:** Netlify with serverless functions

## Project Structure

```
prd-builder/
├── app/
│   ├── layout.tsx              # Root layout with dark theme
│   ├── page.tsx                # Main application page
│   ├── globals.css             # Tailwind styles
│   └── api/
│       └── generate/
│           └── route.ts        # Gemini API streaming endpoint
├── components/
│   ├── FileUpload.tsx          # Drag-and-drop file upload
│   ├── InputForm.tsx           # Product details form
│   ├── PDFPreview.tsx          # Markdown preview panel
│   ├── StatsBar.tsx            # Real-time content stats
│   ├── GenerationProgress.tsx  # Loading/streaming indicator
│   └── DownloadPanel.tsx       # PDF/Markdown download
├── lib/
│   ├── utils.ts                # Utility functions (cn)
│   ├── prdTemplate.ts          # PRD sections and system prompt
│   ├── promptBuilder.ts        # Gemini prompt construction
│   ├── pdfGenerator.tsx        # PDF generation with @react-pdf/renderer
│   └── fileProcessors/
│       ├── pdfProcessor.ts     # PDF text extraction
│       ├── docxProcessor.ts    # DOCX text extraction
│       └── imageProcessor.ts   # Image to base64 conversion
├── types/
│   └── index.ts                # TypeScript interfaces
├── .env.local                  # Environment variables (GOOGLE_API_KEY)
├── netlify.toml                # Netlify configuration
└── tailwind.config.ts          # Custom color palette
```

## Color Palette

```typescript
colors: {
  background: "#191919",
  "prussian-blue": "#021A2E",  // darkest blue, for deep backgrounds
  "yale-blue": "#014379",      // medium dark blue, for cards/containers
  "dodger-blue": "#0d91fd",    // primary accent, for buttons/links
  "cool-sky": "#5db5fe",       // light accent, for hover states
  "icy-blue": "#c2e3fe",       // lightest, for highlights/borders
}
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Variables

Required in `.env.local`:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## API Route Details

### POST /api/generate

Accepts `multipart/form-data` with:
- `productName` (required): Product name string
- `description` (required): Product description
- `goals`: Product goals/objectives
- `targetAudience`: Target audience description
- `features`: JSON array of feature strings
- `files`: Multiple file uploads (PDF, DOCX, images)

Returns Server-Sent Events (SSE) stream:
- `data: {"text": "chunk"}` - Content chunks
- `data: [DONE]` - Completion signal
- `data: {"error": "message"}` - Error messages

## File Processing Notes

### PDF Processing
Uses CommonJS import due to pdf-parse compatibility:
```typescript
const pdfParse = require("pdf-parse");
```

### DOCX Processing
Uses mammoth for Word document text extraction:
```typescript
import mammoth from "mammoth";
const result = await mammoth.extractRawText({ buffer });
```

### Image Processing
Images are converted to base64 with metadata for Gemini Vision capabilities.

## PDF Generation

The PDF generator creates professional documents with:
- Cover page with product name and generation date
- Inter font family (loaded from Google Fonts)
- Headers, footers, and page numbers
- Proper markdown parsing (headers, lists, paragraphs)
- Blue color scheme matching the UI

## PRD Template Structure

Generated PRDs follow this structure:
1. Executive Summary
2. Product Overview
3. Objectives and Goals
4. Target Audience
5. Scope (In Scope / Out of Scope / Future Considerations)
6. Functional Requirements
7. Non-Functional Requirements
8. User Interface Requirements
9. Technical Requirements
10. Success Metrics
11. Timeline and Milestones
12. Risks and Mitigation
13. Dependencies and Assumptions
14. Future Enhancements
15. Appendix

## Deployment

### Netlify Configuration

The `netlify.toml` is configured for Next.js deployment:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Environment Setup
1. Connect repository to Netlify
2. Add `GOOGLE_API_KEY` in Netlify dashboard (Site settings → Environment variables)
3. Deploy

## Known Limitations

- **Netlify function timeout:** 26 seconds max (streaming helps mitigate)
- **File size limits:** Large files may exceed Gemini context window
- **PDF generation:** Client-side only, requires browser environment

## Future Enhancements

- Template customization
- Multiple export formats (DOCX, HTML)
- Shareable PRD links
- Competitor analysis integration
