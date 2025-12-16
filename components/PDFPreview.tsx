"use client";

import ReactMarkdown from "react-markdown";
import { FileText } from "lucide-react";

interface PDFPreviewProps {
  content: string;
  isGenerating: boolean;
}

export default function PDFPreview({ content, isGenerating }: PDFPreviewProps) {
  if (!content && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <FileText className="h-16 w-16 text-cool-sky/30 mb-4" />
        <p className="text-gray-400 text-lg">Your generated PRD will appear here...</p>
        <p className="text-gray-500 text-sm mt-2">Fill out the form and click "Generate PRD"</p>
      </div>
    );
  }

  return (
    <div className="prose prose-invert prose-blue max-w-none">
      <div className="markdown-content">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-white mb-4 pb-2 border-b border-yale-blue/30">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold text-cool-sky mt-8 mb-3">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-medium text-icy-blue mt-6 mb-2">{children}</h3>
            ),
            p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
            li: ({ children }) => <li className="text-gray-300">{children}</li>,
            strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
            em: ({ children }) => <em className="text-cool-sky italic">{children}</em>,
            code: ({ children, className }) => {
              const isInline = !className;
              return isInline ? (
                <code className="px-1.5 py-0.5 rounded bg-prussian-blue/50 text-dodger-blue text-sm font-mono">
                  {children}
                </code>
              ) : (
                <code className="block px-4 py-3 rounded-md bg-prussian-blue/50 text-cool-sky text-sm font-mono overflow-x-auto">
                  {children}
                </code>
              );
            },
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-yale-blue/30 border border-yale-blue/30 rounded-lg">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-yale-blue/20">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-yale-blue/20">{children}</tbody>
            ),
            tr: ({ children }) => <tr>{children}</tr>,
            th: ({ children }) => (
              <th className="px-4 py-2 text-left text-sm font-medium text-cool-sky">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2 text-sm text-gray-300">{children}</td>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-dodger-blue pl-4 py-2 my-4 bg-yale-blue/10">
                {children}
              </blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
        {isGenerating && (
          <div className="flex items-center gap-2 text-cool-sky animate-pulse mt-4">
            <div className="h-2 w-2 bg-cool-sky rounded-full animate-bounce" />
            <div className="h-2 w-2 bg-cool-sky rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="h-2 w-2 bg-cool-sky rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>
    </div>
  );
}
