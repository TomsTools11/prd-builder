"use client";

import ReactMarkdown from "react-markdown";
import { FileText } from "lucide-react";

interface PDFPreviewProps {
  content: string;
  isGenerating: boolean;
  variant?: "dark" | "light";
}

export default function PDFPreview({ content, isGenerating, variant = "dark" }: PDFPreviewProps) {
  const isLight = variant === "light";

  if (!content && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <FileText className={`h-16 w-16 mb-4 ${isLight ? "text-gray-300" : "text-cool-sky/30"}`} />
        <p className={`text-lg ${isLight ? "text-gray-500" : "text-gray-400"}`}>
          Your generated PRD will appear here...
        </p>
        <p className={`text-sm mt-2 ${isLight ? "text-gray-400" : "text-gray-500"}`}>
          Fill out the form and click "Generate PRD"
        </p>
      </div>
    );
  }

  // Light theme colors for PDF preview on white background
  const lightStyles = {
    h1: "text-3xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200",
    h2: "text-2xl font-semibold text-teal mt-8 mb-3",
    h3: "text-xl font-medium text-gray-800 mt-6 mb-2",
    p: "text-gray-700 mb-4 leading-relaxed",
    li: "text-gray-700",
    strong: "text-gray-900 font-semibold",
    em: "text-teal italic",
    codeInline: "px-1.5 py-0.5 rounded bg-gray-100 text-teal text-sm font-mono",
    codeBlock: "block px-4 py-3 rounded-md bg-gray-100 text-gray-800 text-sm font-mono overflow-x-auto",
    table: "min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg",
    thead: "bg-gray-50",
    tbody: "divide-y divide-gray-100",
    th: "px-4 py-2 text-left text-sm font-medium text-gray-700",
    td: "px-4 py-2 text-sm text-gray-600",
    blockquote: "border-l-4 border-teal pl-4 py-2 my-4 bg-gray-50",
  };

  // Dark theme colors (original)
  const darkStyles = {
    h1: "text-3xl font-bold text-white mb-4 pb-2 border-b border-yale-blue/30",
    h2: "text-2xl font-semibold text-cool-sky mt-8 mb-3",
    h3: "text-xl font-medium text-icy-blue mt-6 mb-2",
    p: "text-gray-300 mb-4 leading-relaxed",
    li: "text-gray-300",
    strong: "text-white font-semibold",
    em: "text-cool-sky italic",
    codeInline: "px-1.5 py-0.5 rounded bg-prussian-blue/50 text-dodger-blue text-sm font-mono",
    codeBlock: "block px-4 py-3 rounded-md bg-prussian-blue/50 text-cool-sky text-sm font-mono overflow-x-auto",
    table: "min-w-full divide-y divide-yale-blue/30 border border-yale-blue/30 rounded-lg",
    thead: "bg-yale-blue/20",
    tbody: "divide-y divide-yale-blue/20",
    th: "px-4 py-2 text-left text-sm font-medium text-cool-sky",
    td: "px-4 py-2 text-sm text-gray-300",
    blockquote: "border-l-4 border-dodger-blue pl-4 py-2 my-4 bg-yale-blue/10",
  };

  const styles = isLight ? lightStyles : darkStyles;

  return (
    <div className={`prose max-w-none ${isLight ? "" : "prose-invert prose-blue"}`}>
      <div className="markdown-content">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className={styles.h1}>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className={styles.h2}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className={styles.h3}>{children}</h3>
            ),
            p: ({ children }) => <p className={styles.p}>{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
            li: ({ children }) => <li className={styles.li}>{children}</li>,
            strong: ({ children }) => <strong className={styles.strong}>{children}</strong>,
            em: ({ children }) => <em className={styles.em}>{children}</em>,
            code: ({ children, className }) => {
              const isInline = !className;
              return isInline ? (
                <code className={styles.codeInline}>{children}</code>
              ) : (
                <code className={styles.codeBlock}>{children}</code>
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className={styles.table}>{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className={styles.thead}>{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className={styles.tbody}>{children}</tbody>
            ),
            tr: ({ children }) => <tr>{children}</tr>,
            th: ({ children }) => (
              <th className={styles.th}>{children}</th>
            ),
            td: ({ children }) => (
              <td className={styles.td}>{children}</td>
            ),
            blockquote: ({ children }) => (
              <blockquote className={styles.blockquote}>{children}</blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
        {isGenerating && (
          <div className={`flex items-center gap-2 animate-pulse mt-4 ${isLight ? "text-teal" : "text-cool-sky"}`}>
            <div className={`h-2 w-2 rounded-full animate-bounce ${isLight ? "bg-teal" : "bg-cool-sky"}`} />
            <div className={`h-2 w-2 rounded-full animate-bounce [animation-delay:0.2s] ${isLight ? "bg-teal" : "bg-cool-sky"}`} />
            <div className={`h-2 w-2 rounded-full animate-bounce [animation-delay:0.4s] ${isLight ? "bg-teal" : "bg-cool-sky"}`} />
          </div>
        )}
      </div>
    </div>
  );
}
