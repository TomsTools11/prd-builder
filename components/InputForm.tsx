"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import FileUpload from "./FileUpload";
import type { PRDFormData, UploadedFile } from "@/types";

interface InputFormProps {
  onSubmit: (data: PRDFormData, files: UploadedFile[]) => void;
  isGenerating: boolean;
}

export default function InputForm({ onSubmit, isGenerating }: InputFormProps) {
  const [formData, setFormData] = useState<PRDFormData>({
    productName: "",
    description: "",
    goals: "",
    targetAudience: "",
    features: [],
  });

  const [featureInput, setFeatureInput] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.description) {
      alert("Please fill in at least the product name and description");
      return;
    }
    onSubmit(formData, files);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div className="rounded-lg bg-yale-blue/20 p-6 border border-yale-blue/30">
        <h2 className="text-xl font-semibold mb-4 text-cool-sky">Product Information</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-300 mb-2">
              Product Name <span className="text-red-400">*</span>
            </label>
            <input
              id="productName"
              type="text"
              required
              value={formData.productName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, productName: e.target.value }))
              }
              className="w-full px-4 py-2 bg-prussian-blue/50 border border-yale-blue/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-dodger-blue"
              placeholder="e.g., Project Management Dashboard"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Product Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={6}
              className="w-full px-4 py-2 bg-prussian-blue/50 border border-yale-blue/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-dodger-blue resize-none"
              placeholder="Describe your product, its purpose, and what problems it solves..."
              disabled={isGenerating}
            />
          </div>

          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-gray-300 mb-2">
              Goals & Objectives
            </label>
            <textarea
              id="goals"
              value={formData.goals}
              onChange={(e) => setFormData((prev) => ({ ...prev, goals: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 bg-prussian-blue/50 border border-yale-blue/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-dodger-blue resize-none"
              placeholder="What are the main goals and objectives for this product?"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-300 mb-2">
              Target Audience
            </label>
            <input
              id="targetAudience"
              type="text"
              value={formData.targetAudience}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, targetAudience: e.target.value }))
              }
              className="w-full px-4 py-2 bg-prussian-blue/50 border border-yale-blue/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-dodger-blue"
              placeholder="e.g., Product managers, Development teams"
              disabled={isGenerating}
            />
          </div>

          {/* Features */}
          <div>
            <label htmlFor="features" className="block text-sm font-medium text-gray-300 mb-2">
              Key Features
            </label>
            <div className="flex gap-2">
              <input
                id="features"
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                className="flex-1 px-4 py-2 bg-prussian-blue/50 border border-yale-blue/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-dodger-blue"
                placeholder="Add a key feature..."
                disabled={isGenerating}
              />
              <button
                type="button"
                onClick={addFeature}
                disabled={isGenerating}
                className="px-4 py-2 bg-dodger-blue hover:bg-cool-sky text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Feature List */}
            {formData.features.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md bg-prussian-blue/30 border border-yale-blue/20"
                  >
                    <span className="text-sm text-white">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      disabled={isGenerating}
                      className="p-1 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="rounded-lg bg-yale-blue/20 p-6 border border-yale-blue/30">
        <h2 className="text-xl font-semibold mb-4 text-cool-sky">
          Additional Context <span className="text-sm font-normal text-gray-400">(Optional)</span>
        </h2>
        <FileUpload onFilesChange={setFiles} />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isGenerating}
        className="w-full bg-dodger-blue hover:bg-cool-sky text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? "Generating PRD..." : "Generate PRD"}
      </button>
    </form>
  );
}
