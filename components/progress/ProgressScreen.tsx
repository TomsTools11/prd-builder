"use client";

import { Globe, FileText, Layout, FileCheck, CheckCircle, Loader2, Circle, Info } from "lucide-react";
import Header from "../Header";

interface ProgressStep {
  id: string;
  label: string;
  icon: React.ElementType;
  status: "pending" | "processing" | "done";
}

interface ProgressScreenProps {
  productName: string;
  progress: number;
  currentStep: number;
  onCancel: () => void;
}

const steps: Omit<ProgressStep, "status">[] = [
  { id: "analyze", label: "Analyzing input", icon: Globe },
  { id: "sections", label: "Generating sections", icon: FileText },
  { id: "format", label: "Formatting document", icon: Layout },
  { id: "finalize", label: "Finalizing PRD", icon: FileCheck },
];

export default function ProgressScreen({
  productName,
  progress,
  currentStep,
  onCancel,
}: ProgressScreenProps) {
  const getStepStatus = (index: number): "pending" | "processing" | "done" => {
    if (index < currentStep) return "done";
    if (index === currentStep) return "processing";
    return "pending";
  };

  const estimatedTimeRemaining = Math.max(0, Math.ceil((100 - progress) / 10));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="generating" onCancel={onCancel} />

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-xl px-6 animate-slide-in-up">
          {/* Product badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-near-black border border-white/10 rounded-full text-sm">
              <Globe className="h-4 w-4 text-text-secondary" />
              <span className="text-text-secondary">{productName}</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-h1 mb-2">Generating PRD</h1>
            <p className="text-text-secondary">
              Please wait while we create your document...
            </p>
          </div>

          {/* Progress card */}
          <div className="card">
            {/* Progress header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-secondary">Overall Progress</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>

            {/* Progress bar */}
            <div className="progress-bar mb-8">
              <div
                className="progress-bar-fill progress-bar-shimmer"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {steps.map((step, index) => {
                const status = getStepStatus(index);
                const StepIcon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                      status === "processing"
                        ? "bg-teal/10 border border-teal/20 animate-glow-pulse"
                        : status === "done"
                        ? "bg-success/5"
                        : "bg-white/[0.02]"
                    }`}
                  >
                    {/* Status icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        status === "done"
                          ? "bg-success/10"
                          : status === "processing"
                          ? "bg-teal/10"
                          : "bg-white/5"
                      }`}
                    >
                      {status === "done" ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : status === "processing" ? (
                        <Loader2 className="h-5 w-5 text-teal animate-spin" />
                      ) : (
                        <Circle className="h-5 w-5 text-text-secondary" />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 flex items-center gap-2">
                      <StepIcon
                        className={`h-4 w-4 ${
                          status === "done"
                            ? "text-success"
                            : status === "processing"
                            ? "text-teal"
                            : "text-text-secondary"
                        }`}
                      />
                      <span
                        className={
                          status === "pending"
                            ? "text-text-secondary"
                            : "text-white"
                        }
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Status label */}
                    <span
                      className={`text-sm ${
                        status === "done"
                          ? "text-success"
                          : status === "processing"
                          ? "text-teal"
                          : "text-text-secondary"
                      }`}
                    >
                      {status === "done"
                        ? "Done"
                        : status === "processing"
                        ? "Processing..."
                        : ""}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Tip box */}
            <div className="mt-6 p-4 bg-teal/5 border border-teal/10 rounded-lg">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-teal flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-teal font-medium">Tip: </span>
                  <span className="text-text-secondary text-sm">
                    Your PRD will include all 15 standard sections, comprehensive requirements,
                    and professional formatting.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Estimated time */}
          <p className="text-center text-sm text-text-secondary mt-6">
            Estimated time remaining: {estimatedTimeRemaining} seconds
          </p>
        </div>
      </main>
    </div>
  );
}
