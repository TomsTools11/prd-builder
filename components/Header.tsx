"use client";

import { Sparkles, ArrowLeft, RefreshCw } from "lucide-react";

interface HeaderProps {
  variant?: "landing" | "generating" | "complete";
  onCancel?: () => void;
  onNewPRD?: () => void;
}

export default function Header({ variant = "landing", onCancel, onNewPRD }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-near-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal/10">
              <Sparkles className="h-5 w-5 text-teal" />
            </div>
            <span className="text-lg font-semibold text-white">PRD Builder</span>
          </div>

          {/* Navigation - varies by variant */}
          {variant === "landing" && (
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-text-secondary hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-text-secondary hover:text-white transition-colors">
                How It Works
              </a>
            </nav>
          )}

          {/* Action buttons - varies by variant */}
          <div className="flex items-center gap-4">
            {variant === "generating" && onCancel && (
              <button
                onClick={onCancel}
                className="btn-ghost btn-sm text-text-secondary hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </button>
            )}

            {variant === "complete" && onNewPRD && (
              <button
                onClick={onNewPRD}
                className="btn-secondary btn-sm"
              >
                <RefreshCw className="h-4 w-4" />
                New Analysis
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
