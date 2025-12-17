# PRD Builder

A modern web application that generates professional Product Requirements Documents (PRDs) from user inputs and uploaded files. Powered by Claude AI with streaming responses and professional PDF export capabilities.

## Features

- 📄 **AI-Generated PRDs** - Create comprehensive PRDs in seconds using Claude Sonnet 4.5
- 📤 **Multi-Format Upload** - Support for PDF, DOCX, and image files
- 🎨 **Real-Time Preview** - Live markdown preview as your PRD is generated
- 📊 **Content Statistics** - Track word count and section stats
- 🌙 **Dark-Themed UI** - Modern dark interface with custom blue color palette
- 📥 **Multiple Exports** - Download as PDF or markdown
- 🚀 **Streaming Responses** - Real-time generation with streaming API
- 🔓 **No Authentication** - Public, stateless tool - no sign-up required

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router and TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom color palette
- **LLM:** [Anthropic Claude API](https://www.anthropic.com/) (Claude Sonnet 4.5)
- **PDF Generation:** [@react-pdf/renderer](https://react-pdf.org/)
- **File Processing:**
  - PDFs: `pdf-parse`
  - Word Docs: `mammoth`
  - Images: Base64 encoding for vision capabilities
- **Markdown:** `react-markdown`
- **Hosting:** [Netlify](https://www.netlify.com/) with serverless functions

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prd-builder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your API key:
```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
prd-builder/
├── app/
│   ├── layout.tsx                 # Root layout with dark theme
│   ├── page.tsx                   # Main application page
│   ├── globals.css                # Tailwind styles
│   └── api/
│       └── generate/
│           └── route.ts           # Claude API streaming endpoint
├── components/
│   ├── FileUpload.tsx             # Drag-and-drop file upload
│   ├── InputForm.tsx              # Product details form
│   ├── PDFPreview.tsx             # Markdown preview panel
│   ├── StatsBar.tsx               # Content statistics
│   ├── GenerationProgress.tsx     # Loading/streaming indicator
│   └── DownloadPanel.tsx          # PDF/Markdown download
├── lib/
│   ├── utils.ts                   # Utility functions
│   ├── prdTemplate.ts             # PRD sections and system prompt
│   ├── promptBuilder.ts           # API prompt construction
│   ├── pdfGenerator.tsx           # PDF generation
│   └── fileProcessors/
│       ├── pdfProcessor.ts        # PDF text extraction
│       ├── docxProcessor.ts       # DOCX text extraction
│       └── imageProcessor.ts      # Image to base64 conversion
├── types/
│   └── index.ts                   # TypeScript interfaces
├── netlify.toml                   # Netlify configuration
├── tailwind.config.ts             # Color palette
└── CLAUDE.md                       # Development guidelines
```

## API Endpoint

### POST /api/generate

Generates a PRD using Claude AI with streaming responses.

**Request (multipart/form-data):**
- `productName` (required): Name of the product
- `description` (required): Product description
- `goals`: Product goals and objectives
- `targetAudience`: Target audience description
- `features`: JSON array of feature strings
- `files`: Optional file uploads (PDF, DOCX, or images)

**Response:** Server-Sent Events (SSE) stream
```
data: {"text": "chunk of content"}
data: [DONE]
data: {"error": "error message"} // if applicable
```

## Usage

1. **Enter Product Details:**
   - Product name and description (required)
   - Goals, target audience, and features (optional)

2. **Upload Supporting Files (Optional):**
   - PDF documents
   - Word documents
   - Images or screenshots

3. **Generate PRD:**
   - Click "Generate PRD"
   - Watch the real-time preview as Claude generates content
   - Monitor word count and section progress

4. **Export:**
   - Download as a professionally styled PDF
   - Or download as markdown

## PRD Template Structure

Generated PRDs include the following sections:

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

## Styling & Color Palette

The application uses a custom dark blue color palette:

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#191919` | Page background |
| Prussian Blue | `#021A2E` | Deep backgrounds |
| Yale Blue | `#014379` | Cards/containers |
| Dodger Blue | `#0d91fd` | Primary accent, buttons |
| Cool Sky | `#5db5fe` | Hover states |
| Icy Blue | `#c2e3fe` | Highlights, borders |

## Building & Deployment

### Build for Production

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

### Netlify Deployment

1. Connect your repository to Netlify
2. Add `ANTHROPIC_API_KEY` to environment variables (Site settings → Environment variables)
3. Deploy

The `netlify.toml` is pre-configured for Next.js deployment with serverless functions support.

## File Processing

### PDF Files
- Text extraction using `pdf-parse`
- Preserves document structure for context

### Word Documents (DOCX)
- Text extraction using `mammoth`
- Supports both .docx modern format

### Images
- Converted to base64 encoding
- Compatible with Claude's vision capabilities
- Useful for wireframes, mockups, and screenshots

## Known Limitations

- **Function timeout:** 26 seconds on Netlify (streaming helps mitigate)
- **File size limits:** Very large files may exceed context window
- **PDF export:** Rendered client-side, requires modern browser

## Future Enhancements

- [ ] Template customization options
- [ ] Additional export formats (DOCX, HTML)
- [ ] Shareable PRD links with preview
- [ ] Competitor analysis integration
- [ ] PRD history and versioning
- [ ] Team collaboration features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feedback, please open an issue on the GitHub repository.

---

**Built with ❤️ for product managers and developers**
