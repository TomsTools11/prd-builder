"use client";

import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-teal/10">
              <Sparkles className="h-4 w-4 text-teal" />
            </div>
            <span className="text-sm font-medium">PRD Builder</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <a href="#" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>

          {/* Made with */}
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-error fill-error" />
            <span>by Tom & Anthropic AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
