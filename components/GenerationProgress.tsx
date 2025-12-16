"use client";

import { Loader2 } from "lucide-react";

interface GenerationProgressProps {
  isGenerating: boolean;
  currentSection?: string;
}

export default function GenerationProgress({
  isGenerating,
  currentSection,
}: GenerationProgressProps) {
  if (!isGenerating) return null;

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-dodger-blue/10 border border-dodger-blue/30">
      <Loader2 className="h-5 w-5 text-dodger-blue animate-spin" />
      <div className="flex-1">
        <p className="text-sm font-medium text-white">Generating your PRD...</p>
        {currentSection && (
          <p className="text-xs text-gray-400 mt-1">Current section: {currentSection}</p>
        )}
      </div>
    </div>
  );
}
