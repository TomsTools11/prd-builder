"use client";

import { useState } from "react";
import InputForm from "@/components/InputForm";
import PDFPreview from "@/components/PDFPreview";
import StatsBar from "@/components/StatsBar";
import GenerationProgress from "@/components/GenerationProgress";
import DownloadPanel from "@/components/DownloadPanel";
import { Sparkles } from "lucide-react";
import type { PRDFormData, UploadedFile } from "@/types";

export default function Home() {
  const [prdContent, setPrdContent] = useState("");
  const [productName, setProductName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (formData: PRDFormData, files: UploadedFile[]) => {
    setIsGenerating(true);
    setError("");
    setPrdContent("");
    setProductName(formData.productName);

    try {
      // Prepare form data for API
      const apiFormData = new FormData();
      apiFormData.append("productName", formData.productName);
      apiFormData.append("description", formData.description);
      apiFormData.append("goals", formData.goals);
      apiFormData.append("targetAudience", formData.targetAudience);
      apiFormData.append("features", JSON.stringify(formData.features));

      // Note: File uploads would need additional handling
      // For now, files are processed client-side

      // Call streaming API
      const response = await fetch("/api/generate", {
        method: "POST",
        body: apiFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate PRD");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              setIsGenerating(false);
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setPrdContent((prev) => prev + parsed.text);
              } else if (parsed.error) {
                setError(parsed.error);
                setIsGenerating(false);
                break;
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while generating the PRD");
      setIsGenerating(false);
    }
  };

  const handleNewPRD = () => {
    setPrdContent("");
    setProductName("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-yale-blue/30 bg-prussian-blue/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-dodger-blue/10">
                <Sparkles className="h-6 w-6 text-dodger-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dodger-blue">PRD Builder</h1>
                <p className="text-sm text-gray-400">AI-Powered Product Requirements Generator</p>
              </div>
            </div>
            {prdContent && !isGenerating && (
              <button
                onClick={handleNewPRD}
                className="flex items-center gap-2 px-4 py-2 bg-yale-blue/30 hover:bg-yale-blue/50 text-white rounded-md transition-colors border border-yale-blue/50"
              >
                New PRD
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/50 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Form */}
          <div className="space-y-6">
            <InputForm onSubmit={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* Right Column - Preview & Download */}
          <div className="space-y-6">
            {/* Stats Bar */}
            {prdContent && <StatsBar content={prdContent} />}

            {/* Generation Progress */}
            <GenerationProgress isGenerating={isGenerating} />

            {/* Preview Panel */}
            <div className="rounded-lg bg-yale-blue/20 p-6 border border-yale-blue/30 min-h-[400px] max-h-[calc(100vh-450px)] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 text-cool-sky sticky top-0 bg-yale-blue/20 pb-2 border-b border-yale-blue/30 z-10">
                PRD Preview
              </h2>
              <PDFPreview content={prdContent} isGenerating={isGenerating} />
            </div>

            {/* Download Panel */}
            {prdContent && !isGenerating && (
              <DownloadPanel productName={productName} content={prdContent} />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-yale-blue/30 mt-12">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-sm text-gray-500">
            Powered by Claude AI. Generate professional PRDs in seconds.
          </p>
        </div>
      </footer>
    </main>
  );
}
