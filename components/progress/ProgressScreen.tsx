"use client";

import { Globe, Loader2, Clock, FileText } from "lucide-react";
import Header from "../Header";
import ReactMarkdown from "react-markdown";

interface ProgressScreenProps {
  productName: string;
  progress: number;
  elapsedTime: number;
  content: string;
  onCancel: () => void;
}

// Format elapsed time as mm:ss
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Count words in content
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function ProgressScreen({
  productName,
  progress,
  elapsedTime,
  content,
  onCancel,
}: ProgressScreenProps) {
  const wordCount = countWords(content);
  const charCount = content.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="generating" onCancel={onCancel} />

      <main className="flex-1 flex py-6 px-6 gap-6 overflow-hidden">
        {/* Left side: Live content preview */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-teal animate-spin" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Generating PRD</h1>
                <p className="text-sm text-text-secondary">{productName}</p>
              </div>
            </div>
          </div>

          {/* Live content area */}
          <div className="flex-1 card overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              {content ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-white mt-6 mb-4 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold text-white mt-6 mb-3 border-b border-white/10 pb-2">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-medium text-white mt-4 mb-2">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-text-secondary mb-3 leading-relaxed">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside text-text-secondary mb-3 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside text-text-secondary mb-3 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-text-secondary">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-white font-semibold">{children}</strong>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                  {/* Typing cursor indicator */}
                  <span className="inline-block w-2 h-5 bg-teal animate-pulse ml-1" />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-text-secondary">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-teal" />
                    <p>Waiting for content...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Compact progress panel */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-4">
          {/* Progress card */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-secondary">Progress</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar mb-4">
              <div
                className="progress-bar-fill progress-bar-shimmer"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Elapsed</span>
                </div>
                <span className="text-sm font-medium">{formatTime(elapsedTime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Words</span>
                </div>
                <span className="text-sm font-medium">{wordCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Characters</span>
                </div>
                <span className="text-sm font-medium">{charCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Info card */}
          <div className="card bg-teal/5 border-teal/10">
            <p className="text-sm text-text-secondary">
              Your PRD is being generated with 15 comprehensive sections including requirements,
              success metrics, and timeline.
            </p>
          </div>

          {/* Cancel button */}
          <button
            onClick={onCancel}
            className="w-full py-3 px-4 rounded-lg border border-white/10 text-text-secondary hover:text-white hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
}
