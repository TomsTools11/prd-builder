"use client";

import { useState } from "react";
import { CheckCircle, Layers, Type, FileText, Clock, Download, ExternalLink, Loader2 } from "lucide-react";
import Header from "../Header";
import PDFPreview from "../PDFPreview";

interface OutputScreenProps {
  productName: string;
  content: string;
  onNewPRD: () => void;
}

export default function OutputScreen({ productName, content, onNewPRD }: OutputScreenProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  // Calculate stats from content
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const sectionCount = (content.match(/^##\s/gm) || []).length || 15;
  const pageEstimate = Math.max(1, Math.ceil(wordCount / 400));
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const stats = [
    { icon: Layers, value: sectionCount, label: "Sections" },
    { icon: Type, value: wordCount.toLocaleString(), label: "Words" },
    { icon: FileText, value: pageEstimate, label: "Pages" },
    { icon: Clock, value: `${readingTime} min`, label: "Reading Time" },
  ];

  const includedItems = [
    "Cover page & table of contents",
    "Executive summary",
    "Functional requirements",
    "Technical specifications",
    "UI requirements",
    "Success metrics",
    "Timeline & milestones",
    "Risk assessment",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header variant="complete" onNewPRD={onNewPRD} />

      <main className="container-custom py-12">
        {/* Success header */}
        <div className="text-center mb-10 animate-slide-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal/10 mb-6 animate-bounce-in">
            <CheckCircle className="h-8 w-8 text-teal" />
          </div>
          <h1 className="text-h1 mb-2">Your PRD is Ready!</h1>
          <p className="text-text-secondary">
            We&apos;ve analyzed <span className="text-white">{productName}</span> and created a
            comprehensive {pageEstimate}-page PRD document.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto stagger-children">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card hover:scale-105 transition-transform duration-200">
              <stat.icon className="h-5 w-5 text-teal mb-2" />
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
          {/* Left - PDF Preview */}
          <div className="lg:col-span-3">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h2">PDF Preview</h2>
                <span className="text-xs text-text-secondary">{pageEstimate} pages</span>
              </div>

              {/* PDF mockup */}
              <div className="bg-white rounded-lg p-6 text-gray-800 max-h-[500px] overflow-y-auto">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="text-xl font-bold text-gray-800">{productName}</div>
                  <div className="text-sm text-gray-500">Product Requirements Document</div>
                </div>

                {/* Preview of content */}
                <div className="prose prose-sm max-w-none">
                  <PDFPreview content={content} isGenerating={false} variant="light" />
                </div>
              </div>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Download card */}
            <div className="card">
              <h3 className="text-h2 mb-2">Download PRD</h3>
              <p className="text-sm text-text-secondary mb-4">
                Get your professionally formatted PDF document, ready to share with your team.
              </p>
              <button
                onClick={async () => {
                  setIsDownloading(true);
                  try {
                    const { generatePRDPdf } = await import("@/lib/pdfGenerator");
                    const blob = await generatePRDPdf(productName, content);
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${productName.replace(/\s+/g, "-")}-PRD.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error("Error generating PDF:", error);
                  } finally {
                    setIsDownloading(false);
                  }
                }}
                disabled={isDownloading}
                className="btn-primary w-full"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </button>
            </div>

            {/* What's included */}
            <div className="card">
              <h3 className="text-h2 mb-4">What&apos;s Included</h3>
              <ul className="space-y-3">
                {includedItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    <span className="text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Source */}
            <div className="card">
              <h3 className="text-h2 mb-2">Source Product</h3>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-teal hover:text-light-teal transition-colors text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                {productName}
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
