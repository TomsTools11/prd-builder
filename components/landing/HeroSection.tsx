"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Upload } from "lucide-react";
import FileUpload from "../FileUpload";
import type { UploadedFile } from "@/types";

interface HeroSectionProps {
  onGenerate: (productName: string, description: string, files: UploadedFile[]) => void;
  isGenerating?: boolean;
}

export default function HeroSection({ onGenerate, isGenerating = false }: HeroSectionProps) {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showUpload, setShowUpload] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productName.trim() && description.trim()) {
      onGenerate(productName, description, files);
    }
  };

  const exampleProducts = [
    { name: "stripe.com", label: "stripe.com" },
    { name: "notion.so", label: "notion.so" },
    { name: "linear.app", label: "linear.app" },
  ];

  const handleExample = (name: string) => {
    setProductName(name);
    setDescription(`Create a comprehensive PRD for ${name}, including all key features and requirements.`);
  };

  return (
    <section className="section">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 badge mb-6">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered PRD Generation</span>
          </div>

          {/* Headline */}
          <h1 className="text-display mb-6">
            Generate Professional{" "}
            <span className="text-teal">PRDs</span>{" "}
            in Seconds
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
            Enter your product details and receive a comprehensive, beautifully
            formatted PRD powered by Claude AI.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Product name (e.g., TaskFlow Pro)"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="input md:w-1/3"
                disabled={isGenerating}
              />
              <input
                type="text"
                placeholder="Brief product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input flex-1"
                disabled={isGenerating}
              />
            </div>

            {/* File upload toggle */}
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowUpload(!showUpload)}
                className="btn-ghost btn-sm text-text-secondary"
              >
                <Upload className="h-4 w-4" />
                {showUpload ? "Hide" : "Add"} context files
                {files.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-teal/20 text-teal text-xs rounded">
                    {files.length}
                  </span>
                )}
              </button>
            </div>

            {/* File upload area */}
            {showUpload && (
              <div className="animate-fade-in">
                <FileUpload files={files} onFilesChange={setFiles} />
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={!productName.trim() || !description.trim() || isGenerating}
              className="btn-primary btn-lg w-full md:w-auto"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  Generating...
                </>
              ) : (
                <>
                  Generate PRD
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Example buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-text-secondary">Try examples:</span>
            {exampleProducts.map((example) => (
              <button
                key={example.name}
                type="button"
                onClick={() => handleExample(example.name)}
                className="btn-secondary btn-sm"
                disabled={isGenerating}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview mockup */}
        <div className="mt-16 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="card p-8 bg-gradient-to-b from-near-black to-background hover:border-white/20 transition-colors duration-300">
            <div className="flex gap-6">
              {/* Left panel - document preview */}
              <div className="flex-1 bg-white rounded-lg p-4 text-gray-800 text-sm">
                <div className="font-bold text-lg mb-2">YourSite.com</div>
                <div className="text-xs text-gray-500 mb-4">Brand & Design Style Guide</div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-800 rounded"></div>
                    <div className="w-8 h-8 bg-gray-600 rounded"></div>
                    <div className="w-8 h-8 bg-teal rounded"></div>
                    <div className="w-8 h-8 bg-light-teal rounded"></div>
                    <div className="w-8 h-8 bg-dark-teal rounded"></div>
                  </div>
                </div>
              </div>

              {/* Right panels */}
              <div className="flex-1 space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-xs text-teal mb-2">2.2 Core Palette</div>
                  <div className="space-y-1 text-xs text-text-secondary">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-800 rounded"></div>
                      <span>Primary</span>
                      <span className="ml-auto">#1F1F1F</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-teal rounded"></div>
                      <span>Accent</span>
                      <span className="ml-auto">#2383E2</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-xs text-teal mb-2">2.3 Typography</div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold">Heading 1</div>
                    <div className="text-sm font-semibold">Heading 2</div>
                    <div className="text-xs text-text-secondary">
                      Body text looks like this, with good readability.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-teal rounded-full"></div>
              <div className="w-2 h-2 bg-white/20 rounded-full"></div>
              <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            </div>
            <div className="text-center text-xs text-text-secondary mt-2">
              19 pages total
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
