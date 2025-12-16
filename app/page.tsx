"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { HeroSection, HowItWorks, FeatureGrid, PDFOutput, FooterCTA, Footer } from "@/components/landing";
import { ProgressScreen } from "@/components/progress";
import { OutputScreen } from "@/components/output";
import type { PRDFormData, UploadedFile } from "@/types";

type AppState = "landing" | "generating" | "complete";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [prdContent, setPrdContent] = useState("");
  const [productName, setProductName] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleGenerate = async (name: string, description: string, files: UploadedFile[]) => {
    setAppState("generating");
    setError("");
    setPrdContent("");
    setProductName(name);
    setProgress(0);
    setCurrentStep(0);

    // Start progress simulation
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          return prev;
        }
        const increment = Math.random() * 5 + 2;
        const newProgress = Math.min(prev + increment, 95);

        // Update current step based on progress
        if (newProgress >= 75) {
          setCurrentStep(3);
        } else if (newProgress >= 50) {
          setCurrentStep(2);
        } else if (newProgress >= 25) {
          setCurrentStep(1);
        }

        return newProgress;
      });
    }, 500);

    try {
      // Prepare form data for API
      const apiFormData = new FormData();
      apiFormData.append("productName", name);
      apiFormData.append("description", description);
      apiFormData.append("goals", "");
      apiFormData.append("targetAudience", "");
      apiFormData.append("features", JSON.stringify([]));

      // Add files to form data
      files.forEach((file) => {
        if (file.file) {
          apiFormData.append("files", file.file);
        }
      });

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
      let contentBuffer = "";

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
              // Clear interval and complete
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
              }
              setProgress(100);
              setCurrentStep(4);
              setTimeout(() => {
                setAppState("complete");
              }, 500);
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                contentBuffer += parsed.text;
                setPrdContent(contentBuffer);
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (err: any) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setError(err.message || "An error occurred while generating the PRD");
      setAppState("landing");
    }
  };

  const handleCancel = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setAppState("landing");
    setPrdContent("");
    setProductName("");
    setProgress(0);
    setCurrentStep(0);
  };

  const handleNewPRD = () => {
    setAppState("landing");
    setPrdContent("");
    setProductName("");
    setProgress(0);
    setCurrentStep(0);
    setError("");
  };

  // Render based on state
  if (appState === "generating") {
    return (
      <ProgressScreen
        productName={productName}
        progress={progress}
        currentStep={currentStep}
        onCancel={handleCancel}
      />
    );
  }

  if (appState === "complete") {
    return (
      <OutputScreen
        productName={productName}
        content={prdContent}
        onNewPRD={handleNewPRD}
      />
    );
  }

  // Landing page
  return (
    <div className="min-h-screen bg-background">
      <Header variant="landing" />

      {/* Error message */}
      {error && (
        <div className="container-custom py-4">
          <div className="rounded-lg bg-error/10 border border-error/50 p-4">
            <p className="text-error text-sm">{error}</p>
          </div>
        </div>
      )}

      <HeroSection onGenerate={handleGenerate} />
      <HowItWorks />
      <FeatureGrid />
      <PDFOutput />
      <FooterCTA />
      <Footer />
    </div>
  );
}
