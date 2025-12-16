"use client";

import { FileText, Type, Hash, File } from "lucide-react";
import { estimatePageCount, countSections } from "@/lib/utils";
import type { PRDStats } from "@/types";

interface StatsBarProps {
  content: string;
}

export default function StatsBar({ content }: StatsBarProps) {
  const stats: PRDStats = {
    sections: countSections(content),
    words: content ? content.split(/\s+/).filter((w) => w.length > 0).length : 0,
    pages: content ? estimatePageCount(content) : 0,
    characters: content.length,
  };

  const statItems = [
    {
      icon: FileText,
      label: "Pages",
      value: stats.pages,
    },
    {
      icon: Hash,
      label: "Sections",
      value: stats.sections,
    },
    {
      icon: Type,
      label: "Words",
      value: stats.words.toLocaleString(),
    },
    {
      icon: File,
      label: "Characters",
      value: stats.characters.toLocaleString(),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-4 rounded-lg bg-yale-blue/20 border border-yale-blue/30"
        >
          <div className="p-2 rounded-md bg-dodger-blue/10">
            <stat.icon className="h-5 w-5 text-dodger-blue" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
