"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/Header";
import { HeroSection, HowItWorks, FeatureGrid, PDFOutput, FooterCTA, Footer } from "@/components/landing";
import { ProgressScreen } from "@/components/progress";
import { OutputScreen } from "@/components/output";
import type { PRDFormData, UploadedFile } from "@/types";

type AppState = "landing" | "generating" | "complete";

// Expected PRD length for progress calculation (~30,000 characters)
const EXPECTED_CHARACTERS = 30000;
const TIMEOUT_MS = 180000; // 3 minute timeout

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [prdContent, setPrdContent] = useState("");
  const [productName, setProductName] = useState("");
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);
  const elapsedIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleGenerate = async (name: string, description: string, files: UploadedFile[]) => {
    setAppState("generating");
    setError("");
    setPrdContent("");
    setProductName(name);
    setProgress(0);
    setElapsedTime(0);

    // Setup abort controller for timeout and cancellation
    abortControllerRef.current = new AbortController();

    // Start elapsed time tracking
    const startTime = Date.now();
    elapsedIntervalRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Setup timeout
    timeoutRef.current = setTimeout(() => {
      abortControllerRef.current?.abort();
    }, TIMEOUT_MS);

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

      // Call streaming API with abort signal
      const response = await fetch("/api/generate", {
        method: "POST",
        body: apiFormData,
        signal: abortControllerRef.current.signal,
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

      let streamCompleted = false;

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
              streamCompleted = true;
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                contentBuffer += parsed.text;
                setPrdContent(contentBuffer);
                // Calculate real progress based on character count
                const realProgress = Math.min(95, (contentBuffer.length / EXPECTED_CHARACTERS) * 100);
                setProgress(realProgress);
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }

        if (streamCompleted) break;
      }

      // Stream ended - complete if we have content
      if (contentBuffer.length > 0) {
        if (elapsedIntervalRef.current) {
          clearInterval(elapsedIntervalRef.current);
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setProgress(100);
        setTimeout(() => {
          setAppState("complete");
        }, 500);
      } else {
        throw new Error("No content received from API");
      }
    } catch (err: any) {
      // Clear all timers
      if (elapsedIntervalRef.current) {
        clearInterval(elapsedIntervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Handle abort/timeout vs other errors
      if (err.name === "AbortError") {
        setError("Generation timed out or was cancelled. Please try again with a shorter description.");
      } else {
        setError(err.message || "An error occurred while generating the PRD");
      }
      setAppState("landing");
    }
  };

  const handleCancel = () => {
    // Abort the active request
    abortControllerRef.current?.abort();

    // Clear all timers
    if (elapsedIntervalRef.current) {
      clearInterval(elapsedIntervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAppState("landing");
    setPrdContent("");
    setProductName("");
    setProgress(0);
    setElapsedTime(0);
  };

  const handleNewPRD = () => {
    setAppState("landing");
    setPrdContent("");
    setProductName("");
    setProgress(0);
    setElapsedTime(0);
    setError("");
  };

  // Render based on state
  if (appState === "generating") {
    return (
      <ProgressScreen
        productName={productName}
        progress={progress}
        elapsedTime={elapsedTime}
        content={prdContent}
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
