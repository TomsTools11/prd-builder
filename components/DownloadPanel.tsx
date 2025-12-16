"use client";

import { useState } from "react";
import { Download, FileText, Loader2, CheckCircle } from "lucide-react";
import { downloadPRDPdf } from "@/lib/pdfGenerator";

interface DownloadPanelProps {
  productName: string;
  content: string;
}

export default function DownloadPanel({ productName, content }: DownloadPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownloadPDF = async () => {
    if (!content) return;

    setIsGenerating(true);
    setDownloadComplete(false);

    try {
      await downloadPRDPdf(productName || "Product", content);
      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!content) return;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(productName || "Product").replace(/\s+/g, "-")}-PRD.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const includedItems = [
    "Cover page with product name",
    "Executive Summary",
    "Product Overview & Goals",
    "Target Audience Analysis",
    "Functional Requirements",
    "Non-Functional Requirements",
    "UI/UX Requirements",
    "Technical Specifications",
    "Success Metrics & KPIs",
    "Timeline & Milestones",
    "Risks & Mitigation",
    "Future Enhancements",
  ];

  if (!content) return null;

  return (
    <div className="rounded-lg bg-yale-blue/20 p-6 border border-yale-blue/30">
      <h3 className="text-lg font-semibold text-cool-sky mb-4">Download PRD</h3>

      <p className="text-sm text-gray-400 mb-4">
        Get your professionally formatted PRD ready to share with your team.
      </p>

      {/* Download Buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-dodger-blue hover:bg-cool-sky text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating PDF...
            </>
          ) : downloadComplete ? (
            <>
              <CheckCircle className="h-5 w-5" />
              Downloaded!
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Download PDF
            </>
          )}
        </button>

        <button
          onClick={handleDownloadMarkdown}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-prussian-blue/50 border border-yale-blue/50 text-white hover:bg-yale-blue/30 rounded-md transition-colors"
        >
          <FileText className="h-5 w-5" />
          Download Markdown
        </button>
      </div>

      {/* What's Included */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">What&apos;s Included</h4>
        <ul className="space-y-2">
          {includedItems.map((item, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle className="h-4 w-4 text-dodger-blue flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
